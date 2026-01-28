"use client"

import { useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import VendorGroup, { VendorGroupData } from "@modules/cart/components/vendor-group"
import repeat from "@lib/util/repeat"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

interface GroupedCartResponse {
  cart_id: string
  vendor_groups: VendorGroupData[]
  total_items: number
  subtotal: number
}

type VendorGroupedItemsProps = {
  cart?: HttpTypes.StoreCart
}

const VendorGroupedItems = ({ cart }: VendorGroupedItemsProps) => {
  const [groupedData, setGroupedData] = useState<GroupedCartResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGroupedCart = async () => {
      if (!cart?.id) {
        setIsLoading(false)
        return
      }

      try {
        const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
        const response = await fetch(`${backendUrl}/store/carts/${cart.id}/grouped`, {
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch grouped cart")
        }

        const data: GroupedCartResponse = await response.json()
        setGroupedData(data)
      } catch (err) {
        console.warn("Could not fetch vendor-grouped cart, falling back to default view:", err)
        // Don't set error - we'll fall back to showing items without grouping
        setGroupedData(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGroupedCart()
  }, [cart?.id])

  // Loading state
  if (isLoading) {
    return (
      <div>
        <div className="pb-3 flex items-center">
          <Heading className="text-[2rem] leading-[2.75rem]">Cart</Heading>
        </div>
        <div className="space-y-4">
          {repeat(3).map((i) => (
            <div key={i} className="border border-ui-border-base rounded-lg p-4">
              <SkeletonLineItem />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // If we have grouped data with multiple vendors, show vendor groups
  if (groupedData && groupedData.vendor_groups.length > 0) {
    const hasMultipleVendors = groupedData.vendor_groups.length > 1 ||
      (groupedData.vendor_groups.length === 1 && groupedData.vendor_groups[0].vendor_id !== null)

    return (
      <div>
        <div className="pb-3 flex items-center justify-between">
          <Heading className="text-[2rem] leading-[2.75rem]">Cart</Heading>
          {hasMultipleVendors && (
            <Text className="text-ui-fg-subtle">
              {groupedData.vendor_groups.length} vendor{groupedData.vendor_groups.length > 1 ? "s" : ""}
            </Text>
          )}
        </div>

        {hasMultipleVendors && (
          <Text className="text-ui-fg-subtle mb-4">
            Your items are grouped by vendor for easier checkout
          </Text>
        )}

        <div className="space-y-4">
          {groupedData.vendor_groups.map((group, index) => (
            <VendorGroup
              key={group.vendor_id || `group-${index}`}
              group={group}
              currencyCode={cart?.currency_code}
              cartItems={cart?.items}
            />
          ))}
        </div>
      </div>
    )
  }

  // Fallback: No grouped data available, show empty state or message
  if (!cart?.items || cart.items.length === 0) {
    return (
      <div>
        <div className="pb-3 flex items-center">
          <Heading className="text-[2rem] leading-[2.75rem]">Cart</Heading>
        </div>
        <Text className="text-ui-fg-subtle">Your cart is empty</Text>
      </div>
    )
  }

  // Fallback: Show items without vendor grouping (when API not available)
  return (
    <div>
      <div className="pb-3 flex items-center">
        <Heading className="text-[2rem] leading-[2.75rem]">Cart</Heading>
      </div>
      <div className="border border-ui-border-base rounded-lg overflow-hidden">
        <div className="bg-ui-bg-subtle px-4 py-3 border-b border-ui-border-base">
          <Text className="font-medium text-ui-fg-base">Kuwait Marketplace</Text>
          <Text className="text-sm text-ui-fg-subtle">
            {cart.items.length} {cart.items.length === 1 ? "item" : "items"}
          </Text>
        </div>
        <VendorGroup
          group={{
            vendor_id: null,
            vendor_name: "Kuwait Marketplace",
            vendor_logo: null,
            items: cart.items.map((item) => ({
              id: item.id,
              title: item.title || "Unknown Item",
              variant_title: item.variant?.title,
              quantity: item.quantity || 1,
              unit_price: item.unit_price || 0,
              total: (item.unit_price || 0) * (item.quantity || 1),
              thumbnail: item.thumbnail,
              product_id: item.variant?.product?.id,
            })),
            subtotal: cart.items.reduce(
              (sum, item) => sum + (item.unit_price || 0) * (item.quantity || 1),
              0
            ),
            item_count: cart.items.reduce((sum, item) => sum + (item.quantity || 1), 0),
          }}
          currencyCode={cart.currency_code}
          cartItems={cart.items}
        />
      </div>
    </div>
  )
}

export default VendorGroupedItems
