import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface Vendor {
  name: string
  shortName: string
  category: string
  district: string
  status: "premium" | "verified" | "pending"
  color: string
  slug: string
}

const vendors: Vendor[] = [
  {
    name: "TechZone Kuwait",
    shortName: "TZ",
    category: "Electronics",
    district: "Kuwait City",
    status: "premium",
    color: "bg-blue-600",
    slug: "techzone-kuwait",
  },
  {
    name: "Al-Shaya Fashion",
    shortName: "AS",
    category: "Fashion",
    district: "The Avenues",
    status: "verified",
    color: "bg-purple-600",
    slug: "al-shaya-fashion",
  },
  {
    name: "Glow Beauty Kuwait",
    shortName: "GB",
    category: "Health & Beauty",
    district: "Salmiya",
    status: "verified",
    color: "bg-pink-600",
    slug: "glow-beauty-kuwait",
  },
  {
    name: "Tamr Dates & Foods",
    shortName: "TD",
    category: "Food & Grocery",
    district: "Farwaniya",
    status: "verified",
    color: "bg-green-700",
    slug: "tamr-dates-specialty",
  },
  {
    name: "FitLife Kuwait",
    shortName: "FL",
    category: "Sports & Outdoors",
    district: "Sabah Al-Salem",
    status: "verified",
    color: "bg-orange-600",
    slug: "fitlife-kuwait",
  },
]

function StatusBadge({ status }: { status: Vendor["status"] }) {
  if (status === "premium") {
    return (
      <span className="text-xs bg-yellow-500 text-yellow-900 px-2 py-0.5 rounded-full font-semibold">
        ⭐ Premium
      </span>
    )
  }
  if (status === "verified") {
    return (
      <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full font-semibold">
        ✓ Verified
      </span>
    )
  }
  return null
}

export default function VendorSpotlight() {
  return (
    <section
      className="py-6 px-4"
      data-testid="vendor-spotlight"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg">Shop by Vendor</h2>
          <LocalizedClientLink
            href="/store"
            className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
          >
            See all vendors →
          </LocalizedClientLink>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {vendors.map((vendor) => (
            <LocalizedClientLink
              key={vendor.slug}
              href={`/store`}
              className="bg-[#1F2937] border border-[#374151] rounded-lg p-4 flex flex-col items-center gap-2 hover:border-orange-400 hover:bg-[#2d3748] transition-all group"
              data-testid="vendor-card"
            >
              {/* Avatar */}
              <div
                className={`${vendor.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-105 transition-transform`}
              >
                {vendor.shortName}
              </div>

              {/* Name */}
              <div className="text-center">
                <p className="text-white text-xs font-semibold leading-tight">
                  {vendor.name}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">{vendor.category}</p>
                <p className="text-gray-500 text-xs">{vendor.district}</p>
              </div>

              <StatusBadge status={vendor.status} />
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}
