'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Sidebar from '@/components/sidebar'
import { Search, Bell } from '@/components/Icons'

type Screen = 'list' | 'add' | 'edit'

interface Account {
  id: number
  account_number: string
  account_name: string
  balance: string
}

export default function AccountsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [screen, setScreen] = useState<Screen>('list')
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const isEditMode = searchParams.get('mode') === 'edit'
  const accountNumberParam = searchParams.get('accountNumber') || ''
  const nicknameParam = searchParams.get('nickname') || ''
  const accountNameParam = searchParams.get('accountName') || ''
  const emailParam = searchParams.get('email') || ''

  const [formData, setFormData] = useState({
    accountNumber: '',
    accountName: '',
    email: '',
    nickname: ''
  })
  const [nickname, setNickname] = useState('')
  const [errors, setErrors] = useState({
    accountNumber: '',
    accountName: '',
    email: '',
    nickname: ''
  })

  // ===== REAL DATA FETCHING =====
  useEffect(() => {
    async function fetchAccounts() {
      setIsLoading(true)
      try {
        const res = await fetch('/api/accounts')
        const data = await res.json()
        if (data.ok && data.accounts) {
          setAccounts(data.accounts)
        }
      } catch (err) {
        console.error('Failed to fetch accounts', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (screen === 'list') {
      fetchAccounts()
    }
  }, [screen])

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        accountNumber: accountNumberParam,
        accountName: accountNameParam,
        email: emailParam,
        nickname: nicknameParam
      })
      setNickname(nicknameParam || accountNameParam)
      setScreen('edit')
    }
  }, [
    isEditMode,
    accountNumberParam,
    accountNameParam,
    emailParam,
    nicknameParam
  ])

  // ===== VALIDATION FUNCTIONS =====
  const validateField = (name: string, value: string) => {
    let error = ''
    switch (name) {
      case 'accountNumber':
        if (!value.trim()) error = 'Account number is required'
        else if (!/^\d+$/.test(value))
          error = 'Account number must contain only numbers'
        break
      case 'accountName':
        if (!value.trim()) error = 'Account name is required'
        else if (value.trim().length < 2)
          error = 'Account name must be at least 2 characters'
        break
    }
    return error
  }

  const validateForm = () => {
    const newErrors = {
      accountNumber: validateField('accountNumber', formData.accountNumber),
      accountName: validateField('accountName', formData.accountName),
      email: validateField('email', formData.email),
      nickname: validateField('nickname', formData.nickname)
    }
    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error !== '')
  }

  const resetForm = () => {
    setFormData({ accountNumber: '', accountName: '', email: '', nickname: '' })
    setNickname('')
    setErrors({ accountNumber: '', accountName: '', email: '', nickname: '' })
  }

  // ===== NAVIGATION FUNCTIONS =====
  const goToList = () => {
    resetForm()
    setScreen('list')
    router.push('/bank-accounts')
  }

  const goToAdd = () => {
    resetForm()
    setScreen('add')
    router.push('/bank-accounts?mode=add')
  }

  const goToEdit = (accNumber: string, accName: string) => {
    setScreen('edit')
    router.push(
      `/bank-accounts?mode=edit&accountNumber=${accNumber}&accountName=${accName}`
    )
  }

  // ===== FORM HANDLERS =====
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
  }

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    console.log('Needs backend POST implementation:', formData)
    alert('Frontend validation passed! Waiting on backend POST endpoint.')
    resetForm()
    goToList()
  }

  const handleEditNickname = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nickname.trim()) {
      alert('Please enter a nickname')
      return
    }
    alert(`Needs backend PUT implementation to save: ${nickname}`)
    resetForm()
    goToList()
  }

  const handleCancel = () => {
    resetForm()
    goToList()
  }

  return (
    <main className="app-container">
      {/* Cinematic Background Glows */}
      <div className="bg-glow-1" />
      <div className="bg-glow-2" />

      <Sidebar />

      <section className="content z-10">
        {/* Universal Header */}
        <header className="content-header">
          <h1 className="page-title">Accounts</h1>
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

        {/* ===== LIST SCREEN ===== */}
        {screen === 'list' && (
          <div className="accounts-grid">
            {isLoading ? (
              <div className="flex items-center justify-center w-full col-span-full h-40">
                <p className="text-gray-400 font-medium animate-pulse">
                  Loading secure vault...
                </p>
              </div>
            ) : accounts.length === 0 ? (
              <div className="flex items-center justify-center w-full col-span-full h-40">
                <p className="text-gray-400 font-medium">
                  No accounts found. Create one to get started.
                </p>
              </div>
            ) : (
              accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="glass-card hover-effect relative group"
                >
                  {/* Floating Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() =>
                        goToEdit(acc.account_number, acc.account_name)
                      }
                      className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition"
                      title="Edit Account"
                    >
                      ✏️
                    </button>
                    <button
                      className="w-8 h-8 rounded-full bg-red-500/20 text-red-300 flex items-center justify-center hover:bg-red-500 hover:text-white transition"
                      title="Delete Account"
                    >
                      🗑️
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="flex flex-col items-center mt-2">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-4 border-2 border-white/10">
                      <span className="text-2xl font-black text-white tracking-tighter">
                        N
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-1">
                      {acc.account_name}
                    </h2>
                    <p className="text-gray-400 text-sm font-mono tracking-wider mb-6">
                      **** {acc.account_number.slice(-4)}
                    </p>

                    <div className="w-full bg-black/30 rounded-xl p-4 border border-white/5">
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                        Available Balance
                      </p>
                      <p className="text-2xl font-bold text-green-400">
                        Rs. {acc.balance}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Add Account Card */}
            <button className="glass-card add-card" onClick={goToAdd}>
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-500 flex items-center justify-center mb-4 transition-all duration-300 group-hover:border-indigo-400">
                <span className="text-3xl text-gray-500 transition-colors duration-300 group-hover:text-indigo-400">
                  +
                </span>
              </div>
              <h2 className="text-lg font-semibold text-gray-400 transition-colors duration-300 group-hover:text-white">
                Add New Account
              </h2>
            </button>
          </div>
        )}

        {/* ===== ADD / EDIT SCREENS (Form Layout) ===== */}
        {(screen === 'add' || screen === 'edit') && (
          <div className="form-container">
            <div className="glass-panel form-card">
              <h2 className="text-2xl font-bold text-white mb-8">
                {screen === 'add'
                  ? 'Link New Bank Account'
                  : 'Edit Account Settings'}
              </h2>

              <form
                onSubmit={
                  screen === 'add' ? handleAddAccount : handleEditNickname
                }
                className="space-y-6"
              >
                {screen === 'add' && (
                  <div className="space-y-1.5">
                    <label
                      className="text-sm font-medium text-gray-300 ml-1"
                      htmlFor="accountName"
                    >
                      Account Name
                    </label>
                    <input
                      type="text"
                      id="accountName"
                      name="accountName"
                      value={formData.accountName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. Primary Savings"
                      className={`glass-input ${errors.accountName ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                    {errors.accountName && (
                      <p className="text-red-400 text-xs ml-1 mt-1">
                        {errors.accountName}
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label
                    className="text-sm font-medium text-gray-300 ml-1"
                    htmlFor={screen === 'edit' ? 'nickname' : 'accountNumber'}
                  >
                    {screen === 'edit' ? 'Account Nickname' : 'Account Number'}
                  </label>

                  {screen === 'edit' ? (
                    <input
                      type="text"
                      id="nickname"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="e.g. Travel Fund"
                      className="glass-input"
                    />
                  ) : (
                    <>
                      <input
                        type="text"
                        id="accountNumber"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="0000000000"
                        className={`glass-input font-mono ${errors.accountNumber ? 'border-red-500 focus:border-red-500' : ''}`}
                      />
                      {errors.accountNumber && (
                        <p className="text-red-400 text-xs ml-1 mt-1">
                          {errors.accountNumber}
                        </p>
                      )}
                    </>
                  )}
                </div>

                {screen === 'edit' && (
                  <div className="space-y-1.5">
                    <label
                      className="text-sm font-medium text-gray-500 ml-1"
                      htmlFor="accountNumber"
                    >
                      Account Number (Locked)
                    </label>
                    <input
                      type="text"
                      id="accountNumber"
                      value={formData.accountNumber || '1234567890'}
                      disabled
                      className="glass-input opacity-50 cursor-not-allowed font-mono"
                    />
                  </div>
                )}

                {/* Form Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    className="btn-secondary flex-1"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    {screen === 'add' ? 'Link Account' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>

      {/* Embedded Styles matching the Dashboard Cinematic Theme */}
      <style jsx>{`
        .app-container {
          width: 100vw;
          min-height: 100vh;
          background: #09090b;
          display: flex;
          overflow: hidden;
          font-family: system-ui, -apple-system, sans-serif;
          position: relative;
          color: #ffffff;
        }

        .bg-glow-1 {
          position: absolute; top: -10%; left: -10%; width: 600px; height: 600px;
          background: rgba(79, 70, 229, 0.15); border-radius: 50%; filter: blur(120px); pointer-events: none;
        }

        .bg-glow-2 {
          position: absolute; bottom: -10%; right: -10%; width: 500px; height: 500px;
          background: rgba(147, 51, 234, 0.1); border-radius: 50%; filter: blur(100px); pointer-events: none;
        }

        .content {
          flex: 1; padding: 2rem 2.5rem; overflow-y: auto; min-width: 0;
        }

        .content-header {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem;
        }

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

        /* Accounts Grid Styling */
        .accounts-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 24px;
          padding: 1.5rem; position: relative; overflow: hidden; transition: all 0.3s ease;
        }
        .glass-card.hover-effect:hover {
          transform: translateY(-4px); border-color: rgba(79, 70, 229, 0.4);
          box-shadow: 0 20px 40px -10px rgba(79, 70, 229, 0.15);
        }

        .add-card {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          min-height: 250px; border: 2px dashed rgba(255,255,255,0.1); background: transparent; cursor: pointer;
        }
        .add-card:hover { border-color: rgba(79, 70, 229, 0.5); background: rgba(79, 70, 229, 0.05); }

        /* Form Styling */
        .form-container { display: flex; justify-content: center; align-items: flex-start; padding-top: 2rem; }
        .form-card { width: 100%; max-width: 500px; border-radius: 32px; padding: 2.5rem; }
        
        .glass-input {
          width: 100%; height: 56px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);
          background: rgba(0,0,0,0.2); padding: 0 1.25rem; color: white; outline: none; transition: all 0.2s;
        }
        .glass-input:focus { border-color: #4f46e5; background: rgba(0,0,0,0.4); box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1); }

        .btn-primary {
          height: 56px; border-radius: 16px; background: #4f46e5; color: white; font-weight: 600; cursor: pointer; transition: all 0.2s; border: none;
        }
        .btn-primary:hover { background: #4338ca; transform: translateY(-1px); box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.4); }

        .btn-secondary {
          height: 56px; border-radius: 16px; background: rgba(255,255,255,0.05); color: white; font-weight: 600; cursor: pointer; transition: all 0.2s; border: 1px solid rgba(255,255,255,0.1);
        }
        .btn-secondary:hover { background: rgba(255,255,255,0.1); }

        @media (max-width: 768px) {
          .app-container { flex-direction: column; }
          .content { padding: 1.5rem 1rem; }
          .accounts-grid { grid-template-columns: 1fr; }
          .form-card { padding: 1.5rem; }
        }
      `}</style>
    </main>
  )
}
