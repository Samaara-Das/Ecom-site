import { defineConfig, loadEnv } from "@medusajs/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseLogging: process.env.NODE_ENV === "development",
    databaseDriverOptions: {
      ssl: process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false
    },
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:8000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:9000",
      authCors: process.env.AUTH_CORS || "http://localhost:8000,http://localhost:9000",
      jwtSecret: process.env.JWT_SECRET || "supersecret-jwt-change-in-production",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret-cookie-change-in-production"
    },
    workerMode: (process.env.WORKER_MODE as "shared" | "worker" | "server") || "shared"
  },
  admin: {
    backendUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
    disable: process.env.DISABLE_ADMIN === "true"
  },
  modules: [
    // Vendor Module for multi-vendor marketplace
    {
      resolve: "./src/modules/vendor",
    },
    // Payment Providers (Stripe and PayPal)
    // Stripe is enabled when STRIPE_API_KEY is set
    // PayPal is enabled when PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET are set
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          // Stripe Payment Provider
          ...(process.env.STRIPE_API_KEY
            ? [
                {
                  resolve: "@medusajs/medusa/payment-stripe",
                  id: "stripe",
                  options: {
                    apiKey: process.env.STRIPE_API_KEY,
                    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
                  },
                },
              ]
            : []),
          // PayPal Payment Provider
          ...(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET
            ? [
                {
                  resolve: "./src/modules/paypal",
                  id: "paypal",
                  options: {
                    client_id: process.env.PAYPAL_CLIENT_ID,
                    client_secret: process.env.PAYPAL_CLIENT_SECRET,
                    environment: process.env.PAYPAL_ENVIRONMENT || "sandbox",
                    autoCapture: process.env.PAYPAL_AUTO_CAPTURE === "true",
                    webhook_id: process.env.PAYPAL_WEBHOOK_ID,
                  },
                },
              ]
            : []),
        ],
      },
    },
    // Redis modules for production (uncomment when REDIS_URL is configured)
    // {
    //   resolve: "@medusajs/medusa/cache-redis",
    //   options: {
    //     redisUrl: process.env.REDIS_URL
    //   }
    // },
    // {
    //   resolve: "@medusajs/medusa/event-bus-redis",
    //   options: {
    //     redisUrl: process.env.REDIS_URL
    //   }
    // },
    // {
    //   resolve: "@medusajs/medusa/workflow-engine-redis",
    //   options: {
    //     redis: {
    //       url: process.env.REDIS_URL
    //     }
    //   }
    // },
    // {
    //   resolve: "@medusajs/medusa/locking-redis",
    //   options: {
    //     redisUrl: process.env.REDIS_URL
    //   }
    // }
  ]
})
