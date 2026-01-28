import React from "react"
import VendorNav from "@modules/vendor/components/vendor-nav"
import type { Vendor } from "@lib/data/vendor"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface VendorLayoutProps {
  vendor: Vendor | null
  children: React.ReactNode
}

const VendorLayout: React.FC<VendorLayoutProps> = ({ vendor, children }) => {
  // If no vendor, show not a vendor message
  if (!vendor) {
    return (
      <div className="flex-1 small:py-12" data-testid="vendor-page">
        <div className="content-container h-full max-w-5xl mx-auto bg-white flex flex-col items-center justify-center py-12">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-ui-bg-subtle rounded-full flex items-center justify-center mx-auto mb-6">
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-4">Vendor Account Required</h2>
            <p className="text-ui-fg-subtle mb-8">
              You need to be a registered vendor to access this area. If you have
              already applied, please make sure you are logged in with the same
              email address you used during registration.
            </p>
            <div className="space-y-3">
              <LocalizedClientLink
                href="/become-a-seller"
                className="block w-full px-6 py-3 bg-ui-button-neutral text-ui-fg-on-color rounded-md hover:bg-ui-button-neutral-hover transition-colors text-center"
              >
                Become a Seller
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/account"
                className="block w-full px-6 py-3 border border-ui-border-base text-ui-fg-base rounded-md hover:bg-ui-bg-subtle transition-colors text-center"
              >
                Sign In
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If vendor is pending, show pending message
  if (vendor.status === "pending") {
    return (
      <div className="flex-1 small:py-12" data-testid="vendor-page">
        <div className="content-container h-full max-w-5xl mx-auto bg-white flex flex-col items-center justify-center py-12">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-4">Application Under Review</h2>
            <p className="text-ui-fg-subtle mb-4">
              Thank you for applying to become a seller on Kuwait Marketplace. Your
              application is currently being reviewed by our team.
            </p>
            <p className="text-sm text-ui-fg-muted mb-8">
              This usually takes 2-3 business days. We will notify you at{" "}
              <strong>{vendor.email}</strong> once your account has been approved.
            </p>
            <div className="bg-ui-bg-subtle rounded-lg p-4 text-left">
              <h4 className="font-medium mb-2">Application Details</h4>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ui-fg-muted">Business Name:</dt>
                  <dd>{vendor.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ui-fg-muted">Application ID:</dt>
                  <dd className="font-mono text-xs">{vendor.id}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If vendor is suspended, show suspended message
  if (vendor.status === "suspended") {
    return (
      <div className="flex-1 small:py-12" data-testid="vendor-page">
        <div className="content-container h-full max-w-5xl mx-auto bg-white flex flex-col items-center justify-center py-12">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-4">Account Suspended</h2>
            <p className="text-ui-fg-subtle mb-8">
              Your vendor account has been suspended. If you believe this is an
              error, please contact our support team for assistance.
            </p>
            <LocalizedClientLink
              href="/customer-service"
              className="inline-block px-6 py-3 bg-ui-button-neutral text-ui-fg-on-color rounded-md hover:bg-ui-button-neutral-hover transition-colors"
            >
              Contact Support
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    )
  }

  // Normal vendor layout for verified/premium vendors
  return (
    <div className="flex-1 small:py-12" data-testid="vendor-page">
      <div className="content-container h-full max-w-6xl mx-auto bg-white flex flex-col">
        <div className="grid grid-cols-1 small:grid-cols-[260px_1fr] gap-8 py-8">
          <aside className="small:sticky small:top-24 small:self-start">
            <VendorNav vendor={vendor} />
          </aside>
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}

export default VendorLayout
