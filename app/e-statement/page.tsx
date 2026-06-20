'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

import Sidebar from '@/components/sidebar'
import { Search, Bell, ChevronLeft } from '@/components/Icons' // Assuming ChevronLeft is available

interface Account {
  id: number
  account_number: string
  account_name: string
  balance: string | number
}

// Mock Transaction Data for the Statement Generation
const mockTransactions = [
  {
    date: '2026-06-15',
    desc: 'Salary Deposit - Tech Corp',
    ref: 'TRX-98234',
    debit: '-',
    credit: '150,000.00',
    balance: '150,000.00'
  },
  {
    date: '2026-06-16',
    desc: 'Keells Supermarket',
    ref: 'POS-00912',
    debit: '8,450.00',
    credit: '-',
    balance: '141,550.00'
  },
  {
    date: '2026-06-18',
    desc: 'CEB Bill Payment',
    ref: 'BIL-44512',
    debit: '4,500.00',
    credit: '-',
    balance: '137,050.00'
  },
  {
    date: '2026-06-19',
    desc: 'Uber Rides',
    ref: 'POS-11234',
    debit: '1,200.00',
    credit: '-',
    balance: '135,850.00'
  },
  {
    date: '2026-06-20',
    desc: 'Transfer from HKDS',
    ref: 'TRX-11992',
    debit: '-',
    credit: '15,000.00',
    balance: '150,850.00'
  }
]

