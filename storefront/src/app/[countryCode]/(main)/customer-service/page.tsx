import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Customer Service | Kuwait Marketplace",
  description: "Get help with orders, shipping, returns, and more.",
}

const SERVICE_CARDS = [
  {
    icon: "❓",
    title: "FAQ",
    description:
      "Find quick answers to common questions about orders, payments, returns, and delivery.",
    href: "/faq",
    cta: "Browse FAQ",
  },
  {
    icon: "✉️",
    title: "Contact Us",
    description:
      "Reach our support team by email, phone, or the contact form. We respond within 1 business day.",
    href: "/contact",
    cta: "Get in Touch",
  },
  {
    icon: "🚚",
    title: "Shipping Info",
    description:
      "Learn about Kuwait delivery zones, estimated times, shipping fees, and how to track your order.",
    href: "/shipping",
    cta: "View Shipping Details",
  },
  {
    icon: "↩️",
    title: "Return Policy",
    description:
      "Return most items within 14 days of delivery. Items must be unused and in original packaging.",
    href: "/faq#returns",
    cta: "Learn About Returns",
  },
]

const QUICK_STATS = [
  { label: "Avg. Response Time", value: "< 24 hrs" },
  { label: "Customer Satisfaction", value: "98%" },
  { label: "Orders Resolved", value: "50,000+" },
  { label: "Support Days", value: "Sun–Thu" },
]

export default function CustomerServicePage() {
  return (
    <div className="bg-[#131921] min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-3">Customer Service</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            We&apos;re here to make your shopping experience on Kuwait Marketplace as smooth as possible.
            Browse the resources below or reach out directly.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {QUICK_STATS.map((stat, i) => (
            <div
              key={i}
              className="bg-[#1e2a35] rounded-lg p-4 text-center"
            >
              <p className="text-2xl font-bold text-[#FF9900]">{stat.value}</p>
              <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
          {SERVICE_CARDS.map((card) => (
            <div
              key={card.title}
              className="bg-[#1e2a35] rounded-lg p-6 flex flex-col"
            >
              <div className="text-3xl mb-3">{card.icon}</div>
              <h2 className="text-lg font-semibold mb-2">{card.title}</h2>
              <p className="text-gray-400 text-sm flex-1 mb-4">
                {card.description}
              </p>
              <LocalizedClientLink
                href={card.href}
                className="inline-block bg-[#FF9900] hover:bg-[#e68a00] text-gray-900 font-semibold px-4 py-2 rounded text-sm transition-colors text-center"
              >
                {card.cta}
              </LocalizedClientLink>
            </div>
          ))}
        </div>

        {/* Direct contact */}
        <div className="bg-[#1e2a35] rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-white mb-1">
              Need urgent help?
            </p>
            <p className="text-gray-400 text-sm">
              Call us directly at{" "}
              <span className="text-[#FF9900] font-medium">+965 2200 0000</span>
              {" "}(Sunday–Thursday, 9 AM–5 PM)
            </p>
          </div>
          <LocalizedClientLink
            href="/contact"
            className="flex-shrink-0 bg-white text-gray-900 hover:bg-gray-100 font-semibold px-5 py-2.5 rounded text-sm transition-colors"
          >
            Open a Support Ticket
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
