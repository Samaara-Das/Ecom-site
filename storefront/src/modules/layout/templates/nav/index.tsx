import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import LocaleSwitcher from "@modules/common/components/locale-switcher"
import SearchBar from "@/components/search/SearchBar"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      {/* Main nav row */}
      <header className="relative bg-[#131921] border-b border-[#2d3748]">
        <nav className="content-container txt-xsmall-plus flex items-center gap-3 w-full h-14 text-small-regular">
          {/* Hamburger / side menu */}
          <div className="flex-shrink-0">
            <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
          </div>

          {/* Logo */}
          <LocalizedClientLink
            href="/"
            className="text-white font-bold text-base whitespace-nowrap hover:text-orange-400 transition-colors flex-shrink-0"
            data-testid="nav-store-link"
          >
            Kuwait Market
          </LocalizedClientLink>

          {/* Search bar — takes remaining space */}
          <div className="flex-1 min-w-0 hidden sm:block">
            <SearchBar />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-x-4 flex-shrink-0">
            <div className="hidden small:flex items-center gap-x-4">
              <LocaleSwitcher />
              <LocalizedClientLink
                className="text-white hover:text-orange-400 text-sm transition-colors whitespace-nowrap"
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="text-white hover:text-orange-400 text-sm flex gap-1 transition-colors"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>

        {/* Mobile search row */}
        <div className="sm:hidden px-3 pb-2">
          <SearchBar />
        </div>
      </header>
    </div>
  )
}
