import { NextResponse } from "next/server"

function safePrefix(value: string, n: number) {
  return value.length <= n ? value : value.slice(0, n)
}

function safeSuffix(value: string, n: number) {
  return value.length <= n ? value : value.slice(-n)
}

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token") || ""
  const expected = process.env.SUPABASE_DIAG_TOKEN || ""

  // Avoid exposing config publicly; enable only with a token.
  if (!expected || token !== expected) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  let origin = ""
  try {
    origin = rawUrl ? new URL(rawUrl).origin : ""
  } catch {
    origin = ""
  }

  return NextResponse.json({
    vercelEnv: process.env.VERCEL_ENV || null,
    vercelUrl: process.env.VERCEL_URL || null,
    supabaseUrlOrigin: origin || null,
    anonKeyLength: anonKey ? anonKey.length : 0,
    anonKeyPrefix: anonKey ? safePrefix(anonKey, 12) : null,
    anonKeySuffix: anonKey ? safeSuffix(anonKey, 6) : null,
  })
}

