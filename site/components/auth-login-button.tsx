"use client"

import { Button } from "@/components/ui/button"

export default function AuthLoginButton() {
  return (
    <Button
      type="button"
      variant="outline"
      className="bg-transparent"
      onClick={() => {
        // Force a full navigation so the OAuth redirect chain isn't blocked by fetch/CORS.
        window.location.assign("/auth/login")
      }}
    >
      Sign in with Google
    </Button>
  )
}

