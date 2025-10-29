import { NextResponse } from "next/server"
import { roomStore } from "@/lib/room-store"
import type { CreateRoomRequest, CreateRoomResponse, RoomListResponse } from "@/lib/types"

export async function GET() {
  const rooms = roomStore.getPublicRooms()
  const response: RoomListResponse = { rooms }
  return NextResponse.json(response)
}

export async function POST(request: Request) {
  try {
    const body: CreateRoomRequest = await request.json()

    const room = roomStore.createRoom(
      body.name,
      body.isPublic,
      body.password,
      body.maxPlayers,
      body.creatorId,
      body.creatorName,
      body.targetNumber,
      body.targetDigits || 4,
    )

    const response: CreateRoomResponse = {
      roomId: room.id,
      room,
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 })
  }
}
