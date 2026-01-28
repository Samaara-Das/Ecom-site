import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Heading, Text } from "@medusajs/ui"
import { retrieveCustomer } from "@lib/data/customer"
import { getVendorByEmail, listVendorProducts } from "@lib/data/vendor"
import ProductList from "@modules/vendor/components/product-list"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Products | Vendor Dashboard",
  description: "Manage your product listings",
}

export default async function VendorProductsPage() {
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer?.email) {
    notFound()
  }

  const vendor = await getVendorByEmail(customer.email)

  if (!vendor || !["verified", "premium"].includes(vendor.status)) {
    notFound()
  }

  const productsResult = await listVendorProducts(customer.email)

  return (
    <div className="w-full" data-testid="vendor-products">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <Heading level="h1" className="text-2xl font-semibold mb-2">
            Products
          </Heading>
          <Text className="text-ui-fg-subtle">
            Manage your product catalog ({productsResult?.count || 0} products)
          </Text>
        </div>
        <LocalizedClientLink
          href="/vendor/products/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-ui-button-neutral text-ui-fg-on-color rounded-md hover:bg-ui-button-neutral-hover transition-colors"
        >
          <svg
            className="w-4 h-4"
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
          Add Product
        </LocalizedClientLink>
      </div>

      {/* Product List */}
      <ProductList
        products={productsResult?.products || []}
        vendorEmail={customer.email}
      />
    </div>
  )
}
