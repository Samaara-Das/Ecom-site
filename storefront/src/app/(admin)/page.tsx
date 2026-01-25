import { DollarSign, ShoppingCart, Store, Users } from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here&apos;s what&apos;s happening with your marketplace.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value="$45,231.89"
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatsCard
          title="Total Orders"
          value="1,234"
          icon={ShoppingCart}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatsCard
          title="Active Vendors"
          value="156"
          icon={Store}
          trend={{ value: 4.1, isPositive: true }}
        />
        <StatsCard
          title="Total Customers"
          value="5,678"
          icon={Users}
          trend={{ value: 15.3, isPositive: true }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <p className="text-sm text-gray-500">Latest orders from your marketplace</p>

          <div className="mt-4 space-y-4">
            {[1, 2, 3, 4, 5].map((order) => (
              <div key={order} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-gray-900">Order #{1000 + order}</p>
                  <p className="text-sm text-gray-500">Customer {order}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${(Math.random() * 500).toFixed(2)}</p>
                  <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                    Completed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Vendor Approvals */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Pending Vendor Approvals</h2>
          <p className="text-sm text-gray-500">Vendors waiting for approval</p>

          <div className="mt-4 space-y-4">
            {[1, 2, 3].map((vendor) => (
              <div key={vendor} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                    <Store className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Vendor Store {vendor}</p>
                    <p className="text-sm text-gray-500">Applied 2 days ago</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
