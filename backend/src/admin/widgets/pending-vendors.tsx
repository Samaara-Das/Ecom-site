import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button } from "@medusajs/ui"
import { useState, useEffect } from "react"

interface Vendor {
  id: string
  name: string
  email: string
  status: string
  created_at: string
}

interface VendorsResponse {
  vendors: Vendor[]
  count: number
}

const PendingVendorsWidget = () => {
  const [pendingVendors, setPendingVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPendingVendors = async () => {
      try {
        const response = await fetch("/admin/vendors?status=pending&limit=5", {
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch vendors")
        }

        const data: VendorsResponse = await response.json()
        setPendingVendors(data.vendors)
      } catch (error) {
        console.error("Failed to fetch pending vendors:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPendingVendors()
  }, [])

  if (loading) {
    return (
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">Pending Vendors</Heading>
        </div>
        <div className="px-6 py-4">
          <Text className="text-ui-fg-subtle">Loading...</Text>
        </div>
      </Container>
    )
  }

  if (pendingVendors.length === 0) {
    return (
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">Pending Vendors</Heading>
          <Badge color="green" size="small">All clear</Badge>
        </div>
        <div className="px-6 py-4">
          <Text className="text-ui-fg-subtle">No pending vendor applications</Text>
        </div>
      </Container>
    )
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Pending Vendors</Heading>
        <Badge color="orange" size="small">
          {pendingVendors.length} pending
        </Badge>
      </div>
      <div className="px-6 py-4 space-y-3">
        {pendingVendors.map((vendor) => (
          <div
            key={vendor.id}
            className="flex items-center justify-between py-2 border-b border-ui-border-base last:border-0"
          >
            <div>
              <Text className="font-medium">{vendor.name}</Text>
              <Text className="text-ui-fg-subtle text-sm">{vendor.email}</Text>
            </div>
            <Badge color="orange" size="small">Pending</Badge>
          </div>
        ))}
        <div className="pt-2">
          <a href="/app/vendors">
            <Button variant="secondary" size="small">
              View All Vendors
            </Button>
          </a>
        </div>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.list.before",
})

export default PendingVendorsWidget
