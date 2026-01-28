import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Heading, Text } from "@medusajs/ui"
import { retrieveCustomer } from "@lib/data/customer"
import { getVendorByEmail } from "@lib/data/vendor"
import ProductForm from "@modules/vendor/components/product-form"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Add Product | Vendor Dashboard",
  description: "Create a new product listing",
}

export default async function NewProductPage() {
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer?.email) {
    notFound()
  }

  const vendor = await getVendorByEmail(customer.email)

  if (!vendor || !["verified", "premium"].includes(vendor.status)) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="vendor-new-product">
      {/* Breadcrumb */}
      <nav className="mb-4">
        <ol className="flex items-center gap-2 text-sm text-ui-fg-subtle">
          <li>
            <LocalizedClientLink
              href="/vendor/products"
              className="hover:text-ui-fg-base"
            >
              Products
            </LocalizedClientLink>
          </li>
          <li>/</li>
          <li className="text-ui-fg-base">New Product</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <Heading level="h1" className="text-2xl font-semibold mb-2">
          Add New Product
        </Heading>
        <Text className="text-ui-fg-subtle">
          Create a new product to sell on Kuwait Marketplace
        </Text>
      </div>

      {/* Product Form */}
      <ProductForm vendorEmail={customer.email} mode="create" />
    </div>
  )
}
