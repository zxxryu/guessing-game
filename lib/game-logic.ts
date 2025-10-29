// Game logic utilities

export function generateTargetNumber(digits = 4): string {
  // Generate a random number with specified digits (can have duplicates and leading zeros)
  let result = ""
  for (let i = 0; i < digits; i++) {
    result += Math.floor(Math.random() * 10).toString()
  }
  return result
}

export function calculateGuessResult(
  guess: string,
  target: string,
): {
  correctPositionCount: number // A: correct digit in correct position
  correctCount: number // B: total correct digits (including position matches)
} {
  const guessDigits = guess.split("")
  const targetDigits = target.split("")

  let correctPositionCount = 0
  const guessCounts: Record<string, number> = {}
  const targetCounts: Record<string, number> = {}

  // First pass: count exact position matches (A)
  for (let i = 0; i < guessDigits.length; i++) {
    console.log(guessDigits[i], targetDigits[i])
    if (guessDigits[i] === targetDigits[i]) {
      correctPositionCount++
      guessCounts[guessDigits[i]] = (guessCounts[guessDigits[i]] || 0) + 1
      targetCounts[targetDigits[i]] = (targetCounts[targetDigits[i]] || 0) + 1
    } else {
      guessCounts[guessDigits[i]] = (guessCounts[guessDigits[i]] || 0) + 1
      targetCounts[targetDigits[i]] = (targetCounts[targetDigits[i]] || 0) + 1
    }
  }

  // Second pass: count remaining digit matches (wrong position)
  let correctCount = 0
  for (let digit = 0; digit < 10; digit++) {
    const digitStr = digit.toString()
    if (guessCounts[digitStr] && targetCounts[digitStr]) {
      correctCount += Math.min(guessCounts[digitStr], targetCounts[digitStr])
    }
  }

  return { correctPositionCount, correctCount }
}
