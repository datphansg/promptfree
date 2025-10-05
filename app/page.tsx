import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Upload, ImageIcon } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-8 inline-flex items-center justify-center rounded-full border border-border bg-muted p-3">
          <ImageIcon className="h-8 w-8 text-primary" />
        </div>

        <h1 className="mb-4 text-5xl font-bold tracking-tight text-balance">Thư viện hình ảnh</h1>

        <p className="mb-8 text-lg text-muted-foreground text-balance">
          Tải lên, tổ chức và trình bày hình ảnh của bạn với metadata, prompt và thẻ. Xây dựng với Next.js và Supabase.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/gallery">
              Xem thư viện
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/gallery">
              <Upload className="mr-2 h-4 w-4" />
              Tải lên hình ảnh
            </Link>
          </Button>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-3 inline-flex items-center justify-center rounded-lg bg-primary/10 p-2">
              <Upload className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold">Tải lên dễ dàng</h3>
            <p className="text-sm text-muted-foreground">Tải hình ảnh với prompt, văn bản thay thế và thẻ</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-3 inline-flex items-center justify-center rounded-lg bg-primary/10 p-2">
              <ImageIcon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold">Thư viện đẹp mắt</h3>
            <p className="text-sm text-muted-foreground">Xem hình ảnh của bạn trong bố cục lưới đáp ứng</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-3 inline-flex items-center justify-center rounded-lg bg-primary/10 p-2">
              <ImageIcon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold">Metadata phong phú</h3>
            <p className="text-sm text-muted-foreground">Lưu prompt, thẻ và mô tả cho mỗi hình ảnh</p>
          </div>
        </div>
      </div>
    </div>
  )
}