export default function EStatementPage() {
  const router = useRouter()

  // State
  const [userName, setUserName] = useState<string>('User')
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedAccountId, setSelectedAccountId] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showStatement, setShowStatement] = useState(false)

  // Auth & Data Fetching
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const extractedName = user.email ? user.email.split('@')[0] : 'User'
        const capitalizedName =
          extractedName.charAt(0).toUpperCase() + extractedName.slice(1)
        setUserName(capitalizedName)

        try {
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
          setIsLoading(false)
        }
      } else {
        router.push('/login')
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAccountId) return

    setIsGenerating(true)
    setShowStatement(false)

    // Simulate secure document generation time
    setTimeout(() => {
      setIsGenerating(false)
      setShowStatement(true)
    }, 1500)
  }

  const handleDownload = () => {
    // Quick hackathon trick: opens the browser print dialog to save as PDF
    window.print()
  }

  const activeAccount = accounts.find(
    (a) => a.account_number === selectedAccountId
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-white font-semibold">
        Loading Secure Vault...
      </div>
    )
  }

  return (
    <main className="app-container print-friendly">
      <div className="bg-glow-1 no-print" />
      <div className="bg-glow-2 no-print" />

      <div className="no-print h-full">
        <Sidebar />
      </div>

      <section className="content z-10 w-full">
        {/* Header */}
        <header className="content-header no-print">
          <h1 className="page-title">E-Statement</h1>
          <div className="header-actions">
            <div className="icon-wrapper">
              <Search size={22} />
            </div>
            <div className="icon-wrapper relative">
              <Bell size={22} />
              <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            <img src="/avatar.png" alt="Profile" className="avatar bg-white" />
          </div>
        </header>

        <div className="max-w-[1000px] mx-auto space-y-8">
          {/* Form Control Panel */}
          <div className="glass-panel p-8 rounded-3xl no-print">
            <h2 className="text-xl font-bold text-white mb-6">
              Generate Statement
            </h2>
            <form
              onSubmit={handleGenerate}
              className="flex flex-col md:flex-row items-end gap-6"
            >
              <div className="w-full md:flex-1 space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">
                  Select Account
                </label>
                <select
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="glass-input select-dropdown w-full"
                  disabled={isGenerating}
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
                      {acc.account_name} - **** {acc.account_number.slice(-4)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full md:w-auto">
                <button
                  type="submit"
                  disabled={isGenerating || !selectedAccountId}
                  className="btn-primary w-full md:w-48"
                >
                  {isGenerating ? 'GENERATING...' : 'GENERATE'}
                </button>
              </div>
            </form>
          </div>

          {/* Statement Preview Area */}
          {showStatement && activeAccount && (
            <div className="statement-paper fade-in rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
              {/* Watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none">
                <span className="text-[200px] font-black tracking-tighter">
                  NOVA
                </span>
              </div>

              {/* Action Bar (Only visible on screen) */}
              <div className="absolute top-8 right-8 no-print">
                <button
                  onClick={handleDownload}
                  className="btn-secondary px-6 py-2 text-sm"
                >
                  Download PDF
                </button>
              </div>

              {/* Document Header */}
              <div className="flex items-center gap-6 mb-12 border-b border-white/10 pb-8">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  <span className="text-4xl font-black text-indigo-900 tracking-tighter">
                    N
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-widest text-white">
                    NOVA BANK
                  </h1>
                  <p className="text-gray-400 tracking-widest text-sm uppercase mt-1">
                    Official E-Statement
                  </p>
                </div>
              </div>

              {/* Account Info Grid */}
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                      Account Holder
                    </p>
                    <p className="text-lg font-semibold text-white">
                      {userName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                      Account Name
                    </p>
                    <p className="text-white font-medium">
                      {activeAccount.account_name}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                      Account Number
                    </p>
                    <p className="text-lg font-mono text-white tracking-widest">
                      {activeAccount.account_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                      Statement Period
                    </p>
                    <p className="text-white font-medium">
                      June 01, 2026 – June 30, 2026
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary Box */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-12 flex justify-between items-center">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Credits</p>
                  <p className="text-green-400 font-semibold">Rs. 165,000.00</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Debits</p>
                  <p className="text-red-400 font-semibold">Rs. 14,150.00</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">
                    Closing Balance
                  </p>
                  <p className="text-3xl font-bold text-white">
                    Rs. {activeAccount.balance}
                  </p>
                </div>
              </div>

              {/* Transactions Table */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-4">
                  Transaction Details
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="py-4 text-gray-500 font-medium text-sm w-[15%]">
                          Date
                        </th>
                        <th className="py-4 text-gray-500 font-medium text-sm w-[35%]">
                          Description
                        </th>
                        <th className="py-4 text-gray-500 font-medium text-sm w-[15%]">
                          Ref ID
                        </th>
                        <th className="py-4 text-gray-500 font-medium text-sm text-right w-[10%]">
                          Debit
                        </th>
                        <th className="py-4 text-gray-500 font-medium text-sm text-right w-[10%]">
                          Credit
                        </th>
                        <th className="py-4 text-gray-500 font-medium text-sm text-right w-[15%]">
                          Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm border-t border-white/5">
                      {mockTransactions.map((trx, index) => (
                        <tr
                          key={index}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-4 text-gray-300">{trx.date}</td>
                          <td className="py-4 text-white font-medium">
                            {trx.desc}
                          </td>
                          <td className="py-4 text-gray-400 font-mono text-xs">
                            {trx.ref}
                          </td>
                          <td className="py-4 text-red-400 text-right">
                            {trx.debit}
                          </td>
                          <td className="py-4 text-green-400 text-right">
                            {trx.credit}
                          </td>
                          <td className="py-4 text-white text-right font-semibold">
                            {trx.balance}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-16 text-center text-gray-600 text-xs border-t border-white/10 pt-6">
                This is a computer-generated document and does not require a
                signature. <br />
                Generated securely on {new Date().toLocaleDateString()} by Nova
                Bank Systems.
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Cinematic & Print CSS */}
      <style jsx>{`
        .app-container {
          width: 100vw; min-height: 100vh; background: #09090b; display: flex;
          font-family: system-ui, -apple-system, sans-serif; position: relative; color: #ffffff;
        }

        .bg-glow-1 {
          position: absolute; top: -10%; left: -10%; width: 600px; height: 600px;
          background: rgba(79, 70, 229, 0.15); border-radius: 50%; filter: blur(120px); pointer-events: none;
        }

        .bg-glow-2 {
          position: absolute; bottom: -10%; right: -10%; width: 500px; height: 500px;
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

        .glass-panel {
          background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.05); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .glass-input {
          height: 56px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);
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
          border-radius: 12px; background: rgba(255,255,255,0.05); color: white; font-weight: 600; cursor: pointer; transition: all 0.2s; border: 1px solid rgba(255,255,255,0.1);
        }
        .btn-secondary:hover { background: rgba(255,255,255,0.1); }

        .statement-paper {
          background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
          backdrop-filter: blur(40px); border: 1px solid rgba(255,255,255,0.08);
        }

        .fade-in { animation: fadeIn 0.5s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        /* Print Specific CSS */
        @media print {
          @page { margin: 0; size: auto; }
          body { background: white !important; color: black !important; }
          .app-container { background: white !important; display: block; overflow: visible; height: auto; }
          .no-print { display: none !important; }
          .statement-paper {
            background: white !important; color: black !important; border: none !important; box-shadow: none !important;
            padding: 2cm !important; margin: 0 !important; width: 100% !important;
          }
          .statement-paper * { color: black !important; border-color: #ddd !important; }
          .bg-white\\/5 { background: #f9f9f9 !important; border-color: #eee !important; }
          .text-white, .text-gray-300, .text-gray-400, .text-gray-500 { color: #333 !important; }
          .text-green-400 { color: #16a34a !important; }
          .text-red-400 { color: #dc2626 !important; }
        }

        @media (max-width: 768px) {
          .app-container { flex-direction: column; }
          .content { padding: 1.5rem 1rem; }
        }
      `}</style>
    </main>
  )
}
