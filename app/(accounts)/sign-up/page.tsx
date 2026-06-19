'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthButton from '@/components/authButton'

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    accountNumber: '',
    accountName: '',
    branch: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    // 1. Guard against double submission
    if (isLoading) return

    // 2. Clear previous errors and validate
    setError('')
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountNumber: formData.accountNumber.trim(),
          accountName: formData.accountName.trim(),
          branch: formData.branch.trim(),
          email: formData.email.trim(),
          password: formData.password
        })
      })

      const data = await res.json().catch(() => ({ error: 'Unknown error' }))

      if (res.ok) {
        alert('Account created! You can now log in.')
        router.push('/login')
      } else {
        setError(data.error || 'Failed to create account.')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="mx-auto min-h-[700px] w-full max-w-[1100px] rounded-[58px] bg-white px-8 py-9 shadow-[0_1px_3px_0_rgba(0,0,0,0.30),0_4px_8px_3px_rgba(0,0,0,0.15)] lg:min-h-[820px] lg:px-14">
      <div className="relative mx-auto w-full max-w-[860px]">
        <img
          src="/loginlogo.png"
          alt="Nova Bank"
          className="absolute left-0 top-0 hidden w-[128px] md:block"
        />

        <h1 className="mb-12 text-center text-[2.6rem] font-bold text-black text-balance">
          SIGN UP
        </h1>

        <form onSubmit={handleSignUp} className="space-y-4">
          {[
            { label: 'Account Number', name: 'accountNumber', type: 'text' },
            { label: 'Account Name', name: 'accountName', type: 'text' },
            { label: 'Branch', name: 'branch', type: 'text' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Password', name: 'password', type: 'password' },
            {
              label: 'Confirm Password',
              name: 'confirmPassword',
              type: 'password'
            }
          ].map((field) => (
            <div
              className="grid items-center gap-4 md:grid-cols-[180px_1fr]"
              key={field.name}
            >
              <label className="text-xl text-black" htmlFor={field.name}>
                {field.label} :
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleChange}
                disabled={isLoading}
                required
                className="h-[64px] w-full rounded-[40px] border-0 bg-[#d9d9d9] px-7 text-lg text-black outline-none transition-opacity disabled:opacity-50"
              />
            </div>
          ))}

          {error && (
            <p className="text-red-500 text-center font-bold animate-in fade-in">
              {error}
            </p>
          )}

          <div className="mt-8 flex justify-center">
            <AuthButton type="submit" disabled={isLoading}>
              {isLoading ? 'CREATING...' : 'SIGN UP'}
            </AuthButton>
          </div>
        </form>
      </div>
    </section>
  )
}
