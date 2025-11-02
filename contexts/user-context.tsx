'use client'

import { createContext, useContext, useEffect, useState } from 'react'

import type React from 'react'

import { getUserId, getUserName, setUserName as saveUserName, getUserRoomsPassword, setUserRoomsPassword as saveUserRoomsPassword } from '@/lib/user'

interface UserContextType {
  userId: string
  userName: string
  setUserName: (name: string) => void
  setUserRoomPassword: (roomId: string, password: string) => void
  getUserRoomPassword: (roomId: string) => string | undefined
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState('')
  const [userName, setUserNameState] = useState('')
  const [userRoomsPassword, setUserRoomsPasswordState] = useState<Record<string, string>>({})

  useEffect(() => {
    setUserId(getUserId())
    setUserNameState(getUserName())
    setUserRoomsPasswordState(getUserRoomsPassword())
  }, [])

  const setUserName = (name: string) => {
    saveUserName(name)
    setUserNameState(name)
  }

  const setUserRoomPassword = (roomId: string, password: string) => {
    saveUserRoomsPassword(roomId, password)
    setUserRoomsPasswordState((prev) => ({ ...prev, [roomId]: password }))
  }
  const getUserRoomPassword = (roomId: string) => {
    return userRoomsPassword[roomId]
  }

  return <UserContext.Provider value={{ userId, userName, setUserName, setUserRoomPassword, getUserRoomPassword }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
