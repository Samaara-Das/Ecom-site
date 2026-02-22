"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

const QuickActions = () => {
  const actions = [
    {
      title: "Add New Product",
      description: "Create a new product listing",
      href: "/vendor/products/new",
      icon: PlusIcon,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "View All Products",
      description: "Manage your product catalog",
      href: "/vendor/products",
      icon: ProductIcon,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Manage Orders",
      description: "View and fulfill orders",
      href: "/vendor/orders",
      icon: OrderIcon,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Update Profile",
      description: "Edit your vendor settings",
      href: "/vendor/settings",
      icon: SettingsIcon,
      color: "bg-orange-50 text-orange-600",
    },
  ]

  return (
    <div className="bg-white border border-ui-border-base rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <LocalizedClientLink
              key={action.href}
              href={action.href}
              className="flex items-start gap-3 p-3 rounded-lg border border-ui-border-base hover:border-ui-border-strong hover:bg-ui-bg-subtle-hover transition-colors"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm">{action.title}</p>
                <p className="text-xs text-ui-fg-muted truncate">{action.description}</p>
              </div>
            </LocalizedClientLink>
          )
        })}
      </div>
    </div>
  )
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
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

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

export default QuickActions
