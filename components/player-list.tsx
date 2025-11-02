'use client'

import { Crown, Trophy } from 'lucide-react'

import type { Player } from '@/lib/types'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface PlayerListProps {
  players: Player[]
  currentUserId: string
}

export function PlayerList({ players, currentUserId }: PlayerListProps) {
  return (
    <div className="ios-card rounded-3xl p-5 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Players ({players.length})</h2>
      <div className="space-y-3">
        {players.map((player) => (
          <div key={player.id} className="flex items-center gap-3 p-3 rounded-2xl ios-transition hover:bg-secondary/30">
            <Avatar className="h-11 w-11">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-base">
                {player.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-semibold truncate">
                  {player.name}
                  {player.id === currentUserId && ' (You)'}
                </p>
                {player.isCreator && <Crown className="h-4 w-4 text-accent flex-shrink-0" />}
              </div>
              <p className="text-sm text-muted-foreground">{player.guesses.length} guesses</p>
            </div>
            {player.hasWon && (
              <Badge variant="default" className="flex-shrink-0 rounded-full">
                <Trophy className="h-3 w-3 mr-1" />
                Won
              </Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
