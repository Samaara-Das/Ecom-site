"use client"

import { useState } from "react"

import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"
import OTPLogin from "@modules/account/components/otp-login"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
  PHONE_OTP = "phone-otp",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState<LOGIN_VIEW>(LOGIN_VIEW.SIGN_IN)

  return (
    <div className="w-full flex justify-start px-8 py-8">
      {currentView === LOGIN_VIEW.SIGN_IN && (
        <Login setCurrentView={setCurrentView} />
      )}
      {currentView === LOGIN_VIEW.REGISTER && (
        <Register setCurrentView={setCurrentView} />
      )}
      {currentView === LOGIN_VIEW.PHONE_OTP && (
        <OTPLogin setCurrentView={setCurrentView} />
      )}
    </div>
  )
}

export default LoginTemplate
