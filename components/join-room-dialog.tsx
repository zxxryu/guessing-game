"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { LogIn } from "lucide-react"

export function JoinRoomDialog() {
  const [open, setOpen] = useState(false)
  const [roomId, setRoomId] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleJoin = async () => {
    if (!roomId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a room ID",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/room/${roomId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, password: password || undefined }),
      })

      const data = await response.json()

      if (data.canJoin) {
        router.push(`/room/${roomId}`)
        setOpen(false)
      } else {
        toast({
          title: "Cannot join room",
          description: data.reason || "Unknown error",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join room",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full rounded-2xl h-14 text-base font-semibold shadow-sm">
          <LogIn className="h-5 w-5 mr-2" />
          Join with Room ID
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Join Room</DialogTitle>
          <DialogDescription className="text-base">
            Enter the room ID and password (if required) to join a game.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="roomId" className="text-base font-medium">
              Room ID
            </Label>
            <Input
              id="roomId"
              placeholder="room_xxxxx"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="h-12 rounded-xl text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-base font-medium">
              Password (optional)
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password if required"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-xl text-base"
            />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl h-11 flex-1">
            Cancel
          </Button>
          <Button onClick={handleJoin} disabled={loading} className="rounded-xl h-11 flex-1">
            {loading ? "Joining..." : "Join Room"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
