import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import VendorModule from "../modules/vendor"

/**
 * Links Vendor to Product
 * - A vendor can have multiple products (isList: true on product side)
 * - This creates a virtual relation between the two modules
 *
 * After defining this link and running migrations:
 * - Products can be queried with their vendor
 * - Vendors can be queried with their products
 */
export default defineLink(
  {
    linkable: ProductModule.linkable.product,
    isList: true,
  },
  VendorModule.linkable.vendor
)
