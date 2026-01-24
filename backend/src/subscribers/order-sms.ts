import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { SMSNotificationService } from "../services/sms-notification"

type OrderPlacedData = {
  id: string
}

type FulfillmentCreatedData = {
  id: string
  order_id: string
}

type ShipmentCreatedData = {
  id: string
  fulfillment_id: string
  order_id: string
}

const smsService = new SMSNotificationService()

export async function orderPlacedHandler({
  event,
  container,
}: SubscriberArgs<OrderPlacedData>) {
  const orderId = event.data.id
  const logger = container.resolve("logger")

  if (!smsService.isReady()) {
    logger.warn(
      "SMS service not configured - skipping order placed notification"
    )
    return
  }

  try {
    const query = container.resolve("query")

    const {
      data: [order],
    } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "total",
        "currency_code",
        "items.*",
        "customer.first_name",
        "customer.last_name",
        "customer.phone",
        "shipping_address.phone",
      ],
      filters: { id: orderId },
    })

    if (!order) {
      logger.error(`Order ${orderId} not found for SMS notification`)
      return
    }

    const customerPhone =
      order.customer?.phone || order.shipping_address?.phone
    if (!customerPhone) {
      logger.info(
        `No phone number found for order ${order.display_id} - skipping SMS`
      )
      return
    }

    const customerName = order.customer?.first_name
      ? `${order.customer.first_name}${order.customer.last_name ? " " + order.customer.last_name : ""}`
      : undefined

    const result = await smsService.sendOrderPlacedSMS({
      orderId: order.id,
      orderNumber: String(order.display_id),
      customerPhone,
      customerName,
      totalAmount: formatAmount(order.total, order.currency_code),
      currency: order.currency_code.toUpperCase(),
      itemCount: order.items?.length || 0,
    })

    if (result.success) {
      logger.info(
        `Order placed SMS sent for order ${order.display_id} (message ID: ${result.messageId})`
      )
    } else {
      logger.error(
        `Failed to send order placed SMS for order ${order.display_id}: ${result.error}`
      )
    }
  } catch (error) {
    logger.error(`Error in order placed SMS handler: ${error}`)
  }
}

export async function shipmentCreatedHandler({
  event,
  container,
}: SubscriberArgs<ShipmentCreatedData>) {
  const { order_id } = event.data
  const logger = container.resolve("logger")

  if (!smsService.isReady()) {
    logger.warn(
      "SMS service not configured - skipping shipping update notification"
    )
    return
  }

  try {
    const query = container.resolve("query")

    const {
      data: [order],
    } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "customer.phone",
        "shipping_address.phone",
        "fulfillments.tracking_links.*",
        "fulfillments.provider_id",
      ],
      filters: { id: order_id },
    })

    if (!order) {
      logger.error(`Order ${order_id} not found for shipping SMS notification`)
      return
    }

    const customerPhone =
      order.customer?.phone || order.shipping_address?.phone
    if (!customerPhone) {
      logger.info(
        `No phone number found for order ${order.display_id} - skipping shipping SMS`
      )
      return
    }

    const latestFulfillment = order.fulfillments?.[order.fulfillments.length - 1]
    const trackingLink = latestFulfillment?.tracking_links?.[0]

    const result = await smsService.sendShippingUpdateSMS({
      orderId: order.id,
      orderNumber: String(order.display_id),
      customerPhone,
      trackingNumber: trackingLink?.tracking_number,
      carrier: latestFulfillment?.provider_id,
      status: "shipped",
    })

    if (result.success) {
      logger.info(
        `Shipping SMS sent for order ${order.display_id} (message ID: ${result.messageId})`
      )
    } else {
      logger.error(
        `Failed to send shipping SMS for order ${order.display_id}: ${result.error}`
      )
    }
  } catch (error) {
    logger.error(`Error in shipment created SMS handler: ${error}`)
  }
}

function formatAmount(amount: number, currencyCode: string): string {
  const divisor = getCurrencyDivisor(currencyCode)
  return (amount / divisor).toFixed(2)
}

function getCurrencyDivisor(currencyCode: string): number {
  const zeroDivisorCurrencies = ["jpy", "krw", "vnd"]
  if (zeroDivisorCurrencies.includes(currencyCode.toLowerCase())) {
    return 1
  }
  const threeDivisorCurrencies = ["kwd", "bhd", "omr"]
  if (threeDivisorCurrencies.includes(currencyCode.toLowerCase())) {
    return 1000
  }
  return 100
}

export const config: SubscriberConfig = {
  event: ["order.placed", "order.shipment_created"],
}

export default async function handler(args: SubscriberArgs<unknown>) {
  const eventName = args.event.name

  if (eventName === "order.placed") {
    return orderPlacedHandler(args as SubscriberArgs<OrderPlacedData>)
  }

  if (eventName === "order.shipment_created") {
    return shipmentCreatedHandler(args as SubscriberArgs<ShipmentCreatedData>)
  }
}
