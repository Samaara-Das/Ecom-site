import { Metadata } from "next"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import { getVendorByEmail, getVendorOrder } from "@lib/data/vendor"
import OrderDetail from "@modules/vendor/components/order-detail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer?.email) {
    return { title: "Order Not Found" }
  }

  const order = await getVendorOrder(customer.email, params.id)

  if (!order) {
    return { title: "Order Not Found" }
  }

  return {
    title: `Order #${order.display_id} | Vendor Dashboard`,
    description: `View order details for order #${order.display_id}`,
  }
}

export default async function VendorOrderDetailPage(props: Props) {
  const params = await props.params
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer?.email) {
    notFound()
  }

  const vendor = await getVendorByEmail(customer.email)

  if (!vendor || !["verified", "premium"].includes(vendor.status)) {
    notFound()
  }

  const order = await getVendorOrder(customer.email, params.id)

  if (!order) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="vendor-order-detail">
      {/* Breadcrumb */}
      <nav className="mb-4">
        <ol className="flex items-center gap-2 text-sm text-ui-fg-subtle">
          <li>
            <LocalizedClientLink
              href="/vendor/orders"
              className="hover:text-ui-fg-base"
            >
              Orders
            </LocalizedClientLink>
          </li>
          <li>/</li>
          <li className="text-ui-fg-base">Order #{order.display_id}</li>
        </ol>
      </nav>

      {/* Order Detail */}
      <OrderDetail order={order} vendorEmail={customer.email} />
    </div>
  )
}
