import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { POST, VerifyOTPSchema } from "../verify/route"

// Mock the OTP service instance
vi.mock("../../../../services/otp-instance", () => ({
  getOTPService: vi.fn(() => ({
    verifyOTP: vi.fn().mockResolvedValue({ success: true, message: "OTP verified successfully" }),
  })),
}))

// Mock request/response helpers
function createMockRequest(body: any) {
  return {
    body,
    scope: {
      resolve: vi.fn((name: string) => {
        if (name === "logger") {
          return {
            info: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
          }
        }
        if (name === "query") {
          return {
            graph: vi.fn().mockResolvedValue({ data: [] }),
          }
        }
        if (name === "customer") {
          return {
            createCustomers: vi.fn().mockResolvedValue({
              id: "cust_123",
              email: "phone_96512345678@placeholder.local",
              phone: "+96512345678",
              first_name: "",
              last_name: "",
              has_account: true,
              created_at: new Date().toISOString(),
            }),
            updateCustomers: vi.fn().mockResolvedValue({}),
          }
        }
        return {}
      }),
    },
  }
}

function createMockResponse() {
  const res: any = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

describe("POST /store/auth/otp/verify", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("VerifyOTPSchema validation", () => {
    it("should accept valid phone and code", () => {
      const result = VerifyOTPSchema.safeParse({
        phone: "+96512345678",
        code: "123456",
      })
      expect(result.success).toBe(true)
    })

    it("should reject code shorter than 6 digits", () => {
      const result = VerifyOTPSchema.safeParse({
        phone: "+96512345678",
        code: "12345",
      })
      expect(result.success).toBe(false)
    })

    it("should reject code longer than 6 digits", () => {
      const result = VerifyOTPSchema.safeParse({
        phone: "+96512345678",
        code: "1234567",
      })
      expect(result.success).toBe(false)
    })

    it("should reject code with non-digit characters", () => {
      const result = VerifyOTPSchema.safeParse({
        phone: "+96512345678",
        code: "12345a",
      })
      expect(result.success).toBe(false)
    })

    it("should reject missing code", () => {
      const result = VerifyOTPSchema.safeParse({
        phone: "+96512345678",
      })
      expect(result.success).toBe(false)
    })

    it("should reject missing phone", () => {
      const result = VerifyOTPSchema.safeParse({
        code: "123456",
      })
      expect(result.success).toBe(false)
    })
  })

  describe("POST handler", () => {
    it("should return 200 when OTP is verified successfully for new customer", async () => {
      const { getOTPService } = await import("../../../../services/otp-instance")
      const mockOTPService = {
        verifyOTP: vi.fn().mockResolvedValue({ success: true, message: "OTP verified successfully" }),
      }
      vi.mocked(getOTPService).mockReturnValue(mockOTPService as any)

      const req = createMockRequest({ phone: "+96512345678", code: "123456" })
      const res = createMockResponse()

      await POST(req as any, res as any)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          verified: true,
          message: "Phone number verified successfully",
          customer: expect.objectContaining({
            id: "cust_123",
            phone: "+96512345678",
            is_new: true,
          }),
        })
      )
    })

    it("should return 200 and update existing customer", async () => {
      const { getOTPService } = await import("../../../../services/otp-instance")
      const mockOTPService = {
        verifyOTP: vi.fn().mockResolvedValue({ success: true }),
      }
      vi.mocked(getOTPService).mockReturnValue(mockOTPService as any)

      const existingCustomer = {
        id: "cust_existing",
        email: "existing@example.com",
        phone: "+96512345678",
        first_name: "John",
        last_name: "Doe",
        has_account: true,
        created_at: new Date().toISOString(),
        metadata: {},
      }

      const mockQuery = {
        graph: vi.fn().mockResolvedValue({ data: [existingCustomer] }),
      }
      const mockCustomerService = {
        updateCustomers: vi.fn().mockResolvedValue({}),
      }

      const req = {
        body: { phone: "+96512345678", code: "123456" },
        scope: {
          resolve: vi.fn((name: string) => {
            if (name === "logger") return { info: vi.fn(), warn: vi.fn(), error: vi.fn() }
            if (name === "query") return mockQuery
            if (name === "customer") return mockCustomerService
            return {}
          }),
        },
      }
      const res = createMockResponse()

      await POST(req as any, res as any)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          verified: true,
          customer: expect.objectContaining({
            id: "cust_existing",
            is_new: false,
          }),
        })
      )
      expect(mockCustomerService.updateCustomers).toHaveBeenCalled()
    })

    it("should return 400 for invalid code format", async () => {
      const req = createMockRequest({ phone: "+96512345678", code: "abc" })
      const res = createMockResponse()

      await POST(req as any, res as any)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "invalid_data",
        })
      )
    })

    it("should return 400 for invalid OTP code", async () => {
      const { getOTPService } = await import("../../../../services/otp-instance")
      const mockOTPService = {
        verifyOTP: vi.fn().mockResolvedValue({
          success: false,
          error: "Invalid OTP code",
        }),
      }
      vi.mocked(getOTPService).mockReturnValue(mockOTPService as any)

      const req = createMockRequest({ phone: "+96512345678", code: "654321" })
      const res = createMockResponse()

      await POST(req as any, res as any)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "invalid_otp",
        })
      )
    })

    it("should return 410 for expired OTP", async () => {
      const { getOTPService } = await import("../../../../services/otp-instance")
      const mockOTPService = {
        verifyOTP: vi.fn().mockResolvedValue({
          success: false,
          error: "OTP has expired. Please request a new one.",
        }),
      }
      vi.mocked(getOTPService).mockReturnValue(mockOTPService as any)

      const req = createMockRequest({ phone: "+96512345678", code: "123456" })
      const res = createMockResponse()

      await POST(req as any, res as any)

      expect(res.status).toHaveBeenCalledWith(410)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "otp_expired",
        })
      )
    })

    it("should return 429 when max attempts exceeded", async () => {
      const { getOTPService } = await import("../../../../services/otp-instance")
      const mockOTPService = {
        verifyOTP: vi.fn().mockResolvedValue({
          success: false,
          error: "Maximum verification attempts exceeded. Please request a new OTP.",
        }),
      }
      vi.mocked(getOTPService).mockReturnValue(mockOTPService as any)

      const req = createMockRequest({ phone: "+96512345678", code: "123456" })
      const res = createMockResponse()

      await POST(req as any, res as any)

      expect(res.status).toHaveBeenCalledWith(429)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "max_attempts",
        })
      )
    })

    it("should return 400 when no OTP exists for phone", async () => {
      const { getOTPService } = await import("../../../../services/otp-instance")
      const mockOTPService = {
        verifyOTP: vi.fn().mockResolvedValue({
          success: false,
          error: "No OTP found for this phone number. Please request a new one.",
        }),
      }
      vi.mocked(getOTPService).mockReturnValue(mockOTPService as any)

      const req = createMockRequest({ phone: "+96512345678", code: "123456" })
      const res = createMockResponse()

      await POST(req as any, res as any)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "otp_not_found",
        })
      )
    })

    it("should return 500 on unexpected error", async () => {
      const { getOTPService } = await import("../../../../services/otp-instance")
      const mockOTPService = {
        verifyOTP: vi.fn().mockRejectedValue(new Error("Database error")),
      }
      vi.mocked(getOTPService).mockReturnValue(mockOTPService as any)

      const req = createMockRequest({ phone: "+96512345678", code: "123456" })
      const res = createMockResponse()

      await POST(req as any, res as any)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "unexpected_error",
        })
      )
    })
  })
})
