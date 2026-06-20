'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthButton from '@/components/authButton'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'

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

    if (isLoading) return

    setError('')
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!')
      return
    }

    setIsLoading(true)

    try {
      // 1. Authenticate and create user securely in Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email.trim(),
        formData.password
      )
      const firebaseUser = userCredential.user

      // 2. Sync the rest of the banking data to your Postgres backend
      // (This ensures your existing database logic still works!)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseUid: firebaseUser.uid, // Passing the secure Firebase ID
          accountNumber: formData.accountNumber.trim(),
          accountName: formData.accountName.trim(),
          branch: formData.branch.trim(),
          email: formData.email.trim(),
          password: formData.password // Note: You can remove this from backend later now that Firebase handles passwords!
        })
      })

      const data = await res
        .json()
        .catch(() => ({ error: 'Unknown database error' }))

      if (res.ok) {
        alert('Account created successfully! You can now log in.')
        router.push('/login')
      } else {
        // If DB fails, you might want to delete the Firebase user here in a production app
        setError(data.error || 'Failed to sync account to database.')
      }
    } catch (err: any) {
      // Catch specific Firebase errors for better UX
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered in Firebase.')
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.')
      } else {
        setError('Network or authentication error. Please try again.')
      }
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Embedded CSS for the 3D spinning coins to keep this a single-file drop-in */}
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
        .coin-edge {
          position: absolute;
          width: 20px;
          height: 100%;
          background: #3f3f46;
          transform: rotateY(90deg) translateZ(90px); /* Adjust based on coin radius */
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
                Next-generation banking infrastructure. Secure, lightning-fast,
                and built for the future.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: The Form */}
          <div className="w-full max-w-[550px] mx-auto">
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 lg:p-12 shadow-2xl">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white">
                  N
                </div>
                <h1 className="text-2xl font-bold text-white">Nova Bank</h1>
              </div>

              <h2 className="text-3xl font-semibold text-white mb-8">
                Create your account
              </h2>

              <form onSubmit={handleSignUp} className="space-y-5">
                {[
                  {
                    label: 'Account Number',
                    name: 'accountNumber',
                    type: 'text',
                    placeholder: '0000000000'
                  },
                  {
                    label: 'Account Name',
                    name: 'accountName',
                    type: 'text',
                    placeholder: 'e.g. Savings'
                  },
                  {
                    label: 'Branch',
                    name: 'branch',
                    type: 'text',
                    placeholder: 'City Branch'
                  },
                  {
                    label: 'Email',
                    name: 'email',
                    type: 'email',
                    placeholder: 'name@example.com'
                  },
                  {
                    label: 'Password',
                    name: 'password',
                    type: 'password',
                    placeholder: '••••••••'
                  },
                  {
                    label: 'Confirm Password',
                    name: 'confirmPassword',
                    type: 'password',
                    placeholder: '••••••••'
                  }
                ].map((field) => (
                  <div key={field.name} className="space-y-1.5">
                    <label
                      className="text-sm font-medium text-gray-300 ml-1"
                      htmlFor={field.name}
                    >
                      {field.label}
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleChange}
                      disabled={isLoading}
                      required
                      className="h-[56px] w-full rounded-2xl border border-white/10 bg-black/20 px-5 text-white placeholder:text-gray-600 outline-none transition-all focus:border-indigo-500 focus:bg-black/40 disabled:opacity-50"
                    />
                  </div>
                ))}

                {error && (
                  <p className="text-red-400 text-sm font-medium bg-red-400/10 border border-red-400/20 p-3 rounded-xl animate-in fade-in">
                    {error}
                  </p>
                )}

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="h-[56px] w-full rounded-2xl bg-indigo-600 text-white font-semibold text-lg hover:bg-indigo-700 transition-all focus:ring-4 focus:ring-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'CREATING ACCOUNT...' : 'Get Started'}
                  </button>
                </div>
              </form>

              <p className="mt-8 text-center text-gray-400 text-sm">
                Already have an account?{' '}
                <button
                  onClick={() => router.push('/login')}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                >
                  Log in
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
