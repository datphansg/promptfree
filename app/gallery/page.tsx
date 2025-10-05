"use client"

import { useState, useEffect } from "react"
import { GalleryGrid } from "@/components/gallery-grid"
import { UploadModal } from "@/components/upload-modal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { Image } from "@/app/lib/types"
import { getSupabaseBrowserClient } from "@/app/lib/client"

export default function GalleryPage() {
  const [images, setImages] = useState<Image[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  
  useEffect(() => {
   loadImages()
  }, [])

  const loadImages = async () => {
    try {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase.from("images").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("[v0] Failed to fetch images:", error)
        return
      }

      setImages(data || [])
    } catch (error) {
      console.error("[v0] Error loading images:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUploadSuccess = (newImage: Image) => {
    setImages((prev) => [newImage, ...prev])
  }



  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Bộ sưu tập</h1>
              <p className="text-sm text-muted-foreground">{images.length} hình ảnh</p>
            </div>
            <Button onClick={() => setUploadModalOpen(true)} size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Chia sẻ Prompt
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <GalleryGrid images={images} />
        )}
      </div>

      <UploadModal open={uploadModalOpen} onOpenChange={setUploadModalOpen} onUploadSuccess={handleUploadSuccess} />
    </div>
  )
}
