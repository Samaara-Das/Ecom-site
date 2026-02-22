import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shipping Info | Kuwait Marketplace",
  description: "Kuwait delivery zones, estimated times, fees, and tracking information.",
}

const DELIVERY_ZONES = [
  {
    zone: "Kuwait City (Capital Governorate)",
    time: "1–2 business days",
    fee: "KWD 1.500",
    express: "Same-day (order before 12 PM)",
  },
  {
    zone: "Hawalli Governorate",
    time: "1–2 business days",
    fee: "KWD 1.500",
    express: "Next-day",
  },
  {
    zone: "Al Farwaniyah Governorate",
    time: "2–3 business days",
    fee: "KWD 1.500",
    express: "Next-day",
  },
  {
    zone: "Al Ahmadi Governorate",
    time: "2–3 business days",
    fee: "KWD 1.500",
    express: "2-day",
  },
  {
    zone: "Al Jahra Governorate",
    time: "2–3 business days",
    fee: "KWD 1.500",
    express: "2-day",
  },
  {
    zone: "Mubarak Al-Kabeer Governorate",
    time: "2–3 business days",
    fee: "KWD 1.500",
    express: "Next-day",
  },
]

export default function ShippingPage() {
  return (
    <div className="bg-[#131921] min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Shipping Information</h1>
        <p className="text-gray-400 mb-10">
          Everything you need to know about delivery across Kuwait.
        </p>

        {/* Key info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-[#1e2a35] rounded-lg p-5 text-center">
            <div className="text-3xl mb-2">🚚</div>
            <p className="font-semibold text-[#FF9900]">Standard Shipping</p>
            <p className="text-2xl font-bold mt-1">KWD 1.500</p>
            <p className="text-gray-400 text-xs mt-1">Per order, all governorates</p>
          </div>
          <div className="bg-[#1e2a35] rounded-lg p-5 text-center">
            <div className="text-3xl mb-2">🎁</div>
            <p className="font-semibold text-[#FF9900]">Free Shipping</p>
            <p className="text-2xl font-bold mt-1">KWD 50+</p>
            <p className="text-gray-400 text-xs mt-1">Orders over KWD 50 ship free</p>
          </div>
          <div className="bg-[#1e2a35] rounded-lg p-5 text-center">
            <div className="text-3xl mb-2">⚡</div>
            <p className="font-semibold text-[#FF9900]">Express Delivery</p>
            <p className="text-2xl font-bold mt-1">KWD 3.000</p>
            <p className="text-gray-400 text-xs mt-1">Same-day (Kuwait City, before 12 PM)</p>
          </div>
        </div>

        {/* Delivery zones table */}
        <div className="bg-[#1e2a35] rounded-lg overflow-hidden mb-10">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-[#FF9900]">
              Delivery Zones
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400">
                  <th className="text-left px-6 py-3 font-medium">Governorate</th>
                  <th className="text-left px-6 py-3 font-medium">Standard Time</th>
                  <th className="text-left px-6 py-3 font-medium">Standard Fee</th>
                  <th className="text-left px-6 py-3 font-medium">Express</th>
                </tr>
              </thead>
              <tbody>
                {DELIVERY_ZONES.map((zone, i) => (
                  <tr
                    key={i}
                    className={`border-b border-gray-700/50 ${
                      i % 2 === 0 ? "bg-[#1a2530]" : ""
                    }`}
                  >
                    <td className="px-6 py-3 font-medium text-white">
                      {zone.zone}
                    </td>
                    <td className="px-6 py-3 text-gray-300">{zone.time}</td>
                    <td className="px-6 py-3 text-gray-300">{zone.fee}</td>
                    <td className="px-6 py-3 text-gray-300">{zone.express}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* How tracking works */}
        <div className="bg-[#1e2a35] rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#FF9900] mb-4">
            Tracking Your Order
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 bg-[#FF9900] text-gray-900 rounded-full flex items-center justify-center font-bold">1</div>
              <p className="font-medium">Order Confirmed</p>
              <p className="text-gray-400">You receive an order confirmation email/SMS with your order ID.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 bg-[#FF9900] text-gray-900 rounded-full flex items-center justify-center font-bold">2</div>
              <p className="font-medium">Order Shipped</p>
              <p className="text-gray-400">Once dispatched, you receive a tracking number via SMS and email.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 bg-[#FF9900] text-gray-900 rounded-full flex items-center justify-center font-bold">3</div>
              <p className="font-medium">Track Live</p>
              <p className="text-gray-400">Use the tracking number on our website or courier portal. Updates every 2–4 hours.</p>
            </div>
          </div>
        </div>

        {/* International note */}
        <div className="bg-[#1e2a35] border border-yellow-500/30 rounded-lg p-5 text-sm">
          <p className="font-semibold text-yellow-400 mb-1">
            📦 International Shipping
          </p>
          <p className="text-gray-400">
            We currently ship within Kuwait only. International shipping to GCC countries and beyond is planned for Q3 2026. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  )
}
