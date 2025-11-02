'use client'

import { ChevronLeft, Users, Lock, Trophy, Copy, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Room, Guess, Player } from '@/lib/types'

import { AllGuessesHistory } from '@/components/all-guesses-history'
import { GuessInput } from '@/components/guess-input'
import { PlayerList } from '@/components/player-list'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useUser } from '@/contexts/user-context'
import { useToast } from '@/hooks/use-toast'
import { api } from '@/lib/api'
import { connectRoomSocket } from '@/lib/ws'

export default function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = React.use(params);
  const router = useRouter()

  const { toast } = useToast()
  const { userId, userName, getUserRoomPassword } = useUser()

  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)
  const [joined, setJoined] = useState(false)
  const [hasWon, setHasWon] = useState(false)
  const [copied, setCopied] = useState(false)
  const [currentPlayers, setCurrentPlayers] = useState(0)
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [allGuesses, setAllGuesses] = useState<Guess[]>([])
  const [playerList, setPlayerList] = useState<Player[]>([])

  useEffect(() => {
    if (!room) return
    setAllGuesses(room.players.flatMap((p) => p.guesses))
  }, [room])


  useEffect(() => {
    if (!room) return
    setPlayerList(room.players)
  }, [room])

  useEffect(() => {
    if (!room) return
    setCurrentPlayers(room.currentPlayers || playerList.length)
  }, [room, playerList])

  useEffect(() => {
    if (!userId) return
    loadRoom()

    const socket = connectRoomSocket(
      roomId,
      userId,
      (msg) => {
        setJoined(msg.type === 'joined' || msg.type === 'already_joined')
        if (msg.type === 'player_joined') {
          setPlayerList((prev) => [...prev, msg.data.player])
          room!.currentPlayers = msg.data.currentPlayers || playerList.length
          setCurrentPlayers(msg.data.currentPlayers || playerList.length)
        } else if (msg.type === 'player_left') {
          setPlayerList((prev) => prev.filter((p) => p.id !== msg.data.player.id))
          setCurrentPlayers(msg.data.currentPlayers || playerList.length)
        } else if (msg.type === 'guess_result') {
          const { status, winner, guess } = msg.data
          setHasWon(winner === userId)
          setAllGuesses((prev) => [...prev, guess])
          room!.status = status
        }
      },
      () => {
        socket.send(JSON.stringify({ type: 'join', roomId, playerId: userId, playerName: userName }))
      },
    )

    setWs(socket)
    return () => socket.close()
  }, [roomId, userId])


  const loadRoom = async () => {
    try {
      const data = await api.getRoom(roomId, getUserRoomPassword(roomId))
      setRoom(data)
      if (data.players.some((p) => p.id === userId)) {
        setJoined(true)
      }
      if (data.status === 'finished') {
        setHasWon(data.players.find((p) => p.id === userId && p.hasWon) !== undefined)
      }
    } catch (err) {
      toast({
        title: 'Room not found',
        description: err instanceof Error ? err.message : 'The room you are trying to join does not exist.',
        variant: 'destructive',
      })
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const handleGuess = async (number: string) => {
    if (!ws || !room) return
    ws.send(JSON.stringify({ type: 'guess', roomId, playerId: userId, guess: number }))
  }

  const handleLeave = () => {
    ws?.send(JSON.stringify({ type: 'leave', roomId, playerId: userId }))
    router.push('/')
  }

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  // ------- UI ---------
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
              className={`rounded-full bg-transparent ios-transition ${copied ? 'bg-green-500/10 border-green-500 text-green-600' : ''}`}
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
            <PlayerList players={playerList} currentUserId={userId} />
          </div>

          {/* Middle & Right Columns - Game */}
          <div className="lg:col-span-2 space-y-4">
            {room.status !== 'finished' && (
              <GuessInput onGuess={handleGuess} disabled={!joined} digits={room.targetDigits} />
            )}
            <AllGuessesHistory allGuesses={allGuesses} currentUserId={userId} targetDigits={room.targetDigits} />
          </div>
        </div>
      </div>
    </div>
  )
}
