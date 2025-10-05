"use client"

import { useState, useRef, type ChangeEvent, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X } from "lucide-react"
import type { Image, UploadResponse } from "@/app/lib/types"

interface UploadFormProps {
  onUploadSuccess: (image: Image) => void
}

export function UploadForm({ onUploadSuccess }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [alt, setAlt] = useState("")
  const [tags, setTags] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validate file type
    if (!selectedFile.type.startsWith("image/")) {
      setError("Vui lòng chọn một tệp hình ảnh")
      return
    }

    // Validate file size (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Kích thước tệp phải nhỏ hơn 5MB")
      return
    }

    setError(null)
    setFile(selectedFile)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleRemoveFile = () => {
    setFile(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("prompt", prompt)
      formData.append("alt", alt)
      formData.append("tags", tags)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data: UploadResponse = await response.json()

      if (!data.success || !data.image) {
        throw new Error(data.error || "Tải lên thất bại")
      }

      // Success - call callback and reset form
      onUploadSuccess(data.image)
      setFile(null)
      setPreview(null)
      setPrompt("")
      setAlt("")
      setTags("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tải hình ảnh thất bại")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="file">Hình ảnh</Label>
        <div className="flex items-center gap-4">
          <Input
            ref={fileInputRef}
            id="file"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="flex-1"
          />
          {file && (
            <Button type="button" variant="ghost" size="icon" onClick={handleRemoveFile} disabled={isUploading}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {preview && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
            <img src={preview || "/placeholder.svg"} alt="Xem trước" className="h-full w-full object-contain" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="prompt">Prompt (không bắt buộc)</Label>
        <Textarea
          id="prompt"
          placeholder="Mô tả cách bạn tạo ra hình ảnh này..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isUploading}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="alt">Văn bản thay thế (không bắt buộc)</Label>
        <Input
          id="alt"
          placeholder="Mô tả hình ảnh để hỗ trợ truy cập..."
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          disabled={isUploading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Thẻ (không bắt buộc)</Label>
        <Input
          id="tags"
          placeholder="phong cảnh, thiên nhiên, hoàng hôn (cách nhau bằng dấu phẩy)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          disabled={isUploading}
        />
      </div>

      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button type="submit" disabled={!file || isUploading} className="w-full">
        {isUploading ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Đang tải lên...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Tải lên hình ảnh
          </>
        )}
      </Button>
    </form>
  )
}
