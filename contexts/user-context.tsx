"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { getUserId, getUserName, setUserName as saveUserName } from "@/lib/user"

interface UserContextType {
  userId: string
  userName: string
  setUserName: (name: string) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState("")
  const [userName, setUserNameState] = useState("")

  useEffect(() => {
    setUserId(getUserId())
    setUserNameState(getUserName())
  }, [])

  const setUserName = (name: string) => {
    saveUserName(name)
    setUserNameState(name)
  }

  return <UserContext.Provider value={{ userId, userName, setUserName }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
