'use client'

import { Users, Lock, Copy, ChevronRight, Gamepad2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'

import type { Room } from '@/lib/types'
import type React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useUser } from '@/contexts/user-context'
import { useToast } from '@/hooks/use-toast'
import { api } from '@/lib/api'

export default function MyRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const { userId } = useUser()
  const router = useRouter()
  const { toast } = useToast()

  const fetchRooms = useCallback(async () => {
    try {
      const rooms: Room[] = await api.listRooms(undefined, userId)
      setRooms(rooms)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch my rooms',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [userId, toast])

  useEffect(() => {
    if (!userId) return
    fetchRooms()
  }, [fetchRooms, userId])

  const handleCopyRoomId = (roomId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(roomId)
    toast({
      title: 'Copied!',
      description: 'Room ID copied to clipboard',
    })
  }

  const handleCopyShareLink = (roomId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const shareLink = `${window.location.origin}/room/${roomId}`
    navigator.clipboard.writeText(shareLink)
    toast({
      title: 'Copied!',
      description: 'Share link copied to clipboard',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">My Rooms</h1>
          <p className="text-lg text-muted-foreground">Rooms you have created</p>
        </div>

        {loading ? (
          <div className="text-center py-16 text-muted-foreground">
            <div className="inline-block w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mb-3" />
            <p>Loading your rooms...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium mb-2">No rooms yet</p>
            <p className="text-muted-foreground mb-6">Create your first game room</p>
            <Button onClick={() => router.push('/create')} size="lg" className="rounded-full">
              Create Room
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => router.push(`/room/${room.id}`)}
                className="ios-card ios-transition rounded-3xl p-5 text-left w-full hover:scale-[1.01] active:scale-[0.99] shadow-sm"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold truncate mb-2">{room.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                  <div className="flex flex-wrap items-center gap-2">
                    {room.currentPlayers >= room.maxPlayers ? (
                      <Badge variant="secondary" className="rounded-full">
                        Full
                      </Badge>
                    ) : (
                      <Badge variant="default" className="rounded-full">
                        Open
                      </Badge>
                    )}
                    {room.isPublic && (
                      <Badge variant="outline" className="rounded-full">
                        Public
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Room ID */}
                <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/30 font-mono text-sm mb-3">
                  <span className="flex-1 truncate">{room.id}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleCopyRoomId(room.id, e)}
                    className="rounded-full w-9 h-9 p-0 flex-shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={(e) => handleCopyShareLink(room.id, e)}
                    className="flex-1 rounded-xl h-11"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Share Link
                  </Button>
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <ChevronRight className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
