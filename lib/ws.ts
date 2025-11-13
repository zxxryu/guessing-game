import type { Guess, Player, Room } from './types'

export type MessageEventPayload =
  | { type: 'room_update'; data: Partial<Room> }
  | { type: 'guess_update'; data: { room: Room, winner?: string } }
  | { type: 'guess_result'; data: { room: Room, winner?: string } }
  | { type: 'player_joined'; data: { connections: number, room: Room } }
  | { type: 'joined'; data: { connections: number, room: Room } }
  | { type: 'player_left'; data: { connections: number, room: Room } }
  | { type: 'error'; data: string }

export function connectRoomSocket(
  roomId: string,
  userId: string,
  onMessage: (msg: MessageEventPayload) => void,
  onOpen?: (event: Event) => void,
  onClose?: (event: CloseEvent) => void,
  onerror?: (event: Event) => void,
) {
  const url = new URL(`${process.env.API_BASE}/room/${roomId}/ws`)
  url.searchParams.set('playerId', userId)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('gg_token')
    if (token) url.searchParams.set('token', token)
  }
  url.protocol = url.protocol.replace('http', 'ws')
  const ws = new WebSocket(url.toString())

  ws.onopen = (event) => {
    console.log(`[WS] Connected to room ${roomId}`)
    onOpen?.(event)
  }
  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data)
      onMessage(msg)
    } catch (e) {
      console.error(e)
      console.warn('[WS] Invalid message', event.data)  
    }
  }
  ws.onclose = (event) => {
    console.log('[WS] Disconnected', event.code, event.reason)
    onClose?.(event)
  }
  ws.onerror = (event) => {
    console.error('[WS] Error', event)
    onerror?.(event)
  }

  return ws
}
