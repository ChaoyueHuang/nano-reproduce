import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import AuthLoginButton from "@/components/auth-login-button"

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
    return (
      <div className="flex items-center justify-center">
        <AuthLoginButton />
        <noscript>
          <Button asChild variant="outline" className="bg-transparent">
            <a href="/auth/login">Sign in with Google</a>
          </Button>
        </noscript>
      </div>
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
