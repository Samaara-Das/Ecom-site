import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Heading, Text } from "@medusajs/ui"
import { retrieveCustomer } from "@lib/data/customer"
import { getVendorByEmail, getVendorStats, listVendorOrders } from "@lib/data/vendor"
import DashboardStats from "@modules/vendor/components/dashboard-stats"
import RecentOrders from "@modules/vendor/components/recent-orders"
import QuickActions from "@modules/vendor/components/quick-actions"

export const metadata: Metadata = {
  title: "Vendor Dashboard | Kuwait Marketplace",
  description: "Manage your store, products, and orders",
}

export default async function VendorDashboardPage() {
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer?.email) {
    notFound()
  }

  const vendor = await getVendorByEmail(customer.email)

  if (!vendor || !["verified", "premium"].includes(vendor.status)) {
    notFound()
  }

  // Fetch dashboard data
  const [stats, ordersResult] = await Promise.all([
    getVendorStats(customer.email),
    listVendorOrders(customer.email, { limit: 5 }),
  ])

  const defaultStats = {
    products: { total: 0, published: 0, draft: 0 },
    orders: { total: 0, pending: 0, completed: 0 },
    revenue: { total: 0, commission: 0, commission_rate: 0.15, net: 0, currency_code: "kwd" },
    vendor: { id: vendor.id, name: vendor.name, status: vendor.status, member_since: vendor.created_at },
  }

  return (
    <div className="w-full" data-testid="vendor-dashboard">
      {/* Header */}
      <div className="mb-8">
        <Heading level="h1" className="text-2xl font-semibold mb-2">
          Welcome back, {vendor.name}
        </Heading>
        <Text className="text-ui-fg-subtle">
          Here&apos;s what&apos;s happening with your store today
        </Text>
      </div>

      {/* Stats Grid */}
      <div className="mb-8">
        <DashboardStats stats={stats || defaultStats} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders - Takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <RecentOrders orders={ordersResult?.orders || []} />
        </div>

        {/* Quick Actions - Takes 1 column */}
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Tips for Success</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>Add high-quality images to your products to increase sales</li>
              <li>Respond to orders quickly to maintain good customer satisfaction</li>
              <li>Keep your inventory updated to avoid overselling</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
