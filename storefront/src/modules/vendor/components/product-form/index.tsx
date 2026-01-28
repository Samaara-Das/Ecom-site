"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button, Heading, Text } from "@medusajs/ui"
import Input from "@modules/common/components/input"
import { createVendorProduct, updateVendorProduct, VendorProduct } from "@lib/data/vendor"

interface ProductFormProps {
  vendorEmail: string
  product?: VendorProduct | null
  mode: "create" | "edit"
}

interface FormData {
  title: string
  subtitle: string
  description: string
  handle: string
  status: "draft" | "published"
  thumbnail: string
  variantTitle: string
  variantSku: string
  variantPrice: string
}

const ProductForm = ({ vendorEmail, product, mode }: ProductFormProps) => {
  const router = useRouter()
  const { countryCode } = useParams() as { countryCode: string }

  const [formData, setFormData] = useState<FormData>({
    title: product?.title || "",
    subtitle: product?.subtitle || "",
    description: product?.description || "",
    handle: product?.handle || "",
    status: product?.status || "draft",
    thumbnail: product?.thumbnail || "",
    variantTitle: product?.variants?.[0]?.title || "Default",
    variantSku: product?.variants?.[0]?.sku || "",
    variantPrice: product?.variants?.[0]?.prices?.[0]?.amount
      ? (product.variants[0].prices[0].amount / 100).toString()
      : "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      if (mode === "create") {
        const result = await createVendorProduct(vendorEmail, {
          title: formData.title,
          subtitle: formData.subtitle || undefined,
          description: formData.description || undefined,
          handle: formData.handle || undefined,
          status: formData.status,
          thumbnail: formData.thumbnail || undefined,
          variants: [
            {
              title: formData.variantTitle || "Default",
              sku: formData.variantSku || undefined,
              prices: formData.variantPrice
                ? [
                    {
                      amount: Math.round(parseFloat(formData.variantPrice) * 100),
                      currency_code: "kwd",
                    },
                  ]
                : undefined,
            },
          ],
        })

        if (result.success) {
          router.push(`/${countryCode}/vendor/products`)
          router.refresh()
        } else {
          setError(result.error || "Failed to create product")
        }
      } else if (product) {
        const result = await updateVendorProduct(vendorEmail, product.id, {
          title: formData.title,
          subtitle: formData.subtitle || undefined,
          description: formData.description || undefined,
          handle: formData.handle || undefined,
          status: formData.status,
          thumbnail: formData.thumbnail || undefined,
        })

        if (result.success) {
          router.push(`/${countryCode}/vendor/products`)
          router.refresh()
        } else {
          setError(result.error || "Failed to update product")
        }
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white border border-ui-border-base rounded-lg p-6">
        <Heading level="h3" className="mb-4">
          Basic Information
        </Heading>
        <div className="grid grid-cols-1 gap-4">
          <Input
            name="title"
            label="Product Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <Input
            name="subtitle"
            label="Subtitle (optional)"
            value={formData.subtitle}
            onChange={handleChange}
          />
          <Input
            name="handle"
            label="URL Handle (optional)"
            value={formData.handle}
            onChange={handleChange}
          />
          <div>
            <label className="block text-sm font-medium text-ui-fg-base mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-ui-bg-field border border-ui-border-base rounded-md focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active hover:bg-ui-bg-field-hover"
              placeholder="Describe your product..."
            />
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="bg-white border border-ui-border-base rounded-lg p-6">
        <Heading level="h3" className="mb-4">
          Media
        </Heading>
        <Input
          name="thumbnail"
          label="Thumbnail URL"
          value={formData.thumbnail}
          onChange={handleChange}
        />
        <Text className="text-xs text-ui-fg-muted mt-2">
          Enter a URL to an image. For best results, use a square image (1:1 ratio).
        </Text>
      </div>

      {/* Pricing & Inventory (only for create mode) */}
      {mode === "create" && (
        <div className="bg-white border border-ui-border-base rounded-lg p-6">
          <Heading level="h3" className="mb-4">
            Pricing &amp; Inventory
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              name="variantTitle"
              label="Variant Name"
              value={formData.variantTitle}
              onChange={handleChange}
            />
            <Input
              name="variantSku"
              label="SKU (optional)"
              value={formData.variantSku}
              onChange={handleChange}
            />
            <Input
              name="variantPrice"
              label="Price (KWD)"
              type="number"
              step="0.01"
              min="0"
              value={formData.variantPrice}
              onChange={handleChange}
            />
          </div>
          <Text className="text-xs text-ui-fg-muted mt-2">
            You can add more variants and set inventory after creating the product.
          </Text>
        </div>
      )}

      {/* Status */}
      <div className="bg-white border border-ui-border-base rounded-lg p-6">
        <Heading level="h3" className="mb-4">
          Status
        </Heading>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="status"
              value="draft"
              checked={formData.status === "draft"}
              onChange={handleChange}
              className="w-4 h-4 text-ui-fg-interactive"
            />
            <span>Draft</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="status"
              value="published"
              checked={formData.status === "published"}
              onChange={handleChange}
              className="w-4 h-4 text-ui-fg-interactive"
            />
            <span>Published</span>
          </label>
        </div>
        <Text className="text-xs text-ui-fg-muted mt-2">
          Draft products are not visible to customers. Publish when ready to sell.
        </Text>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : mode === "create"
            ? "Create Product"
            : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}

export default ProductForm
