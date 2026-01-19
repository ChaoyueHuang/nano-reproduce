import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"

export default async function AuthControls() {
  let userEmail: string | null = null

  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    userEmail = data.user?.email ?? null
  } catch {
    // Supabase not configured; keep UI minimal.
  }

  if (!userEmail) {
    // Use a plain <a> so it works even if client JS doesn't hydrate.
    // Next/React interception can trigger CORS issues on OAuth redirects.
    return (
      <Button asChild variant="outline" className="bg-transparent">
        <a href="/auth/login">Sign in with Google</a>
      </Button>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
      <span className="text-sm text-muted-foreground">Signed in as {userEmail}</span>
      <form action="/auth/logout" method="post">
        <Button type="submit" variant="outline" className="bg-transparent">
          Sign out
        </Button>
      </form>
    </div>
  )
}
