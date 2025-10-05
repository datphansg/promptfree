import { NextResponse } from "next/server"

// Xử lý GET request
export async function GET() {
  return NextResponse.json({ message: "Hello from Next.js API!" })
}

// Xử lý POST request
export async function POST(req: Request) {
  const body = await req.json()
  return NextResponse.json({ received: body })
}
