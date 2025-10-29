"use client"

import { usePathname, useRouter } from "next/navigation"
import { Home, Plus, FolderOpen } from "lucide-react"

export function IOSNav() {
  const pathname = usePathname()
  const router = useRouter()

  if (pathname.startsWith("/room/")) {
    return null
  }

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Plus, label: "Create", path: "/create" },
    { icon: FolderOpen, label: "My Rooms", path: "/my-rooms" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="ios-blur border-t border-border/50 bg-background/80">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around h-20">
            {navItems.map((item) => {
              const isActive = pathname === item.path
              const Icon = item.icon

              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className="flex flex-col items-center justify-center gap-1 min-w-[60px] ios-transition"
                >
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-2xl ios-transition ${
                      isActive
                        ? "bg-primary text-primary-foreground scale-105"
                        : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span
                    className={`text-xs font-medium ios-transition ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
