import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString()
}

export function randomId(prefix = 'u'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
