"use client"

import { HttpTypes } from "@medusajs/types"
import { Table, Text } from "@medusajs/ui"
import Item from "@modules/cart/components/item"
import { convertToLocale } from "@lib/util/money"

export interface VendorGroupItem {
  id: string
  title: string
  variant_title?: string
  quantity: number
  unit_price: number
  total: number
  thumbnail?: string | null
  product_id?: string
  // Full item for compatibility with Item component
  fullItem?: HttpTypes.StoreCartLineItem
}

export interface VendorGroupData {
  vendor_id: string | null
  vendor_name: string
  vendor_logo?: string | null
  items: VendorGroupItem[]
  subtotal: number
  item_count: number
}

interface VendorGroupProps {
  group: VendorGroupData
  currencyCode?: string
  cartItems?: HttpTypes.StoreCartLineItem[]
}

const VendorGroup = ({ group, currencyCode, cartItems }: VendorGroupProps) => {
  // Match group items with full cart items for the Item component
  const getFullItem = (itemId: string) => {
    return cartItems?.find((i) => i.id === itemId)
  }

  return (
    <div className="mb-6 border border-ui-border-base rounded-lg overflow-hidden">
      {/* Vendor Header */}
      <div className="bg-ui-bg-subtle px-4 py-3 flex items-center justify-between border-b border-ui-border-base">
        <div className="flex items-center gap-3">
          {group.vendor_logo ? (
            <img
              src={group.vendor_logo}
              alt={group.vendor_name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-ui-bg-component flex items-center justify-center">
              <Text className="text-ui-fg-muted text-sm font-medium">
                {group.vendor_name.charAt(0).toUpperCase()}
              </Text>
            </div>
          )}
          <div>
            <Text className="font-medium text-ui-fg-base">
              {group.vendor_name}
            </Text>
            <Text className="text-sm text-ui-fg-subtle">
              {group.item_count} {group.item_count === 1 ? "item" : "items"}
            </Text>
          </div>
        </div>
        <div className="text-right">
          <Text className="text-sm text-ui-fg-subtle">Subtotal</Text>
          <Text className="font-medium text-ui-fg-base">
            {convertToLocale({
              amount: group.subtotal,
              currency_code: currencyCode || "kwd",
            })}
          </Text>
        </div>
      </div>

      {/* Items Table */}
      <Table>
        <Table.Header className="border-t-0">
          <Table.Row className="text-ui-fg-subtle txt-medium-plus">
            <Table.HeaderCell className="!pl-4">Item</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Quantity</Table.HeaderCell>
            <Table.HeaderCell className="hidden small:table-cell">
              Price
            </Table.HeaderCell>
            <Table.HeaderCell className="!pr-4 text-right">
              Total
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {group.items.map((item) => {
            const fullItem = getFullItem(item.id)
            if (fullItem) {
              return (
                <Item
                  key={item.id}
                  item={fullItem}
                  currencyCode={currencyCode}
                />
              )
            }
            // Fallback simple row if full item not available
            return (
              <Table.Row key={item.id} className="border-b last:border-b-0">
                <Table.Cell className="!pl-4">
                  <div className="flex items-center gap-3">
                    {item.thumbnail && (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                    )}
                    <div>
                      <Text className="font-medium">{item.title}</Text>
                      {item.variant_title && (
                        <Text className="text-sm text-ui-fg-subtle">
                          {item.variant_title}
                        </Text>
                      )}
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell>{item.quantity}</Table.Cell>
                <Table.Cell className="hidden small:table-cell">
                  {convertToLocale({
                    amount: item.unit_price,
                    currency_code: currencyCode || "kwd",
                  })}
                </Table.Cell>
                <Table.Cell className="!pr-4 text-right">
                  {convertToLocale({
                    amount: item.total,
                    currency_code: currencyCode || "kwd",
                  })}
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    </div>
  )
}

export default VendorGroup
