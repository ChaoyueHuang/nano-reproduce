import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const next = url.searchParams.get("next") || "/"
  const origin = url.origin

  // Avoid a hard 500 page if Supabase isn't configured yet.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.redirect(new URL("/?auth=missing_supabase_env", origin), { status: 302 })
  }

  try {
    const supabase = createClient()
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
