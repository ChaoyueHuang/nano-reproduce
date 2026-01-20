"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function AuthLoginButton() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Button
      type="button"
      variant="outline"
      className="bg-transparent"
      disabled={isLoading}
      onClick={() => {
        // Force a real document navigation (avoid Next/RSC fetch interception of redirects).
        setIsLoading(true)
        window.location.href = "/auth/login"
      }}
    >
      {isLoading ? "Redirecting..." : "Sign in with Google"}
    </Button>
  )
}

