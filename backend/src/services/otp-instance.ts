/**
 * OTP Service Instance
 *
 * Provides a singleton OTP service instance that can be shared
 * across all OTP-related endpoints.
 */
import { OTPService, InMemoryOTPStore, OTPStore, OTPConfig } from "./otp"
import { SMSNotificationService } from "./sms-notification"

// Singleton instance
let otpServiceInstance: OTPService | null = null
let smsServiceInstance: SMSNotificationService | null = null

/**
 * Configuration for the OTP service
 */
export const OTP_CONFIG = {
  otpLength: 6,
  otpExpirySeconds: 300, // 5 minutes
  maxAttempts: 3,
  maxRequestsPerHour: 5,
}

/**
 * Get or create the SMS service instance
 */
export function getSMSService(): SMSNotificationService {
  if (!smsServiceInstance) {
    smsServiceInstance = new SMSNotificationService()
  }
  return smsServiceInstance
}

/**
 * Create an SMS sender function that uses the SMS notification service
 */
export function createSMSSender(): (phone: string, message: string) => Promise<boolean> {
  return async (phone: string, message: string): Promise<boolean> => {
    const smsService = getSMSService()

    if (!smsService.isReady()) {
      // In development/test mode, log the OTP instead of failing
      console.warn("[OTP] SMS service not configured. Development mode enabled.")
      console.log(`[OTP] Would send to ${phone}: ${message}`)
      return true
    }

    const result = await smsService.sendSMS({ to: phone, message })
    if (!result.success) {
      console.error(`[OTP] SMS send failed:`, result.error)
    }
    return result.success
  }
}

/**
 * Get the OTP service instance
 *
 * Uses InMemoryOTPStore by default. In production, you should:
 * 1. Create a RedisOTPStore implementation
 * 2. Use environment variable to determine which store to use
 */
export function getOTPService(): OTPService {
  if (!otpServiceInstance) {
    // Create the OTP store
    // TODO: In production, use Redis-backed store for distributed systems
    const store = new InMemoryOTPStore()

    // Create SMS sender
    const smsSender = createSMSSender()

    // Create OTP service
    otpServiceInstance = new OTPService({
      store,
      smsSender,
      ...OTP_CONFIG,
    })
  }

  return otpServiceInstance
}

/**
 * Reset the OTP service instance (useful for testing)
 */
export function resetOTPService(): void {
  otpServiceInstance = null
  smsServiceInstance = null
}

export default getOTPService
