'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

import Sidebar from '../../components/sidebar'
import { Bell, Search, ChevronRight } from '../../components/Icons'

// Mock Analytics Data for the Hackathon Demo
const spendingCategories = [
  {
    name: 'Food & Dining',
    amount: 45000,
    percentage: 45,
    color: 'from-orange-400 to-orange-600'
  },
  {
    name: 'Transportation',
    amount: 25000,
    percentage: 25,
    color: 'from-blue-400 to-blue-600'
  },
  {
    name: 'Shopping',
    amount: 15000,
    percentage: 15,
    color: 'from-purple-400 to-purple-600'
  },
  {
    name: 'Bills & Utilities',
    amount: 15000,
    percentage: 15,
    color: 'from-green-400 to-green-600'
  }
]

const recentSpends = [
  {
    merchant: 'Uber',
    category: 'Transportation',
    date: 'Today, 2:30 PM',
    amount: '-Rs. 1,200',
    icon: '🚗'
  },
  {
    merchant: 'Keells Super',
    category: 'Food & Dining',
    date: 'Yesterday',
    amount: '-Rs. 8,450',
    icon: '🛒'
  },
  {
    merchant: 'Daraz',
    category: 'Food & Dining',
    date: 'Oct 14',
    amount: '-Rs. 3,200',
    icon: '🛍️'
  },
  {
    merchant: 'Netflix',
    category: 'Entertainment',
    date: 'Oct 12',
    amount: '-Rs. 2,500',
    icon: '🎬'
  }
]

export default function SmartSpendPage() {
  const router = useRouter()
  const [userName, setUserName] = useState<string>('User')
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [animateCharts, setAnimateCharts] = useState(false)

  // Auth Protection
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const extractedName = user.email ? user.email.split('@')[0] : 'User'
        const capitalizedName =
          extractedName.charAt(0).toUpperCase() + extractedName.slice(1)
        setUserName(capitalizedName)
        setIsAuthLoading(false)

        // Trigger chart animations slightly after load for a cool visual effect
        setTimeout(() => setAnimateCharts(true), 100)
      } else {
        router.push('/login')
      }
    })

    return () => unsubscribe()
  }, [router])

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-white font-semibold">
        Loading Analytics...
      </div>
    )
  }

  return (
    <main className="app-container">
      {/* Cinematic Background Glows */}
      <div className="bg-glow-1" />
      <div className="bg-glow-2" />

      <Sidebar />

      <section className="content z-10">
        {/* Header */}
        <header className="content-header">
          <h1 className="page-title">Smart Spend</h1>
          <div className="header-actions">
            <div className="icon-wrapper">
              <Search size={22} />
            </div>
            <div className="icon-wrapper relative">
              <Bell size={22} />
              <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            <img src="/person-logo.png" alt="Profile" className="avatar" />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Overview & Categories */}
          <div className="lg:col-span-2 space-y-8">
            {/* Total Spent Card */}
            <div className="glass-card flex flex-col justify-center p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-500" />

              <h2 className="text-gray-400 font-medium mb-2 uppercase tracking-wider text-sm">
                Total Spent This Month
              </h2>
              <div className="flex items-end gap-4">
                <span className="text-5xl font-black text-white tracking-tight">
                  Rs. 100,000
                </span>
                <span className="text-red-400 font-medium bg-red-400/10 px-2 py-1 rounded-lg text-sm mb-1 border border-red-400/20">
                  +12.5% vs last month
                </span>
              </div>
            </div>

            {/* Spending Categories */}
            <div className="glass-card p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-white">
                  Spend by Category
                </h2>
                <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition">
                  View Details
                </button>
              </div>

              <div className="space-y-6">
                {spendingCategories.map((cat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300 font-medium">
                        {cat.name}
                      </span>
                      <span className="text-white font-bold">
                        Rs. {cat.amount.toLocaleString()}
                      </span>
                    </div>
                    {/* Animated Progress Bar */}
                    <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden border border-white/5">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${cat.color} transition-all duration-1000 ease-out`}
                        style={{
                          width: animateCharts ? `${cat.percentage}%` : '0%'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: AI Insights & Recent */}
          <div className="space-y-8">
            {/* Nova AI Insight Card */}
            <div className="glass-card p-6 border-indigo-500/30 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl animate-pulse" />

              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/40">
                  <span className="text-white font-black text-sm tracking-tighter">
                    AI
                  </span>
                </div>
                <h3 className="text-indigo-400 font-bold tracking-wide">
                  NOVA INSIGHT
                </h3>
              </div>

              <p className="text-gray-300 leading-relaxed text-sm">
                <span className="text-white font-semibold">
                  Hey {userName},
                </span>{' '}
                you have spent 45% of your budget on Food & Dining this month.
                Consider cutting back on restaurant expenses to reach your
                savings goal of Rs. 50,000.
              </p>

              <button className="mt-6 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-sm transition">
                Create Savings Goal
              </button>
            </div>

            {/* Recent Transactions List */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-white mb-6">
                Recent Spends
              </h3>
              <div className="space-y-5">
                {recentSpends.map((spend, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl group-hover:scale-110 group-hover:bg-white/10 transition">
                        {spend.icon}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">
                          {spend.merchant}
                        </p>
                        <p className="text-gray-500 text-xs">{spend.date}</p>
                      </div>
                    </div>
                    <span className="text-white font-semibold text-sm">
                      {spend.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cinematic Theme CSS */}
      <style jsx>{`
        .app-container {
          width: 100vw; min-height: 100vh; background: #09090b; display: flex;
          overflow: hidden; font-family: system-ui, -apple-system, sans-serif;
          position: relative; color: #ffffff;
        }

        .bg-glow-1 {
          position: absolute; top: -10%; right: -10%; width: 600px; height: 600px;
          background: rgba(79, 70, 229, 0.15); border-radius: 50%; filter: blur(120px); pointer-events: none;
        }

        .bg-glow-2 {
          position: absolute; bottom: -10%; left: -5%; width: 500px; height: 500px;
          background: rgba(147, 51, 234, 0.1); border-radius: 50%; filter: blur(100px); pointer-events: none;
        }

        .content { flex: 1; padding: 2rem 2.5rem; overflow-y: auto; min-width: 0; }
        .content-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }

        .page-title {
          font-size: 32px; font-weight: 700; letter-spacing: -0.5px;
          background: linear-gradient(to right, #ffffff, #a1a1aa);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        .header-actions { display: flex; align-items: center; gap: 1.5rem; }

        .icon-wrapper {
          width: 45px; height: 45px; display: flex; align-items: center; justify-content: center;
          background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%; cursor: pointer; transition: all 0.2s ease; color: #a1a1aa;
        }
        .icon-wrapper:hover { background: rgba(79, 70, 229, 0.2); color: #ffffff; border-color: rgba(79, 70, 229, 0.5); }

        .avatar {
          width: 45px; height: 45px; border-radius: 50%; object-fit: cover;
          border: 2px solid rgba(255,255,255,0.1); cursor: pointer; transition: all 0.2s ease;
        }
        .avatar:hover { border-color: #4f46e5; transform: scale(1.05); }

        .glass-card {
          background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        @media (max-width: 768px) {
          .app-container { flex-direction: column; }
          .content { padding: 1.5rem 1rem; }
        }
      `}</style>
    </main>
  )
}
