"use client"

import { clx, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import type { VendorOrder } from "@lib/data/vendor"

interface RecentOrdersProps {
  orders: VendorOrder[]
}

const RecentOrders = ({ orders }: RecentOrdersProps) => {
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
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "fulfilled":
      case "shipped":
      case "delivered":
        return "bg-green-100 text-green-700"
      case "not_fulfilled":
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "canceled":
      case "cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white border border-ui-border-base rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-ui-bg-subtle rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-ui-fg-muted"
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
          <Text className="text-ui-fg-subtle">No orders yet</Text>
          <Text className="text-sm text-ui-fg-muted mt-1">
            Orders will appear here once customers purchase your products
          </Text>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-ui-border-base rounded-lg">
      <div className="flex items-center justify-between p-4 border-b border-ui-border-base">
        <h3 className="text-lg font-semibold">Recent Orders</h3>
        <LocalizedClientLink
          href="/vendor/orders"
          className="text-sm text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
        >
          View all
        </LocalizedClientLink>
      </div>
      <div className="divide-y divide-ui-border-base">
        {orders.slice(0, 5).map((order) => (
          <LocalizedClientLink
            key={order.id}
            href={`/vendor/orders/${order.id}`}
            className="flex items-center justify-between p-4 hover:bg-ui-bg-subtle-hover transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {order.items.slice(0, 3).map((item, idx) => (
                  <div
                    key={item.id}
                    className="w-10 h-10 rounded-md border-2 border-white bg-ui-bg-subtle overflow-hidden"
                    style={{ zIndex: 3 - idx }}
                  >
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-ui-fg-muted">
                        {item.title.charAt(0)}
                      </div>
                    )}
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="w-10 h-10 rounded-md border-2 border-white bg-ui-bg-subtle flex items-center justify-center text-xs text-ui-fg-muted">
                    +{order.items.length - 3}
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium">Order #{order.display_id}</p>
                <p className="text-sm text-ui-fg-muted">
                  {formatDate(order.created_at)} - {order.vendor_items_count} item
                  {order.vendor_items_count !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {formatCurrency(order.vendor_total, order.currency_code)}
              </p>
              <span
                className={clx(
                  "inline-block text-xs px-2 py-0.5 rounded-full mt-1",
                  getStatusColor(order.fulfillment_status)
                )}
              >
                {order.fulfillment_status.replace(/_/g, " ")}
              </span>
            </div>
          </LocalizedClientLink>
        ))}
      </div>
    </div>
  )
}

export default RecentOrders
