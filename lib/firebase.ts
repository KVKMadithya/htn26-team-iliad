// lib/firebase.ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyDIAyfAHo_trhrobaYs87X8BkTq1W2sOs0',
  authDomain: 'nova-bank-hackathon.firebaseapp.com',
  projectId: 'nova-bank-hackathon',
  storageBucket: 'nova-bank-hackathon.firebasestorage.app',
  messagingSenderId: '901221160510',
  appId: '1:901221160510:web:034bc3e4779cb2838aa36f',
  measurementId: 'G-E96S3VL445'
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app) // Export this!
