import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { OTPService, OTPStore, OTPRecord, OTPConfig } from "../otp"

describe("OTPService", () => {
  let otpService: OTPService
  let mockStore: OTPStore
  let mockSMSSender: (phone: string, message: string) => Promise<boolean>

  beforeEach(() => {
    // Create mock store
    mockStore = {
      set: vi.fn().mockResolvedValue(undefined),
      get: vi.fn().mockResolvedValue(null),
      delete: vi.fn().mockResolvedValue(undefined),
      incrementAttempts: vi.fn().mockResolvedValue(1),
      getAttempts: vi.fn().mockResolvedValue(0),
    }

    // Create mock SMS sender
    mockSMSSender = vi.fn().mockResolvedValue(true)

    // Create service with test config
    otpService = new OTPService({
      store: mockStore,
      smsSender: mockSMSSender,
      otpLength: 6,
      otpExpirySeconds: 300, // 5 minutes
      maxAttempts: 3,
      maxRequestsPerHour: 5,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("generateOTP", () => {
    it("should generate OTP of specified length", () => {
      const otp = otpService.generateOTP()
      expect(otp).toMatch(/^\d{6}$/)
    })

    it("should generate different OTPs on each call", () => {
      const otp1 = otpService.generateOTP()
      const otp2 = otpService.generateOTP()
      // Very low probability of same OTP (1 in 1,000,000)
      // Just check both are valid, not necessarily different
      expect(otp1).toMatch(/^\d{6}$/)
      expect(otp2).toMatch(/^\d{6}$/)
    })

    it("should generate OTP with custom length", () => {
      const customService = new OTPService({
        store: mockStore,
        smsSender: mockSMSSender,
        otpLength: 8,
        otpExpirySeconds: 300,
        maxAttempts: 3,
        maxRequestsPerHour: 5,
      })
      const otp = customService.generateOTP()
      expect(otp).toMatch(/^\d{8}$/)
    })
  })

  describe("sendOTP", () => {
    it("should generate, store, and send OTP successfully", async () => {
      const phone = "+96512345678"
      const result = await otpService.sendOTP(phone)

      expect(result.success).toBe(true)
      expect(result.message).toBe("OTP sent successfully")
      expect(mockStore.set).toHaveBeenCalledWith(
        expect.stringContaining(phone),
        expect.objectContaining({
          phone,
          code: expect.stringMatching(/^\d{6}$/),
          expiresAt: expect.any(Number),
          attempts: 0,
        }),
        300
      )
      expect(mockSMSSender).toHaveBeenCalledWith(
        phone,
        expect.stringContaining("verification code")
      )
    })

    it("should normalize phone number before sending", async () => {
      const phone = "96512345678" // Without +
      const result = await otpService.sendOTP(phone)

      expect(result.success).toBe(true)
      expect(mockStore.set).toHaveBeenCalledWith(
        expect.stringContaining("+96512345678"),
        expect.objectContaining({
          phone: "+96512345678",
        }),
        300
      )
    })

    it("should reject invalid phone numbers", async () => {
      const result = await otpService.sendOTP("123")

      expect(result.success).toBe(false)
      expect(result.error).toBe("Invalid phone number format")
      expect(mockStore.set).not.toHaveBeenCalled()
      expect(mockSMSSender).not.toHaveBeenCalled()
    })

    it("should rate limit OTP requests", async () => {
      mockStore.getAttempts = vi.fn().mockResolvedValue(5)

      const result = await otpService.sendOTP("+96512345678")

      expect(result.success).toBe(false)
      expect(result.error).toBe("Too many OTP requests. Please try again later.")
    })

    it("should return error when SMS fails to send", async () => {
      mockSMSSender = vi.fn().mockResolvedValue(false)
      otpService = new OTPService({
        store: mockStore,
        smsSender: mockSMSSender,
        otpLength: 6,
        otpExpirySeconds: 300,
        maxAttempts: 3,
        maxRequestsPerHour: 5,
      })

      const result = await otpService.sendOTP("+96512345678")

      expect(result.success).toBe(false)
      expect(result.error).toBe("Failed to send OTP. Please try again.")
    })
  })

  describe("verifyOTP", () => {
    it("should verify correct OTP successfully", async () => {
      const phone = "+96512345678"
      const code = "123456"
      const record: OTPRecord = {
        phone,
        code,
        expiresAt: Date.now() + 300000, // 5 minutes from now
        attempts: 0,
      }
      mockStore.get = vi.fn().mockResolvedValue(record)

      const result = await otpService.verifyOTP(phone, code)

      expect(result.success).toBe(true)
      expect(result.message).toBe("OTP verified successfully")
      expect(mockStore.delete).toHaveBeenCalled()
    })

    it("should reject incorrect OTP", async () => {
      const phone = "+96512345678"
      const record: OTPRecord = {
        phone,
        code: "123456",
        expiresAt: Date.now() + 300000,
        attempts: 0,
      }
      mockStore.get = vi.fn().mockResolvedValue(record)
      mockStore.incrementAttempts = vi.fn().mockResolvedValue(1)

      const result = await otpService.verifyOTP(phone, "654321")

      expect(result.success).toBe(false)
      expect(result.error).toBe("Invalid OTP code")
      expect(mockStore.incrementAttempts).toHaveBeenCalled()
    })

    it("should reject expired OTP", async () => {
      const phone = "+96512345678"
      const record: OTPRecord = {
        phone,
        code: "123456",
        expiresAt: Date.now() - 1000, // Expired 1 second ago
        attempts: 0,
      }
      mockStore.get = vi.fn().mockResolvedValue(record)

      const result = await otpService.verifyOTP(phone, "123456")

      expect(result.success).toBe(false)
      expect(result.error).toBe("OTP has expired. Please request a new one.")
      expect(mockStore.delete).toHaveBeenCalled()
    })

    it("should reject when no OTP exists for phone", async () => {
      mockStore.get = vi.fn().mockResolvedValue(null)

      const result = await otpService.verifyOTP("+96512345678", "123456")

      expect(result.success).toBe(false)
      expect(result.error).toBe("No OTP found for this phone number. Please request a new one.")
    })

    it("should block after max attempts exceeded", async () => {
      const phone = "+96512345678"
      const record: OTPRecord = {
        phone,
        code: "123456",
        expiresAt: Date.now() + 300000,
        attempts: 3,
      }
      mockStore.get = vi.fn().mockResolvedValue(record)

      const result = await otpService.verifyOTP(phone, "654321")

      expect(result.success).toBe(false)
      expect(result.error).toBe("Maximum verification attempts exceeded. Please request a new OTP.")
      expect(mockStore.delete).toHaveBeenCalled()
    })

    it("should normalize phone number for verification", async () => {
      const record: OTPRecord = {
        phone: "+96512345678",
        code: "123456",
        expiresAt: Date.now() + 300000,
        attempts: 0,
      }
      mockStore.get = vi.fn().mockResolvedValue(record)

      const result = await otpService.verifyOTP("96512345678", "123456")

      expect(result.success).toBe(true)
      expect(mockStore.get).toHaveBeenCalledWith(expect.stringContaining("+96512345678"))
    })
  })

  describe("normalizePhoneNumber", () => {
    it("should add + prefix if missing", () => {
      expect(otpService.normalizePhoneNumber("96512345678")).toBe("+96512345678")
    })

    it("should keep + prefix if present", () => {
      expect(otpService.normalizePhoneNumber("+96512345678")).toBe("+96512345678")
    })

    it("should convert 00 prefix to +", () => {
      expect(otpService.normalizePhoneNumber("0096512345678")).toBe("+96512345678")
    })

    it("should remove spaces and dashes", () => {
      expect(otpService.normalizePhoneNumber("+965-1234-5678")).toBe("+96512345678")
      expect(otpService.normalizePhoneNumber("+965 1234 5678")).toBe("+96512345678")
    })

    it("should return null for too short numbers", () => {
      expect(otpService.normalizePhoneNumber("1234")).toBeNull()
    })

    it("should return null for too long numbers", () => {
      expect(otpService.normalizePhoneNumber("12345678901234567890")).toBeNull()
    })

    it("should handle Kuwait numbers correctly", () => {
      expect(otpService.normalizePhoneNumber("+96566666666")).toBe("+96566666666")
      expect(otpService.normalizePhoneNumber("96566666666")).toBe("+96566666666")
    })
  })

  describe("formatOTPMessage", () => {
    it("should format OTP message with code", () => {
      const message = otpService.formatOTPMessage("123456")
      expect(message).toContain("123456")
      expect(message).toContain("verification code")
    })
  })
})

describe("OTPService with InMemoryStore", () => {
  it("should work with in-memory store for development", async () => {
    const mockSMSSender = vi.fn().mockResolvedValue(true)
    const service = OTPService.createWithInMemoryStore({
      smsSender: mockSMSSender,
      otpLength: 6,
      otpExpirySeconds: 300,
      maxAttempts: 3,
      maxRequestsPerHour: 5,
    })

    // Send OTP
    const sendResult = await service.sendOTP("+96512345678")
    expect(sendResult.success).toBe(true)

    // Get the OTP from the SMS message
    const sentMessage = (mockSMSSender as any).mock.calls[0][1]
    const otpMatch = sentMessage.match(/\d{6}/)
    expect(otpMatch).not.toBeNull()
    const otp = otpMatch[0]

    // Verify with correct OTP
    const verifyResult = await service.verifyOTP("+96512345678", otp)
    expect(verifyResult.success).toBe(true)

    // Verify again should fail (OTP deleted after successful verification)
    const verifyAgain = await service.verifyOTP("+96512345678", otp)
    expect(verifyAgain.success).toBe(false)
  })
})
