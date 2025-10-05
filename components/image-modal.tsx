"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Copy, Download, X } from "lucide-react"
import type { Image } from "@/app/lib/types"
import { useState } from "react"

interface ImageModalProps {
  image: Image | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImageModal({ image, open, onOpenChange }: ImageModalProps) {
  const [copied, setCopied] = useState<"prompt" | "url" | null>(null)

  if (!image) return null

  const handleCopyPrompt = async () => {
    if (!image.prompt) return
    await navigator.clipboard.writeText(image.prompt)
    setCopied("prompt")
    setTimeout(() => setCopied(null), 2000)
  }

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(image.src)
    setCopied("url")
    setTimeout(() => setCopied(null), 2000)
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = image.src
    link.download = `image-${image.id}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-10 bg-background/80 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
            <img
              src={image.src || "/placeholder.svg"}
              alt={image.alt || "Gallery image"}
              className="h-full w-full object-contain"
            />
          </div>

          <div className="space-y-4 p-6">
            {image.prompt && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">Prompt</h3>
                  <Button variant="ghost" size="sm" onClick={handleCopyPrompt} disabled={copied === "prompt"}>
                    <Copy className="mr-2 h-3 w-3" />
                    {copied === "prompt" ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <p className="text-sm leading-relaxed">{image.prompt}</p>
              </div>
            )}

            {image.tags && image.tags.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {image.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={handleCopyUrl} className="flex-1 bg-transparent">
                <Copy className="mr-2 h-3 w-3" />
                {copied === "url" ? "Copied!" : "Copy URL"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload} className="flex-1 bg-transparent">
                <Download className="mr-2 h-3 w-3" />
                Download
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              Uploaded {new Date(image.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
