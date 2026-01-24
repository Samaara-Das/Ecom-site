import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"

/**
 * Health check endpoint for the Medusa backend.
 * Used for monitoring and load balancer health checks.
 *
 * @route GET /health
 * @returns {Object} Health status with timestamp
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query")

  try {
    // Check database connection by querying regions
    await query.graph({
      entity: "region",
      fields: ["id"],
      pagination: { take: 1 }
    })

    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "kuwait-marketplace-backend"
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      service: "kuwait-marketplace-backend",
      error: errorMessage
    })
  }
}
