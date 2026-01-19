import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get("code")
  const next = url.searchParams.get("next") || "/"

  if (!code) {
    return NextResponse.redirect(new URL("/?auth=missing_code", url.origin), { status: 302 })
  }

  const supabase = createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(new URL(`/?auth=error`, url.origin), { status: 302 })
  }

  return NextResponse.redirect(new URL(next, url.origin), { status: 302 })
}

