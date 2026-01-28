"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button, clx, Heading, Text } from "@medusajs/ui"
import { updateOrderFulfillment } from "@lib/data/vendor"

interface OrderDetailProps {
  order: {
    id: string
    display_id: number
    status: string
    fulfillment_status: string
    payment_status: string
    currency_code: string
    total: number
    subtotal: number
    shipping_total: number
    tax_total: number
    vendor_total: number
    items: {
      id: string
      title: string
      description?: string
      quantity: number
      unit_price: number
      total: number
      thumbnail: string | null
      variant?: {
        id: string
        title: string
        sku: string | null
        product?: {
          id: string
          title: string
          handle: string
        } | null
      } | null
    }[]
    shipping_address?: {
      first_name: string
      last_name: string
      company?: string
      address_1: string
      address_2?: string
      city: string
      province?: string
      postal_code: string
      country_code: string
      phone?: string
    } | null
    billing_address?: {
      first_name: string
      last_name: string
      company?: string
      address_1: string
      address_2?: string
      city: string
      province?: string
      postal_code: string
      country_code: string
      phone?: string
    } | null
    fulfillments?: {
      id: string
      status: string
      tracking_numbers?: string[]
      created_at: string
    }[]
    customer_email: string
    created_at: string
    updated_at: string
  }
  vendorEmail: string
}

