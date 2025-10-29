import { NextResponse } from "next/server"
import { roomStore } from "@/lib/room-store"

export async function GET(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  const rooms = roomStore.getUserRooms(userId)
  return NextResponse.json({ rooms })
}
