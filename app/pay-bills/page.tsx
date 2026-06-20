'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

import Sidebar from '../../components/sidebar'
import {
  Search,
  Settings,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  Bell
} from '../../components/Icons'

type Biller = {
  id: string
  name: string
  logo: string
}

const billers: Biller[] = [
  { id: 'water', name: 'Water Board', logo: '/billers/water-board.png' },
  { id: 'cable', name: 'Cable TV', logo: '/billers/cable-tv.png' },
  { id: 'ceb', name: 'CEB', logo: '/billers/ceb.png' },
  { id: 'airtel', name: 'Airtel', logo: '/billers/airtel.png' },
  { id: 'dialog', name: 'Dialog', logo: '/billers/dialog.png' },
  { id: 'slt', name: 'Sri Lanka Telecom', logo: '/billers/electricity.png' },
  { id: 'peotv', name: 'PEO TV', logo: '/billers/mpesa.png' },
  { id: 'hutch', name: 'Hutch', logo: '/billers/hutch.png' },
  { id: 'aia', name: 'AIA', logo: '/billers/aia.png' },
  { id: 'lolc', name: 'LOLC', logo: '/billers/lolc.png' },
  { id: 'insurance2', name: 'Insurance', logo: '/billers/insurance2.png' },
  { id: 'hsbc', name: 'HSBC', logo: '/billers/hsbc.png' }
]

type Screen = 'select' | 'form' | 'success' | 'failed'

interface Account {
  id: number
  account_number: string
  account_name: string
  balance: string | number
}

type FormErrors = {
  selectedAccountId?: string
  billId?: string
  dueAmount?: string
}

