import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import AuthControls from "@/components/auth-controls"
import Link from "next/link"

export default async function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Banana decoration */}
      <div className="absolute top-20 left-10 text-6xl opacity-10 rotate-12">🍌</div>
      <div className="absolute bottom-20 right-20 text-8xl opacity-5 -rotate-45">🍌</div>

      <div className="container mx-auto px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary mb-8">
            <span className="text-xl">🍌</span>
            <span>The AI model that outperforms competitors</span>
            <ArrowRight className="h-4 w-4" />
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance">Nano Banana</h1>

          <p className="text-xl sm:text-2xl text-muted-foreground mb-8 text-pretty max-w-3xl mx-auto leading-relaxed">
            Transform any image with simple text prompts. Experience advanced AI-powered editing with consistent
            character preservation and scene blending.
          </p>

          <div className="mb-6">
            <AuthControls />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="text-lg px-8 bg-primary hover:bg-primary/90">
              <Link href="/#generator">Start Editing</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 bg-transparent">
              <Link href="/pricing">Pricing</Link>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              One-shot editing
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              Multi-image support
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              Natural language
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
