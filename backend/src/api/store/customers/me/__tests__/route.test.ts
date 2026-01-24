import { GET, POST } from '../route'

describe('Customer Profile API', () => {
  const mockJson = jest.fn()
  const mockStatus = jest.fn().mockReturnThis()

  const createMockResponse = () => ({
    status: mockStatus,
    json: mockJson
  })

  const mockLogger = {
    info: jest.fn(),
    error: jest.fn()
  }

  const mockCustomerService = {
    updateCustomers: jest.fn()
  }

  const mockCustomerData = {
    id: 'cust_123',
    email: 'test@example.com',
    first_name: 'John',
    last_name: 'Doe',
    phone: '+1234567890',
    has_account: true,
    metadata: { loyalty_tier: 'gold' },
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-15T00:00:00.000Z',
    addresses: [
      {
        id: 'addr_123',
        first_name: 'John',
        last_name: 'Doe',
        address_1: '123 Main St',
        city: 'Kuwait City',
        country_code: 'kw'
      }
    ]
  }

  const createMockRequest = (
    body: Record<string, unknown> = {},
    authContext?: { auth_identity_id?: string; actor_id?: string },
    customerFound: boolean = true
  ) => {
    const mockQuery = {
      graph: jest.fn().mockResolvedValue({
        data: customerFound ? [mockCustomerData] : []
      })
    }

    return {
      body,
      auth_context: authContext,
      scope: {
        resolve: jest.fn().mockImplementation((service: string) => {
          if (service === 'customer') return mockCustomerService
          if (service === 'query') return mockQuery
          if (service === 'logger') return mockLogger
          return null
        })
      }
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockCustomerService.updateCustomers.mockResolvedValue(mockCustomerData)
  })

  describe('GET /store/customers/me', () => {
    it('should return 401 when not authenticated', async () => {
      const req = createMockRequest({}, undefined)
      const res = createMockResponse()

      await GET(req as any, res as any)

      expect(mockStatus).toHaveBeenCalledWith(401)
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'unauthorized',
          message: 'Authentication required'
        })
      )
    })

    it('should return 404 when customer not found', async () => {
      const req = createMockRequest({}, { actor_id: 'cust_nonexistent' }, false)
      const res = createMockResponse()

      await GET(req as any, res as any)

      expect(mockStatus).toHaveBeenCalledWith(404)
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'not_found',
          message: 'Customer not found'
        })
      )
    })

    it('should return customer profile with addresses', async () => {
      const req = createMockRequest({}, { actor_id: 'cust_123' })
      const res = createMockResponse()

      await GET(req as any, res as any)

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          customer: expect.objectContaining({
            id: 'cust_123',
            email: 'test@example.com',
            first_name: 'John',
            last_name: 'Doe',
            phone: '+1234567890',
            has_account: true,
            addresses: expect.arrayContaining([
              expect.objectContaining({
                id: 'addr_123',
                city: 'Kuwait City'
              })
            ])
          })
        })
      )
    })

    it('should query with correct customer ID', async () => {
      const req = createMockRequest({}, { actor_id: 'cust_456' })
      const res = createMockResponse()

      await GET(req as any, res as any)

      const query = req.scope.resolve('query')
      expect(query.graph).toHaveBeenCalledWith(
        expect.objectContaining({
          entity: 'customer',
          filters: { id: 'cust_456' }
        })
      )
    })

    it('should return empty addresses array when customer has no addresses', async () => {
      const mockQueryNoAddresses = {
        graph: jest.fn().mockResolvedValue({
          data: [{ ...mockCustomerData, addresses: undefined }]
        })
      }

      const req = {
        body: {},
        auth_context: { actor_id: 'cust_123' },
        scope: {
          resolve: jest.fn().mockImplementation((service: string) => {
            if (service === 'query') return mockQueryNoAddresses
            if (service === 'logger') return mockLogger
            return null
          })
        }
      }
      const res = createMockResponse()

      await GET(req as any, res as any)

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          customer: expect.objectContaining({
            addresses: []
          })
        })
      )
    })
  })

  describe('POST /store/customers/me', () => {
    it('should return 401 when not authenticated', async () => {
      const req = createMockRequest({ first_name: 'Jane' }, undefined)
      const res = createMockResponse()

      await POST(req as any, res as any)

      expect(mockStatus).toHaveBeenCalledWith(401)
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'unauthorized',
          message: 'Authentication required'
        })
      )
    })

    it('should return 400 when no update data provided', async () => {
      const req = createMockRequest({}, { actor_id: 'cust_123' })
      const res = createMockResponse()

      await POST(req as any, res as any)

      expect(mockStatus).toHaveBeenCalledWith(400)
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'invalid_data',
          message: 'No update data provided'
        })
      )
    })

    it('should update customer first_name', async () => {
      const req = createMockRequest({ first_name: 'Jane' }, { actor_id: 'cust_123' })
      const res = createMockResponse()

      await POST(req as any, res as any)

      expect(mockCustomerService.updateCustomers).toHaveBeenCalledWith(
        'cust_123',
        { first_name: 'Jane' }
      )
    })

    it('should update customer last_name', async () => {
      const req = createMockRequest({ last_name: 'Smith' }, { actor_id: 'cust_123' })
      const res = createMockResponse()

      await POST(req as any, res as any)

      expect(mockCustomerService.updateCustomers).toHaveBeenCalledWith(
        'cust_123',
        { last_name: 'Smith' }
      )
    })

    it('should update multiple fields at once', async () => {
      const req = createMockRequest(
        {
          first_name: 'Jane',
          last_name: 'Smith',
          phone: '+9876543210'
        },
        { actor_id: 'cust_123' }
      )
      const res = createMockResponse()

      await POST(req as any, res as any)

      expect(mockCustomerService.updateCustomers).toHaveBeenCalledWith(
        'cust_123',
        {
          first_name: 'Jane',
          last_name: 'Smith',
          phone: '+9876543210'
        }
      )
    })

    it('should allow updating metadata', async () => {
      const req = createMockRequest(
        { metadata: { preferences: { theme: 'dark' } } },
        { actor_id: 'cust_123' }
      )
      const res = createMockResponse()

      await POST(req as any, res as any)

      expect(mockCustomerService.updateCustomers).toHaveBeenCalledWith(
        'cust_123',
        { metadata: { preferences: { theme: 'dark' } } }
      )
    })

    it('should allow setting phone to null', async () => {
      const req = createMockRequest({ phone: null }, { actor_id: 'cust_123' })
      const res = createMockResponse()

      await POST(req as any, res as any)

      expect(mockCustomerService.updateCustomers).toHaveBeenCalledWith(
        'cust_123',
        { phone: null }
      )
    })

    it('should return updated customer profile', async () => {
      const req = createMockRequest({ first_name: 'Jane' }, { actor_id: 'cust_123' })
      const res = createMockResponse()

      await POST(req as any, res as any)

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          customer: expect.objectContaining({
            id: 'cust_123',
            email: 'test@example.com'
          })
        })
      )
    })

    it('should log customer update', async () => {
      const req = createMockRequest({ first_name: 'Jane' }, { actor_id: 'cust_123' })
      const res = createMockResponse()

      await POST(req as any, res as any)

      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringContaining('Customer updated')
      )
    })

    it('should return 500 when update fails', async () => {
      mockCustomerService.updateCustomers.mockRejectedValue(new Error('Database error'))

      const req = createMockRequest({ first_name: 'Jane' }, { actor_id: 'cust_123' })
      const res = createMockResponse()

      await POST(req as any, res as any)

      expect(mockStatus).toHaveBeenCalledWith(500)
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'unexpected_error',
          message: 'Failed to update customer profile'
        })
      )
      expect(mockLogger.error).toHaveBeenCalled()
    })

    it('should return 400 when first_name is too short', async () => {
      const req = createMockRequest({ first_name: '' }, { actor_id: 'cust_123' })
      const res = createMockResponse()

      await POST(req as any, res as any)

      expect(mockStatus).toHaveBeenCalledWith(400)
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'invalid_data'
        })
      )
    })
  })
})
