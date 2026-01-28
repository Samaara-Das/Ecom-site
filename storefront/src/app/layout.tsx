import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import "styles/globals.css"
import { isRtlLocale, type Locale } from "@/i18n/config"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const locale = (await getLocale()) as Locale
  const messages = await getMessages()
  const dir = isRtlLocale(locale) ? "rtl" : "ltr"

  return (
    <html lang={locale} dir={dir} data-mode="light">
      <head>
        {/* Google Fonts - Inter and Noto Sans Arabic */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={dir === "rtl" ? "font-arabic" : ""}>
        <NextIntlClientProvider messages={messages}>
          <main className="relative">{props.children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
