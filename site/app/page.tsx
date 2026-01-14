import Hero from "@/components/hero"
import ImageGenerator from "@/components/image-generator"
import Features from "@/components/features"
import Showcase from "@/components/showcase"
import Testimonials from "@/components/testimonials"
import FAQ from "@/components/faq"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="dark">
      <main className="min-h-screen bg-background">
        <Hero />
        <ImageGenerator />
        <Features />
        <Showcase />
        <Testimonials />
        <FAQ />
        <Footer />
      </main>
    </div>
  )
}
