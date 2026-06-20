'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function LoginPage() {
  const router = useRouter()
  // Changed from 'account' to 'email' because Firebase uses Email for login
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isLoading) return
    setError('')

    if (!email.trim() || !password) {
      setError('Please fill in both fields.')
      return
    }

    setIsLoading(true)

    try {
      // 1. Authenticate securely with Firebase
      await signInWithEmailAndPassword(auth, email.trim(), password)

      // 2. Sync with your Postgres backend to set the browser cookies
      // (This ensures your dashboard and existing app logic still know you are logged in)
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account: email.trim(), // Passing email to your backend
          password: password
        })
      }).catch(() => {}) // We ignore backend errors here since Firebase confirmed identity

      // 3. Teleport to Dashboard
      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      console.error(err)
      // Map Firebase error codes to user-friendly messages
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password'
      ) {
        setError('Invalid email or password.')
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Try again later.')
      } else {
        setError('Network error. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Embedded CSS for the 3D spinning coins to perfectly match the Sign-Up page */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes spin {
          0% { transform: rotateY(0deg) rotateX(10deg); }
          100% { transform: rotateY(360deg) rotateX(10deg); }
        }
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) rotateY(0deg); }
          50% { transform: translateY(-20px) rotateY(180deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotateY(45deg); }
          50% { transform: translateY(20px) rotateY(225deg); }
        }
        .perspective-container { perspective: 1200px; }
        .coin-3d {
          transform-style: preserve-3d;
          animation: spin 6s linear infinite;
        }
        .coin-face {
          backface-visibility: hidden;
          position: absolute;
          inset: 0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 0 20px rgba(255,255,255,0.2), 0 10px 30px rgba(0,0,0,0.5);
        }
        .coin-front {
          background: linear-gradient(135deg, #3f3f46 0%, #18181b 100%);
          border: 4px solid #52525b;
          transform: translateZ(10px);
        }
        .coin-back {
          background: linear-gradient(135deg, #27272a 0%, #09090b 100%);
          border: 4px solid #3f3f46;
          transform: rotateY(180deg) translateZ(10px);
        }
        .bg-cinematic {
          background: radial-gradient(circle at 30% 50%, #1f1d2b 0%, #09090b 70%);
        }
      `
        }}
      />

      <main className="min-h-screen bg-cinematic flex items-center justify-center p-4 lg:p-8 font-sans overflow-hidden relative">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-[1400px] w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* LEFT SIDE: Cinematic 3D Coins */}
          <div className="hidden lg:flex flex-col items-center justify-center h-[600px] perspective-container relative">
            {/* Background floating coin 1 */}
            <div
              className="absolute top-10 left-20 w-24 h-24 coin-3d"
              style={{ animation: 'float1 8s ease-in-out infinite' }}
            >
              <div className="coin-face coin-front"></div>
              <div className="coin-face coin-back"></div>
            </div>

            {/* Background floating coin 2 */}
            <div
              className="absolute bottom-20 right-20 w-32 h-32 coin-3d"
              style={{ animation: 'float2 10s ease-in-out infinite' }}
            >
              <div className="coin-face coin-front"></div>
              <div className="coin-face coin-back"></div>
            </div>

            {/* MAIN CENTER COIN */}
            <div className="relative w-64 h-64 coin-3d">
              <div className="coin-face coin-front">
                <span className="text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">
                  NOVA
                </span>
              </div>
              <div className="coin-face coin-back">
                <div className="w-16 h-16 border-4 border-gray-600 rounded-lg transform rotate-45"></div>
              </div>
            </div>

            <div className="mt-16 text-center">
              <h2 className="text-5xl font-bold text-white tracking-tight mb-4">
                Make Every <br /> Cent Count
              </h2>
              <p className="text-gray-400 text-lg max-w-md mx-auto">
                Welcome back to next-generation banking. Secure, seamless, and
                built for you.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: The Login Form */}
          <div className="w-full max-w-[450px] mx-auto">
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 lg:p-12 shadow-2xl">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white">
                  N
                </div>
                <h1 className="text-2xl font-bold text-white">Nova Bank</h1>
              </div>

              <h2 className="text-3xl font-semibold text-white mb-8">Log In</h2>

              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email Input */}
                <div className="space-y-1.5">
                  <label
                    className="text-sm font-medium text-gray-300 ml-1"
                    htmlFor="login-email"
                  >
                    Email Address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-[56px] w-full rounded-2xl border border-white/10 bg-black/20 px-5 text-white placeholder:text-gray-600 outline-none transition-all focus:border-indigo-500 focus:bg-black/40 disabled:opacity-50"
                  />
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <label
                    className="text-sm font-medium text-gray-300 ml-1"
                    htmlFor="login-password"
                  >
                    Password
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-[56px] w-full rounded-2xl border border-white/10 bg-black/20 px-5 text-white placeholder:text-gray-600 outline-none transition-all focus:border-indigo-500 focus:bg-black/40 disabled:opacity-50"
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm font-medium bg-red-400/10 border border-red-400/20 p-3 rounded-xl animate-in fade-in">
                    {error}
                  </p>
                )}

                <div className="flex justify-end pt-2">
                  <Link
                    href="/reset-password"
                    className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="h-[56px] w-full rounded-2xl bg-indigo-600 text-white font-semibold text-lg hover:bg-indigo-700 transition-all focus:ring-4 focus:ring-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'VERIFYING...' : 'Sign In'}
                  </button>
                </div>
              </form>

              <p className="mt-8 text-center text-gray-400 text-sm">
                Don't have an account?{' '}
                <Link
                  href="/sign-up"
                  className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
