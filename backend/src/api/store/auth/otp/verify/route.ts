/**
 * Verify OTP Route
 *
 * POST /store/auth/otp/verify
 *
 * Verifies the OTP code and authenticates the customer.
 * On success, creates a customer account if it doesn't exist and returns an auth token.
 */
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { z } from "zod"
import { getOTPService } from "../../../../../services/otp-instance"

// Validation schema for verify OTP request
export const VerifyOTPSchema = z.object({
  phone: z
    .string()
    .min(8, "Phone number must be at least 8 digits")
    .max(20, "Phone number is too long")
    .regex(/^\+?[\d\s\-()]+$/, "Invalid phone number format"),
  code: z
    .string()
    .length(6, "OTP code must be 6 digits")
    .regex(/^\d+$/, "OTP code must contain only digits"),
})

export type VerifyOTPInput = z.infer<typeof VerifyOTPSchema>

/**
 * Normalize phone number for consistent storage/lookup
 */
function normalizePhoneNumber(phone: string): string | null {
  const cleaned = phone.replace(/[^\d+]/g, "")
  const digits = cleaned.replace(/\D/g, "")

  if (digits.length < 8 || digits.length > 15) {
    return null
  }

  if (cleaned.startsWith("00")) {
    return "+" + digits.slice(2)
  }

  if (!phone.startsWith("+")) {
    return "+" + digits
  }

  return "+" + digits
}

/**
 * POST /store/auth/otp/verify
 *
 * Verifies the OTP code for a phone number.
 *
 * Request body:
 * - phone: string - Phone number (same as used for send)
 * - code: string - 6-digit OTP code
 *
 * Response:
 * - 200: OTP verified successfully
 *   Returns: { verified: true, customer: {...}, token: "..." }
 * - 400: Invalid phone/code format or invalid OTP
 * - 410: OTP expired
 * - 429: Max attempts exceeded
 * - 500: Server error
 */
export const POST = async (
  req: MedusaRequest<VerifyOTPInput>,
  res: MedusaResponse
) => {
  try {
    // Validate request body
    const validationResult = VerifyOTPSchema.safeParse(req.body)
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

    const { phone, code } = validationResult.data
    const logger = req.scope.resolve("logger")

    // Normalize phone number
    const normalizedPhone = normalizePhoneNumber(phone)
    if (!normalizedPhone) {
      return res.status(400).json({
        type: "invalid_data",
        message: "Invalid phone number format",
      })
    }

    // Get OTP service and verify
    const otpService = getOTPService()
    const result = await otpService.verifyOTP(phone, code)

    if (!result.success) {
      // Check error type and return appropriate status code
      if (result.error?.includes("expired")) {
        logger.info(`OTP expired for phone: ${phone.slice(0, 5)}***`)
        return res.status(410).json({
          type: "otp_expired",
          message: result.error,
        })
      }

      if (result.error?.includes("Maximum")) {
        logger.warn(`Max OTP attempts exceeded for phone: ${phone.slice(0, 5)}***`)
        return res.status(429).json({
          type: "max_attempts",
          message: result.error,
        })
      }

      if (result.error?.includes("No OTP found")) {
        return res.status(400).json({
          type: "otp_not_found",
          message: result.error,
        })
      }

      // Invalid OTP code
      logger.info(`Invalid OTP for phone: ${phone.slice(0, 5)}***`)
      return res.status(400).json({
        type: "invalid_otp",
        message: result.error || "Invalid OTP code",
      })
    }

    // OTP verified successfully
    logger.info(`OTP verified for phone: ${phone.slice(0, 5)}***`)

    // Check if customer exists with this phone number
    const query = req.scope.resolve("query")
    const { data: existingCustomers } = await query.graph({
      entity: "customer",
      fields: ["id", "email", "first_name", "last_name", "phone", "has_account", "created_at"],
      filters: { phone: normalizedPhone },
    })

    let customer = existingCustomers.length > 0 ? existingCustomers[0] : null

    // If no customer exists, create one
    if (!customer) {
      const customerService = req.scope.resolve("customer")

      // Create customer with phone number
      // Note: Email is required by Medusa, so we generate a placeholder
      const placeholderEmail = `phone_${normalizedPhone.replace(/\D/g, "")}@placeholder.local`

      customer = await customerService.createCustomers({
        email: placeholderEmail,
        phone: normalizedPhone,
        first_name: "",
        last_name: "",
        has_account: true,
        metadata: {
          auth_method: "phone_otp",
          phone_verified: true,
          phone_verified_at: new Date().toISOString(),
        },
      })

      logger.info(`Created new customer via phone OTP: ${customer.id}`)
    } else {
      // Update existing customer to mark phone as verified
      const customerService = req.scope.resolve("customer")
      await customerService.updateCustomers(customer.id, {
        metadata: {
          ...(customer.metadata || {}),
          phone_verified: true,
          phone_verified_at: new Date().toISOString(),
        },
      })
    }

    // Generate authentication token
    // Note: In Medusa v2, authentication is handled by the auth module
    // For now, we return success and the customer data
    // The frontend should use this to call the appropriate auth endpoint
    res.status(200).json({
      verified: true,
      message: "Phone number verified successfully",
      customer: {
        id: customer.id,
        email: customer.email,
        phone: customer.phone,
        first_name: customer.first_name,
        last_name: customer.last_name,
        has_account: customer.has_account,
        created_at: customer.created_at,
        is_new: existingCustomers.length === 0,
      },
    })
  } catch (error) {
    const logger = req.scope.resolve("logger")
    logger.error("OTP verification failed:", error instanceof Error ? error : undefined)

    res.status(500).json({
      type: "unexpected_error",
      message: "Failed to verify OTP",
    })
  }
}
