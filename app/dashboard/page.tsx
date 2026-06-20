'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'

import Sidebar from '../../components/sidebar'
import { Bell, ChevronRight, Search } from '../../components/Icons'

const transactions = [
  { date: 'Oct, 16 2025', account: '......3423', amount: '-Rs. 4500.00' },
  { date: 'Oct, 16 2025', account: '......4876', amount: '-Rs. 10,000.00' },
  { date: 'Oct, 16 2025', account: '......6754', amount: '-Rs. 9870.00' }
]

export default function Dashboard() {
  const router = useRouter()
  const [userName, setUserName] = useState<string>('User')
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const extractedName = user.email ? user.email.split('@')[0] : 'User'
        const capitalizedName =
          extractedName.charAt(0).toUpperCase() + extractedName.slice(1)

        setUserName(capitalizedName)
        setIsAuthLoading(false)
      } else {
        router.push('/login')
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-white font-semibold">
        Loading Nova...
      </div>
    )
  }

  return (
    <main className="dashboard">
      {/* Cinematic Background Glows */}
      <div className="bg-glow-1" />
      <div className="bg-glow-2" />

      <Sidebar />

      <section className="content z-10">
        {/* Header */}
        <header className="content-header">
          <h1 className="page-title">Dashboard</h1>
          <div className="header-actions">
            <div className="icon-wrapper">
              <Search size={22} />
            </div>
            <div className="icon-wrapper relative">
              <Bell size={22} />
              <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>

            <img
              src="/person-logo.png"
              alt="profile"
              className="avatar"
              onClick={handleLogout}
              title="Click to logout"
            />
          </div>
        </header>

        {/* Top Section */}
        <div className="top-section">
          <div className="welcome-card glass-panel">
            <h2 className="welcome-title">Welcome back, {userName}!</h2>

            <div className="balance-card">
              <p className="balance-label">Current Balance</p>
              <p className="balance-amount">Rs. 100,000</p>
              <ChevronRight className="balance-chevron" size={24} />
            </div>

            <div className="carousel-dots">
              <span className="dot active" />
              <span className="dot" />
              <span className="dot" />
            </div>
            <img
              src="/dashboard-logo.png"
              alt="woman"
              className="welcome-image"
            />
          </div>

          <div className="payees-card glass-panel">
            <h3 className="payees-title">Saved Payees</h3>
            <div className="payees-list">
              {[1, 2].map((item) => (
                <div key={item} className="payee-item hover-effect">
                  <img
                    src="/person-logo.png"
                    alt="user"
                    className="avatar-sm"
                  />
                  <div className="payee-info">
                    <p>HKDS</p>
                    <p>Wickramanayake</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="view-all">
              View all
              <ChevronRight size={15} />
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="transactions-section">
          <h2 className="transactions-title">Recent Transactions</h2>
          <div className="transactions-card glass-panel">
            {transactions.map((t, index) => (
              <div key={index} className="transaction-item hover-effect">
                <div className="flex items-center gap-4 w-1/3">
                  <img
                    src="/person-logo.png"
                    alt="user"
                    className="avatar-sm"
                  />
                  <span className="transaction-date">{t.date}</span>
                </div>
                <span className="transaction-account w-1/4">{t.account}</span>
                <span className="transaction-amount w-1/4">{t.amount}</span>
                <span className="transaction-status w-auto text-right">
                  Success
                </span>
              </div>
            ))}
            <div className="view-all mt-6">
              View all
              <ChevronRight size={15} />
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .dashboard {
          width: 100vw;
          min-height: 100vh;
          background: #09090b; /* Dark cinematic background */
          display: flex;
          gap: 1.5rem;
          overflow: hidden;
          font-family: system-ui, -apple-system, sans-serif;
          position: relative;
          color: #ffffff;
        }

        .bg-glow-1 {
          position: absolute;
          top: -10%; left: -10%;
          width: 600px; height: 600px;
          background: rgba(79, 70, 229, 0.15); /* Indigo glow */
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
        }

        .bg-glow-2 {
          position: absolute;
          bottom: -10%; right: -10%;
          width: 500px; height: 500px;
          background: rgba(147, 51, 234, 0.1); /* Purple glow */
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
        }

        .content {
          flex: 1;
          padding: 2rem 2.5rem;
          overflow-y: auto;
          min-width: 0;
        }

        .glass-panel {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .page-title {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -0.5px;
          background: linear-gradient(to right, #ffffff, #a1a1aa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .icon-wrapper {
          width: 45px; height: 45px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #a1a1aa;
        }

        .icon-wrapper:hover {
          background: rgba(79, 70, 229, 0.2);
          color: #ffffff;
          border-color: rgba(79, 70, 229, 0.5);
        }

        .avatar, .avatar-sm {
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(255,255,255,0.1);
        }
        
        .avatar {
          width: 45px; height: 45px;
          cursor: pointer; transition: all 0.2s ease;
        }
        .avatar:hover { border-color: #4f46e5; transform: scale(1.05); }
        .avatar-sm { width: 36px; height: 36px; }

        .top-section {
          display: flex; flex-wrap: wrap; gap: 1.5rem;
        }

        .welcome-card {
          width: 640px; max-width: 100%; height: 240px;
          border-radius: 24px; position: relative; overflow: hidden; flex-shrink: 0;
        }

        .welcome-title {
          font-size: 20px; font-weight: 600;
          padding: 1.5rem 1.5rem 0; color: #f4f4f5;
        }

        .balance-card {
          position: absolute; left: 1.5rem; top: 80px;
          width: 380px; max-width: calc(100% - 3rem); height: 110px;
          background: linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(0,0,0,0.6) 100%);
          border: 1px solid rgba(79, 70, 229, 0.3);
          border-radius: 16px;
          display: flex; flex-direction: column; justify-content: center;
          padding: 0 1.5rem;
          transition: transform 0.2s ease, border-color 0.2s ease;
          cursor: pointer;
        }

        .balance-card:hover {
          transform: translateY(-2px);
          border-color: rgba(79, 70, 229, 0.6);
        }

        .balance-label { font-size: 14px; color: #a1a1aa; font-weight: 500; }
        .balance-amount { color: #ffffff; font-size: 28px; font-weight: 700; margin-top: 0.25rem; letter-spacing: 1px;}
        .balance-chevron { position: absolute; right: 1.5rem; color: #4f46e5; }

        .carousel-dots {
          position: absolute; bottom: 1.5rem; left: 1.5rem;
          display: flex; gap: 0.5rem;
        }

        .dot { width: 6px; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; transition: all 0.3s ease;}
        .dot.active { width: 30px; background: #4f46e5; }

        .welcome-image {
          position: absolute; right: 0; bottom: 0;
          height: 260px; object-fit: cover; opacity: 0.9;
          filter: drop-shadow(-10px 0px 20px rgba(0,0,0,0.5));
        }

        .payees-card {
          flex: 1; min-width: 300px; height: 240px;
          border-radius: 24px; padding: 1.5rem;
          display: flex; flex-direction: column;
        }

        .payees-title { font-weight: 600; font-size: 1.1rem; color: #f4f4f5; margin-bottom: 1.5rem; }
        
        .payees-list { display: flex; flex-direction: column; gap: 1rem; flex: 1; }

        .hover-effect {
          padding: 0.75rem;
          border-radius: 12px;
          transition: background 0.2s ease;
          cursor: pointer;
        }
        .hover-effect:hover { background: rgba(255, 255, 255, 0.05); }

        .payee-item { display: flex; align-items: center; gap: 1rem; margin: -0.75rem; }
        
        .payee-info p:first-child { font-weight: 600; color: #e4e4e7; font-size: 14px; }
        .payee-info p:last-child { color: #a1a1aa; font-size: 12px; }

        .view-all {
          text-align: right; font-size: 13px; font-weight: 500;
          display: flex; justify-content: flex-end; align-items: center; gap: 0.25rem;
          color: #818cf8; cursor: pointer; transition: color 0.2s ease;
        }
        .view-all:hover { color: #a5b4fc; }

        .transactions-section { margin-top: 2rem; }
        .transactions-title { font-size: 20px; font-weight: 600; margin-bottom: 1.25rem; color: #f4f4f5; }

        .transactions-card {
          border-radius: 24px; padding: 1.5rem;
          width: 100%; max-width: 1060px; overflow-x: auto;
        }

        .transaction-item {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 0.5rem; flex-wrap: wrap; margin: -0.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .transaction-item:last-of-type { border-bottom: none; }

        .transaction-date { color: #a1a1aa; font-size: 14px; }
        .transaction-account { color: #e4e4e7; font-size: 14px; font-family: monospace; }
        .transaction-amount { color: #ffffff; font-size: 15px; font-weight: 600; }

        .transaction-status {
          background: rgba(74, 222, 128, 0.1);
          color: #4ade80;
          padding: 0.35rem 1rem;
          border-radius: 20px;
          font-size: 12px; font-weight: 600;
          border: 1px solid rgba(74, 222, 128, 0.2);
        }

        @media (max-width: 1024px) {
          .welcome-card { width: 100%; }
        }
        @media (max-width: 768px) {
          .dashboard { flex-direction: column; gap: 0; }
          .content { padding: 1rem; }
          .welcome-card { height: 220px; }
          .balance-card { width: calc(100% - 2rem); left: 1rem; top: 60px; }
          .welcome-image { height: 160px; }
        }
      `}</style>
    </main>
  )
}