const OrderDetail = ({ order, vendorEmail }: OrderDetailProps) => {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const [fulfillmentStatus, setFulfillmentStatus] = useState(order.fulfillment_status)
  const [trackingNumber, setTrackingNumber] = useState("")
  const [notes, setNotes] = useState("")
  const [error, setError] = useState<string | null>(null)

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-KW", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
    }).format(amount / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-KW", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string, type: "fulfillment" | "payment") => {
    const fulfillmentConfig: Record<string, { bg: string; text: string; label: string }> = {
      not_fulfilled: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending" },
      partially_fulfilled: { bg: "bg-blue-100", text: "text-blue-700", label: "Partial" },
      fulfilled: { bg: "bg-green-100", text: "text-green-700", label: "Fulfilled" },
      shipped: { bg: "bg-purple-100", text: "text-purple-700", label: "Shipped" },
      delivered: { bg: "bg-green-100", text: "text-green-700", label: "Delivered" },
    }

    const paymentConfig: Record<string, { bg: string; text: string; label: string }> = {
      captured: { bg: "bg-green-100", text: "text-green-700", label: "Paid" },
      awaiting: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Awaiting" },
      not_paid: { bg: "bg-red-100", text: "text-red-700", label: "Not Paid" },
      refunded: { bg: "bg-gray-100", text: "text-gray-700", label: "Refunded" },
    }

    const config = type === "fulfillment" ? fulfillmentConfig : paymentConfig
    const statusConfig = config[status] || { bg: "bg-gray-100", text: "text-gray-700", label: status }

    return (
      <span className={clx("inline-block text-sm px-3 py-1 rounded-full", statusConfig.bg, statusConfig.text)}>
        {statusConfig.label}
      </span>
    )
  }

  const handleUpdateFulfillment = async () => {
    setError(null)
    setIsUpdating(true)

    try {
      const result = await updateOrderFulfillment(vendorEmail, order.id, {
        fulfillment_status: fulfillmentStatus,
        tracking_number: trackingNumber || undefined,
        notes: notes || undefined,
      })

      if (result.success) {
        router.refresh()
      } else {
        setError(result.error || "Failed to update fulfillment")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="bg-white border border-ui-border-base rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <Heading level="h2" className="text-xl font-semibold">
              Order #{order.display_id}
            </Heading>
            <Text className="text-ui-fg-subtle mt-1">
              Placed on {formatDate(order.created_at)}
            </Text>
          </div>
          <div className="flex flex-wrap gap-2">
            {getStatusBadge(order.fulfillment_status, "fulfillment")}
            {getStatusBadge(order.payment_status, "payment")}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white border border-ui-border-base rounded-lg">
            <div className="p-4 border-b border-ui-border-base">
              <h3 className="font-semibold">Your Items</h3>
            </div>
            <div className="divide-y divide-ui-border-base">
              {order.items.map((item) => (
                <div key={item.id} className="p-4 flex gap-4">
                  <div className="w-16 h-16 rounded-md bg-ui-bg-subtle overflow-hidden flex-shrink-0">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-ui-fg-muted">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{item.title}</p>
                    {item.variant && (
                      <p className="text-sm text-ui-fg-muted">
                        {item.variant.title}
                        {item.variant.sku && ` - SKU: ${item.variant.sku}`}
                      </p>
                    )}
                    <p className="text-sm text-ui-fg-subtle mt-1">
                      Qty: {item.quantity} x {formatCurrency(item.unit_price, order.currency_code)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency(item.total, order.currency_code)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-ui-border-base bg-ui-bg-subtle">
              <div className="flex justify-between font-semibold">
                <span>Your Total</span>
                <span>{formatCurrency(order.vendor_total, order.currency_code)}</span>
              </div>
            </div>
          </div>

          {/* Update Fulfillment */}
          <div className="bg-white border border-ui-border-base rounded-lg p-6">
            <h3 className="font-semibold mb-4">Update Fulfillment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={fulfillmentStatus}
                  onChange={(e) => setFulfillmentStatus(e.target.value)}
                  className="w-full px-4 py-2 bg-ui-bg-field border border-ui-border-base rounded-md focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active"
                >
                  <option value="not_fulfilled">Pending</option>
                  <option value="partially_fulfilled">Partially Fulfilled</option>
                  <option value="fulfilled">Fulfilled</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tracking Number (optional)</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="w-full px-4 py-2 bg-ui-bg-field border border-ui-border-base rounded-md focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Add any notes about this fulfillment..."
                  className="w-full px-4 py-2 bg-ui-bg-field border border-ui-border-base rounded-md focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active"
                />
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}
              <Button onClick={handleUpdateFulfillment} disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update Fulfillment"}
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar - Takes 1 column */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white border border-ui-border-base rounded-lg p-4">
            <h3 className="font-semibold mb-3">Customer</h3>
            <p className="text-sm">{order.customer_email}</p>
          </div>

          {/* Shipping Address */}
          {order.shipping_address && (
            <div className="bg-white border border-ui-border-base rounded-lg p-4">
              <h3 className="font-semibold mb-3">Shipping Address</h3>
              <div className="text-sm text-ui-fg-subtle space-y-1">
                <p className="font-medium text-ui-fg-base">
                  {order.shipping_address.first_name} {order.shipping_address.last_name}
                </p>
                {order.shipping_address.company && <p>{order.shipping_address.company}</p>}
                <p>{order.shipping_address.address_1}</p>
                {order.shipping_address.address_2 && <p>{order.shipping_address.address_2}</p>}
                <p>
                  {order.shipping_address.city}
                  {order.shipping_address.province && `, ${order.shipping_address.province}`}
                </p>
                <p>
                  {order.shipping_address.postal_code}, {order.shipping_address.country_code?.toUpperCase()}
                </p>
                {order.shipping_address.phone && (
                  <p className="mt-2">Phone: {order.shipping_address.phone}</p>
                )}
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-white border border-ui-border-base rounded-lg p-4">
            <h3 className="font-semibold mb-3">Order Summary</h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-ui-fg-subtle">Order Total</span>
                <span>{formatCurrency(order.total, order.currency_code)}</span>
              </div>
              <div className="flex justify-between text-ui-fg-muted">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal, order.currency_code)}</span>
              </div>
              <div className="flex justify-between text-ui-fg-muted">
                <span>Shipping</span>
                <span>{formatCurrency(order.shipping_total, order.currency_code)}</span>
              </div>
              <div className="flex justify-between text-ui-fg-muted">
                <span>Tax</span>
                <span>{formatCurrency(order.tax_total, order.currency_code)}</span>
              </div>
              <div className="border-t border-ui-border-base pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Your Portion</span>
                  <span>{formatCurrency(order.vendor_total, order.currency_code)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
