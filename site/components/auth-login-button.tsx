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
      onClick={async () => {
        if (isLoading) return
        setIsLoading(true)
        try {
          const res = await fetch("/auth/login-url", { method: "GET" })
          const data = (await res.json().catch(() => null)) as any
          if (!res.ok) throw new Error(data?.error || `Failed (${res.status})`)
          const url = typeof data?.url === "string" ? data.url : ""
          if (!url) throw new Error("Missing redirect URL.")
          window.location.assign(url)
        } catch {
          setIsLoading(false)
        }
      }}
    >
      {isLoading ? "Redirecting..." : "Sign in with Google"}
    </Button>
  )
}

