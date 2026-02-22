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
 *
 * Admin Auth Flow:
 * 1. Login: POST /auth/user/emailpass (returns session token)
 * 2. Admin Routes: /admin/* are protected by user authentication
 */
import { defineMiddlewares, authenticate } from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    // Protect admin vendor routes - requires admin user authentication
    {
      matcher: "/admin/vendors",
      middlewares: [authenticate("user", ["session", "bearer", "api-key"])]
    },
    {
      matcher: "/admin/vendors/*",
      middlewares: [authenticate("user", ["session", "bearer", "api-key"])]
    },
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
