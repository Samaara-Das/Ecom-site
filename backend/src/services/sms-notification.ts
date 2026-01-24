import Twilio from "twilio"

export interface SMSNotificationConfig {
  accountSid: string
  authToken: string
  fromNumber: string
}

export interface SendSMSOptions {
  to: string
  message: string
}

export interface SMSResult {
  success: boolean
  messageId?: string
  error?: string
}

export interface OrderSMSData {
  orderId: string
  orderNumber: string
  customerPhone: string
  customerName?: string
  totalAmount: string
  currency: string
  itemCount: number
}

export interface ShippingUpdateSMSData {
  orderId: string
  orderNumber: string
  customerPhone: string
  trackingNumber?: string
  carrier?: string
  status: "shipped" | "out_for_delivery" | "delivered"
}

export class SMSNotificationService {
  private client: Twilio.Twilio | null = null
  private fromNumber: string
  private isConfigured: boolean = false

  constructor(config?: SMSNotificationConfig) {
    this.fromNumber = config?.fromNumber || process.env.TWILIO_FROM_NUMBER || ""

    const accountSid = config?.accountSid || process.env.TWILIO_ACCOUNT_SID
    const authToken = config?.authToken || process.env.TWILIO_AUTH_TOKEN

    if (accountSid && authToken && this.fromNumber) {
      this.client = Twilio(accountSid, authToken)
      this.isConfigured = true
    }
  }

  isReady(): boolean {
    return this.isConfigured && this.client !== null
  }

  async sendSMS(options: SendSMSOptions): Promise<SMSResult> {
    if (!this.isReady()) {
      return {
        success: false,
        error: "SMS service is not configured. Missing Twilio credentials.",
      }
    }

    try {
      const normalizedPhone = this.normalizePhoneNumber(options.to)
      if (!normalizedPhone) {
        return {
          success: false,
          error: "Invalid phone number format",
        }
      }

      const message = await this.client!.messages.create({
        body: options.message,
        from: this.fromNumber,
        to: normalizedPhone,
      })

      return {
        success: true,
        messageId: message.sid,
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred"
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  async sendOrderPlacedSMS(data: OrderSMSData): Promise<SMSResult> {
    const message = this.formatOrderPlacedMessage(data)
    return this.sendSMS({
      to: data.customerPhone,
      message,
    })
  }

  async sendShippingUpdateSMS(data: ShippingUpdateSMSData): Promise<SMSResult> {
    const message = this.formatShippingUpdateMessage(data)
    return this.sendSMS({
      to: data.customerPhone,
      message,
    })
  }

  formatOrderPlacedMessage(data: OrderSMSData): string {
    const greeting = data.customerName ? `Hi ${data.customerName}, ` : ""
    return (
      `${greeting}Your order #${data.orderNumber} has been placed! ` +
      `Total: ${data.currency} ${data.totalAmount} (${data.itemCount} item${data.itemCount > 1 ? "s" : ""}). ` +
      `We'll notify you when it ships. Thank you for shopping with us!`
    )
  }

  formatShippingUpdateMessage(data: ShippingUpdateSMSData): string {
    const statusMessages: Record<ShippingUpdateSMSData["status"], string> = {
      shipped: data.trackingNumber
        ? `Your order #${data.orderNumber} has shipped! Track it with ${data.carrier || "the carrier"}: ${data.trackingNumber}`
        : `Your order #${data.orderNumber} has shipped! You'll receive tracking details soon.`,
      out_for_delivery: `Your order #${data.orderNumber} is out for delivery today!`,
      delivered: `Your order #${data.orderNumber} has been delivered. Thank you for your purchase!`,
    }

    return statusMessages[data.status]
  }

  normalizePhoneNumber(phone: string): string | null {
    const cleaned = phone.replace(/\D/g, "")

    if (cleaned.length < 8 || cleaned.length > 15) {
      return null
    }

    if (cleaned.startsWith("00")) {
      return "+" + cleaned.slice(2)
    }

    if (!phone.startsWith("+")) {
      return "+" + cleaned
    }

    return "+" + cleaned
  }
}

export default SMSNotificationService
