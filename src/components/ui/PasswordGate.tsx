'use client'

import { useState, useEffect, ReactNode } from 'react'

const STORAGE_KEY = 'ds-tool-auth'
const CORRECT_PASSWORD = 'lean2026'

interface PasswordGateProps {
  children: ReactNode
}

export function PasswordGate({ children }: PasswordGateProps) {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  useEffect(() => {
    const stored = typeof window !== 'undefined'
      ? sessionStorage.getItem(STORAGE_KEY)
      : null
    setAuthed(stored === 'ok')
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (input === CORRECT_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'ok')
      setAuthed(true)
    } else {
      setError(true)
      setShake(true)
      setInput('')
      setTimeout(() => setShake(false), 600)
    }
  }

  // Loading state (before hydration check)
  if (authed === null) return null

  // Authenticated — render children
  if (authed) return <>{children}</>

  // Password form
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-6 justify-center">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <span className="text-base font-semibold text-gray-700">Studist DS</span>
          </div>

          <h1 className="text-center text-lg font-semibold text-gray-800 mb-1">
            デバイスプランニングツール
          </h1>
          <p className="text-center text-sm text-gray-400 mb-6">
            アクセスにはパスワードが必要です
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className={shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}>
              <label className="block text-xs font-medium text-gray-500 mb-1">パスワード</label>
              <input
                type="password"
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(false) }}
                placeholder="パスワードを入力"
                autoFocus
                className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ${
                  error ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {error && (
                <p className="text-xs text-red-500 mt-1">パスワードが違います。もう一度お試しください。</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!input}
              className="w-full bg-blue-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ログイン
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  )
}
