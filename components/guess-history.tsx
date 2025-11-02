'use client'

import { CheckCircle2, Circle } from 'lucide-react'

import type { Guess } from '@/lib/types'

import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

interface GuessHistoryProps {
  guesses: Guess[]
  playerName: string
}

export function GuessHistory({ guesses, playerName }: GuessHistoryProps) {
  const sortedGuesses = [...guesses].sort((a, b) => b.timestamp - a.timestamp)

  return (
    <div className="ios-card rounded-3xl p-5 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Your Guesses</h2>
      <ScrollArea className="h-[320px] pr-2">
        {sortedGuesses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-secondary/30 flex items-center justify-center mx-auto mb-3">
              <Circle className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No guesses yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedGuesses.map((guess) => (
              <div
                key={guess.timestamp}
                className="flex items-center justify-between p-4 rounded-2xl bg-secondary/20 ios-transition hover:bg-secondary/30"
              >
                <span className="text-3xl font-bold font-mono tracking-wider">
                  {guess.number.toString().padStart(4, '0')}
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1.5 rounded-full px-3 py-1.5">
                    <Circle className="h-3.5 w-3.5" />
                    <span className="font-semibold">{guess.correctCount}</span>
                  </Badge>
                  <Badge variant="default" className="flex items-center gap-1.5 rounded-full px-3 py-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span className="font-semibold">{guess.correctPositionCount}</span>
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