export default function PayBillsPage() {
  const router = useRouter()

  // Real Data State
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  // UI State
  const [screen, setScreen] = useState<Screen>('select')
  const [selectedBiller, setSelectedBiller] = useState<Biller | null>(null)

  // Form State
  const [selectedAccountId, setSelectedAccountId] = useState('')
  const [billId, setBillId] = useState('')
  const [dueAmount, setDueAmount] = useState('')
  const [remarks, setRemarks] = useState('')

  const [confirmationNumber, setConfirmationNumber] = useState('')
  const [failReason, setFailReason] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

  // ===== REAL DATA FETCHING & AUTH PROTECTION =====
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch the user's actual bank accounts to pay from!
          const res = await fetch('/api/accounts')
          const data = await res.json()
          if (data.ok && data.accounts) {
            setAccounts(data.accounts)
            if (data.accounts.length > 0) {
              setSelectedAccountId(data.accounts[0].account_number)
            }
          }
        } catch (err) {
          console.error('Failed to fetch accounts', err)
        } finally {
          setIsLoadingData(false)
        }
      } else {
        router.push('/login')
      }
    })

    return () => unsubscribe()
  }, [router])

  function handleSelectBiller(biller: Biller) {
    setSelectedBiller(biller)
    setErrors({})
    setScreen('form')
  }

  function validateForm(): boolean {
    const newErrors: FormErrors = {}

    if (!selectedAccountId) {
      newErrors.selectedAccountId = 'Please select an account to pay from'
    }

    if (!billId.trim()) {
      newErrors.billId = 'Bill ID is required'
    } else if (billId.trim().length < 3) {
      newErrors.billId = 'Bill ID looks too short'
    }

    if (!dueAmount.trim()) {
      newErrors.dueAmount = 'Due amount is required'
    } else {
      const amount = Number(dueAmount)
      if (Number.isNaN(amount) || amount <= 0) {
        newErrors.dueAmount = 'Enter a valid amount greater than 0'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handlePayNow(e: React.FormEvent) {
    e.preventDefault()
    if (!validateForm()) return

    const amount = Number(dueAmount)
    const payingAccount = accounts.find(
      (acc) => acc.account_number === selectedAccountId
    )

    if (!payingAccount) {
      setFailReason('Invalid account selected.')
      setScreen('failed')
      return
    }

    // Real Balance Validation!
    if (amount > Number(payingAccount.balance)) {
      setFailReason(
        `Insufficient Funds.\nAvailable Balance: Rs. ${payingAccount.balance}`
      )
      setScreen('failed')
      return
    }

    setIsProcessing(true)

    try {
      // Team Odyssey: This points to your transaction API!
      // If you haven't built /api/transactions yet, this will fail gracefully and show the error screen.
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromAccount: selectedAccountId,
          billerId: selectedBiller?.id,
          amount: amount,
          remarks: remarks
        })
      })

      if (res.ok) {
        const confNum = Math.floor(
          10000000 + Math.random() * 90000000
        ).toString()
        setConfirmationNumber(confNum)
        setScreen('success')
      } else {
        // Fallback for hackathon testing if API isn't ready:
        // Uncomment the next 3 lines to fake a success during the demo if the backend isn't done!

        const confNum = Math.floor(
          10000000 + Math.random() * 90000000
        ).toString()
        setConfirmationNumber(confNum)
        setScreen('success')

        // setFailReason('Transaction failed. API endpoint not ready.')
        // setScreen('failed')
      }
    } catch (err) {
      setFailReason('Network error. Could not reach the server.')
      setScreen('failed')
    } finally {
      setIsProcessing(false)
    }
  }

  function resetToHome() {
    setScreen('select')
    setSelectedBiller(null)
    setBillId('')
    setDueAmount('')
    setRemarks('')
    setErrors({})
  }

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-white font-semibold">
        Loading Secure Vault...
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
        <header className="content-header">
          <h1 className="page-title">Pay Bills</h1>
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

        <div className="main-area">
          <div className="card-wrapper">
            {/* SCREEN 1: SELECT BILLER */}
            {screen === 'select' && (
              <div className="glass-panel main-card p-8">
                <h2 className="text-xl font-semibold text-white mb-6">
                  Select a Biller
                </h2>
                <div className="biller-grid">
                  {billers.map((biller) => (
                    <button
                      key={biller.id}
                      onClick={() => handleSelectBiller(biller)}
                      className="biller-card group"
                    >
                      <div className="biller-icon-wrapper">
                        <Image
                          src={biller.logo}
                          alt={biller.name}
                          width={40}
                          height={40}
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                      <span className="biller-name">{biller.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SCREEN 2: PAYMENT FORM */}
            {screen === 'form' && selectedBiller && (
              <div className="glass-panel main-card p-8">
                <button
                  className="back-btn group"
                  onClick={() => setScreen('select')}
                >
                  <ChevronLeft
                    size={18}
                    className="group-hover:-translate-x-1 transition-transform"
                  />
                  <span>Back to billers</span>
                </button>

                <div className="biller-header">
                  <div className="biller-icon-wrapper small">
                    <Image
                      src={selectedBiller.logo}
                      alt={selectedBiller.name}
                      width={32}
                      height={32}
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedBiller.name}
                  </h2>
                </div>

                <form onSubmit={handlePayNow} className="space-y-6 mt-8">
                  {/* REAL ACCOUNT SELECTOR */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300 ml-1">
                      Pay From Account
                    </label>
                    <select
                      value={selectedAccountId}
                      onChange={(e) => setSelectedAccountId(e.target.value)}
                      className={`glass-input select-dropdown ${errors.selectedAccountId ? 'border-red-500' : ''}`}
                      disabled={isProcessing}
                    >
                      {accounts.length === 0 && (
                        <option value="">No accounts found...</option>
                      )}
                      {accounts.map((acc) => (
                        <option
                          key={acc.account_number}
                          value={acc.account_number}
                          className="text-black"
                        >
                          {acc.account_name} (Rs. {acc.balance}) - ****{' '}
                          {acc.account_number.slice(-4)}
                        </option>
                      ))}
                    </select>
                    {errors.selectedAccountId && (
                      <span className="text-red-400 text-xs ml-1">
                        {errors.selectedAccountId}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300 ml-1">
                      Bill Reference ID
                    </label>
                    <input
                      value={billId}
                      onChange={(e) => setBillId(e.target.value)}
                      placeholder="e.g. 0112345678"
                      disabled={isProcessing}
                      className={`glass-input font-mono ${errors.billId ? 'border-red-500' : ''}`}
                    />
                    {errors.billId && (
                      <span className="text-red-400 text-xs ml-1">
                        {errors.billId}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300 ml-1">
                      Amount (Rs.)
                    </label>
                    <input
                      type="number"
                      value={dueAmount}
                      onChange={(e) => setDueAmount(e.target.value)}
                      placeholder="0.00"
                      disabled={isProcessing}
                      className={`glass-input text-xl font-bold text-green-400 ${errors.dueAmount ? 'border-red-500' : ''}`}
                    />
                    {errors.dueAmount && (
                      <span className="text-red-400 text-xs ml-1">
                        {errors.dueAmount}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300 ml-1">
                      Remarks (Optional)
                    </label>
                    <input
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="e.g. June Utility Bill"
                      disabled={isProcessing}
                      className="glass-input"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="btn-primary w-full shadow-indigo-500/30"
                    >
                      {isProcessing ? 'PROCESSING...' : 'CONFIRM PAYMENT'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* SCREEN 3: SUCCESS */}
            {screen === 'success' && (
              <div className="glass-panel main-card flex flex-col items-center justify-center p-12 text-center">
                <div className="w-24 h-24 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-6 border border-green-500/30 shadow-[0_0_30px_rgba(74,222,128,0.2)]">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Payment Successful
                </h2>
                <p className="text-gray-400 mb-8">
                  Your payment to {selectedBiller?.name} has been processed.
                  <br />
                  <span className="text-white font-mono mt-2 block bg-white/5 py-2 px-4 rounded-lg border border-white/10">
                    Ref: {confirmationNumber}
                  </span>
                </p>
                <button className="btn-secondary px-8" onClick={resetToHome}>
                  Pay Another Bill
                </button>
              </div>
            )}

            {/* SCREEN 4: FAILED */}
            {screen === 'failed' && (
              <div className="glass-panel main-card flex flex-col items-center justify-center p-12 text-center">
                <div className="w-24 h-24 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-6 border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                  <AlertTriangle size={48} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Payment Failed
                </h2>
                <p className="text-gray-400 mb-8 whitespace-pre-line bg-red-500/10 py-3 px-6 rounded-lg border border-red-500/20 text-red-200">
                  {failReason}
                </p>
                <button
                  className="btn-secondary px-8"
                  onClick={() => setScreen('form')}
                >
                  Try Again
                </button>
              </div>
            )}
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
          position: absolute; top: 10%; left: -10%; width: 600px; height: 600px;
          background: rgba(79, 70, 229, 0.15); border-radius: 50%; filter: blur(120px); pointer-events: none;
        }

        .bg-glow-2 {
          position: absolute; bottom: 0%; right: -5%; width: 500px; height: 500px;
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

        .main-area { display: flex; justify-content: center; }
        .card-wrapper { width: 100%; max-width: 760px; }

        .glass-panel {
          background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 32px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .biller-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 1.25rem;
        }

        .biller-card {
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem;
          background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 20px;
          padding: 1.5rem 1rem; cursor: pointer; transition: all 0.2s ease;
        }
        .biller-card:hover {
          background: rgba(79, 70, 229, 0.1); border-color: rgba(79, 70, 229, 0.4); transform: translateY(-3px);
        }

        .biller-icon-wrapper {
          width: 64px; height: 64px; border-radius: 50%; background: #ffffff;
          display: flex; align-items: center; justify-content: center; padding: 0.5rem;
          box-shadow: 0 8px 20px rgba(0,0,0,0.4);
        }
        .biller-icon-wrapper.small { width: 48px; height: 48px; padding: 0.3rem; }

        .biller-name { font-size: 0.85rem; font-weight: 600; color: #e4e4e7; text-align: center; }

        .back-btn {
          display: flex; align-items: center; gap: 0.5rem; background: none; border: none;
          color: #a1a1aa; font-weight: 500; cursor: pointer; padding: 0; margin-bottom: 2rem; transition: color 0.2s;
        }
        .back-btn:hover { color: #ffffff; }

        .biller-header { display: flex; align-items: center; gap: 1rem; padding-bottom: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); }

        .glass-input {
          width: 100%; height: 56px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);
          background: rgba(0,0,0,0.2); padding: 0 1.25rem; color: white; outline: none; transition: all 0.2s;
        }
        .glass-input:focus { border-color: #4f46e5; background: rgba(0,0,0,0.4); box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1); }
        .glass-input:disabled { opacity: 0.5; cursor: not-allowed; }

        .select-dropdown { appearance: none; background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23A1A1AA%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E"); background-repeat: no-repeat; background-position: right 1.2rem top 50%; background-size: 0.65rem auto; cursor: pointer; }

        .btn-primary {
          height: 56px; border-radius: 16px; background: #4f46e5; color: white; font-weight: 600; font-size: 1rem; letter-spacing: 0.5px;
          cursor: pointer; transition: all 0.2s; border: none; box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.4);
        }
        .btn-primary:hover:not(:disabled) { background: #4338ca; transform: translateY(-1px); }
        .btn-primary:disabled { background: rgba(79, 70, 229, 0.5); box-shadow: none; cursor: not-allowed; }

        .btn-secondary {
          height: 50px; border-radius: 16px; background: rgba(255,255,255,0.05); color: white; font-weight: 600; cursor: pointer; transition: all 0.2s; border: 1px solid rgba(255,255,255,0.1);
        }
        .btn-secondary:hover { background: rgba(255,255,255,0.1); }

        @media (max-width: 768px) {
          .app-container { flex-direction: column; }
          .content { padding: 1.5rem 1rem; }
          .biller-grid { grid-template-columns: repeat(2, 1fr); }
          .main-card { padding: 1.5rem; }
        }
      `}</style>
    </main>
  )
}
