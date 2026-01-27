import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Heading, Text } from "@medusajs/ui"
import { retrieveCustomer } from "@lib/data/customer"
import { getVendorByEmail, listVendorOrders } from "@lib/data/vendor"
import OrderList from "@modules/vendor/components/order-list"

export const metadata: Metadata = {
  title: "Orders | Vendor Dashboard",
  description: "View and manage your orders",
}

export default async function VendorOrdersPage() {
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer?.email) {
    notFound()
  }

  const vendor = await getVendorByEmail(customer.email)

  if (!vendor || !["verified", "premium"].includes(vendor.status)) {
    notFound()
  }

  const ordersResult = await listVendorOrders(customer.email)

  return (
    <div className="w-full" data-testid="vendor-orders">
      {/* Header */}
      <div className="mb-8">
        <Heading level="h1" className="text-2xl font-semibold mb-2">
          Orders
        </Heading>
        <Text className="text-ui-fg-subtle">
          View and manage orders containing your products ({ordersResult?.count || 0} orders)
        </Text>
      </div>

      {/* Filters (placeholder for future enhancement) */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2 text-sm text-ui-fg-subtle">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>All Orders</span>
        </div>
      </div>

      {/* Order List */}
      <OrderList orders={ordersResult?.orders || []} />
    </div>
  )
}
