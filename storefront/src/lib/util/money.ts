import { isEmpty } from "./isEmpty"

type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "en-US",
}: ConvertToLocaleParams) => {
  if (!currency_code || isEmpty(currency_code)) {
    return amount.toString()
  }

  // Medusa stores amounts as integers in the smallest currency unit (e.g. fils for KWD, cents for USD).
  // Intl.NumberFormat expects the major unit, so divide by 10^decimalDigits.
  const decimalDigits = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency_code,
  }).resolvedOptions().maximumFractionDigits

  const majorAmount = amount / Math.pow(10, decimalDigits)

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency_code,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(majorAmount)
}
