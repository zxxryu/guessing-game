'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { login, register } from '@/lib/auth'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      toast({ title: 'Error', description: '请输入用户名与密码', variant: 'destructive' })
      return
    }
    setLoading(true)
    try {
      if (mode === 'login') await login(username.trim(), password)
      else await register(username.trim(), password)
      toast({ title: '成功', description: '正在进入游戏...' })
      router.replace('/')
    } catch (err) {
      toast({ title: '认证失败', description: err instanceof Error ? err.message : '请稍后重试', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md ios-card rounded-3xl p-6">
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-muted rounded-xl p-1">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${mode === 'login' ? 'bg-background shadow' : ''}`}
              onClick={() => setMode('login')}
            >登录</button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${mode === 'register' ? 'bg-background shadow' : ''}`}
              onClick={() => setMode('register')}
            >注册</button>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">用户名</Label>
            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="输入用户名" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="输入密码" />
          </div>
          <Button type="submit" className="w-full h-12 rounded-2xl" disabled={loading}>
            {loading ? (mode === 'login' ? '登录中...' : '注册中...') : (mode === 'login' ? '登录' : '注册')}
          </Button>
        </form>
      </div>
    </div>
  )
}
