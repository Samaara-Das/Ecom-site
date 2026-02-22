import LocalizedClientLink from "@modules/common/components/localized-client-link"

const categories = [
  { label: "Electronics", icon: "📱", slug: "store", color: "from-blue-600 to-blue-800" },
  { label: "Fashion", icon: "👗", slug: "store", color: "from-purple-600 to-purple-800" },
  { label: "Beauty", icon: "💄", slug: "store", color: "from-pink-600 to-pink-800" },
  { label: "Food", icon: "🛒", slug: "store", color: "from-green-600 to-green-800" },
  { label: "Home", icon: "🏠", slug: "store", color: "from-orange-600 to-orange-800" },
  { label: "Sports", icon: "🏋️", slug: "store", color: "from-red-600 to-red-800" },
  { label: "Kids", icon: "🧸", slug: "store", color: "from-yellow-600 to-yellow-800" },
  { label: "Auto", icon: "🚗", slug: "store", color: "from-gray-600 to-gray-800" },
]

export default function CategoryShortcuts() {
  return (
    <section
      className="py-6 px-4"
      data-testid="category-shortcuts"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-white text-lg font-semibold mb-4">Shop by Category</h2>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <LocalizedClientLink
              key={cat.label}
              href={`/${cat.slug}`}
              className="flex flex-col items-center gap-2 group"
              data-testid="category-card"
            >
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}
              >
                {cat.icon}
              </div>
              <span className="text-xs text-gray-300 group-hover:text-white transition-colors text-center">
                {cat.label}
              </span>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}
