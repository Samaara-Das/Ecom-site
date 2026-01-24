import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import {
  SMSNotificationService,
  OrderSMSData,
  ShippingUpdateSMSData,
} from "../services/sms-notification"

vi.mock("twilio", () => {
  const mockMessages = {
    create: vi.fn(),
  }
  return {
    default: vi.fn(() => ({
      messages: mockMessages,
    })),
  }
})

describe("SMSNotificationService", () => {
  let originalEnv: NodeJS.ProcessEnv

  beforeEach(() => {
    originalEnv = { ...process.env }
    vi.clearAllMocks()
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe("constructor", () => {
    it("should not be ready when no credentials are provided", () => {
      delete process.env.TWILIO_ACCOUNT_SID
      delete process.env.TWILIO_AUTH_TOKEN
      delete process.env.TWILIO_FROM_NUMBER

      const service = new SMSNotificationService()
      expect(service.isReady()).toBe(false)
    })

    it("should be ready when config credentials are provided", () => {
      const service = new SMSNotificationService({
        accountSid: "test_sid",
        authToken: "test_token",
        fromNumber: "+1234567890",
      })
      expect(service.isReady()).toBe(true)
    })

    it("should be ready when env credentials are provided", () => {
      process.env.TWILIO_ACCOUNT_SID = "test_sid"
      process.env.TWILIO_AUTH_TOKEN = "test_token"
      process.env.TWILIO_FROM_NUMBER = "+1234567890"

      const service = new SMSNotificationService()
      expect(service.isReady()).toBe(true)
    })
  })

  describe("normalizePhoneNumber", () => {
    const service = new SMSNotificationService({
      accountSid: "test_sid",
      authToken: "test_token",
      fromNumber: "+1234567890",
    })

    it("should normalize a phone number with country code", () => {
      expect(service.normalizePhoneNumber("+1234567890")).toBe("+1234567890")
    })

    it("should add + prefix to numbers without it", () => {
      expect(service.normalizePhoneNumber("1234567890")).toBe("+1234567890")
    })

    it("should handle numbers with 00 prefix", () => {
      expect(service.normalizePhoneNumber("001234567890")).toBe("+1234567890")
    })

    it("should remove non-digit characters", () => {
      expect(service.normalizePhoneNumber("+1 (234) 567-8901")).toBe(
        "+12345678901"
      )
    })

    it("should return null for too short numbers", () => {
      expect(service.normalizePhoneNumber("123")).toBeNull()
    })

    it("should return null for too long numbers", () => {
      expect(service.normalizePhoneNumber("1234567890123456")).toBeNull()
    })

    it("should handle Kuwait phone numbers", () => {
      expect(service.normalizePhoneNumber("+96512345678")).toBe("+96512345678")
      expect(service.normalizePhoneNumber("96512345678")).toBe("+96512345678")
    })
  })

  describe("formatOrderPlacedMessage", () => {
    const service = new SMSNotificationService({
      accountSid: "test_sid",
      authToken: "test_token",
      fromNumber: "+1234567890",
    })

    it("should format order message with customer name", () => {
      const data: OrderSMSData = {
        orderId: "order_123",
        orderNumber: "1001",
        customerPhone: "+96512345678",
        customerName: "Ahmed",
        totalAmount: "25.50",
        currency: "KWD",
        itemCount: 3,
      }

      const message = service.formatOrderPlacedMessage(data)

      expect(message).toContain("Hi Ahmed")
      expect(message).toContain("#1001")
      expect(message).toContain("KWD 25.50")
      expect(message).toContain("3 items")
    })

    it("should format order message without customer name", () => {
      const data: OrderSMSData = {
        orderId: "order_123",
        orderNumber: "1001",
        customerPhone: "+96512345678",
        totalAmount: "25.50",
        currency: "KWD",
        itemCount: 1,
      }

      const message = service.formatOrderPlacedMessage(data)

      expect(message).not.toContain("Hi")
      expect(message).toContain("#1001")
      expect(message).toContain("1 item")
    })
  })

  describe("formatShippingUpdateMessage", () => {
    const service = new SMSNotificationService({
      accountSid: "test_sid",
      authToken: "test_token",
      fromNumber: "+1234567890",
    })

    it("should format shipped message with tracking", () => {
      const data: ShippingUpdateSMSData = {
        orderId: "order_123",
        orderNumber: "1001",
        customerPhone: "+96512345678",
        trackingNumber: "TRACK123",
        carrier: "DHL",
        status: "shipped",
      }

      const message = service.formatShippingUpdateMessage(data)

      expect(message).toContain("#1001")
      expect(message).toContain("has shipped")
      expect(message).toContain("TRACK123")
      expect(message).toContain("DHL")
    })

    it("should format shipped message without tracking", () => {
      const data: ShippingUpdateSMSData = {
        orderId: "order_123",
        orderNumber: "1001",
        customerPhone: "+96512345678",
        status: "shipped",
      }

      const message = service.formatShippingUpdateMessage(data)

      expect(message).toContain("#1001")
      expect(message).toContain("has shipped")
      expect(message).toContain("tracking details soon")
    })

    it("should format out for delivery message", () => {
      const data: ShippingUpdateSMSData = {
        orderId: "order_123",
        orderNumber: "1001",
        customerPhone: "+96512345678",
        status: "out_for_delivery",
      }

      const message = service.formatShippingUpdateMessage(data)

      expect(message).toContain("#1001")
      expect(message).toContain("out for delivery")
    })

    it("should format delivered message", () => {
      const data: ShippingUpdateSMSData = {
        orderId: "order_123",
        orderNumber: "1001",
        customerPhone: "+96512345678",
        status: "delivered",
      }

      const message = service.formatShippingUpdateMessage(data)

      expect(message).toContain("#1001")
      expect(message).toContain("has been delivered")
    })
  })

  describe("sendSMS", () => {
    it("should return error when service is not configured", async () => {
      delete process.env.TWILIO_ACCOUNT_SID
      delete process.env.TWILIO_AUTH_TOKEN
      delete process.env.TWILIO_FROM_NUMBER

      const service = new SMSNotificationService()
      const result = await service.sendSMS({
        to: "+96512345678",
        message: "Test message",
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain("not configured")
    })

    it("should return error for invalid phone number", async () => {
      const service = new SMSNotificationService({
        accountSid: "test_sid",
        authToken: "test_token",
        fromNumber: "+1234567890",
      })

      const result = await service.sendSMS({
        to: "123",
        message: "Test message",
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain("Invalid phone number")
    })

    it("should send SMS successfully", async () => {
      const Twilio = await import("twilio")
      const mockCreate = vi.fn().mockResolvedValue({ sid: "SM123456" })
      ;(Twilio.default as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        messages: { create: mockCreate },
      })

      const service = new SMSNotificationService({
        accountSid: "test_sid",
        authToken: "test_token",
        fromNumber: "+1234567890",
      })

      const result = await service.sendSMS({
        to: "+96512345678",
        message: "Test message",
      })

      expect(result.success).toBe(true)
      expect(result.messageId).toBe("SM123456")
    })

    it("should handle Twilio API errors", async () => {
      const Twilio = await import("twilio")
      const mockCreate = vi.fn().mockRejectedValue(new Error("API Error"))
      ;(Twilio.default as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        messages: { create: mockCreate },
      })

      const service = new SMSNotificationService({
        accountSid: "test_sid",
        authToken: "test_token",
        fromNumber: "+1234567890",
      })

      const result = await service.sendSMS({
        to: "+96512345678",
        message: "Test message",
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe("API Error")
    })
  })

  describe("sendOrderPlacedSMS", () => {
    it("should send order placed SMS with correct message", async () => {
      const Twilio = await import("twilio")
      const mockCreate = vi.fn().mockResolvedValue({ sid: "SM123456" })
      ;(Twilio.default as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        messages: { create: mockCreate },
      })

      const service = new SMSNotificationService({
        accountSid: "test_sid",
        authToken: "test_token",
        fromNumber: "+1234567890",
      })

      const data: OrderSMSData = {
        orderId: "order_123",
        orderNumber: "1001",
        customerPhone: "+96512345678",
        customerName: "Ahmed",
        totalAmount: "25.50",
        currency: "KWD",
        itemCount: 3,
      }

      const result = await service.sendOrderPlacedSMS(data)

      expect(result.success).toBe(true)
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "+96512345678",
          from: "+1234567890",
          body: expect.stringContaining("#1001"),
        })
      )
    })
  })

  describe("sendShippingUpdateSMS", () => {
    it("should send shipping update SMS with correct message", async () => {
      const Twilio = await import("twilio")
      const mockCreate = vi.fn().mockResolvedValue({ sid: "SM123456" })
      ;(Twilio.default as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        messages: { create: mockCreate },
      })

      const service = new SMSNotificationService({
        accountSid: "test_sid",
        authToken: "test_token",
        fromNumber: "+1234567890",
      })

      const data: ShippingUpdateSMSData = {
        orderId: "order_123",
        orderNumber: "1001",
        customerPhone: "+96512345678",
        trackingNumber: "TRACK123",
        carrier: "DHL",
        status: "shipped",
      }

      const result = await service.sendShippingUpdateSMS(data)

      expect(result.success).toBe(true)
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "+96512345678",
          from: "+1234567890",
          body: expect.stringContaining("shipped"),
        })
      )
    })
  })
})
