import { redirect } from "next/navigation"

type Props = {
  params: Promise<{ countryCode: string }>
}

export default async function VendorPage(props: Props) {
  const params = await props.params
  redirect(`/${params.countryCode}/vendor/dashboard`)
}
