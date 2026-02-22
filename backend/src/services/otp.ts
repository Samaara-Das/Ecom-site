/**
 * OTP Service
 *
 * Handles OTP generation, storage, verification, and rate limiting
 * for phone-based authentication.
 */

export interface OTPRecord {
  phone: string
  code: string
  expiresAt: number
  attempts: number
}

export interface OTPStore {
  set(key: string, value: OTPRecord, ttlSeconds: number): Promise<void>
  get(key: string): Promise<OTPRecord | null>
  delete(key: string): Promise<void>
  incrementAttempts(key: string): Promise<number>
  getAttempts(key: string): Promise<number>
}

export interface OTPConfig {
  store: OTPStore
  smsSender: (phone: string, message: string) => Promise<boolean>
  otpLength: number
  otpExpirySeconds: number
  maxAttempts: number
  maxRequestsPerHour: number
}

export interface OTPResult {
  success: boolean
  message?: string
  error?: string
}

/**
 * In-memory OTP store for development/testing
 */
export class InMemoryOTPStore implements OTPStore {
  private records: Map<string, OTPRecord> = new Map()
  private requestCounts: Map<string, { count: number; resetAt: number }> = new Map()

  async set(key: string, value: OTPRecord, ttlSeconds: number): Promise<void> {
    this.records.set(key, value)
    // Auto-cleanup after TTL
    setTimeout(() => {
      this.records.delete(key)
    }, ttlSeconds * 1000)
  }

  async get(key: string): Promise<OTPRecord | null> {
    return this.records.get(key) || null
  }

  async delete(key: string): Promise<void> {
    this.records.delete(key)
  }

  async incrementAttempts(key: string): Promise<number> {
    const record = this.records.get(key)
    if (record) {
      record.attempts += 1
      this.records.set(key, record)
      return record.attempts
    }
    return 0
  }

  async getAttempts(key: string): Promise<number> {
    const rateKey = `rate:${key}`
    const rateRecord = this.requestCounts.get(rateKey)
    const now = Date.now()

    if (!rateRecord || now >= rateRecord.resetAt) {
      // Reset hourly counter
      this.requestCounts.set(rateKey, { count: 1, resetAt: now + 3600000 })
      return 0
    }

    rateRecord.count += 1
    this.requestCounts.set(rateKey, rateRecord)
    return rateRecord.count - 1 // Return count before increment
  }
}

export class OTPService {
  private store: OTPStore
  private smsSender: (phone: string, message: string) => Promise<boolean>
  private otpLength: number
  private otpExpirySeconds: number
  private maxAttempts: number
  private maxRequestsPerHour: number

  constructor(config: OTPConfig) {
    this.store = config.store
    this.smsSender = config.smsSender
    this.otpLength = config.otpLength
    this.otpExpirySeconds = config.otpExpirySeconds
    this.maxAttempts = config.maxAttempts
    this.maxRequestsPerHour = config.maxRequestsPerHour
  }

  /**
   * Create an OTP service with in-memory store (for development/testing)
   */
  static createWithInMemoryStore(config: Omit<OTPConfig, "store">): OTPService {
    return new OTPService({
      ...config,
      store: new InMemoryOTPStore(),
    })
  }

  /**
   * Generate a random numeric OTP
   */
  generateOTP(): string {
    const min = Math.pow(10, this.otpLength - 1)
    const max = Math.pow(10, this.otpLength) - 1
    const otp = Math.floor(min + Math.random() * (max - min + 1))
    return otp.toString().padStart(this.otpLength, "0")
  }

  /**
   * Normalize phone number to E.164 format
   */
  normalizePhoneNumber(phone: string): string | null {
    // Remove all non-digits except leading +
    const cleaned = phone.replace(/[^\d+]/g, "")

    // Extract digits only for validation
    const digits = cleaned.replace(/\D/g, "")

    // Validate length (international phone numbers: 8-15 digits)
    if (digits.length < 8 || digits.length > 15) {
      return null
    }

    // Handle 00 international prefix
    if (cleaned.startsWith("00")) {
      return "+" + digits.slice(2)
    }

    // Add + if not present
    if (!phone.startsWith("+")) {
      return "+" + digits
    }

    return "+" + digits
  }

  /**
   * Format OTP message for SMS
   */
  formatOTPMessage(code: string): string {
    return `Your verification code is: ${code}. This code expires in ${Math.floor(this.otpExpirySeconds / 60)} minutes. Do not share this code with anyone.`
  }

  /**
   * Get storage key for a phone number
   */
  private getKey(phone: string): string {
    return `otp:${phone}`
  }

  /**
   * Get rate limit key for a phone number
   */
  private getRateLimitKey(phone: string): string {
    return `rate:${phone}`
  }

  /**
   * Send OTP to a phone number
   */
  async sendOTP(phone: string): Promise<OTPResult> {
    // Normalize phone number
    const normalizedPhone = this.normalizePhoneNumber(phone)
    if (!normalizedPhone) {
      return {
        success: false,
        error: "Invalid phone number format",
      }
    }

    // Check rate limit
    const requestCount = await this.store.getAttempts(this.getRateLimitKey(normalizedPhone))
    if (requestCount >= this.maxRequestsPerHour) {
      return {
        success: false,
        error: "Too many OTP requests. Please try again later.",
      }
    }

    // Generate OTP
    const code = this.generateOTP()
    const expiresAt = Date.now() + this.otpExpirySeconds * 1000

    // Store OTP
    const record: OTPRecord = {
      phone: normalizedPhone,
      code,
      expiresAt,
      attempts: 0,
    }
    await this.store.set(this.getKey(normalizedPhone), record, this.otpExpirySeconds)

    // Send SMS
    const message = this.formatOTPMessage(code)
    const sent = await this.smsSender(normalizedPhone, message)

    if (!sent) {
      // Clean up stored OTP if SMS failed
      await this.store.delete(this.getKey(normalizedPhone))
      return {
        success: false,
        error: "Failed to send OTP. Please try again.",
      }
    }

    return {
      success: true,
      message: "OTP sent successfully",
    }
  }

  /**
   * Verify OTP for a phone number
   */
  async verifyOTP(phone: string, code: string): Promise<OTPResult> {
    // Normalize phone number
    const normalizedPhone = this.normalizePhoneNumber(phone)
    if (!normalizedPhone) {
      return {
        success: false,
        error: "Invalid phone number format",
      }
    }

    // Get stored OTP
    const key = this.getKey(normalizedPhone)
    const record = await this.store.get(key)

    if (!record) {
      return {
        success: false,
        error: "No OTP found for this phone number. Please request a new one.",
      }
    }

    // Check if max attempts exceeded
    if (record.attempts >= this.maxAttempts) {
      await this.store.delete(key)
      return {
        success: false,
        error: "Maximum verification attempts exceeded. Please request a new OTP.",
      }
    }

    // Check if expired
    if (Date.now() > record.expiresAt) {
      await this.store.delete(key)
      return {
        success: false,
        error: "OTP has expired. Please request a new one.",
      }
    }

    // Verify code
    if (record.code !== code) {
      await this.store.incrementAttempts(key)
      return {
        success: false,
        error: "Invalid OTP code",
      }
    }

    // Success - delete the OTP record
    await this.store.delete(key)

    return {
      success: true,
      message: "OTP verified successfully",
    }
  }
}

export default OTPService
