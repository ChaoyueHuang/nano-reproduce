import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }

  // Ensure URL is the project origin (e.g. https://xyz.supabase.co), not a nested path.
  const supabaseUrl = new URL(url).origin
  return { supabaseUrl, anonKey }
}

// Use in Server Components where setting cookies isn't allowed.
export async function createServerComponentClient() {
  const cookieStore = await cookies()
  const { supabaseUrl, anonKey } = getSupabaseConfig()

  return createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(_cookiesToSet) {
        // Server Components can't mutate cookies.
      },
    },
  })
}

// Use in Route Handlers / Server Actions where cookies can be set.
export async function createRouteHandlerClient() {
  const cookieStore = await cookies()
  const { supabaseUrl, anonKey } = getSupabaseConfig()

  return createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) cookieStore.set(name, value, options)
      },
    },
  })
}

