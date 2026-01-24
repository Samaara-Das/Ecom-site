import { defineMiddlewares } from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    // Custom middleware configurations can be added here
    // Example:
    // {
    //   matcher: "/store/*",
    //   middlewares: [
    //     // Your middleware functions
    //   ]
    // }
  ]
})
