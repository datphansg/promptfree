"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UploadForm } from "@/components/upload-form"
import type { Image } from "@/app/lib/types"

interface UploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUploadSuccess: (image: Image) => void
}

export function UploadModal({ open, onOpenChange, onUploadSuccess }: UploadModalProps) {
  const handleSuccess = (image: Image) => {
    onUploadSuccess(image)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chia sẻ Prompt</DialogTitle>
        </DialogHeader>
        <UploadForm onUploadSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}