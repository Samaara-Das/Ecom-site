import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Heading, Text } from "@medusajs/ui"
import { retrieveCustomer } from "@lib/data/customer"
import { getVendorByEmail } from "@lib/data/vendor"
import SettingsForm from "@modules/vendor/components/settings-form"

export const metadata: Metadata = {
  title: "Settings | Vendor Dashboard",
  description: "Manage your vendor profile settings",
}

export default async function VendorSettingsPage() {
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer?.email) {
    notFound()
  }

  const vendor = await getVendorByEmail(customer.email)

  if (!vendor || !["verified", "premium"].includes(vendor.status)) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="vendor-settings">
      {/* Header */}
      <div className="mb-8">
        <Heading level="h1" className="text-2xl font-semibold mb-2">
          Settings
        </Heading>
        <Text className="text-ui-fg-subtle">
          Manage your vendor profile and business information
        </Text>
      </div>

      {/* Settings Form */}
      <SettingsForm vendor={vendor} />
    </div>
  )
}
