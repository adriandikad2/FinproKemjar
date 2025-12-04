"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Profile() {
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
      console.error("Failed to fetch user:", err)
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
            <Link href="/home" className="text-gray-300 hover:text-white transition">
              Home
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

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg border border-border p-8">
          <h2 className="text-2xl font-bold text-primary mb-6">Profile</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Name</label>
              <p className="px-4 py-2 bg-surface border border-border rounded-lg text-primary">{user?.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">Email</label>
              <p className="px-4 py-2 bg-surface border border-border rounded-lg text-primary">{user?.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">Member Since</label>
              <p className="px-4 py-2 bg-surface border border-border rounded-lg text-primary">
                {new Date(user?.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">User ID</label>
              <p className="px-4 py-2 bg-surface border border-border rounded-lg text-primary font-mono text-sm break-all">
                {user?._id}
              </p>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <Link
              href="/home"
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
