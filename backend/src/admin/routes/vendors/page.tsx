import { defineRouteConfig } from "@medusajs/admin-sdk"
import { BuildingStorefront } from "@medusajs/icons"
import {
  Container,
  Heading,
  Text,
  Badge,
  Button,
  Table,
  Input,
  Select,
  toast,
  Drawer,
  Label,
} from "@medusajs/ui"
import { useState, useEffect, useCallback } from "react"

interface Vendor {
  id: string
  name: string
  email: string
  phone: string | null
  description: string | null
  logo_url: string | null
  status: "pending" | "verified" | "premium" | "suspended"
  commission_rate: number
  business_registration: string | null
  bank_account: string | null
  address_line_1: string | null
  address_line_2: string | null
  city: string | null
  postal_code: string | null
  country_code: string
  created_at: string
  updated_at: string
}

interface VendorsResponse {
  vendors: Vendor[]
  count: number
  offset: number
  limit: number
}

const statusColors: Record<string, "green" | "orange" | "blue" | "red" | "grey"> = {
  pending: "orange",
  verified: "green",
  premium: "blue",
  suspended: "red",
}

const VendorsPage = () => {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editCommission, setEditCommission] = useState("")

  const fetchVendors = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter && statusFilter !== "all") {
        params.append("status", statusFilter)
      }
      params.append("limit", "100")

      const response = await fetch(`/admin/vendors?${params.toString()}`, {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch vendors")
      }

      const data: VendorsResponse = await response.json()
      setVendors(data.vendors)
    } catch (error) {
      toast.error("Error", {
        description: "Failed to load vendors",
      })
      console.error("Failed to fetch vendors:", error)
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchVendors()
  }, [fetchVendors])

  const handleApprove = async (vendorId: string) => {
    try {
      const response = await fetch(`/admin/vendors/${vendorId}/approve`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to approve vendor")
      }

      toast.success("Success", {
        description: "Vendor approved successfully",
      })
      fetchVendors()
      setIsDrawerOpen(false)
    } catch (error) {
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Failed to approve vendor",
      })
    }
  }

  const handleReject = async (vendorId: string) => {
    try {
      const response = await fetch(`/admin/vendors/${vendorId}/reject`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to reject vendor")
      }

      toast.success("Success", {
        description: "Vendor rejected successfully",
      })
      fetchVendors()
      setIsDrawerOpen(false)
    } catch (error) {
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Failed to reject vendor",
      })
    }
  }

  const handleUpdateCommission = async (vendorId: string) => {
    try {
      const rate = parseFloat(editCommission) / 100 // Convert percentage to decimal

      if (isNaN(rate) || rate < 0 || rate > 1) {
        toast.error("Error", {
          description: "Commission rate must be between 0 and 100",
        })
        return
      }

      const response = await fetch(`/admin/vendors/${vendorId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commission_rate: rate }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to update commission")
      }

      toast.success("Success", {
        description: "Commission rate updated successfully",
      })
      fetchVendors()

      // Update selected vendor in drawer
      if (selectedVendor) {
        setSelectedVendor({ ...selectedVendor, commission_rate: rate })
      }
    } catch (error) {
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Failed to update commission",
      })
    }
  }

  const openVendorDetails = (vendor: Vendor) => {
    setSelectedVendor(vendor)
    setEditCommission((vendor.commission_rate * 100).toFixed(1))
    setIsDrawerOpen(true)
  }

  const pendingCount = vendors.filter((v) => v.status === "pending").length

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h1">Vendor Management</Heading>
          <Text className="text-ui-fg-subtle mt-1">
            Manage vendor applications and settings
          </Text>
        </div>
        {pendingCount > 0 && (
          <Badge color="orange" size="small">
            {pendingCount} pending
          </Badge>
        )}
      </div>

      <div className="px-6 py-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-48">
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <Select.Trigger>
                <Select.Value placeholder="Filter by status" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="all">All Statuses</Select.Item>
                <Select.Item value="pending">Pending</Select.Item>
                <Select.Item value="verified">Verified</Select.Item>
                <Select.Item value="premium">Premium</Select.Item>
                <Select.Item value="suspended">Suspended</Select.Item>
              </Select.Content>
            </Select>
          </div>
          <Button variant="secondary" onClick={() => fetchVendors()}>
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Text className="text-ui-fg-subtle">Loading vendors...</Text>
          </div>
        ) : vendors.length === 0 ? (
          <div className="flex justify-center py-8">
            <Text className="text-ui-fg-subtle">No vendors found</Text>
          </div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Commission</Table.HeaderCell>
                <Table.HeaderCell>Registration</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {vendors.map((vendor) => (
                <Table.Row key={vendor.id}>
                  <Table.Cell>
                    <Text className="font-medium">{vendor.name}</Text>
                  </Table.Cell>
                  <Table.Cell>{vendor.email}</Table.Cell>
                  <Table.Cell>
                    <Badge color={statusColors[vendor.status]} size="small">
                      {vendor.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    {(vendor.commission_rate * 100).toFixed(1)}%
                  </Table.Cell>
                  <Table.Cell>
                    {vendor.business_registration || "-"}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => openVendorDetails(vendor)}
                      >
                        View
                      </Button>
                      {vendor.status === "pending" && (
                        <>
                          <Button
                            variant="primary"
                            size="small"
                            onClick={() => handleApprove(vendor.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="small"
                            onClick={() => handleReject(vendor.id)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>

      {/* Vendor Details Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Vendor Details</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body className="p-4">
            {selectedVendor && (
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <Heading level="h3" className="mb-2">
                    Basic Information
                  </Heading>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-ui-fg-subtle">Name</Label>
                      <Text>{selectedVendor.name}</Text>
                    </div>
                    <div>
                      <Label className="text-ui-fg-subtle">Email</Label>
                      <Text>{selectedVendor.email}</Text>
                    </div>
                    <div>
                      <Label className="text-ui-fg-subtle">Phone</Label>
                      <Text>{selectedVendor.phone || "Not provided"}</Text>
                    </div>
                    <div>
                      <Label className="text-ui-fg-subtle">Status</Label>
                      <div className="mt-1">
                        <Badge color={statusColors[selectedVendor.status]} size="small">
                          {selectedVendor.status}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-ui-fg-subtle">Description</Label>
                      <Text>{selectedVendor.description || "Not provided"}</Text>
                    </div>
                  </div>
                </div>

                {/* Business Info */}
                <div>
                  <Heading level="h3" className="mb-2">
                    Business Information
                  </Heading>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-ui-fg-subtle">Business Registration (CR)</Label>
                      <Text>{selectedVendor.business_registration || "Not provided"}</Text>
                    </div>
                    <div>
                      <Label className="text-ui-fg-subtle">Bank Account</Label>
                      <Text>{selectedVendor.bank_account || "Not provided"}</Text>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <Heading level="h3" className="mb-2">
                    Address
                  </Heading>
                  <div className="space-y-2">
                    <Text>
                      {selectedVendor.address_line_1 || ""}<br />
                      {selectedVendor.address_line_2 && <>{selectedVendor.address_line_2}<br /></>}
                      {selectedVendor.city && <>{selectedVendor.city}, </>}
                      {selectedVendor.postal_code && <>{selectedVendor.postal_code}<br /></>}
                      {selectedVendor.country_code?.toUpperCase()}
                    </Text>
                  </div>
                </div>

                {/* Commission Rate */}
                <div>
                  <Heading level="h3" className="mb-2">
                    Commission Rate
                  </Heading>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={editCommission}
                      onChange={(e) => setEditCommission(e.target.value)}
                      placeholder="15.0"
                      className="w-24"
                    />
                    <Text>%</Text>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleUpdateCommission(selectedVendor.id)}
                    >
                      Update
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                {selectedVendor.status === "pending" && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="primary"
                      onClick={() => handleApprove(selectedVendor.id)}
                    >
                      Approve Vendor
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleReject(selectedVendor.id)}
                    >
                      Reject Vendor
                    </Button>
                  </div>
                )}

                {selectedVendor.status === "verified" && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="danger"
                      onClick={() => handleReject(selectedVendor.id)}
                    >
                      Suspend Vendor
                    </Button>
                  </div>
                )}

                {selectedVendor.status === "suspended" && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="primary"
                      onClick={() => handleApprove(selectedVendor.id)}
                    >
                      Reinstate Vendor
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Drawer.Body>
        </Drawer.Content>
      </Drawer>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Vendors",
  icon: BuildingStorefront,
})

export default VendorsPage
