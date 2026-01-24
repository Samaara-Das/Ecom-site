/**
 * Send OTP Route
 *
 * POST /store/auth/otp/send
 *
 * Sends a one-time password to the provided phone number for authentication.
 * Rate limited to prevent abuse.
 */
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { z } from "zod"
import { getOTPService } from "../../../../services/otp-instance"

// Validation schema for send OTP request
export const SendOTPSchema = z.object({
  phone: z
    .string()
    .min(8, "Phone number must be at least 8 digits")
    .max(20, "Phone number is too long")
    .regex(/^\+?[\d\s\-()]+$/, "Invalid phone number format"),
})

export type SendOTPInput = z.infer<typeof SendOTPSchema>

/**
 * POST /store/auth/otp/send
 *
 * Sends an OTP to the provided phone number.
 *
 * Request body:
 * - phone: string - Phone number in E.164 format (e.g., +96512345678)
 *
 * Response:
 * - 200: OTP sent successfully
 * - 400: Invalid phone number
 * - 429: Rate limit exceeded
 * - 500: Failed to send OTP
 */
export const POST = async (
  req: MedusaRequest<SendOTPInput>,
  res: MedusaResponse
) => {
  try {
    // Validate request body
    const validationResult = SendOTPSchema.safeParse(req.body)
    if (!validationResult.success) {
      return res.status(400).json({
        type: "invalid_data",
        message: "Validation failed",
        errors: validationResult.error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      })
    }

    const { phone } = validationResult.data
    const logger = req.scope.resolve("logger")

    // Get OTP service and send OTP
    const otpService = getOTPService()
    const result = await otpService.sendOTP(phone)

    if (!result.success) {
      // Check if it's a rate limit error
      if (result.error?.includes("Too many")) {
        logger.warn(`OTP rate limit exceeded for phone: ${phone.slice(0, 5)}***`)
        return res.status(429).json({
          type: "rate_limit",
          message: result.error,
        })
      }

      // Check if it's a validation error
      if (result.error?.includes("Invalid phone")) {
        return res.status(400).json({
          type: "invalid_data",
          message: result.error,
        })
      }

      // Other errors (SMS sending failed)
      logger.error(`OTP send failed for phone: ${phone.slice(0, 5)}***`, result.error)
      return res.status(500).json({
        type: "unexpected_error",
        message: result.error || "Failed to send OTP",
      })
    }

    logger.info(`OTP sent successfully to phone: ${phone.slice(0, 5)}***`)

    res.status(200).json({
      success: true,
      message: "OTP sent successfully. Please check your phone.",
      // In development, we could include the OTP for testing
      // otp: process.env.NODE_ENV === "development" ? result.otp : undefined,
    })
  } catch (error) {
    const logger = req.scope.resolve("logger")
    logger.error("OTP send failed:", error)

    res.status(500).json({
      type: "unexpected_error",
      message: "Failed to send OTP",
    })
  }
}
