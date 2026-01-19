import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get("code")
  const next = url.searchParams.get("next") || "/"

  if (!code) {
    return NextResponse.redirect(new URL("/?auth=missing_code", url.origin), { status: 302 })
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.redirect(new URL("/?auth=missing_supabase_env", url.origin), { status: 302 })
  }

  try {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return NextResponse.redirect(new URL(`/?auth=exchange_failed`, url.origin), { status: 302 })
    }
  } catch {
    return NextResponse.redirect(new URL(`/?auth=exchange_failed`, url.origin), { status: 302 })
  }

  return NextResponse.redirect(new URL(next, url.origin), { status: 302 })
}
