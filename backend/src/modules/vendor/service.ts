import { MedusaService } from "@medusajs/framework/utils"
import { Vendor } from "./models/vendor"

/**
 * Vendor Module Service
 * Provides data-management methods for the Vendor data model
 *
 * Extends MedusaService which auto-generates CRUD methods:
 * - listVendors(filters, config)
 * - listAndCountVendors(filters, config)
 * - retrieveVendor(id, config)
 * - createVendors(data)
 * - updateVendors(selector, data)
 * - deleteVendors(ids)
 */
class VendorModuleService extends MedusaService({
  Vendor,
}) {
  /**
   * Get vendors by status
   */
  async listVendorsByStatus(status: string) {
    return this.listVendors({ status })
  }

  /**
   * Get verified vendors only (for storefront display)
   */
  async listActiveVendors() {
    return this.listVendors({
      status: ["verified", "premium"],
    })
  }

  /**
   * Update vendor status (for admin approval workflow)
   */
  async updateVendorStatus(vendorId: string, status: string) {
    return this.updateVendors(
      { id: vendorId },
      { status }
    )
  }

  /**
   * Get vendor by email (for registration duplicate check)
   */
  async findVendorByEmail(email: string) {
    const vendors = await this.listVendors({ email })
    return vendors[0] || null
  }
}

export default VendorModuleService
