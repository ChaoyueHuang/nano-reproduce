import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const url = new URL(req.url)
  const supabase = await createRouteHandlerClient()
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL("/", url.origin), { status: 303 })
}
