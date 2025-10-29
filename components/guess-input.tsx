"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { VerificationInput } from "@/components/verification-input"
import { Send, Circle, CheckCircle2 } from "lucide-react"

interface GuessInputProps {
  onGuess: (number: string) => void
  disabled?: boolean
  digits?: number
}

export function GuessInput({ onGuess, disabled, digits = 4 }: GuessInputProps) {
  const [guess, setGuess] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (guess.length !== digits || !/^\d+$/.test(guess)) {
      return
    }

    onGuess(guess)
    setGuess("")
  }

  return (
    <div className="ios-card rounded-3xl p-5 shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Make a Guess</h2>
      <p className="text-sm text-muted-foreground mb-4">Enter a {digits}-digit number</p>

      <form onSubmit={handleSubmit} className="mb-5">
        <div className="mb-4">
          <VerificationInput length={digits} value={guess} onChange={setGuess} disabled={disabled} />
        </div>
        <Button
          type="submit"
          disabled={disabled || guess.length !== digits}
          size="lg"
          className="w-full rounded-2xl h-14 text-base font-semibold"
        >
          <Send className="h-5 w-5 mr-2" />
          Submit Guess
        </Button>
      </form>

      <div className="space-y-2.5 text-sm">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
            <Circle className="h-4 w-4 text-secondary-foreground" />
          </div>
          <span className="text-muted-foreground">Correct digits in wrong position</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/10">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-muted-foreground">Correct digits in correct position</span>
        </div>
      </div>
    </div>
  )
}
