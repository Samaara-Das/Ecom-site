/**
 * Customer Profile Routes
 *
 * GET /store/customers/me - Get authenticated customer's profile
 * POST /store/customers/me - Update authenticated customer's profile
 *
 * These routes are protected and require customer authentication.
 */
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { z } from "zod"

// Validation schema for customer update
export const UpdateCustomerSchema = z.object({
  first_name: z.string().min(1).max(255).optional(),
  last_name: z.string().min(1).max(255).optional(),
  phone: z.string().optional().nullable(),
  metadata: z.record(z.unknown()).optional()
})

export type UpdateCustomerInput = z.infer<typeof UpdateCustomerSchema>

/**
 * GET /store/customers/me
 *
 * Retrieves the authenticated customer's profile.
 * Requires customer authentication via JWT token.
 */
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    // Get the authenticated customer ID from auth context
    const authContext = (req as any).auth_context

    if (!authContext?.actor_id) {
      return res.status(401).json({
        type: "unauthorized",
        message: "Authentication required"
      })
    }

    const customerId = authContext.actor_id

    // Query the customer with addresses
    const query = req.scope.resolve("query")
    const { data: customers } = await query.graph({
      entity: "customer",
      fields: [
        "id",
        "email",
        "first_name",
        "last_name",
        "phone",
        "has_account",
        "metadata",
        "created_at",
        "updated_at",
        "addresses.*"
      ],
      filters: { id: customerId }
    })

    if (customers.length === 0) {
      return res.status(404).json({
        type: "not_found",
        message: "Customer not found"
      })
    }

    const customer = customers[0]

    res.json({
      customer: {
        id: customer.id,
        email: customer.email,
        first_name: customer.first_name,
        last_name: customer.last_name,
        phone: customer.phone,
        has_account: customer.has_account,
        metadata: customer.metadata,
        created_at: customer.created_at,
        updated_at: customer.updated_at,
        addresses: customer.addresses || []
      }
    })
  } catch (error) {
    const logger = req.scope.resolve("logger")
    logger.error("Failed to retrieve customer profile:", error)

    res.status(500).json({
      type: "unexpected_error",
      message: "Failed to retrieve customer profile"
    })
  }
}

/**
 * POST /store/customers/me
 *
 * Updates the authenticated customer's profile.
 * Requires customer authentication via JWT token.
 */
export const POST = async (
  req: MedusaRequest<UpdateCustomerInput>,
  res: MedusaResponse
) => {
  try {
    // Get the authenticated customer ID from auth context
    const authContext = (req as any).auth_context

    if (!authContext?.actor_id) {
      return res.status(401).json({
        type: "unauthorized",
        message: "Authentication required"
      })
    }

    const customerId = authContext.actor_id

    // Validate request body
    const validationResult = UpdateCustomerSchema.safeParse(req.body)
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

    const updateData = validationResult.data

    // Ensure we have something to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        type: "invalid_data",
        message: "No update data provided"
      })
    }

    // Resolve services
    const customerService = req.scope.resolve("customer")
    const logger = req.scope.resolve("logger")

    // Update the customer
    await customerService.updateCustomers(customerId, updateData)

    logger.info(`Customer updated: ${customerId}`)

    // Query the full customer with addresses
    const query = req.scope.resolve("query")
    const { data: customers } = await query.graph({
      entity: "customer",
      fields: [
        "id",
        "email",
        "first_name",
        "last_name",
        "phone",
        "has_account",
        "metadata",
        "created_at",
        "updated_at",
        "addresses.*"
      ],
      filters: { id: customerId }
    })

    const customer = customers[0]

    res.json({
      customer: {
        id: customer.id,
        email: customer.email,
        first_name: customer.first_name,
        last_name: customer.last_name,
        phone: customer.phone,
        has_account: customer.has_account,
        metadata: customer.metadata,
        created_at: customer.created_at,
        updated_at: customer.updated_at,
        addresses: customer.addresses || []
      }
    })
  } catch (error) {
    const logger = req.scope.resolve("logger")
    logger.error("Failed to update customer profile:", error)

    res.status(500).json({
      type: "unexpected_error",
      message: "Failed to update customer profile"
    })
  }
}
