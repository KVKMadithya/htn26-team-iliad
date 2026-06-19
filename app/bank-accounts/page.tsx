'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Sidebar from '@/components/sidebar'
import { Search, Bell } from '@/components/Icons'
import styles from './accounts.module.css'

type Screen = 'list' | 'add' | 'edit'

// Define what a real account looks like based on your database
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

  // URL Parameters
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

  // ===== NEW: REAL DATA FETCHING =====
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

  // Load data into forms if in edit mode
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
      default:
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

    // TODO for Team Odyssey: Wire this up to a real POST /api/accounts endpoint!
    console.log('Needs backend POST implementation:', formData)
    alert('Frontend validation passed! Waiting on backend POST endpoint.')
    resetForm()
    goToList()
  }

  const handleUpdateAccount = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.accountNumber.trim()) {
      alert('Please enter an account number first')
      return
    }
    router.push(
      `/bank-accounts?mode=edit&accountNumber=${formData.accountNumber}&accountName=${formData.accountName || ''}`
    )
  }

  const handleEditNickname = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nickname.trim()) {
      alert('Please enter a nickname')
      return
    }
    // TODO for Team Odyssey: Wire this up to a real PUT /api/accounts endpoint!
    alert(`Needs backend PUT implementation to save: ${nickname}`)
    resetForm()
    goToList()
  }

  const handleCancel = () => {
    resetForm()
    goToList()
  }

  return (
    <main className={styles.accountsPage}>
      <Sidebar />
      <section className={styles.content}>
        {/* ===== LIST SCREEN ===== */}
        {screen === 'list' && (
          <>
            <header className={styles.contentHeader}>
              <h1 className={styles.pageTitle}>Accounts</h1>
              <div className={styles.headerActions}>
                <Search size={22} />
                <Bell size={22} />
                <div className={styles.avatarPlaceholder}>
                  <Image
                    src="/person-logo.png"
                    alt="Profile"
                    width={40}
                    height={40}
                    style={{ objectFit: 'cover', borderRadius: '50%' }}
                  />
                </div>
              </div>
            </header>

            <div className={styles.cardsContainer}>
              {isLoading ? (
                <p>Loading your accounts...</p>
              ) : accounts.length === 0 ? (
                <p>No accounts found. Add one below!</p>
              ) : (
                accounts.map((acc) => (
                  <div key={acc.id} className={styles.accountCard}>
                    <div
                      className={styles.iconEdit}
                      onClick={() =>
                        goToEdit(acc.account_number, acc.account_name)
                      }
                    >
                      ✏️
                    </div>
                    <div className={styles.iconDelete}>🗑️</div>
                    <div className={styles.accountCardContent}>
                      <h2 className={styles.accountName}>{acc.account_name}</h2>
                      <div className={styles.accountAvatar}>
                        <div
                          style={{
                            width: 100,
                            height: 100,
                            backgroundColor: '#eee',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          Bank
                        </div>
                      </div>
                      <p className={styles.accountDetails}>
                        Account: {acc.account_number} <br />
                        Balance: Rs. {acc.balance}
                      </p>
                    </div>
                  </div>
                ))
              )}

              <button className={styles.addAccountCard} onClick={goToAdd}>
                <h2 className={styles.addAccountTitle}>Add a Bank Account</h2>
                <div className={styles.addAccountIcon}>+</div>
              </button>
            </div>
          </>
        )}

        {/* ===== ADD SCREEN ===== */}
        {screen === 'add' && (
          <>
            <header className={styles.contentHeader}>
              <h1 className={styles.pageTitle}>Accounts</h1>
              <div className={styles.headerActions}>
                <Search size={22} />
                <Bell size={22} />
              </div>
            </header>
            <div className={styles.formContainer}>
              <div className={styles.formCard}>
                <div className={styles.formHeader}>
                  <h2 className={styles.formTitle}>Add Another Bank Account</h2>
                </div>
                <form className={styles.formFields}>
                  <div className={styles.formGroup}>
                    <label htmlFor="accountNumber">Bank Account Number:</label>
                    <input
                      type="text"
                      id="accountNumber"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.accountNumber ? styles.inputError : ''}
                      required
                    />
                    {errors.accountNumber && (
                      <span className={styles.fieldError}>
                        {errors.accountNumber}
                      </span>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="accountName">Bank Account Name:</label>
                    <input
                      type="text"
                      id="accountName"
                      name="accountName"
                      value={formData.accountName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.accountName ? styles.inputError : ''}
                      required
                    />
                    {errors.accountName && (
                      <span className={styles.fieldError}>
                        {errors.accountName}
                      </span>
                    )}
                  </div>
                  <div className={styles.formActionsBottom}>
                    <button
                      type="button"
                      className={styles.btnCancel}
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className={styles.btnAdd}
                      onClick={handleAddAccount}
                    >
                      Add Account
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}

        {/* ===== EDIT SCREEN ===== */}
        {screen === 'edit' && (
          <>
            <header className={styles.contentHeader}>
              <h1 className={styles.pageTitle}>Accounts</h1>
            </header>
            <div className={styles.formContainer}>
              <div className={styles.formCard}>
                <div className={styles.formHeader}>
                  <h2 className={styles.formTitle}>Edit the nickname</h2>
                </div>
                <form
                  onSubmit={handleEditNickname}
                  className={styles.formFields}
                >
                  <div className={styles.formGroup}>
                    <label htmlFor="accountNumber">Bank Account Number:</label>
                    <input
                      type="text"
                      id="accountNumber"
                      value={formData.accountNumber || '1234567890'}
                      disabled
                      className={styles.inputDisabled}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="nickname">Nickname:</label>
                    <input
                      type="text"
                      id="nickname"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.formActionsBottom}>
                    <button
                      type="button"
                      className={styles.btnCancel}
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button type="submit" className={styles.btnUpdate}>
                      UPDATE
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  )
}
