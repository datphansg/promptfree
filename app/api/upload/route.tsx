import { getSupabaseServerClient } from "@/app/lib/server"
import { type NextRequest, NextResponse } from "next/server"
import type { UploadResponse } from "@/app/lib/types"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const prompt = formData.get("prompt") as string
    const alt = formData.get("alt") as string
    const tagsString = formData.get("tags") as string

    // Validation
    if (!file) {
      return NextResponse.json<UploadResponse>({ success: false, error: "No file provided" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json<UploadResponse>({ success: false, error: "File must be an image" }, { status: 400 })
    }

    // Max file size: 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json<UploadResponse>(
        { success: false, error: "File size must be less than 5MB" },
        { status: 400 },
      )
    }

    const supabase = await getSupabaseServerClient()

    // Upload to Supabase Storage
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `images/${fileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage.from("gallery").upload(filePath, file, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    })

    if (uploadError) {
      console.error("[v0] Upload error:", uploadError)
      return NextResponse.json<UploadResponse>({ success: false, error: "Failed to upload image" }, { status: 500 })
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("gallery").getPublicUrl(uploadData.path)

    // Parse tags
    const tags = tagsString
      ? tagsString
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : []

    // Insert into database
    const { data: imageData, error: dbError } = await supabase
      .from("images")
      .insert({
        src: publicUrl,
        alt: alt || null,
        prompt: prompt || null,
        tags: tags.length > 0 ? tags : null,
      })
      .select()
      .single()

    if (dbError) {
      console.error("[v0] Database error:", dbError)
      // Try to delete the uploaded file
      await supabase.storage.from("gallery").remove([uploadData.path])
      return NextResponse.json<UploadResponse>(
        { success: false, error: "Failed to save image metadata" },
        { status: 500 },
      )
    }

    return NextResponse.json<UploadResponse>({ success: true, image: imageData })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json<UploadResponse>({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
