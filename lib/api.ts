import type { Room, Guess } from './types'

const BASE_URL = process.env.API_BASE

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const msg = await res.text()
    throw new Error(`API Error (${res.status}): ${msg}`)
  }
  return res.json()
}

export const api = {
  // 获取房间列表
  listRooms: (isPublic?: boolean, creatorId?: string) => {
    const uri = creatorId ? `/rooms?creatorId=${creatorId}&isPublic=${isPublic}` : `/rooms?isPublic=${isPublic}`
    return request<Room[]>(uri)
  },

  // 创建房间
  createRoom: (data: Partial<Room>) =>
    request<Room>('/rooms', { method: 'POST', body: JSON.stringify(data) }),

  // 获取房间详情
  getRoom: (roomId: string, password?: string) => request<Room>(`/room/${roomId}`, {
    method: 'GET',
    headers: {
      'X-Auth-Code': password || '',
    },
  }),

  // 加入房间
  joinRoom: (roomId: string, playerId: string, password?: string) =>
    request<{ canJoin: boolean, reason?: string }>(`/room/${roomId}/join`, {
      method: 'POST',
      body: JSON.stringify({ 
        playerId,
        password: password,
      }),
    }),

  // 离开房间
  leaveRoom: (id: string, playerId: string) =>
    request<Room>(`/rooms/${id}/leave`, {
      method: 'POST',
      body: JSON.stringify({ playerId }),
    }),

  // 提交猜测
  makeGuess: (id: string, guess: Partial<Guess>) =>
    request<Guess>(`/rooms/${id}/guess`, {
      method: 'POST',
      body: JSON.stringify(guess),
    }),
}
