"use client"

import { clx } from "@medusajs/ui"
import type { VendorStats } from "@lib/data/vendor"

interface DashboardStatsProps {
  stats: VendorStats
}

const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-KW", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
    }).format(amount / 100) // Assuming amounts are in cents
  }

  const statCards = [
    {
      label: "Total Products",
      value: stats.products.total.toString(),
      subtext: `${stats.products.published} published, ${stats.products.draft} draft`,
      icon: ProductIcon,
      color: "blue",
    },
    {
      label: "Total Orders",
      value: stats.orders.total.toString(),
      subtext: `${stats.orders.pending} pending, ${stats.orders.completed} completed`,
      icon: OrderIcon,
      color: "green",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(stats.revenue.total, stats.revenue.currency_code),
      subtext: `Net: ${formatCurrency(stats.revenue.net, stats.revenue.currency_code)}`,
      icon: RevenueIcon,
      color: "purple",
    },
    {
      label: "Commission Rate",
      value: `${(stats.revenue.commission_rate * 100).toFixed(0)}%`,
      subtext: `Commission: ${formatCurrency(stats.revenue.commission, stats.revenue.currency_code)}`,
      icon: PercentIcon,
      color: "orange",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className="bg-white border border-ui-border-base rounded-lg p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-ui-fg-subtle">{card.label}</p>
                <p className="text-2xl font-semibold mt-1">{card.value}</p>
                <p className="text-xs text-ui-fg-muted mt-1">{card.subtext}</p>
              </div>
              <div
                className={clx(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  card.color === "blue" && "bg-blue-100",
                  card.color === "green" && "bg-green-100",
                  card.color === "purple" && "bg-purple-100",
                  card.color === "orange" && "bg-orange-100"
                )}
              >
                <Icon
                  className={clx(
                    "w-5 h-5",
                    card.color === "blue" && "text-blue-600",
                    card.color === "green" && "text-green-600",
                    card.color === "purple" && "text-purple-600",
                    card.color === "orange" && "text-orange-600"
                  )}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ProductIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  )
}

function OrderIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
  )
}

function RevenueIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function PercentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    </svg>
  )
}

export default DashboardStats
