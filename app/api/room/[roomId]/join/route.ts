import { NextResponse } from "next/server"
import { roomStore } from "@/lib/room-store"
import type { JoinRoomRequest, JoinRoomResponse } from "@/lib/types"

export async function POST(request: Request, { params }: { params: Promise<{ roomId: string }> }) {
  try {
    const { roomId } = await params
    const body: JoinRoomRequest = await request.json()

    const room = roomStore.getRoom(roomId)

    if (!room) {
      const response: JoinRoomResponse = {
        canJoin: false,
        reason: "Room not found",
      }
      return NextResponse.json(response)
    }

    // Check if room is full
    if (room.currentPlayers >= room.maxPlayers) {
      const response: JoinRoomResponse = {
        canJoin: false,
        reason: "Room is full",
      }
      return NextResponse.json(response)
    }

    // Check password for private rooms
    if (!room.isPublic && room.password !== body.password) {
      const response: JoinRoomResponse = {
        canJoin: false,
        reason: "Incorrect password",
      }
      return NextResponse.json(response)
    }

    const response: JoinRoomResponse = {
      canJoin: true,
    }
    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ error: "Failed to validate join" }, { status: 500 })
  }
}
