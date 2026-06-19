'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthButton from '@/components/authButton'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [status, setStatus] = useState('')

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      })

      if (res.ok) {
        alert('Password reset successfully! Please log in.')
        router.push('/login')
      } else {
        setStatus('Invalid OTP or Email.')
      }
    } catch (err) {
      setStatus('Network error.')
    }
  }

  return (
    <section className="mx-auto flex min-h-[500px] w-full max-w-[1100px] items-center justify-center rounded-[58px] bg-white px-8 py-10 shadow-[0_1px_3px_0_rgba(0,0,0,0.30),0_4px_8px_3px_rgba(0,0,0,0.15)] lg:min-h-[684px]">
      <div className="w-full max-w-[670px]">
        <h1 className="mb-16 text-center text-[2.6rem] font-bold text-black text-balance">
          RESET PASSWORD
        </h1>

        <form onSubmit={handleReset} className="space-y-8">
          <div className="grid items-center gap-4 md:grid-cols-[120px_1fr]">
            <label className="text-xl text-black" htmlFor="reset-email">
              Email:
            </label>
            <input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-[64px] rounded-[40px] border-0 bg-[#d9d9d9] px-7 text-lg text-black outline-none"
            />
          </div>

          <div className="grid items-center gap-4 md:grid-cols-[120px_250px]">
            <label className="text-xl text-black" htmlFor="reset-otp">
              OTP:
            </label>
            <input
              id="reset-otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="h-[64px] rounded-[40px] border-0 bg-[#d9d9d9] px-7 text-lg text-black outline-none"
            />
          </div>

          <div className="grid items-center gap-4 md:grid-cols-[120px_250px]">
            <label className="text-xl text-black" htmlFor="reset-password">
              New Password:
            </label>
            <input
              id="reset-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="h-[64px] rounded-[40px] border-0 bg-[#d9d9d9] px-7 text-lg text-black outline-none"
            />
          </div>

          {status && (
            <p className="text-red-500 text-center font-bold">{status}</p>
          )}

          <div className="mt-12 flex justify-center" onClick={handleReset}>
            <AuthButton>RESET</AuthButton>
          </div>
        </form>
      </div>
    </section>
  )
}
