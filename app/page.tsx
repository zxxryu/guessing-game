"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RoomCard } from "@/components/room-card"
import { JoinRoomDialog } from "@/components/join-room-dialog"
import type { Room } from "@/lib/types"
import { RefreshCw, Gamepad2 } from "lucide-react"

export default function HomePage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchRooms = async () => {
    try {
      const response = await fetch("/api/rooms")
      const data = await response.json()
      setRooms(data.rooms || [])
    } catch (error) {
      console.error("Failed to fetch rooms:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
    const interval = setInterval(fetchRooms, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <Gamepad2 className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-balance">Guess Game</h1>
              <p className="text-base text-muted-foreground mt-0.5">Play with friends</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <JoinRoomDialog />
        </div>

        <div className="mb-4 flex items-center justify-between px-1">
          <h2 className="text-2xl font-semibold tracking-tight">Public Rooms</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchRooms}
            disabled={loading}
            className="rounded-full w-10 h-10 p-0"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-muted-foreground">
            <div className="inline-block w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mb-3" />
            <p>Loading rooms...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium mb-2">No rooms yet</p>
            <p className="text-muted-foreground mb-6">Be the first to create a game room</p>
            <Button onClick={() => router.push("/create")} size="lg" className="rounded-full">
              Create Room
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
