"use client"

import { useState } from "react"
import { Button, clx, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import type { VendorProduct } from "@lib/data/vendor"
import { deleteVendorProduct } from "@lib/data/vendor"

interface ProductListProps {
  products: VendorProduct[]
  vendorEmail: string
}

const ProductList = ({ products, vendorEmail }: ProductListProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [localProducts, setLocalProducts] = useState(products)

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-KW", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
    }).format(amount / 100)
  }

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return
    }

    setDeletingId(productId)
    const result = await deleteVendorProduct(vendorEmail, productId)

    if (result.success) {
      setLocalProducts(localProducts.filter((p) => p.id !== productId))
    } else {
      alert(result.error || "Failed to delete product")
    }
    setDeletingId(null)
  }

  if (localProducts.length === 0) {
    return (
      <div className="text-center py-12 bg-white border border-ui-border-base rounded-lg">
        <div className="w-16 h-16 bg-ui-bg-subtle rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-ui-fg-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No products yet</h3>
        <Text className="text-ui-fg-subtle mb-6">
          Start by adding your first product to the marketplace
        </Text>
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
    )
  }

  return (
    <div className="bg-white border border-ui-border-base rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-ui-bg-subtle border-b border-ui-border-base">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-ui-fg-subtle">
                Product
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-ui-fg-subtle">
                Status
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-ui-fg-subtle">
                Price
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-ui-fg-subtle">
                Inventory
              </th>
              <th className="text-right px-4 py-3 text-sm font-medium text-ui-fg-subtle">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ui-border-base">
            {localProducts.map((product) => {
              const primaryVariant = product.variants?.[0]
              const price = primaryVariant?.prices?.[0]
              const inventory = primaryVariant?.inventory_quantity ?? 0

              return (
                <tr key={product.id} className="hover:bg-ui-bg-subtle-hover">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-md bg-ui-bg-subtle overflow-hidden flex-shrink-0">
                        {product.thumbnail ? (
                          <img
                            src={product.thumbnail}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-ui-fg-muted">
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{product.title}</p>
                        <p className="text-sm text-ui-fg-muted truncate">
                          {product.handle}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={clx(
                        "inline-block text-xs px-2 py-1 rounded-full",
                        product.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      )}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {price ? (
                      formatCurrency(price.amount, price.currency_code)
                    ) : (
                      <span className="text-ui-fg-muted">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={clx(
                        inventory <= 0
                          ? "text-red-600"
                          : inventory <= 5
                          ? "text-yellow-600"
                          : "text-ui-fg-base"
                      )}
                    >
                      {inventory}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <LocalizedClientLink
                        href={`/vendor/products/${product.id}`}
                        className="text-sm px-3 py-1.5 border border-ui-border-base rounded-md hover:bg-ui-bg-subtle transition-colors"
                      >
                        Edit
                      </LocalizedClientLink>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId === product.id}
                      >
                        {deletingId === product.id ? "..." : "Delete"}
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductList
