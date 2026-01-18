"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

async function downscaleImage(file: File): Promise<File> {
  // Keep requests small to reduce serverless timeouts (Vercel) and model latency.
  if (!file.type.startsWith("image/")) return file
  if (file.size <= 1_500_000) return file // ~1.5MB

  const img = new Image()
  img.decoding = "async"

  const url = URL.createObjectURL(file)
  try {
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error("Failed to load image."))
      img.src = url
    })

    const maxDim = 1024
    const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
    const w = Math.max(1, Math.round(img.width * scale))
    const h = Math.max(1, Math.round(img.height * scale))

    const canvas = document.createElement("canvas")
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d")
    if (!ctx) return file

    ctx.drawImage(img, 0, 0, w, h)

    const blob: Blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Failed to encode image."))),
        "image/jpeg",
        0.9,
      )
    })

    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" })
  } finally {
    URL.revokeObjectURL(url)
  }
}

export default function ImageGenerator() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedImagePreviewUrl, setSelectedImagePreviewUrl] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [outputImages, setOutputImages] = useState<string[]>([])

  useEffect(() => {
    if (!selectedFile) {
      setSelectedImagePreviewUrl(null)
      return
    }

    const url = URL.createObjectURL(selectedFile)
    setSelectedImagePreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [selectedFile])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("Image too large. Max size is 10MB.")
        return
      }

      setError(null)
      setSelectedFile(file)
    }
  }

  const handleGenerate = async () => {
    if (!selectedFile || !prompt.trim() || isGenerating) return

    setIsGenerating(true)
    setError(null)

    try {
      const imageFile = await downscaleImage(selectedFile)

      const form = new FormData()
      form.set("prompt", prompt.trim())
      form.set("image", imageFile)

      const res = await fetch("/api/generate", {
        method: "POST",
        body: form,
      })

      const data = (await res.json().catch(() => null)) as any
      if (!res.ok) {
        throw new Error(data?.error || `Request failed (${res.status})`)
      }

      const images = Array.isArray(data?.images) ? data.images.filter((u: unknown) => typeof u === "string") : []
      if (!images.length) throw new Error("No image returned from API.")

      setOutputImages(images)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate image.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section id="generator" className="container mx-auto px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">Get Started</h2>
          <p className="text-xl text-muted-foreground text-pretty">
            Experience the power of AI-powered natural language image editing
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload & Prompt Section */}
          <Card className="p-6 bg-card border-border">
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Prompt Engine
            </h3>

            <div className="space-y-6">
              <div>
                <Label htmlFor="image-upload" className="text-base mb-2 block">
                  Reference Image
                </Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <input
                    ref={fileInputRef}
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {selectedImagePreviewUrl ? (
                    <div className="space-y-4">
                      <img
                        src={selectedImagePreviewUrl || "/placeholder.svg"}
                        alt="Uploaded"
                        className="max-h-48 mx-auto rounded-lg"
                      />
                      <div className="flex items-center justify-center gap-3">
                        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                          Replace Image
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setSelectedFile(null)
                            setOutputImages([])
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-muted-foreground">Upload a reference image (max 10MB).</p>
                      <Button type="button" onClick={() => fileInputRef.current?.click()}>
                        Add Image
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="prompt" className="text-base mb-2 block">
                  Main Prompt
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe your desired edit... e.g., 'place the person in a snowy mountain landscape'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-24 resize-none"
                />
              </div>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-lg"
                disabled={!selectedFile || !prompt.trim() || isGenerating}
                onClick={handleGenerate}
              >
                {isGenerating ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner />
                    Generating...
                  </span>
                ) : (
                  "Generate Now"
                )}
              </Button>
            </div>
          </Card>

          {/* Output Section */}
          <Card className="p-6 bg-card border-border">
            <h3 className="text-2xl font-semibold mb-6">Output Gallery</h3>

            {outputImages.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {outputImages.map((url, idx) => (
                  <a key={idx} href={url} target="_blank" rel="noreferrer" className="block">
                    <img src={url || "/placeholder.svg"} alt={`Output ${idx + 1}`} className="w-full rounded-lg border border-border" />
                  </a>
                ))}
              </div>
            ) : (
              <div className="h-[400px] flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                <div className="text-center">
                  <div className="text-6xl mb-4">🍌</div>
                  <p className="text-muted-foreground mb-2">Ready for instant generation</p>
                  <p className="text-sm text-muted-foreground">Upload an image and enter a prompt to generate</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  )
}
