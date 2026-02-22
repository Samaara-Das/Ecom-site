"use client"

import { useState } from "react"

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="bg-[#131921] min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
        <p className="text-gray-400 mb-10">
          Our support team is here to help. Reach out anytime.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact info */}
          <div className="space-y-6">
            <div className="bg-[#1e2a35] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-[#FF9900] mb-4">
                Get in Touch
              </h2>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-[#FF9900] text-lg">✉</span>
                  <div>
                    <p className="font-medium text-white">Email Support</p>
                    <p className="text-gray-400">support@kuwaitmarket.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#FF9900] text-lg">📞</span>
                  <div>
                    <p className="font-medium text-white">Phone</p>
                    <p className="text-gray-400">+965 2200 0000</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#FF9900] text-lg">🕒</span>
                  <div>
                    <p className="font-medium text-white">Business Hours</p>
                    <p className="text-gray-400">Sunday – Thursday</p>
                    <p className="text-gray-400">9:00 AM – 5:00 PM (AST)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#FF9900] text-lg">📍</span>
                  <div>
                    <p className="font-medium text-white">Head Office</p>
                    <p className="text-gray-400">
                      Al-Hamra Tower, 17th Floor
                      <br />
                      Kuwait City, Kuwait
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-[#1e2a35] rounded-lg p-6">
            {sent ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-[#FF9900] mb-2">
                  Message Sent!
                </h3>
                <p className="text-gray-400 text-sm">
                  We&apos;ll get back to you within 1–2 business days.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-[#FF9900] mb-4">
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className="w-full bg-[#131921] border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FF9900]"
                      placeholder="Ahmed Al-Rashid"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      className="w-full bg-[#131921] border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FF9900]"
                      placeholder="ahmed@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, message: e.target.value }))
                      }
                      className="w-full bg-[#131921] border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FF9900] resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#FF9900] hover:bg-[#e68a00] text-gray-900 font-semibold py-2.5 rounded transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
