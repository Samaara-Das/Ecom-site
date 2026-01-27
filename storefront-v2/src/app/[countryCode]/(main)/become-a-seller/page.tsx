import { Metadata } from "next"
import VendorRegistrationForm from "@modules/vendor/components/registration-form"

export const metadata: Metadata = {
  title: "Become a Seller | Kuwait Marketplace",
  description:
    "Join Kuwait Marketplace as a seller and reach thousands of customers across Kuwait. Apply now to start selling your products.",
}

export default function BecomeASellerPage() {
  return (
    <div className="py-12">
      <div className="content-container">
        <VendorRegistrationForm />
      </div>
    </div>
  )
}
