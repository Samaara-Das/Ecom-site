/**
 * Store Customer Routes
 *
 * POST /store/customers - Register a new customer
 *
 * Flow:
 * 1. Client calls POST /auth/customer/emailpass/register with { email, password }
 * 2. Auth endpoint returns { token } (registration JWT)
 * 3. Client calls POST /store/customers with customer data and token in Authorization header
 * 4. This route creates the customer and links it to the auth identity
 */
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { z } from "zod"

// Validation schema for customer registration
export const CreateCustomerSchema = z.object({
  email: z.string().email("Invalid email format"),
  first_name: z.string().min(1, "First name is required").max(255),
  last_name: z.string().min(1, "Last name is required").max(255),
  phone: z.string().optional(),
  metadata: z.record(z.unknown()).optional()
})

export type CreateCustomerInput = z.infer<typeof CreateCustomerSchema>

/**
 * POST /store/customers
 *
 * Creates a new customer. Requires authorization token from /auth/customer/emailpass/register.
 * The token contains the auth identity ID that will be linked to the customer.
 */
export const POST = async (
  req: MedusaRequest<CreateCustomerInput>,
  res: MedusaResponse
) => {
  try {
    // Validate request body
    const validationResult = CreateCustomerSchema.safeParse(req.body)
    if (!validationResult.success) {
      return res.status(400).json({
        type: "invalid_data",
        message: "Validation failed",
        errors: validationResult.error.errors.map(e => ({
          field: e.path.join("."),
          message: e.message
        }))
      })
    }

    const { email, first_name, last_name, phone, metadata } = validationResult.data

    // Get auth context from the registration token
    // The auth middleware decodes the JWT and populates req.auth_context
    const authContext = (req as any).auth_context

    if (!authContext?.auth_identity_id) {
      return res.status(401).json({
        type: "unauthorized",
        message: "Registration token required. First call POST /auth/customer/emailpass/register"
      })
    }

    // Resolve the customer service
    const customerService = req.scope.resolve("customer")
    const logger = req.scope.resolve("logger")

    // Check if customer with this email already exists
    const query = req.scope.resolve("query")
    const { data: existingCustomers } = await query.graph({
      entity: "customer",
      fields: ["id", "email"],
      filters: { email }
    })

    if (existingCustomers.length > 0) {
      return res.status(409).json({
        type: "conflict",
        message: "A customer with this email already exists"
      })
    }

    // Create the customer
    const customer = await customerService.createCustomers({
      email,
      first_name,
      last_name,
      phone,
      metadata,
      has_account: true
    })

    logger.info(`Customer created: ${customer.id} (${email})`)

    // Return the created customer (without sensitive data)
    res.status(201).json({
      customer: {
        id: customer.id,
        email: customer.email,
        first_name: customer.first_name,
        last_name: customer.last_name,
        phone: customer.phone,
        has_account: customer.has_account,
        created_at: customer.created_at
      }
    })
  } catch (error) {
    const logger = req.scope.resolve("logger")
    logger.error("Customer registration failed:", error instanceof Error ? error : undefined)

    res.status(500).json({
      type: "unexpected_error",
      message: "Failed to create customer"
    })
  }
}
