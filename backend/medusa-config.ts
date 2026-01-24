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
