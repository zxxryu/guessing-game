"use client"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Guess } from "@/lib/types"
import { CheckCircle2, Circle, Clock } from "lucide-react"

interface AllGuessesHistoryProps {
  allGuesses: Guess[]
  currentUserId: string
  targetDigits: number
}

export function AllGuessesHistory({ allGuesses, currentUserId, targetDigits }: AllGuessesHistoryProps) {
  const sortedGuesses = [...allGuesses].sort((a, b) => b.timestamp - a.timestamp)

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  }

  const formatNumber = (guess: Guess) => {
    if (guess.playerId !== currentUserId) {
      return "*".repeat(targetDigits)
    }
    return guess.number.toString().padStart(targetDigits, "0")
  }

  return (
    <div className="ios-card rounded-3xl p-5 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">All Guesses</h2>
      <ScrollArea className="h-[400px] pr-2">
        {sortedGuesses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-secondary/30 flex items-center justify-center mx-auto mb-3">
              <Circle className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No guesses yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedGuesses.map((guess, index) => {
              const isCurrentUser = guess.playerId === currentUserId
              const guessNumber = sortedGuesses.length - index

              return (
                <div
                  key={`${guess.playerId}-${guess.timestamp}`}
                  className="p-4 rounded-2xl bg-secondary/20 ios-transition hover:bg-secondary/30"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="rounded-full px-2.5 py-0.5 text-xs font-semibold">
                        #{guessNumber}
                      </Badge>
                      <span
                        className={`text-sm font-medium ${isCurrentUser ? "text-primary" : "text-muted-foreground"}`}
                      >
                        {isCurrentUser ? "You" : guess.playerName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {formatTime(guess.timestamp)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className={`text-2xl font-bold font-mono tracking-wider ${isCurrentUser ? "" : "text-muted-foreground"}`}
                    >
                      {formatNumber(guess)}
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
                </div>
              )
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
