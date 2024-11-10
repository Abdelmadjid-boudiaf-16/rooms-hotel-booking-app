import { ReactNode } from "react"

const AuthLayout = ({children}:{children:ReactNode}) => {
  return (
      <div className="flex items-center justify-center min-h-screen py-10">{children}</div>
  )
}

export default AuthLayout