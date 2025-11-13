type AuthUser = { id: string, username: string }

const TOKEN_KEY = 'gg_token'
const USER_KEY = 'gg_user'

export function setToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setUser(user: AuthUser): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try { return JSON.parse(raw) as AuthUser } catch { return null }
}

export function clearAuth(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export async function register(username: string, password: string) {
  const { api } = await import('./api')
  const res = await api.register(username, password)
  setToken(res.token)
  setUser(res.user)
  return res.user
}

export async function login(username: string, password: string) {
  const { api } = await import('./api')
  const res = await api.login(username, password)
  setToken(res.token)
  setUser(res.user)
  return res.user
}

export async function me() {
  const { api } = await import('./api')
  try {
    const res = await api.me()
    setUser(res)
    return res
  } catch {
    return null
  }
}
