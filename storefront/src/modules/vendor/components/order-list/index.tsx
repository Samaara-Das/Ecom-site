"use client"

import { clx, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import type { VendorOrder } from "@lib/data/vendor"

interface OrderListProps {
  orders: VendorOrder[]
}

const OrderList = ({ orders }: OrderListProps) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-KW", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
    }).format(amount / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-KW", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      not_fulfilled: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending" },
      partially_fulfilled: { bg: "bg-blue-100", text: "text-blue-700", label: "Partial" },
      fulfilled: { bg: "bg-green-100", text: "text-green-700", label: "Fulfilled" },
      shipped: { bg: "bg-purple-100", text: "text-purple-700", label: "Shipped" },
      delivered: { bg: "bg-green-100", text: "text-green-700", label: "Delivered" },
      canceled: { bg: "bg-red-100", text: "text-red-700", label: "Canceled" },
      cancelled: { bg: "bg-red-100", text: "text-red-700", label: "Cancelled" },
    }

    const config = statusConfig[status] || { bg: "bg-gray-100", text: "text-gray-700", label: status }

    return (
      <span className={clx("inline-block text-xs px-2 py-1 rounded-full", config.bg, config.text)}>
        {config.label}
      </span>
    )
  }

  const getPaymentBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      captured: { bg: "bg-green-100", text: "text-green-700", label: "Paid" },
      awaiting: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Awaiting" },
      not_paid: { bg: "bg-red-100", text: "text-red-700", label: "Not Paid" },
      refunded: { bg: "bg-gray-100", text: "text-gray-700", label: "Refunded" },
    }

    const config = statusConfig[status] || { bg: "bg-gray-100", text: "text-gray-700", label: status }

    return (
      <span className={clx("inline-block text-xs px-2 py-1 rounded-full", config.bg, config.text)}>
        {config.label}
      </span>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-white border border-ui-border-base rounded-lg">
        <div className="w-16 h-16 bg-ui-bg-subtle rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-ui-fg-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
        <Text className="text-ui-fg-subtle">
          Orders containing your products will appear here
        </Text>
      </div>
    )
  }

  return (
    <div className="bg-white border border-ui-border-base rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-ui-bg-subtle border-b border-ui-border-base">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-ui-fg-subtle">
                Order
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-ui-fg-subtle">
                Date
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-ui-fg-subtle">
                Customer
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-ui-fg-subtle">
                Items
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-ui-fg-subtle">
                Your Total
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-ui-fg-subtle">
                Fulfillment
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-ui-fg-subtle">
                Payment
              </th>
              <th className="text-right px-4 py-3 text-sm font-medium text-ui-fg-subtle">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ui-border-base">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-ui-bg-subtle-hover">
                <td className="px-4 py-4">
                  <p className="font-medium">#{order.display_id}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm text-ui-fg-subtle">
                    {formatDate(order.created_at)}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm">{order.customer_email}</p>
                  {order.shipping_address && (
                    <p className="text-xs text-ui-fg-muted">
                      {order.shipping_address.city}, {order.shipping_address.country_code?.toUpperCase()}
                    </p>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <div
                          key={item.id}
                          className="w-8 h-8 rounded border-2 border-white bg-ui-bg-subtle overflow-hidden"
                          style={{ zIndex: 2 - idx }}
                        >
                          {item.thumbnail ? (
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-ui-fg-muted">
                              ?
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <span className="text-sm text-ui-fg-subtle">
                      {order.vendor_items_count} item{order.vendor_items_count !== 1 ? "s" : ""}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="font-medium">
                    {formatCurrency(order.vendor_total, order.currency_code)}
                  </p>
                </td>
                <td className="px-4 py-4">
                  {getStatusBadge(order.fulfillment_status)}
                </td>
                <td className="px-4 py-4">
                  {getPaymentBadge(order.payment_status)}
                </td>
                <td className="px-4 py-4 text-right">
                  <LocalizedClientLink
                    href={`/vendor/orders/${order.id}`}
                    className="text-sm px-3 py-1.5 border border-ui-border-base rounded-md hover:bg-ui-bg-subtle transition-colors"
                  >
                    View
                  </LocalizedClientLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OrderList
