import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const showcaseItems = [
  {
    title: "Ultra-Fast Mountain Generation",
    description: "Created in 0.8 seconds with optimized neural engine",
    image: "/snowy-mountain-landscape.png",
  },
  {
    title: "Instant Garden Creation",
    description: "Complex scene rendered in milliseconds",
    image: "/beautiful-garden-with-flowers.jpg",
  },
  {
    title: "Real-time Beach Synthesis",
    description: "Photorealistic results at lightning speed",
    image: "/tropical-beach-sunset.png",
  },
  {
    title: "Rapid Aurora Generation",
    description: "Advanced effects processed instantly",
    image: "/northern-lights-aurora-sky.jpg",
  },
]

export default function Showcase() {
  return (
    <section id="showcase" className="container mx-auto px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-sm text-primary mb-4">
            <span>🍌</span>
            <span>Nano Banana Speed</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">Showcase</h2>
          <p className="text-xl text-muted-foreground text-pretty">Lightning-Fast AI Creations</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {showcaseItems.map((item, index) => (
            <Card key={index} className="overflow-hidden hover:border-primary/50 transition-colors bg-card">
              <div className="aspect-video overflow-hidden">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-6">Experience the power of Nano Banana yourself</p>
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Try Nano Banana Generator
          </Button>
        </div>
      </div>
    </section>
  )
}
