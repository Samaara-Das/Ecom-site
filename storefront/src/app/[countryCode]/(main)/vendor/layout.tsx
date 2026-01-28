import { Toaster } from "@medusajs/ui"
import { retrieveCustomer } from "@lib/data/customer"
import { getVendorByEmail } from "@lib/data/vendor"
import VendorLayout from "@modules/vendor/templates/vendor-layout"

export default async function VendorPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get the logged in customer
  const customer = await retrieveCustomer().catch(() => null)

  // If customer is logged in, try to find their vendor account
  let vendor = null
  if (customer?.email) {
    vendor = await getVendorByEmail(customer.email)
  }

  return (
    <VendorLayout vendor={vendor}>
      {children}
      <Toaster />
    </VendorLayout>
  )
}
