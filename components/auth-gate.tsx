'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('gg_token') : null
    const user = typeof window !== 'undefined' ? localStorage.getItem('gg_user') : null
    const authed = !!token && !!user
    const isAuthPage = pathname === '/auth'
    if (!authed && !isAuthPage) {
      router.replace('/auth')
      return
    }
    setReady(true)
  }, [pathname, router])

  if (!ready) return null
  return <>{children}</>
}
