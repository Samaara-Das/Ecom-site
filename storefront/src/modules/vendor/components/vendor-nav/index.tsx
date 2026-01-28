"use client"

import { clx } from "@medusajs/ui"
import { useParams, usePathname } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import type { Vendor } from "@lib/data/vendor"

interface VendorNavProps {
  vendor: Vendor
}

const VendorNav = ({ vendor }: VendorNavProps) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }

  const navItems = [
    { href: "/vendor/dashboard", label: "Dashboard", icon: DashboardIcon },
    { href: "/vendor/products", label: "Products", icon: ProductIcon },
    { href: "/vendor/orders", label: "Orders", icon: OrderIcon },
    { href: "/vendor/settings", label: "Settings", icon: SettingsIcon },
  ]

  return (
    <div className="w-full">
      {/* Vendor Profile Header */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {vendor.logo_url ? (
            <img
              src={vendor.logo_url}
              alt={vendor.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-ui-bg-subtle flex items-center justify-center">
              <span className="text-lg font-semibold text-ui-fg-muted">
                {vendor.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-ui-fg-base">{vendor.name}</h3>
            <span
              className={clx(
                "text-xs px-2 py-0.5 rounded-full",
                vendor.status === "verified" && "bg-green-100 text-green-700",
                vendor.status === "premium" && "bg-purple-100 text-purple-700",
                vendor.status === "pending" && "bg-yellow-100 text-yellow-700",
                vendor.status === "suspended" && "bg-red-100 text-red-700"
              )}
            >
              {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="small:hidden">
        <select
          value={route}
          onChange={(e) => {
            window.location.href = `/${countryCode}${e.target.value}`
          }}
          className="w-full px-4 py-3 bg-ui-bg-field border border-ui-border-base rounded-md"
        >
          {navItems.map((item) => (
            <option key={item.href} value={item.href}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden small:block">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = route?.includes(item.href)
            const Icon = item.icon
            return (
              <li key={item.href}>
                <LocalizedClientLink
                  href={item.href}
                  className={clx(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                    isActive
                      ? "bg-ui-bg-subtle text-ui-fg-base font-medium"
                      : "text-ui-fg-subtle hover:bg-ui-bg-subtle-hover hover:text-ui-fg-base"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </LocalizedClientLink>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Quick Actions */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <LocalizedClientLink
          href="/vendor/products/new"
          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-ui-button-neutral text-ui-fg-on-color rounded-md hover:bg-ui-button-neutral-hover transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add Product</span>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

// Icon components
function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    </svg>
  )
}

function ProductIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
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
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
      />
    </svg>
  )
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  )
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  )
}

export default VendorNav
