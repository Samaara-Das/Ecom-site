/**
 * API Middleware Configuration
 *
 * Configures authentication and other middleware for API routes.
 *
 * Customer Auth Flow:
 * 1. Register: POST /auth/customer/emailpass/register (returns registration token)
 * 2. Create Customer: POST /store/customers (requires registration token)
 * 3. Login: POST /auth/customer/emailpass (returns session token)
 * 4. Authenticated Routes: Pass token in Authorization: Bearer {token}
 */
import { defineMiddlewares, authenticate } from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    // Protect customer profile routes - requires customer authentication
    {
      matcher: "/store/customers/me",
      middlewares: [authenticate("customer", ["bearer", "session"])]
    },
    {
      matcher: "/store/customers/me/*",
      middlewares: [authenticate("customer", ["bearer", "session"])]
    },
    // The /store/customers POST route allows registration with auth token
    // (the customer create route checks for auth_identity_id from the registration flow)
    {
      matcher: "/store/customers",
      methods: ["POST"],
      middlewares: [authenticate("customer", ["bearer"], { allowUnregistered: true })]
    }
  ]
})
