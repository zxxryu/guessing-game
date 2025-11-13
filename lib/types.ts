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
  guesses: Guess[]
  status: 'not_started' | 'playing' | 'finished'
}

export interface Player {
  id: string
  name: string
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
  | { type: 'join'; playerId: string; playerName: string; roomId: string; password?: string }
  | { type: 'guess'; playerId: string; guess: string; roomId: string }
  | { type: 'leave'; playerId: string }

export type WSResponse =
  | { type: 'room_state'; room: Room }
  | { type: 'player_joined'; data: { connections: number; room: Room } }
  | { type: 'joined'; data: { connections: number; room: Room } }
  | { type: 'player_left'; data: { connections: number; room: Room } }
  | { type: 'guess_update'; data: { room: Room; winner?: string | null; } }
  | { type: 'guess_result'; data: { room: Room; winner?: string | null; } }
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
