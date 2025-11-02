// Game and Room Types
export interface Room {
  id: string
  name: string
  isPublic: boolean
  password?: string
  maxPlayers: number
  currentPlayers: number
  creatorId: string
  createdAt: number
  targetNumber?: string
  targetDigits: number
  players: Player[]
  status: 'not_started' | 'playing' | 'finished'
}

export interface Player {
  id: string
  name: string
  guesses: Guess[]
  hasWon: boolean
}

export interface Guess {
  number: string
  correctCount: number
  correctPositionCount: number
  timestamp: number
  playerId: string
  playerName: string
}

// WebSocket Message Types
export type WSMessage =
  | { type: 'join'; playerId: string; playerName: string; password?: string }
  | { type: 'guess'; playerId: string; number: string }
  | { type: 'leave'; playerId: string }
  | { type: 'start'; playerId: string }

export type WSResponse =
  | { type: 'room-state'; room: Room }
  | { type: 'player-joined'; player: Player }
  | { type: 'player-left'; playerId: string }
  | { type: 'guess-result'; playerId: string; guess: Guess }
  | { type: 'game-won'; playerId: string; playerName: string }
  | { type: 'error'; message: string }

// API Response Types
export interface CreateRoomRequest {
  name: string
  isPublic: boolean
  password?: string
  targetNumberType?: 'fixed' | 'random'
  targetNumber?: string
  targetDigits?: number
  maxPlayers: number
  creatorId: string
  creatorName: string
}

export interface CreateRoomResponse {
  roomId: string
  room: Room
}

export interface RoomListResponse {
  rooms: Room[]
}

export interface JoinRoomRequest {
  roomId: string
  password?: string
}

export interface JoinRoomResponse {
  canJoin: boolean
  reason?: string
}
