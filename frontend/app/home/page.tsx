"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    fetchUser(token)
  }, [router])

  const fetchUser = async (token: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        localStorage.removeItem("token")
        router.push("/login")
        return
      }

      const data = await res.json()
      setUser(data.user)
    } catch (err) {
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <p className="text-muted">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-surface">
      <nav className="bg-gray-900 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Kelompok 38</h1>
          <div className="flex items-center gap-4">
            <Link href="/profile" className="text-gray-300 hover:text-white transition">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg border border-border p-8">
          <h2 className="text-2xl font-bold text-primary mb-4">Welcome, {user?.name}!</h2>
          <p className="text-muted mb-6">You are now logged in to Kelompok 38.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-surface rounded-lg border border-border">
              <p className="text-sm text-muted mb-1">Email</p>
              <p className="font-medium text-primary">{user?.email}</p>
            </div>
            <div className="p-4 bg-surface rounded-lg border border-border">
              <p className="text-sm text-muted mb-1">Account Status</p>
              <p className="font-medium text-green-600">Active</p>
            </div>
            <div className="p-4 bg-surface rounded-lg border border-border">
              <p className="text-sm text-muted mb-1">Member Since</p>
              <p className="font-medium text-primary">
                {new Date(user?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
