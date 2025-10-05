export interface Image {
  id: string
  src: string
  alt: string | null
  prompt: string | null
  tags: string[] | null
  created_at: string
}

export interface UploadResponse {
  success: boolean
  image?: Image
  error?: string
}
