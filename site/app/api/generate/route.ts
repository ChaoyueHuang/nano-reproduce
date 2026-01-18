import { NextResponse } from "next/server"

export const runtime = "nodejs"
// Allow more time for image generation on platforms that honor this (e.g. Vercel Pro).
export const maxDuration = 60

type GenerateRequestBody = {
  prompt: string
  imageDataUrl: string
}

async function readBody(req: Request): Promise<{ prompt: string; imageDataUrl: string }> {
  const contentType = req.headers.get("content-type") || ""

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData()
    const prompt = String(form.get("prompt") ?? "").trim()
    const file = form.get("image")

    if (!(file instanceof File)) {
      return { prompt, imageDataUrl: "" }
    }

    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString("base64")
    const mime = file.type || "application/octet-stream"
    const imageDataUrl = `data:${mime};base64,${base64}`

    return { prompt, imageDataUrl }
  }

  let body: GenerateRequestBody
  body = (await req.json()) as GenerateRequestBody
  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : ""
  const imageDataUrl = typeof body.imageDataUrl === "string" ? body.imageDataUrl.trim() : ""
  return { prompt, imageDataUrl }
}

function extractImagesFromMessageContent(content: unknown): { images: string[]; text?: string } {
  if (typeof content === "string") return { images: [], text: content }

  if (!Array.isArray(content)) return { images: [] }

  const images: string[] = []
  const textParts: string[] = []

  for (const part of content) {
    if (!part || typeof part !== "object") continue

    const type = (part as any).type
    if (type === "image_url") {
      const url = (part as any).image_url?.url
      if (typeof url === "string" && url.length > 0) images.push(url)
      continue
    }

    if (type === "text") {
      const text = (part as any).text
      if (typeof text === "string" && text.length > 0) textParts.push(text)
      continue
    }
  }

  return { images, text: textParts.length ? textParts.join("\n") : undefined }
}

function extractImagesFromMessageImages(imagesField: unknown): string[] {
  if (!Array.isArray(imagesField)) return []

  const images: string[] = []
  for (const item of imagesField) {
    if (!item || typeof item !== "object") continue

    const type = (item as any).type
    if (type !== "image_url") continue

    const url = (item as any).image_url?.url
    if (typeof url === "string" && url.length > 0) images.push(url)
  }

  return images
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing OPENROUTER_API_KEY. Set it in site/.env.local and restart the dev server." },
      { status: 500 },
    )
  }

  let prompt: string
  let imageDataUrl: string
  try {
    ;({ prompt, imageDataUrl } = await readBody(req))
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  if (!prompt || !imageDataUrl) {
    return NextResponse.json({ error: "Both prompt and imageDataUrl are required." }, { status: 400 })
  }

  const siteUrl = process.env.OPENROUTER_SITE_URL || "http://localhost:3000"
  const siteTitle = process.env.OPENROUTER_SITE_TITLE || "Nano Banana"

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 55_000)

  const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    signal: controller.signal,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": siteUrl,
      "X-Title": siteTitle,
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-image",
      modalities: ["image", "text"],
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageDataUrl } },
          ],
        },
      ],
    }),
  }).finally(() => clearTimeout(timeout))

  const data = await upstream.json().catch(() => null)
  if (!upstream.ok) {
    const message =
      (data && (data.error?.message || data.error || data.message)) || `Upstream error (${upstream.status}).`
    return NextResponse.json({ error: message }, { status: upstream.status })
  }

  const messageContent = data?.choices?.[0]?.message?.content
  const messageImages = data?.choices?.[0]?.message?.images
  const { images, text } = extractImagesFromMessageContent(messageContent)
  const extractedFromImagesField = extractImagesFromMessageImages(messageImages)
  const allImages = [...images, ...extractedFromImagesField]

  if (!allImages.length) {
    return NextResponse.json(
      {
        error: "No image returned from model.",
        debug: { text },
      },
      { status: 502 },
    )
  }

  return NextResponse.json({ images: allImages, text })
}
