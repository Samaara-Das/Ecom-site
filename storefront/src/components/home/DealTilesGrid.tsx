import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface DealTile {
  title: string
  subtitle: string
  cta: string
  ctaHref: string
  products: { handle: string; image: string; alt: string }[]
}

const deals: DealTile[] = [
  {
    title: "Up to 40% off",
    subtitle: "Electronics",
    cta: "See more deals",
    ctaHref: "/store",
    products: [
      {
        handle: "samsung-galaxy-s25-ultra",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&h=150&fit=crop&auto=format",
        alt: "Samsung Galaxy",
      },
      {
        handle: "apple-iphone-16-pro-max",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=150&h=150&fit=crop&auto=format",
        alt: "iPhone",
      },
      {
        handle: "sony-wh-1000xm6-headphones",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop&auto=format",
        alt: "Sony Headphones",
      },
      {
        handle: "logitech-mx-master-3s-mouse",
        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=150&h=150&fit=crop&auto=format",
        alt: "Electronics",
      },
    ],
  },
  {
    title: "Up to 60% off",
    subtitle: "Fashion",
    cta: "See more deals",
    ctaHref: "/store",
    products: [
      {
        handle: "nike-air-max-270",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop&auto=format",
        alt: "Nike Shoes",
      },
      {
        handle: "adidas-ultraboost-24",
        image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=150&h=150&fit=crop&auto=format",
        alt: "Adidas",
      },
      {
        handle: "michael-kors-leather-tote",
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=150&h=150&fit=crop&auto=format",
        alt: "Bag",
      },
      {
        handle: "ray-ban-aviator-classic",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=150&h=150&fit=crop&auto=format",
        alt: "Sunglasses",
      },
    ],
  },
  {
    title: "New Arrivals",
    subtitle: "This Week",
    cta: "Shop new arrivals",
    ctaHref: "/store",
    products: [
      {
        handle: "dyson-airwrap-complete-long",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=150&h=150&fit=crop&auto=format",
        alt: "Dyson Airwrap",
      },
      {
        handle: "apple-watch-series-10",
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e359b1?w=150&h=150&fit=crop&auto=format",
        alt: "Apple Watch",
      },
      {
        handle: "dji-mini-4-pro-drone",
        image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=150&h=150&fit=crop&auto=format",
        alt: "Drone",
      },
      {
        handle: "laneige-lip-sleeping-mask",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=150&h=150&fit=crop&auto=format",
        alt: "Beauty",
      },
    ],
  },
  {
    title: "Under 10 KWD",
    subtitle: "Budget Picks",
    cta: "Shop all deals",
    ctaHref: "/store",
    products: [
      {
        handle: "the-ordinary-aha-bha",
        image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=150&h=150&fit=crop&auto=format",
        alt: "Skincare",
      },
      {
        handle: "al-qassab-arabic-coffee-blend",
        image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=150&h=150&fit=crop&auto=format",
        alt: "Coffee",
      },
      {
        handle: "himalayan-pink-salt-grinder",
        image: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=150&h=150&fit=crop&auto=format",
        alt: "Grocery",
      },
      {
        handle: "laneige-lip-sleeping-mask",
        image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=150&h=150&fit=crop&auto=format",
        alt: "Makeup",
      },
    ],
  },
]

export default function DealTilesGrid() {
  return (
    <section
      className="py-6 px-4"
      data-testid="deal-tiles"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-white text-lg font-semibold mb-4">{"Today's Deals"}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {deals.map((deal) => (
            <div
              key={deal.title}
              className="bg-[#1F2937] rounded-lg p-4 flex flex-col hover:bg-[#2d3748] transition-colors"
            >
              <h3 className="text-white font-bold text-sm">{deal.title}</h3>
              <p className="text-orange-400 text-xs mb-3">{deal.subtitle}</p>

              {/* 2×2 product thumbnail grid */}
              <div className="grid grid-cols-2 gap-1 mb-3">
                {deal.products.map((p) => (
                  <LocalizedClientLink key={p.handle} href={`/products/${p.handle}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.alt}
                      className="w-full aspect-square object-cover rounded hover:opacity-90 transition-opacity"
                      loading="lazy"
                    />
                  </LocalizedClientLink>
                ))}
              </div>

              <LocalizedClientLink
                href={deal.ctaHref}
                className="text-blue-400 text-xs hover:text-blue-300 transition-colors mt-auto"
              >
                {deal.cta} ›
              </LocalizedClientLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
