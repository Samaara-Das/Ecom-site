import { model } from "@medusajs/framework/utils"

/**
 * Vendor data model for Kuwait Marketplace
 * Represents a seller/merchant in the multi-vendor marketplace
 */
export const Vendor = model.define("vendor", {
  id: model.id().primaryKey(),
  name: model.text(),
  description: model.text().nullable(),
  email: model.text(),
  phone: model.text().nullable(),
  logo_url: model.text().nullable(),
  // Vendor verification status
  status: model.enum(["pending", "verified", "premium", "suspended"]).default("pending"),
  // Commission rate (e.g., 0.15 = 15%)
  commission_rate: model.float().default(0.15),
  // Business registration number (Kuwait CR)
  business_registration: model.text().nullable(),
  // Bank account for payouts
  bank_account: model.text().nullable(),
  // Address fields
  address_line_1: model.text().nullable(),
  address_line_2: model.text().nullable(),
  city: model.text().nullable(),
  postal_code: model.text().nullable(),
  country_code: model.text().default("kw"),
}).checks([
  {
    name: "email_format_check",
    expression: (columns) => `${columns.email} LIKE '%@%'`,
  },
])
