"use client"

import { useActionState, useState, useEffect, useRef } from "react"
import Input from "@modules/common/components/input"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import ErrorMessage from "@modules/checkout/components/error-message"
import { sendOTP, verifyOTP } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const OTPLogin = ({ setCurrentView }: Props) => {
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phone, setPhone] = useState("")
  const [resendTimer, setResendTimer] = useState(0)
  const otpInputRef = useRef<HTMLInputElement>(null)

  // Form state for phone step
  const [sendState, sendAction] = useActionState(sendOTP, null)
  // Form state for OTP verification step
  const [verifyState, verifyAction] = useActionState(verifyOTP, null)

  // Handle successful OTP send
  useEffect(() => {
    if (sendState?.success && sendState?.phone) {
      setPhone(sendState.phone)
      setStep("otp")
      setResendTimer(60) // 60 second cooldown
      // Focus OTP input
      setTimeout(() => otpInputRef.current?.focus(), 100)
    }
  }, [sendState])

  // Handle successful OTP verification
  useEffect(() => {
    if (verifyState?.success && verifyState?.customer) {
      // Redirect to account page
      window.location.href = window.location.pathname.replace("/account", "/account")
      window.location.reload()
    }
  }, [verifyState])

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleResend = async () => {
    if (resendTimer > 0) return

    const formData = new FormData()
    formData.append("phone", phone)

    const result = await sendOTP(null, formData)
    if (result.success) {
      setResendTimer(60)
    }
  }

  const handleBack = () => {
    setStep("phone")
    setPhone("")
  }

  // Phone input step
  if (step === "phone") {
    return (
      <div
        className="max-w-sm flex flex-col items-center"
        data-testid="otp-login-page"
      >
        <h1 className="text-large-semi uppercase mb-6">Sign in with Phone</h1>
        <p className="text-center text-base-regular text-ui-fg-base mb-4">
          Enter your phone number and we'll send you a verification code.
        </p>
        <form className="w-full flex flex-col" action={sendAction}>
          <div className="flex flex-col w-full gap-y-2">
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              placeholder="+965 1234 5678"
              data-testid="phone-input"
            />
          </div>
          <ErrorMessage error={sendState?.error} data-testid="otp-send-error" />
          <SubmitButton className="w-full mt-6" data-testid="send-otp-button">
            Send Verification Code
          </SubmitButton>
        </form>
        <span className="text-center text-ui-fg-base text-small-regular mt-6">
          Prefer email?{" "}
          <button
            onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
            className="underline"
          >
            Sign in with email
          </button>
        </span>
        <span className="text-center text-ui-fg-base text-small-regular mt-2">
          Don't have an account?{" "}
          <button
            onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
            className="underline"
          >
            Register
          </button>
        </span>
      </div>
    )
  }

  // OTP verification step
  return (
    <div
      className="max-w-sm flex flex-col items-center"
      data-testid="otp-verify-page"
    >
      <h1 className="text-large-semi uppercase mb-6">Enter Verification Code</h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-4">
        We sent a 6-digit code to{" "}
        <span className="font-semibold">{phone}</span>
      </p>
      <form className="w-full flex flex-col" action={verifyAction}>
        <input type="hidden" name="phone" value={phone} />
        <div className="flex flex-col w-full gap-y-2">
          <Input
            ref={otpInputRef}
            label="Verification Code"
            name="code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            required
            autoComplete="one-time-code"
            placeholder="123456"
            data-testid="otp-code-input"
          />
        </div>
        <ErrorMessage error={verifyState?.error} data-testid="otp-verify-error" />
        <SubmitButton className="w-full mt-6" data-testid="verify-otp-button">
          Verify & Sign In
        </SubmitButton>
      </form>
      <div className="flex flex-col items-center gap-2 mt-6">
        <span className="text-center text-ui-fg-base text-small-regular">
          Didn't receive the code?{" "}
          {resendTimer > 0 ? (
            <span className="text-ui-fg-subtle">
              Resend in {resendTimer}s
            </span>
          ) : (
            <button
              onClick={handleResend}
              className="underline"
              type="button"
            >
              Resend code
            </button>
          )}
        </span>
        <button
          onClick={handleBack}
          className="text-small-regular underline text-ui-fg-subtle"
          type="button"
        >
          Use a different phone number
        </button>
      </div>
    </div>
  )
}

export default OTPLogin
