import { roomStore } from "@/lib/room-store"
import type { WSMessage, WSResponse } from "@/lib/types"

export async function GET(request: Request, { params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params
  const upgradeHeader = request.headers.get("upgrade")

  if (upgradeHeader !== "websocket") {
    return new Response("Expected websocket", { status: 426 })
  }

  // Note: WebSocket support in Next.js requires custom server or edge runtime
  // This is a placeholder - actual implementation depends on deployment platform
  const room = roomStore.getRoom(roomId)
  if (!room) {
    return new Response("Room not found", { status: 404 })
  }

  // For Vercel deployment, WebSocket needs to be handled differently
  // This would work with a custom Node.js server
  return new Response("WebSocket endpoint - requires custom server setup", { status: 501 })
}

// WebSocket handler function (to be used with custom server)
export function handleWebSocket(ws: any, roomId: string) {
  roomStore.addConnection(roomId, ws)

  ws.on("message", (data: string) => {
    try {
      const message: WSMessage = JSON.parse(data)

      switch (message.type) {
        case "join": {
          const success = roomStore.joinRoom(roomId, message.playerId, message.playerName, message.password)

          if (success) {
            const room = roomStore.getRoom(roomId)
            if (room) {
              const response: WSResponse = { type: "room-state", room }
              ws.send(JSON.stringify(response))

              const player = room.players.find((p) => p.id === message.playerId)
              if (player) {
                const joinResponse: WSResponse = { type: "player-joined", player }
                roomStore.broadcast(roomId, joinResponse)
              }
            }
          } else {
            const errorResponse: WSResponse = { type: "error", message: "Failed to join room" }
            ws.send(JSON.stringify(errorResponse))
          }
          break
        }

        case "guess": {
          const guess = roomStore.addGuess(roomId, message.playerId, message.number)
          if (guess) {
            const response: WSResponse = {
              type: "guess-result",
              playerId: message.playerId,
              guess,
            }
            roomStore.broadcast(roomId, response)

            // Check if player won
            if (guess.correctPositionCount === 4) {
              const room = roomStore.getRoom(roomId)
              const player = room?.players.find((p) => p.id === message.playerId)
              if (player) {
                const winResponse: WSResponse = {
                  type: "game-won",
                  playerId: message.playerId,
                  playerName: player.name,
                }
                roomStore.broadcast(roomId, winResponse)
              }
            }
          }
          break
        }

        case "leave": {
          roomStore.leaveRoom(roomId, message.playerId)
          const response: WSResponse = { type: "player-left", playerId: message.playerId }
          roomStore.broadcast(roomId, response)
          ws.close()
          break
        }
      }
    } catch (error) {
      console.error("[v0] WebSocket message error:", error)
    }
  })

  ws.on("close", () => {
    roomStore.removeConnection(roomId, ws)
  })
}
