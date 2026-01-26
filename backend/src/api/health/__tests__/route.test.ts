import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '../route'

describe('Health Check API', () => {
  const mockJson = vi.fn()
  const mockStatus = vi.fn().mockReturnThis()

  const createMockResponse = () => ({
    status: mockStatus,
    json: mockJson
  })

  const createMockRequest = (queryResult: unknown = { data: [{ id: 'test' }] }, shouldThrow = false) => {
    const mockQuery = {
      graph: vi.fn().mockImplementation(() => {
        if (shouldThrow) {
          throw new Error('Database connection failed')
        }
        return Promise.resolve(queryResult)
      })
    }

    return {
      scope: {
        resolve: vi.fn().mockReturnValue(mockQuery)
      }
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /health', () => {
    it('should return 200 with healthy status when database is connected', async () => {
      const req = createMockRequest()
      const res = createMockResponse()

      await GET(req as any, res as any)

      expect(mockStatus).toHaveBeenCalledWith(200)
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'healthy',
          service: 'kuwait-marketplace-backend',
          timestamp: expect.any(String)
        })
      )
    })

    it('should query the database to verify connection', async () => {
      const req = createMockRequest()
      const res = createMockResponse()

      await GET(req as any, res as any)

      const query = req.scope.resolve('query')
      expect(query.graph).toHaveBeenCalledWith({
        entity: 'region',
        fields: ['id'],
        pagination: { take: 1 }
      })
    })

    it('should return 503 with unhealthy status when database connection fails', async () => {
      const req = createMockRequest(null, true)
      const res = createMockResponse()

      await GET(req as any, res as any)

      expect(mockStatus).toHaveBeenCalledWith(503)
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'unhealthy',
          service: 'kuwait-marketplace-backend',
          error: 'Database connection failed',
          timestamp: expect.any(String)
        })
      )
    })

    it('should include timestamp in ISO format', async () => {
      const req = createMockRequest()
      const res = createMockResponse()

      const beforeTime = new Date().toISOString()
      await GET(req as any, res as any)
      const afterTime = new Date().toISOString()

      const responseBody = mockJson.mock.calls[0][0]
      const timestamp = new Date(responseBody.timestamp)

      expect(timestamp.getTime()).toBeGreaterThanOrEqual(new Date(beforeTime).getTime())
      expect(timestamp.getTime()).toBeLessThanOrEqual(new Date(afterTime).getTime())
    })
  })
})
