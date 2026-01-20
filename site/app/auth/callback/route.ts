import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

async function getBaseUrl(reqUrl: string) {
  const h = await headers()
  const proto = h.get("x-forwarded-proto") ?? "http"
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? new URL(reqUrl).host
  const normalizedHost = host.startsWith("[::]") ? host.replace("[::]", "localhost") : host
  return `${proto}://${normalizedHost}`
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get("code")
  const next = url.searchParams.get("next") || "/"
  const origin = await getBaseUrl(req.url)

  if (!code) {
    return NextResponse.redirect(new URL("/?auth=missing_code", origin), { status: 302 })
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.redirect(new URL("/?auth=missing_supabase_env", origin), { status: 302 })
  }

  try {
    const supabase = await createRouteHandlerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      const msg = encodeURIComponent(String(error.message || "exchange_failed").slice(0, 120))
      return NextResponse.redirect(new URL(`/?auth=exchange_failed&msg=${msg}`, origin), { status: 302 })
    }
  } catch {
    return NextResponse.redirect(new URL(`/?auth=exchange_failed&msg=exception`, origin), { status: 302 })
  }

  return NextResponse.redirect(new URL(next, origin), { status: 302 })
}
