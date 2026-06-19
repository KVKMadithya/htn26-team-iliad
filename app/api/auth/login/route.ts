import { asText, runStatement } from '@/lib/platform-db'
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

// Firebase Initialization
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
    const rawUsername = asText(
      body.username || body.account || body.email
    )?.trim()
    const rawPassword = asText(body.password)

    if (!rawUsername || !rawPassword) {
      return Response.json(
        { ok: false, error: 'Missing credentials.' },
        { status: 400 }
      )
    }

    // 1. Authenticate with Firebase
    const email = rawUsername.includes('@')
      ? rawUsername
      : `${rawUsername}@novabank.com`
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      rawPassword
    )
    const uid = userCredential.user.uid

    // 2. Fetch User Profile from SQL Database using Firebase UID
    // This assumes you saved the Firebase UID as the 'id' in your users table
    const result = await runStatement(`
      SELECT id, username, role, full_name, email 
      FROM users 
      WHERE id = '${uid}' 
      LIMIT 1
    `)

    if (!result.rows || result.rows.length === 0) {
      return Response.json(
        { ok: false, error: 'User profile not found in database.' },
        { status: 404 }
      )
    }

    const user = result.rows[0]

    // 3. Set Cookies (Maintains compatibility with your existing frontend)
    const headers = new Headers()
    headers.append(
      'Set-Cookie',
      `user_id=${user.id}; Path=/; HttpOnly; SameSite=Lax`
    )
    headers.append(
      'Set-Cookie',
      `role=${user.role}; Path=/; HttpOnly; SameSite=Lax`
    )

    return Response.json(
      {
        ok: true,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          full_name: user.full_name,
          email: user.email
        }
      },
      { headers }
    )
  } catch (reason: any) {
    console.error('FIREBASE LOGIN ERROR:', reason)

    // Handle Firebase Auth errors
    if (
      reason.code === 'auth/invalid-credential' ||
      reason.code === 'auth/user-not-found'
    ) {
      return Response.json(
        { ok: false, error: 'Invalid username or password.' },
        { status: 401 }
      )
    }

    return Response.json(
      {
        ok: false,
        error: 'Login failed. Please try again.'
      },
      { status: 500 }
    )
  }
}
