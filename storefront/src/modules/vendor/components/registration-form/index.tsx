"use client"

import { useState } from "react"
import { Button, Heading, Text } from "@medusajs/ui"
import Input from "@modules/common/components/input"

interface VendorFormData {
  name: string
  email: string
  phone: string
  description: string
  business_registration: string
  address_line_1: string
  city: string
  postal_code: string
}

interface FormState {
  isSubmitting: boolean
  isSuccess: boolean
  error: string | null
  vendorId: string | null
}

const VendorRegistrationForm = () => {
  const [formData, setFormData] = useState<VendorFormData>({
    name: "",
    email: "",
    phone: "",
    description: "",
    business_registration: "",
    address_line_1: "",
    city: "",
    postal_code: "",
  })

  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isSuccess: false,
    error: null,
    vendorId: null,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setFormState({
      isSubmitting: true,
      isSuccess: false,
      error: null,
      vendorId: null,
    })

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

      const response = await fetch(`${backendUrl}/store/vendors/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit application")
      }

      setFormState({
        isSubmitting: false,
        isSuccess: true,
        error: null,
        vendorId: data.vendor?.id,
      })
    } catch (error) {
      setFormState({
        isSubmitting: false,
        isSuccess: false,
        error: error instanceof Error ? error.message : "An error occurred",
        vendorId: null,
      })
    }
  }

  if (formState.isSuccess) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <Heading level="h2" className="mb-4">
          Application Submitted!
        </Heading>
        <Text className="text-ui-fg-subtle mb-6">
          Thank you for applying to become a seller on Kuwait Marketplace. Our
          team will review your application and contact you within 2-3 business
          days.
        </Text>
        <Text className="text-sm text-ui-fg-muted">
          Application ID: {formState.vendorId}
        </Text>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <Heading level="h1" className="mb-4">
          Become a Seller
        </Heading>
        <Text className="text-ui-fg-subtle">
          Join Kuwait Marketplace and start selling to thousands of customers
          across Kuwait. Fill out the form below to apply.
        </Text>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Information */}
        <div className="bg-white p-6 rounded-lg border border-ui-border-base">
          <Heading level="h3" className="mb-4">
            Business Information
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                name="name"
                label="Business Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Input
                name="email"
                label="Business Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Input
                name="phone"
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="md:col-span-2">
              <Input
                name="business_registration"
                label="Business Registration (CR Number)"
                value={formData.business_registration}
                onChange={handleChange}
              />
              <Text className="text-xs text-ui-fg-muted mt-1">
                Optional but recommended for faster verification
              </Text>
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-ui-fg-base mb-2"
              >
                Business Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-ui-bg-field border border-ui-border-base rounded-md focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active hover:bg-ui-bg-field-hover"
                placeholder="Tell us about your business and what products you sell..."
              />
            </div>
          </div>
        </div>

        {/* Business Address */}
        <div className="bg-white p-6 rounded-lg border border-ui-border-base">
          <Heading level="h3" className="mb-4">
            Business Address
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                name="address_line_1"
                label="Street Address"
                value={formData.address_line_1}
                onChange={handleChange}
              />
            </div>
            <div>
              <Input
                name="city"
                label="City"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div>
              <Input
                name="postal_code"
                label="Postal Code"
                value={formData.postal_code}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="bg-ui-bg-subtle p-4 rounded-lg">
          <Text className="text-sm text-ui-fg-subtle">
            By submitting this application, you agree to Kuwait Marketplace&apos;s{" "}
            <a href="/content/terms-of-use" className="underline">
              Seller Terms of Service
            </a>{" "}
            and{" "}
            <a href="/content/privacy-policy" className="underline">
              Privacy Policy
            </a>
            . A 15% commission fee applies to all sales.
          </Text>
        </div>

        {/* Error Message */}
        {formState.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {formState.error}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={formState.isSubmitting}
        >
          {formState.isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </div>
  )
}

export default VendorRegistrationForm
