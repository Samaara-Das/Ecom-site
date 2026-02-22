import { Metadata } from "next"

import HeroBannerCarousel from "@/components/home/HeroBannerCarousel"
import CategoryShortcuts from "@/components/home/CategoryShortcuts"
import DealTilesGrid from "@/components/home/DealTilesGrid"
import ProductCarousel from "@/components/home/ProductCarousel"
import VendorSpotlight from "@/components/home/VendorSpotlight"

export const metadata: Metadata = {
  title: "Kuwait Marketplace — Shop Electronics, Fashion, Beauty & More",
  description:
    "Discover quality products from 12+ trusted vendors across Kuwait. Shop Samsung, Apple, Nike, and local Kuwaiti brands. Fast delivery, KWD pricing.",
}

export default async function Home() {
  return (
    <div className="bg-[#131921] min-h-screen">
      {/* Section B — Hero Carousel */}
      <HeroBannerCarousel />

      {/* Section C — Category Shortcuts */}
      <CategoryShortcuts />

      {/* Section D — Deal Tiles */}
      <DealTilesGrid />

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="border-t border-[#2d3748]" />
      </div>

      {/* Section E1 — Bestsellers in Electronics */}
      <ProductCarousel
        title="Bestsellers in Electronics"
        category="electronics"
        seeAllHref="/store"
      />

      {/* Section E2 — Fashion Picks */}
      <ProductCarousel
        title="Fashion Picks"
        category="fashion"
        seeAllHref="/store"
      />

      {/* Section F — Vendor Spotlight */}
      <VendorSpotlight />

      {/* Section G — Deals of the Day */}
      <ProductCarousel
        title="Deals of the Day"
        category="deals"
        seeAllHref="/store"
      />

      {/* Bottom padding */}
      <div className="pb-16" />
    </div>
  )
}
