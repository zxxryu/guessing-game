// In-memory room storage (for demo purposes)
// In production, this should use a database
import type { Room, Player, Guess } from "./types"
import { generateTargetNumber, calculateGuessResult } from "./game-logic"

class RoomStore {
  private rooms = new Map<string, Room>()
  private wsConnections = new Map<string, Set<any>>()

  createRoom(
    name: string,
    isPublic: boolean,
    password: string | undefined,
    maxPlayers: number,
    creatorId: string,
    creatorName: string,
    targetNumber?: string,
    targetDigits = 4,
  ): Room {
    const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const creator: Player = {
      id: creatorId,
      name: creatorName,
      isCreator: true,
      guesses: [],
      hasWon: false,
    }

    const room: Room = {
      id: roomId,
      name,
      isPublic,
      password,
      maxPlayers,
      currentPlayers: 1,
      creatorId,
      createdAt: Date.now(),
      targetNumber: targetNumber || generateTargetNumber(targetDigits),
      targetDigits: targetDigits,
      players: [creator],
      gameStarted: true,
    }

    this.rooms.set(roomId, room)
    return room
  }

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId)
  }

  getPublicRooms(): Room[] {
    return Array.from(this.rooms.values())
      .filter((room) => room.isPublic)
      .sort((a, b) => b.createdAt - a.createdAt)
  }

  getUserRooms(userId: string): Room[] {
    return Array.from(this.rooms.values())
      .filter((room) => room.creatorId === userId)
      .sort((a, b) => b.createdAt - a.createdAt)
  }

  joinRoom(roomId: string, playerId: string, playerName: string, password?: string): boolean {
    const room = this.rooms.get(roomId)
    if (!room) return false

    // Check password for private rooms
    if (!room.isPublic && room.password !== password) {
      return false
    }

    // Check if room is full
    if (room.currentPlayers >= room.maxPlayers) {
      return false
    }

    // Check if player already in room
    if (room.players.some((p) => p.id === playerId)) {
      return true
    }

    const player: Player = {
      id: playerId,
      name: playerName,
      isCreator: false,
      guesses: [],
      hasWon: false,
    }

    room.players.push(player)
    room.currentPlayers++
    this.rooms.set(roomId, room)

    return true
  }

  leaveRoom(roomId: string, playerId: string): boolean {
    const room = this.rooms.get(roomId)
    if (!room) return false

    const playerIndex = room.players.findIndex((p) => p.id === playerId)
    if (playerIndex === -1) return false

    room.players.splice(playerIndex, 1)
    room.currentPlayers--

    // Delete room if empty
    if (room.players.length === 0) {
      this.rooms.delete(roomId)
      this.wsConnections.delete(roomId)
    } else {
      this.rooms.set(roomId, room)
    }

    return true
  }

  addGuess(roomId: string, playerId: string, guessNumber: string): Guess | null {
    const room = this.rooms.get(roomId)
    if (!room || !room.targetNumber) return null

    const player = room.players.find((p) => p.id === playerId)
    if (!player) return null

    const { correctCount, correctPositionCount } = calculateGuessResult(guessNumber, room.targetNumber)

    const guess: Guess = {
      number: guessNumber,
      correctCount,
      correctPositionCount,
      timestamp: Date.now(),
      playerId: player.id,
      playerName: player.name,
    }

    player.guesses.push(guess)

    if (correctPositionCount === room.targetDigits) {
      player.hasWon = true
    }

    this.rooms.set(roomId, room)
    return guess
  }

  // WebSocket connection management
  addConnection(roomId: string, ws: any): void {
    if (!this.wsConnections.has(roomId)) {
      this.wsConnections.set(roomId, new Set())
    }
    this.wsConnections.get(roomId)!.add(ws)
  }

  removeConnection(roomId: string, ws: any): void {
    const connections = this.wsConnections.get(roomId)
    if (connections) {
      connections.delete(ws)
      if (connections.size === 0) {
        this.wsConnections.delete(roomId)
      }
    }
  }

  broadcast(roomId: string, message: any): void {
    const connections = this.wsConnections.get(roomId)
    if (connections) {
      const messageStr = JSON.stringify(message)
      connections.forEach((ws) => {
        if (ws.readyState === 1) {
          // OPEN
          ws.send(messageStr)
        }
      })
    }
  }
}

export const roomStore = new RoomStore()
