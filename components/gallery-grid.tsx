"use client"

import { useState } from "react"
import type { Image } from "@/app/lib/types"
import { ImageModal } from "./image-modal"

interface GalleryGridProps {
  images: Image[]
}

export function GalleryGrid({ images }: GalleryGridProps) {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleImageClick = (image: Image) => {
    setSelectedImage(image)
    setModalOpen(true)
  }

  if (images.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed border-border">
        <div className="text-center">
      <p className="text-sm text-muted-foreground">Chưa có hình ảnh nào</p>
          <p className="mt-1 text-xs text-muted-foreground">Hãy tải lên hình ảnh đầu tiên để bắt đầu</p>
          </div>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {images.map((image) => (
          <button
            key={image.id}
            onClick={() => handleImageClick(image)}
            className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted transition-all hover:border-primary hover:shadow-lg"
          >
            <img
              src={image.src || "/placeholder.svg"}
              alt={image.alt || "Hình ảnh trong thư viện"}
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            {image.prompt && (
              <div className="absolute bottom-0 left-0 right-0 p-3 text-left opacity-0 transition-opacity group-hover:opacity-100">
                <p className="line-clamp-2 text-xs text-white">{image.prompt}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      <ImageModal image={selectedImage} open={modalOpen} onOpenChange={setModalOpen} />
    </>
  )
}
