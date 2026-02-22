"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button, Heading, Text } from "@medusajs/ui"
import Input from "@modules/common/components/input"
import { updateVendorProfile, Vendor } from "@lib/data/vendor"

interface SettingsFormProps {
  vendor: Vendor
}

const SettingsForm = ({ vendor }: SettingsFormProps) => {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: vendor.name,
    description: vendor.description || "",
    phone: vendor.phone || "",
    logo_url: vendor.logo_url || "",
    address_line_1: vendor.address_line_1 || "",
    address_line_2: vendor.address_line_2 || "",
    city: vendor.city || "",
    postal_code: vendor.postal_code || "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setSuccess(false)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsSubmitting(true)

    try {
      const result = await updateVendorProfile(vendor.email, {
        name: formData.name,
        description: formData.description || null,
        phone: formData.phone || null,
        logo_url: formData.logo_url || null,
        address_line_1: formData.address_line_1 || null,
        address_line_2: formData.address_line_2 || null,
        city: formData.city || null,
        postal_code: formData.postal_code || null,
      })

      if (result.success) {
        setSuccess(true)
        router.refresh()
      } else {
        setError(result.error || "Failed to update profile")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Business Information */}
      <div className="bg-white border border-ui-border-base rounded-lg p-6">
        <Heading level="h3" className="mb-4">
          Business Information
        </Heading>
        <div className="grid grid-cols-1 gap-4">
          <Input
            name="name"
            label="Business Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <div>
            <label className="block text-sm font-medium text-ui-fg-base mb-2">
              Business Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-ui-bg-field border border-ui-border-base rounded-md focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active hover:bg-ui-bg-field-hover"
              placeholder="Tell customers about your business..."
            />
          </div>
          <Input
            name="phone"
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Branding */}
      <div className="bg-white border border-ui-border-base rounded-lg p-6">
        <Heading level="h3" className="mb-4">
          Branding
        </Heading>
        <Input
          name="logo_url"
          label="Logo URL"
          value={formData.logo_url}
          onChange={handleChange}
        />
        <Text className="text-xs text-ui-fg-muted mt-2">
          Enter a URL to your business logo. For best results, use a square image.
        </Text>
        {formData.logo_url && (
          <div className="mt-4">
            <p className="text-sm text-ui-fg-subtle mb-2">Preview:</p>
            <img
              src={formData.logo_url}
              alt="Logo preview"
              className="w-20 h-20 rounded-lg object-cover border border-ui-border-base"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none"
              }}
            />
          </div>
        )}
      </div>

      {/* Business Address */}
      <div className="bg-white border border-ui-border-base rounded-lg p-6">
        <Heading level="h3" className="mb-4">
          Business Address
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              name="address_line_1"
              label="Address Line 1"
              value={formData.address_line_1}
              onChange={handleChange}
            />
          </div>
          <div className="md:col-span-2">
            <Input
              name="address_line_2"
              label="Address Line 2 (optional)"
              value={formData.address_line_2}
              onChange={handleChange}
            />
          </div>
          <Input
            name="city"
            label="City"
            value={formData.city}
            onChange={handleChange}
          />
          <Input
            name="postal_code"
            label="Postal Code"
            value={formData.postal_code}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Account Info (Read-only) */}
      <div className="bg-ui-bg-subtle border border-ui-border-base rounded-lg p-6">
        <Heading level="h3" className="mb-4">
          Account Information
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-ui-fg-muted">Email</p>
            <p className="font-medium">{vendor.email}</p>
          </div>
          <div>
            <p className="text-ui-fg-muted">Status</p>
            <p className="font-medium capitalize">{vendor.status}</p>
          </div>
          <div>
            <p className="text-ui-fg-muted">Commission Rate</p>
            <p className="font-medium">{(vendor.commission_rate * 100).toFixed(0)}%</p>
          </div>
          <div>
            <p className="text-ui-fg-muted">Member Since</p>
            <p className="font-medium">
              {new Date(vendor.created_at).toLocaleDateString("en-KW", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          {vendor.business_registration && (
            <div className="md:col-span-2">
              <p className="text-ui-fg-muted">Business Registration (CR)</p>
              <p className="font-medium">{vendor.business_registration}</p>
            </div>
          )}
        </div>
        <Text className="text-xs text-ui-fg-muted mt-4">
          To update your email, commission rate, or business registration, please contact support.
        </Text>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          Profile updated successfully!
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}

export default SettingsForm
