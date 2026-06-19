'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthButton from '@/components/authButton'

export default function LoginPage() {
  const router = useRouter()
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    // Prevent multiple submissions while loading
    if (isLoading) return

    setError('')

    // Basic validation
    if (!account.trim() || !password) {
      setError('Please fill in both fields.')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: account.trim(),
          password: password
        })
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        // Force a hard navigation or cache refresh to ensure middleware picks up the new cookies
        router.push('/dashboard')
        router.refresh()
      } else {
        // Set error from backend, or generic fallback
        setError(data.error || 'Invalid credentials. Please try again.')
      }
    } catch (err) {
      setError('Network error. Is the server running?')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="mx-auto flex min-h-[480px] w-full max-w-[1060px] overflow-hidden rounded-[56px] bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.30),0_4px_8px_3px_rgba(0,0,0,0.15)] lg:min-h-[660px]">
      {/* Decorative Sidebar */}
      <aside
        aria-label="Nova Bank shell artwork"
        className="relative hidden w-[46.2%] shrink-0 overflow-hidden bg-[#1d0730] md:block"
      >
        <img
          src="/loginshellbg.png"
          alt=""
          className="size-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/loginlogo.png"
            alt="Nova Bank"
            className="w-[38%] max-w-[276px]"
          />
        </div>
      </aside>

      {/* Login Form Container */}
      <div className="flex flex-1 items-center justify-center bg-white px-8 py-10">
        <div className="w-full max-w-[450px] text-center">
          <h1 className="mb-11 text-[2.45rem] font-bold text-black text-balance">
            LOGIN
          </h1>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Input */}
            <div className="relative">
              <label className="sr-only" htmlFor="login-account">
                Account name
              </label>
              <img
                src="/person.png"
                alt=""
                aria-hidden="true"
                className="absolute left-8 top-1/2 size-6 -translate-y-1/2"
              />
              <input
                id="login-account"
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="Account name"
                disabled={isLoading}
                className="h-[64px] w-full rounded-[40px] border-0 bg-[#d9d9d9] px-8 pl-20 text-lg text-black shadow-[0_1px_3px_0_rgba(0,0,0,0.30),0_4px_8px_3px_rgba(0,0,0,0.15)] outline-none transition-shadow placeholder:text-black/45 focus:shadow-[0_4px_4px_0_rgba(0,0,0,0.30),0_8px_12px_6px_rgba(0,0,0,0.15)] disabled:opacity-50"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <label className="sr-only" htmlFor="login-password">
                Password
              </label>
              <img
                src="/password.png"
                alt=""
                aria-hidden="true"
                className="absolute left-8 top-1/2 size-6 -translate-y-1/2"
              />
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                disabled={isLoading}
                className="h-[64px] w-full rounded-[40px] border-0 bg-[#d9d9d9] px-8 pl-20 text-lg text-black shadow-[0_1px_3px_0_rgba(0,0,0,0.30),0_4px_8px_3px_rgba(0,0,0,0.15)] outline-none transition-shadow placeholder:text-black/45 focus:shadow-[0_4px_4px_0_rgba(0,0,0,0.30),0_8px_12px_6px_rgba(0,0,0,0.15)] disabled:opacity-50"
              />
            </div>

            {error && (
              <p className="mt-2 text-sm font-semibold text-red-500 animate-in fade-in">
                {error}
              </p>
            )}

            <div className="mt-3 text-right">
              <Link
                href="/reset-password"
                className="text-sm font-bold text-black hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <div className="mt-8">
              <AuthButton type="submit" disabled={isLoading}>
                {isLoading ? 'VERIFYING...' : 'SIGN IN'}
              </AuthButton>
            </div>
          </form>

          <p className="mt-6 text-sm font-bold text-black">
            Don&apos;t have an account?
          </p>
          <Link
            href="/sign-up"
            className="text-2xl font-bold text-black hover:underline"
          >
            SIGN UP
          </Link>
        </div>
      </div>
    </section>
  )
}
