import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

async function getBaseUrl() {
  const h = await headers()
  const proto = h.get("x-forwarded-proto") ?? "http"
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000"
  return `${proto}://${host}`
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const next = url.searchParams.get("next") || "/"
  const origin = await getBaseUrl()

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: "Missing Supabase env vars." }, { status: 500 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  })

  if (error || !data?.url) {
    return NextResponse.json({ error: error?.message || "Failed to start OAuth flow." }, { status: 500 })
  }

  return NextResponse.json({ url: data.url })
}

