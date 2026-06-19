import { redirect } from 'next/navigation'

export default function Home() {
  // Instantly forward users to the login page when they hit the root URL
  redirect('/login')
}
