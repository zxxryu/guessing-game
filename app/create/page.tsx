"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useUser } from "@/contexts/user-context"
import { useToast } from "@/hooks/use-toast"
import { Plus, Users, Lock, Shuffle, Key } from "lucide-react"
import type { CreateRoomRequest } from "@/lib/types"

export default function CreateRoomPage() {
  const [roomName, setRoomName] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [password, setPassword] = useState("")
  const [targetNumberType, setTargetNumberType] = useState<"fixed" | "random">("fixed")
  const [targetNumber, setTargetNumber] = useState("")
  const [targetDigits, setTargetDigits] = useState(4)
  const [maxPlayers, setMaxPlayers] = useState(4)
  const [loading, setLoading] = useState(false)
  const { userId, userName } = useUser()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!roomName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a room name",
        variant: "destructive",
      })
      return
    }

    if (!isPublic) {
      if (!password.trim()) {
        toast({
          title: "Error",
          description: "Please enter a password",
          variant: "destructive",
        })
        return
      }
    } else {
      setPassword("")
    }

    if (targetNumberType === "fixed" && !targetNumber.trim()) { 
      toast({
        title: "Error",
        description: "Please enter a target number",
        variant: "destructive",
      })
      return
    }
    if (targetNumberType === "fixed" && (targetNumber.length < 4 || targetNumber.length > 6)) {
      toast({
        title: "Error",
        description: "Target number must be 4-6 digits",
        variant: "destructive",
      })
      return
    }
    if (targetNumberType === "fixed" && !/^\d+$/.test(targetNumber)) {
      toast({
        title: "Error",
        description: "Target number must contain only numbers",
        variant: "destructive",
      })
      return
    }

    if (maxPlayers < 2 || maxPlayers > 10) {
      toast({
        title: "Error",
        description: "Max players must be between 2 and 10",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      let finalTargetNumber = targetNumber
      let finalTargetDigits = targetDigits

      if (targetNumberType === "random") {
        const min = Math.pow(10, targetDigits - 1)
        const max = Math.pow(10, targetDigits) - 1
        finalTargetNumber = Math.floor(Math.random() * (max - min + 1) + min).toString()
        finalTargetDigits = targetDigits
      } else if (targetNumberType === "fixed") {
        finalTargetDigits = targetNumber.length
      }

      const requestBody: CreateRoomRequest = {
        name: roomName,
        isPublic,
        password: isPublic ? undefined : password,
        targetNumberType: targetNumberType,
        targetNumber: finalTargetNumber,
        targetDigits: finalTargetDigits,
        maxPlayers,
        creatorId: userId,
        creatorName: userName,
      }

      console.log(requestBody)

      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error("Failed to create room")
      }

      const data = await response.json()

      toast({
        title: "Room created!",
        description: "Redirecting to your room...",
      })

      router.push(`/room/${data.roomId}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create room",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTargetNumberTypeChange = (type: "fixed" | "random") => {
    setTargetNumberType(type)
    if (type === "fixed") {
      setTargetNumber("")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Create Room</h1>
          <p className="text-lg text-muted-foreground">Set up your game room</p>
        </div>

        <div className="ios-card rounded-3xl p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Room Name */}
            <div className="space-y-3">
              <Label htmlFor="roomName" className="text-base font-semibold">
                Room Name
              </Label>
              <Input
                id="roomName"
                placeholder="My Awesome Game Room"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                maxLength={50}
                className="h-12 rounded-xl text-base"
              />
            </div>

            <div className="space-y-4">
              {/* Number Type Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Number Type
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleTargetNumberTypeChange("fixed")}
                    className={`ios-card rounded-2xl p-4 border-2 transition-all ${
                      targetNumberType === "fixed"
                        ? "border-primary bg-primary/5"
                        : "border-border/50 hover:border-border"
                    }`}
                  >
                    <Key className="h-5 w-5 mb-2 mx-auto" />
                    <div className="text-sm font-semibold">Fixed</div>
                    <div className="text-xs text-muted-foreground mt-1">Set your own</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTargetNumberTypeChange("random")}
                    className={`ios-card rounded-2xl p-4 border-2 transition-all ${
                      targetNumberType === "random"
                        ? "border-primary bg-primary/5"
                        : "border-border/50 hover:border-border"
                    }`}
                  >
                    <Shuffle className="h-5 w-5 mb-2 mx-auto" />
                    <div className="text-sm font-semibold">Random</div>
                    <div className="text-xs text-muted-foreground mt-1">Auto generate</div>
                  </button>
                </div>
              </div>

              {/* Fixed Target Number Input */}
              {targetNumberType === "fixed" && (
                <div className="space-y-3">
                  <Label htmlFor="targetNumber" className="text-base font-semibold">
                    Target Number (4-6 digits)
                  </Label>
                  <Input
                    id="targetNumber"
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter 4-6 digit target number"
                    value={targetNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                      setTargetNumber(value)
                    }}
                    className="h-12 rounded-xl text-base font-mono tracking-wider text-center"
                    maxLength={6}
                  />
                </div>
              )}

              {/* Random Target Number Digits Selection */}
              {targetNumberType === "random" && (
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Target Number Length</Label>
                  <div className="flex gap-3">
                    {[4, 5, 6].map((digits) => (
                      <button
                        key={digits}
                        type="button"
                        onClick={() => setTargetDigits(digits)}
                        className={`flex-1 ios-card rounded-xl p-4 border-2 transition-all ${
                          targetDigits === digits
                            ? "border-primary bg-primary/5"
                            : "border-border/50 hover:border-border"
                        }`}
                      >
                        <div className="text-2xl font-bold">{digits}</div>
                        <div className="text-xs text-muted-foreground mt-1">digits</div>
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    A random {targetDigits}-digit target number will be generated
                  </p>
                </div>
              )}
            </div>

            {/* Public/Private Toggle */}
            <div className="ios-card rounded-2xl p-4 border border-border/50">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <Label htmlFor="isPublic" className="text-base font-semibold">
                    Public Room
                  </Label>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {isPublic ? "Anyone can see and join this room" : "Only people with the password can join"}
                  </p>
                </div>
                <Switch id="isPublic" checked={isPublic} onCheckedChange={setIsPublic} />
              </div>
            </div>

            {/* Password Input */}
            {!isPublic && (
              <div className="space-y-3">
                <Label htmlFor="password" className="text-base font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Room Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  inputMode="text"
                  placeholder="Enter password (4 characters)"
                  value={password}
                  onChange={(e) => {
                    const value = e.target.value.slice(0, 4)
                    setPassword(value)
                  }}
                  className="h-12 rounded-xl text-base"
                  minLength={4}
                  maxLength={4}
                />
              </div>
            )}  

            {/* Max Players */}
            <div className="space-y-3">
              <Label htmlFor="maxPlayers" className="text-base font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                Maximum Players
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  id="maxPlayers"
                  type="number"
                  min={2}
                  max={10}
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(Number.parseInt(e.target.value, 10))}
                  className="w-24 h-12 rounded-xl text-base text-center font-semibold"
                />
                <span className="text-sm text-muted-foreground">Between 2 and 10 players</span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-14 rounded-2xl text-base font-semibold shadow-sm"
              disabled={loading}
            >
              <Plus className="h-5 w-5 mr-2" />
              {loading ? "Creating..." : "Create Room"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
