import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { SOCIAL_PROOF_CONFIG } from "@lib/social-proof-config"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { HttpTypes } from "@medusajs/types"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

function applyClientFilters(
  products: HttpTypes.StoreProduct[],
  category?: string,
  minPrice?: number,
  maxPrice?: number,
  rating?: number
): HttpTypes.StoreProduct[] {
  let result = [...products]

  if (category) {
    const cat = category.toLowerCase()
    result = result.filter(
      (p) => (p.metadata?.category as string | undefined)?.toLowerCase() === cat
    )
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    const min = minPrice ?? 0
    const max = maxPrice ?? Infinity
    result = result.filter((p) => {
      const kwdPrice = p.variants
        ?.flatMap((v) => v.prices ?? [])
        .find((pr) => pr.currency_code === "kwd")
      if (!kwdPrice) return true
      const amount = kwdPrice.amount / 1000
      return amount >= min && amount <= max
    })
  }

  if (rating !== undefined && rating > 0) {
    result = result.filter((p) => {
      const proofData = p.handle ? SOCIAL_PROOF_CONFIG[p.handle] : undefined
      return (proofData?.rating ?? 0) >= rating
    })
  }

  return result
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  category,
  minPrice,
  maxPrice,
  rating,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  category?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
}) {
  const hasClientFilters = !!(category || minPrice !== undefined || maxPrice !== undefined || (rating && rating > 0))

  const queryParams: PaginatedProductsParams = {
    // Fetch more when client filters are active so we have enough after filtering
    limit: hasClientFilters ? 200 : 12,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  let {
    response: { products, count },
  } = await listProductsWithSort({
    page: hasClientFilters ? 1 : page,
    queryParams,
    sortBy,
    countryCode,
  })

  if (hasClientFilters) {
    products = applyClientFilters(products, category, minPrice, maxPrice, rating)
    count = products.length

    // Apply pagination manually
    const offset = (page - 1) * PRODUCT_LIMIT
    products = products.slice(offset, offset + PRODUCT_LIMIT)
  }

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <>
      <ul
        className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
        data-testid="products-list"
      >
        {products.map((p) => {
          return (
            <li key={p.id}>
              <ProductPreview product={p} region={region} />
            </li>
          )
        })}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
