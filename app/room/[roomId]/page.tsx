"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlayerList } from "@/components/player-list"
import { AllGuessesHistory } from "@/components/all-guesses-history"
import { GuessInput } from "@/components/guess-input"
import { useUser } from "@/contexts/user-context"
import { useToast } from "@/hooks/use-toast"
import type { Room, Guess } from "@/lib/types"
import { Copy, Users, Trophy, Lock, ChevronLeft, Check } from "lucide-react"

export default function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = React.use(params)

  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasWon, setHasWon] = useState(false)
  const [copied, setCopied] = useState(false)
  const { userId, userName } = useUser()
  const router = useRouter()
  const { toast } = useToast()

  const currentPlayer = room?.players.find((p) => p.id === userId)
  const allGuesses: Guess[] = room?.players.flatMap((p) => p.guesses) || []

  useEffect(() => {
    if (!userId) return

    const fetchRoom = async () => {
      try {
        const response = await fetch(`/api/room/${roomId}`)
        if (!response.ok) {
          throw new Error("Room not found")
        }
        const data = await response.json()
        setRoom(data.room)

        // Auto-join if not already in room
        if (!data.room.players.some((p: any) => p.id === userId)) {
          await fetch(`/api/room/${roomId}/join`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ roomId }),
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load room",
          variant: "destructive",
        })
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    fetchRoom()
    const interval = setInterval(fetchRoom, 2000)
    return () => clearInterval(interval)
  }, [roomId, userId, router, toast])

  const handleGuess = async (number: string) => {
    if (!userId || hasWon) return

    console.log("[v0] Submitting guess:", number)

    try {
      const response = await fetch(`/api/room/${roomId}/guess`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: userId, number }),
      })

      console.log("[v0] Guess response status:", response.status)

      if (!response.ok) {
        throw new Error("Failed to submit guess")
      }

      const data = await response.json()
      console.log("[v0] Guess result:", data)

      if (data.guess.correctPositionCount === room?.targetDigits) {
        setHasWon(true)
        toast({
          title: "Congratulations!",
          description: "You guessed the correct number!",
        })
      }
    } catch (error) {
      console.error("[v0] Guess error:", error)
      toast({
        title: "Error",
        description: "Failed to submit guess",
        variant: "destructive",
      })
    }
  }

  const handleLeave = () => {
    router.push("/")
  }

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId)
    setCopied(true)
    setTimeout(() => setCopied(false), 5000)
    toast({
      title: "Copied!",
      description: "Room ID copied to clipboard",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-muted-foreground">Loading room...</p>
        </div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Room not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="sticky top-0 z-40 ios-blur border-b border-border/50 bg-background/80">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-14">
            <button
              onClick={handleLeave}
              className="flex items-center gap-1 text-primary hover:opacity-70 ios-transition -ml-2 px-2 py-1"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="text-base font-medium">Back</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="ios-card rounded-3xl p-5 shadow-sm mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold truncate mb-2">{room.name}</h1>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    {room.currentPlayers}/{room.maxPlayers} players
                  </span>
                  {!room.isPublic && (
                    <span className="flex items-center gap-1.5">
                      <Lock className="h-4 w-4" />
                      Private
                    </span>
                  )}
                </div>
              </div>
              {hasWon && (
                <Badge variant="default" className="rounded-full px-3 py-1.5 text-sm">
                  <Trophy className="h-4 w-4 mr-1" />
                  You Won!
                </Badge>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyRoomId}
              className={`rounded-full bg-transparent ios-transition ${
                copied ? "bg-green-500/10 border-green-500 text-green-600" : ""
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2 animate-in zoom-in duration-200" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Room ID
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Players */}
          <div className="lg:col-span-1">
            <PlayerList players={room.players} currentUserId={userId} />
          </div>

          {/* Middle & Right Columns - Game */}
          <div className="lg:col-span-2 space-y-4">
            <GuessInput onGuess={handleGuess} disabled={hasWon} digits={room.targetDigits} />
            <AllGuessesHistory allGuesses={allGuesses} currentUserId={userId} targetDigits={room.targetDigits} />
          </div>
        </div>
      </div>
    </div>
  )
}
