"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Image {
  id: string
  url: string
  title: string
  createdAt: string
}

export default function ImageGallery() {
  const [images, setImages] = useState<Image[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")

  // Load images from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("gallery-images")
    if (stored) {
      setImages(JSON.parse(stored))
    }
  }, [])

  // Save images to localStorage whenever they change
  useEffect(() => {
    if (images.length > 0) {
      localStorage.setItem("gallery-images", JSON.stringify(images))
    }
  }, [images])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = () => {
    if (!selectedFile || !previewUrl) return

    const newImage: Image = {
      id: Date.now().toString(),
      url: previewUrl,
      title: title || "Untitled",
      createdAt: new Date().toISOString(),
    }

    setImages((prev) => [newImage, ...prev])

    // Reset form
    setTitle("")
    setSelectedFile(null)
    setPreviewUrl("")
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
    if (images.length === 1) {
      localStorage.removeItem("gallery-images")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Upload Button */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Gallery</h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Upload className="h-5 w-5" />
              Tải hình lên
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload hình ảnh</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề</Label>
                <Input
                  id="title"
                  placeholder="Nhập tiêu đề cho hình ảnh"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Chọn hình ảnh</Label>
                <Input id="image" type="file" accept="image/*" onChange={handleFileChange} />
              </div>

              {previewUrl && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                  <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}

              <Button onClick={handleUpload} disabled={!selectedFile} className="w-full">
                Upload
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Gallery Grid */}
      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Upload className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Chưa có hình ảnh</h2>
          <p className="text-muted-foreground">Click nút "Tải hình lên" để thêm hình ảnh vào gallery</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image) => (
            <div key={image.id} className="group relative aspect-square overflow-hidden rounded-lg border bg-muted">
              <img
                src={image.url || "/placeholder.svg"}
                alt={image.title}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />

              {/* Overlay with title and delete button */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-lg">{image.title}</h3>
                  <p className="text-white/80 text-sm">{new Date(image.createdAt).toLocaleDateString("vi-VN")}</p>
                </div>

                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={() => handleDelete(image.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
