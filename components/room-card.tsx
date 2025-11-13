'use client'
import { Users, Lock, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

import type { Room } from '@/lib/types'

import { Badge } from '@/components/ui/badge'

interface RoomCardProps {
  room: Room
}

export function RoomCard({ room }: RoomCardProps) {
  const router = useRouter()
  const isFull = room.currentPlayers >= room.maxPlayers
  const isFinished = room.status === 'finished' ? true : false

  const handleJoin = () => {
    router.push(`/room/${room.id}`)
  }

  return (
    <button
      onClick={handleJoin}
      disabled={isFull}
      className="ios-card ios-transition rounded-3xl p-5 text-left w-full hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold truncate mb-1">{room.name}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {room.currentPlayers}/{room.maxPlayers} players
            </span>
          </div>
        </div>
        {!room.isPublic && (
          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
            <Lock className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <Badge variant={isFinished ? 'destructive' : (isFull ? 'secondary' : 'default')} className="rounded-full px-3 py-1">
          {isFinished ? 'Finished' : (isFull ? 'Full' : 'Open')}
        </Badge>
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <ChevronRight className="h-5 w-5 text-primary" />
        </div>
      </div>
    </button>
  )
}
