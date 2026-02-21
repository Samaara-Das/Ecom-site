"use client"

import { useState, useEffect, useCallback } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface Banner {
  bg: string
  headline: string
  sub: string
  cta: string
  ctaHref: string
  emoji: string
}

const banners: Banner[] = [
  {
    bg: "#FF9900",
    headline: "Up to 50% off Electronics",
    sub: "Samsung, Apple, Sony & more — limited-time deals",
    cta: "Shop Now",
    ctaHref: "/store",
    emoji: "📱",
  },
  {
    bg: "#146EB4",
    headline: "Ramadan Mega Sale",
    sub: "Free delivery on all orders above 10 KWD",
    cta: "See Deals",
    ctaHref: "/store",
    emoji: "🌙",
  },
  {
    bg: "#1B7F2A",
    headline: "Fresh & Organic Groceries",
    sub: "Premium Ajwa dates, saffron, pure honey — delivered today",
    cta: "Shop Grocery",
    ctaHref: "/store",
    emoji: "🌿",
  },
  {
    bg: "#8B008B",
    headline: "Designer Fashion Arrivals",
    sub: "Nike, Adidas, Ray-Ban & exclusive styles",
    cta: "Browse Fashion",
    ctaHref: "/store",
    emoji: "👗",
  },
  {
    bg: "#C7511F",
    headline: "Beauty Bestsellers",
    sub: "Charlotte Tilbury, La Mer, Dyson Airwrap — all in stock",
    cta: "Shop Beauty",
    ctaHref: "/store",
    emoji: "✨",
  },
]

export default function HeroBannerCarousel() {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % banners.length)
  }, [])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + banners.length) % banners.length)
  }, [])

  useEffect(() => {
    const id = setInterval(next, 4000)
    return () => clearInterval(id)
  }, [next])

  const banner = banners[current]

  return (
    <div
      className="relative w-full overflow-hidden"
      data-testid="hero-carousel"
      style={{ backgroundColor: banner.bg, transition: "background-color 0.5s ease" }}
    >
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Text side */}
        <div className="text-white max-w-xl">
          <p className="text-sm uppercase tracking-widest opacity-80 mb-2">Kuwait Marketplace</p>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight mb-3">
            {banner.headline}
          </h1>
          <p className="text-base sm:text-lg opacity-90 mb-6">{banner.sub}</p>
          <LocalizedClientLink
            href={banner.ctaHref}
            className="inline-block bg-white text-gray-900 font-bold px-8 py-3 rounded-lg hover:bg-yellow-100 transition-colors"
            data-testid="hero-cta"
          >
            {banner.cta}
          </LocalizedClientLink>
        </div>

        {/* Emoji / decorative side */}
        <div className="text-[100px] sm:text-[140px] select-none opacity-80">
          {banner.emoji}
        </div>
      </div>

      {/* Left / right arrows */}
      <button
        onClick={prev}
        aria-label="Previous banner"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
        data-testid="carousel-prev"
      >
        ‹
      </button>
      <button
        onClick={next}
        aria-label="Next banner"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
        data-testid="carousel-next"
      >
        ›
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-2 h-2 rounded-full transition-all ${
              i === current ? "bg-white w-4" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
