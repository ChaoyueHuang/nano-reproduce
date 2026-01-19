import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const url = new URL(req.url)
  const supabase = createClient()
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL("/", url.origin), { status: 303 })
}

