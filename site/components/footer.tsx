export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <span>🍌</span>
            <span>Nano Banana</span>
          </div>

          <div className="text-sm text-muted-foreground text-center">
            <p>Transform any image with simple text prompts</p>
            <p className="mt-2">© 2026 Nano Banana. All rights reserved.</p>
          </div>

          <div className="flex gap-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
