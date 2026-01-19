import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }

  // Ensure URL is the project origin (e.g. https://xyz.supabase.co), not a nested path.
  const supabaseUrl = new URL(url).origin

  // In newer Next.js versions, `cookies()` is async.
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        // setAll() is only allowed in Route Handlers / Server Actions. In Server Components it throws.
        try {
          for (const { name, value, options } of cookiesToSet) cookieStore.set(name, value, options)
        } catch {
          // Ignore if called from a Server Component.
        }
      },
    },
  })
}
