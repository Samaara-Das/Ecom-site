import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '../route'

describe('Customer Registration API', () => {
  const mockJson = vi.fn()
  const mockStatus = vi.fn().mockReturnThis()

  const createMockResponse = () => ({
    status: mockStatus,
    json: mockJson
  })

  const mockLogger = {
    info: vi.fn(),
    error: vi.fn()
  }

  const mockCustomerService = {
    createCustomers: vi.fn()
  }

  const createMockRequest = (
    body: Record<string, unknown>,
    authContext?: { auth_identity_id?: string; actor_id?: string },
    existingCustomers: unknown[] = []
  ) => {
    const mockQuery = {
      graph: vi.fn().mockResolvedValue({ data: existingCustomers })
    }

    return {
      body,
      auth_context: authContext,
      scope: {
        resolve: vi.fn().mockImplementation((service: string) => {
          if (service === 'customer') return mockCustomerService
          if (service === 'query') return mockQuery
          if (service === 'logger') return mockLogger
          return null
        })
      }
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockCustomerService.createCustomers.mockResolvedValue({
      id: 'cust_123',
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
      phone: '+1234567890',
      has_account: true,
      created_at: new Date().toISOString()
    })
  })

  describe('POST /store/customers', () => {
    it('should return 400 when validation fails (missing required fields)', async () => {
      const req = createMockRequest(
        { email: 'invalid' }, // missing first_name, last_name
        { auth_identity_id: 'auth_123' }
      )
      const res = createMockResponse()

      await POST(req as any, res as any)

      expect(mockStatus).toHaveBeenCalledWith(400)
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'invalid_data',
          message: 'Validation failed'
        })
      )
    })

    it('should return 400 when email format is invalid', async () => {
      const req = createMockRequest(
        {
          email: 'not-an-email',
          first_name: 'John',
          last_name: 'Doe'
        },
        { auth_identity_id: 'auth_123' }
      )
      const res = createMockResponse()

      await POST(req as any, res as any)

      expect(mockStatus).toHaveBeenCalledWith(400)
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'invalid_data',
          errors: expect.arrayContaining([
            expect.objectContaining({
              field: 'email',
              message: 'Invalid email format'
            })
          ])
        })
      )
    })

    it('should return 401 when no auth token is provided', async () => {
      const req = createMockRequest(
        {
          email: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe'
        },
        undefined // no auth context
      )
      const res = createMockResponse()

      await POST(req as any, res as any)

      expect(mockStatus).toHaveBeenCalledWith(401)
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'unauthorized',
          message: expect.stringContaining('Registration token required')
        })
      )
    })

    it('should return 409 when customer with email already exists', async () => {
      const req = createMockRequest(
        {
          email: 'existing@example.com',
          first_name: 'John',
          last_name: 'Doe'
        },
        { auth_identity_id: 'auth_123' },
        [{ id: 'cust_existing', email: 'existing@example.com' }] // existing customer
      )
      const res = createMockResponse()

      await POST(req as any, res as any)

      expect(mockStatus).toHaveBeenCalledWith(409)
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'conflict',
          message: 'A customer with this email already exists'
        })
      )
    })

    it('should create customer and return 201 on success', async () => {
      const req = createMockRequest(
        {
          email: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe',
          phone: '+1234567890'
        },
        { auth_identity_id: 'auth_123' }
      )
      const res = createMockResponse()

      await POST(req as any, res as any)

      expect(mockCustomerService.createCustomers).toHaveBeenCalledWith({
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        phone: '+1234567890',
        metadata: undefined,
        has_account: true
      })
      expect(mockStatus).toHaveBeenCalledWith(201)
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          customer: expect.objectContaining({
            id: 'cust_123',
            email: 'test@example.com',
            first_name: 'John',
            last_name: 'Doe',
            has_account: true
          })
        })
      )
    })

    it('should accept optional metadata field', async () => {
      const req = createMockRequest(
        {
          email: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe',
          metadata: { source: 'mobile_app' }
        },
        { auth_identity_id: 'auth_123' }
      )
      const res = createMockResponse()

      await POST(req as any, res as any)

      expect(mockCustomerService.createCustomers).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: { source: 'mobile_app' }
        })
      )
    })

    it('should log customer creation', async () => {
      const req = createMockRequest(
        {
          email: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe'
        },
        { auth_identity_id: 'auth_123' }
      )
      const res = createMockResponse()

      await POST(req as any, res as any)

      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringContaining('Customer created')
      )
    })

    it('should return 500 when customer creation fails', async () => {
      mockCustomerService.createCustomers.mockRejectedValue(new Error('Database error'))

      const req = createMockRequest(
        {
          email: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe'
        },
        { auth_identity_id: 'auth_123' }
      )
      const res = createMockResponse()

      await POST(req as any, res as any)

      expect(mockStatus).toHaveBeenCalledWith(500)
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'unexpected_error',
          message: 'Failed to create customer'
        })
      )
      expect(mockLogger.error).toHaveBeenCalled()
    })
  })
})
