import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Heading, Text } from "@medusajs/ui"
import { retrieveCustomer } from "@lib/data/customer"
import { getVendorByEmail, getVendorProduct } from "@lib/data/vendor"
import ProductForm from "@modules/vendor/components/product-form"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer?.email) {
    return { title: "Product Not Found" }
  }

  const product = await getVendorProduct(customer.email, params.id)

  if (!product) {
    return { title: "Product Not Found" }
  }

  return {
    title: `Edit ${product.title} | Vendor Dashboard`,
    description: `Edit product: ${product.title}`,
  }
}

export default async function EditProductPage(props: Props) {
  const params = await props.params
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer?.email) {
    notFound()
  }

  const vendor = await getVendorByEmail(customer.email)

  if (!vendor || !["verified", "premium"].includes(vendor.status)) {
    notFound()
  }

  const product = await getVendorProduct(customer.email, params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="vendor-edit-product">
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
          <li className="text-ui-fg-base truncate max-w-[200px]">
            {product.title}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <Heading level="h1" className="text-2xl font-semibold mb-2">
          Edit Product
        </Heading>
        <Text className="text-ui-fg-subtle">
          Update your product details
        </Text>
      </div>

      {/* Product Form */}
      <ProductForm
        vendorEmail={customer.email}
        product={product}
        mode="edit"
      />
    </div>
  )
}
