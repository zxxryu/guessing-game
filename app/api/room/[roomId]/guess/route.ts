import { NextResponse } from "next/server"
import { roomStore } from "@/lib/room-store"

export async function POST(request: Request, { params }: { params: Promise<{ roomId: string }> }) {
  try {
    const { roomId } = await params
    const body = await request.json()
    const { playerId, number } = body

    console.log("[v0] API received guess:", { roomId, playerId, number })

    const guess = roomStore.addGuess(roomId, playerId, number)

    console.log("[v0] Guess result:", guess)

    if (!guess) {
      return NextResponse.json({ error: "Failed to add guess" }, { status: 400 })
    }

    return NextResponse.json({ guess })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Failed to process guess" }, { status: 500 })
  }
}
