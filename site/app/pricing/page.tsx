import Link from "next/link"
import { Check, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const PAYPAL_CHECKOUT_URL = "https://www.paypal.com/ncp/payment/GEXYDPY6PSG8W"

const tiers = [
  {
    name: "Free",
    price: "$0",
    tagline: "Try Nano Banana with basic limits.",
    cta: { label: "Start Free", href: "/#generator" },
    highlight: false,
    features: ["Limited generations", "Single image input", "Community support"],
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    tagline: "For creators who generate daily.",
    cta: { label: "Upgrade with PayPal", href: PAYPAL_CHECKOUT_URL },
    highlight: true,
    features: ["Higher generation limits", "Faster queue", "Priority support", "Commercial usage"],
  },
  {
    name: "Team",
    price: "Custom",
    tagline: "For teams and agencies.",
    cta: { label: "Contact Sales", href: "mailto:contact@nanobananareplica.online" },
    highlight: false,
    features: ["Shared workspace", "Team billing", "SLA & onboarding"],
  },
]

export default function PricingPage() {
  return (
    <div className="dark">
      <main className="min-h-screen bg-background">
        <section className="container mx-auto px-4 py-16">
          <div className="mb-10 flex items-center justify-between gap-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              ← Back to home
            </Link>
            <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20">
              Pricing
            </Badge>
          </div>

          <div className="mx-auto max-w-4xl text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Simple plans for Nano Banana</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">Choose your plan</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Start free, upgrade anytime. Pay securely via PayPal for the Pro plan.
            </p>
          </div>

          <div className="mx-auto max-w-6xl grid lg:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <Card
                key={tier.name}
                className={`p-6 bg-card border-border ${tier.highlight ? "border-primary/50" : ""}`}
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground">{tier.name}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{tier.tagline}</p>
                  </div>
                  {tier.highlight ? (
                    <Badge className="bg-primary/10 text-primary border border-primary/20">Most Popular</Badge>
                  ) : null}
                </div>

                <div className="mb-6">
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                    {"period" in tier ? <span className="text-muted-foreground pb-1">{tier.period}</span> : null}
                  </div>
                </div>

                <div className="mb-6">
                  {tier.cta.href.startsWith("http") ? (
                    <Button asChild size="lg" className="w-full">
                      <a href={tier.cta.href} target="_blank" rel="noreferrer">
                        {tier.cta.label}
                      </a>
                    </Button>
                  ) : (
                    <Button asChild size="lg" className="w-full">
                      <Link href={tier.cta.href}>{tier.cta.label}</Link>
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  {tier.features.map((f) => (
                    <div key={f} className="flex items-start gap-3 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5" />
                      <span className="text-muted-foreground">{f}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          <div className="mx-auto max-w-4xl mt-14">
            <Card className="p-6 bg-card border-border">
              <h3 className="text-xl font-semibold text-foreground mb-2">Notes</h3>
              <p className="text-sm text-muted-foreground">
                Purchases are processed by PayPal. After payment, you may need to sign in and we will activate Pro on
                your account. If activation doesn&apos;t happen automatically, contact support with your PayPal receipt.
              </p>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}

