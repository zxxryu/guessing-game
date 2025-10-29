"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface VerificationInputProps {
  length: number
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  onComplete?: (value: string) => void
}

export function VerificationInput({ length, value, onChange, disabled, onComplete }: VerificationInputProps) {
  const [focusedIndex, setFocusedIndex] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (value.length === length && onComplete) {
      onComplete(value)
    }
  }, [value, length, onComplete])

  const handleChange = (index: number, digit: string) => {
    if (disabled) return

    // Only allow single digit
    const newDigit = digit.replace(/\D/g, "").slice(-1)

    const newValue = value.split("")
    newValue[index] = newDigit
    const updatedValue = newValue.join("").slice(0, length)

    onChange(updatedValue)

    // Auto focus next input
    if (newDigit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
      setFocusedIndex(index + 1)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return

    if (e.key === "Backspace") {
      e.preventDefault()
      const newValue = value.split("")

      if (newValue[index]) {
        // Clear current digit
        newValue[index] = ""
        onChange(newValue.join(""))
      } else if (index > 0) {
        // Move to previous and clear
        newValue[index - 1] = ""
        onChange(newValue.join(""))
        inputRefs.current[index - 1]?.focus()
        setFocusedIndex(index - 1)
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
      setFocusedIndex(index - 1)
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
      setFocusedIndex(index + 1)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled) return

    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length)
    onChange(pastedData)

    // Focus the next empty input or last input
    const nextIndex = Math.min(pastedData.length, length - 1)
    inputRefs.current[nextIndex]?.focus()
    setFocusedIndex(nextIndex)
  }

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => setFocusedIndex(index)}
          disabled={disabled}
          className={cn(
            "w-12 h-16 text-center text-2xl font-mono font-bold rounded-2xl",
            "ios-card border-2 transition-all",
            "focus:outline-none focus:ring-0",
            focusedIndex === index && !disabled ? "border-primary bg-primary/5 scale-105" : "border-border/50",
            disabled && "opacity-50 cursor-not-allowed",
            value[index] && "bg-secondary/20",
          )}
        />
      ))}
    </div>
  )
}
