"use client"

import { useState } from "react"

const FAQ_ITEMS = [
  {
    question: "How do I place an order?",
    answer:
      "Browse our store, add items to your cart, and proceed to checkout. You'll need to create an account or log in to complete your purchase. We accept credit/debit cards and Kuwait KNET.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept Visa, Mastercard, American Express, and Kuwait KNET. All transactions are secured with 256-bit SSL encryption. Payment is charged at the time of order confirmation.",
  },
  {
    question: "What is the return policy?",
    answer:
      "You can return most items within 14 days of delivery for a full refund. Items must be unused and in original packaging. Some categories (food, personal care) are non-returnable for hygiene reasons. Contact support to initiate a return.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Kuwait City orders typically arrive in 1–2 business days. Other governorates take 2–3 business days. Express same-day delivery is available for select areas in Kuwait City. You'll receive a tracking number once your order ships.",
  },
  {
    question: "Which areas do you deliver to?",
    answer:
      "We deliver to all 6 governorates of Kuwait: Capital, Hawalli, Al Farwaniyah, Al Ahmadi, Al Jahra, and Mubarak Al-Kabeer. International shipping is not currently available.",
  },
  {
    question: "How much does shipping cost?",
    answer:
      "Standard shipping within Kuwait is KWD 1.500 per order. Orders over KWD 50 qualify for free shipping. Express same-day delivery is KWD 3.000 for eligible Kuwait City addresses.",
  },
  {
    question: "How do I track my order?",
    answer:
      "After your order ships, you'll receive an SMS and email with your tracking number. You can also track your order from your account dashboard under 'My Orders'. Tracking updates every 2–4 hours.",
  },
  {
    question: "Can I cancel or modify my order?",
    answer:
      "Orders can be cancelled or modified within 1 hour of placement, before they are processed for shipping. Contact our support team immediately at +965 2200 0000 or support@kuwaitmarket.com.",
  },
  {
    question: "How do I apply to become a seller?",
    answer:
      "Visit our 'Become a Seller' page and complete the vendor application form. Our team reviews applications within 2–3 business days. Approved sellers pay a 15% commission on sales. A valid Commercial Registration (CR) number is required.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "You can reach us by email at support@kuwaitmarket.com, by phone at +965 2200 0000 (Sunday–Thursday, 9 AM–5 PM), or through the Contact Us form on our website. We aim to respond within 1 business day.",
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="bg-[#131921] min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
        <p className="text-gray-400 mb-10">
          Find answers to the most common questions about shopping, shipping, and selling on Kuwait Marketplace.
        </p>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => (
            <div
              key={index}
              className="bg-[#1e2a35] rounded-lg overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#243240] transition-colors"
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              >
                <span className="font-medium text-white pr-4">
                  {item.question}
                </span>
                <span
                  className={`text-[#FF9900] text-xl flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  ▾
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-[#1e2a35] rounded-lg p-6 text-center">
          <p className="text-gray-400 text-sm mb-3">
            Can&apos;t find what you&apos;re looking for?
          </p>
          <a
            href="./contact"
            className="inline-block bg-[#FF9900] hover:bg-[#e68a00] text-gray-900 font-semibold px-6 py-2.5 rounded transition-colors text-sm"
          >
            Contact Our Support Team
          </a>
        </div>
      </div>
    </div>
  )
}
