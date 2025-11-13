// User ID management using localStorage
const USER_ID_KEY = 'guessing-game-user-id'
const USER_NAME_KEY = 'guessing-game-user-name'
const USER_ROOMS_PASSWORD_KEY = 'guessing-game-user-rooms-password'

export function getUserId(): string {
  if (typeof window === 'undefined') return ''
  const authRaw = localStorage.getItem('gg_user')
  if (authRaw) {
    try {
      const u = JSON.parse(authRaw)
      if (u?.id) return u.id as string
    } catch {}
  }
  let userId = localStorage.getItem(USER_ID_KEY)
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem(USER_ID_KEY, userId)
  }
  return userId
}

export function getUserName(): string {
  if (typeof window === 'undefined') return ''
  const authRaw = localStorage.getItem('gg_user')
  if (authRaw) {
    try {
      const u = JSON.parse(authRaw)
      if (u?.username) return u.username as string
    } catch {}
  }
  let userName = localStorage.getItem(USER_NAME_KEY)
  if (!userName) {
    userName = `Player${Math.floor(Math.random() * 9999)}`
    localStorage.setItem(USER_NAME_KEY, userName)
  }
  return userName
}

export function setUserName(name: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(USER_NAME_KEY, name)
}


export function getUserRoomsPassword(): Record<string, string> {
  if (typeof window === 'undefined') return {}

  let roomsPassword = localStorage.getItem(USER_ROOMS_PASSWORD_KEY)
  if (!roomsPassword) {
    roomsPassword = JSON.stringify({})
    localStorage.setItem(USER_ROOMS_PASSWORD_KEY, roomsPassword)
  }
  return JSON.parse(roomsPassword) as Record<string, string>
}
export function setUserRoomsPassword(roomId: string, password: string) {
  if (typeof window === 'undefined') return ''

  let roomsPassword = localStorage.getItem(USER_ROOMS_PASSWORD_KEY)
  if (!roomsPassword) {
    roomsPassword = JSON.stringify({})
  }
  const passwordObj = JSON.parse(roomsPassword)
  passwordObj[roomId] = password
  localStorage.setItem(USER_ROOMS_PASSWORD_KEY, JSON.stringify(passwordObj))
}
