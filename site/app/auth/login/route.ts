import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

async function getBaseUrl() {
  const h = await headers()
  const proto = h.get("x-forwarded-proto") ?? "http"
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000"

  // When dev server is bound to ::, some environments set host to [::]:3000 which is not a usable client URL.
  const normalizedHost = host.startsWith("[::]") ? host.replace("[::]", "localhost") : host
  return `${proto}://${normalizedHost}`
}

async function startOAuth(req: Request) {
  const url = new URL(req.url)
  const next = url.searchParams.get("next") || "/"
  const origin = await getBaseUrl()

  // Avoid a hard 500 page if Supabase isn't configured yet.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.redirect(new URL("/?auth=missing_supabase_env", origin), { status: 302 })
  }

  try {
    const supabase = await createRouteHandlerClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })

    if (error || !data?.url) {
      return NextResponse.redirect(new URL(`/?auth=oauth_start_failed`, origin), { status: 302 })
    }

    return NextResponse.redirect(data.url, { status: 302 })
  } catch {
    return NextResponse.redirect(new URL(`/?auth=oauth_start_failed`, origin), { status: 302 })
  }
}

export async function GET(req: Request) {
  return startOAuth(req)
}

export async function POST(req: Request) {
  // Form submission avoids SPA/RSC fetch interception and reliably follows redirects.
  return startOAuth(req)
}
