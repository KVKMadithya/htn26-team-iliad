import { asText, runStatement } from '@/lib/platform-db'
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

// Firebase Config
const firebaseConfig = {
  apiKey: 'AIzaSyDIAyfAHo_trhrobaYs87X8BkTq1W2sOs0',
  authDomain: 'nova-bank-hackathon.firebaseapp.com',
  projectId: 'nova-bank-hackathon',
  storageBucket: 'nova-bank-hackathon.firebasestorage.app',
  messagingSenderId: '901221160510',
  appId: '1:901221160510:web:034bc3e4779cb2838aa36f'
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { accountNumber, accountName, email, password } = body

    if (!accountNumber || !accountName || !email || !password) {
      return Response.json(
        { ok: false, error: 'All fields are required.' },
        { status: 400 }
      )
    }

    // 1. Create User in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    const uid = userCredential.user.uid // This is the string ID

    // 2. Escape data for SQL
    const escape = (val: string) => val.replace(/'/g, "''")
    const sanitizedName = escape(accountName)
    const sanitizedAccount = escape(accountNumber)
    const dummyNic = `${Math.floor(100000000 + Math.random() * 900000000)}V`

    // 3. Save profile to SQL
    // We use the Firebase UID as the primary key here.
    const userSql = `
      INSERT INTO users (id, username, full_name, email, role, nic)
      VALUES ('${uid}', '${email.split('@')[0]}', '${sanitizedName}', '${email}', 'customer', '${dummyNic}')
    `
    await runStatement(userSql)

    // 4. Link bank account
    const accountSql = `
      INSERT INTO accounts (user_id, account_number, account_name, balance)
      VALUES ('${uid}', '${sanitizedAccount}', '${sanitizedName}', 0)
    `
    await runStatement(accountSql)

    return Response.json({ ok: true, message: 'Account created successfully!' })
  } catch (reason: any) {
    console.error('SIGNUP ERROR:', reason)

    // Firebase Error Handling
    if (reason.code === 'auth/email-already-in-use') {
      return Response.json(
        { ok: false, error: 'Email is already registered.' },
        { status: 400 }
      )
    }

    // DB Error Handling
    return Response.json(
      {
        ok: false,
        error: 'Database error. Ensure you ran the ALTER TABLE commands.'
      },
      { status: 500 }
    )
  }
}
