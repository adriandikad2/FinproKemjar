import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface via-background to-surface">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Kelompok 38</h1>
          <p className="text-muted text-base">Welcome to our platform</p>
        </div>

        <div className="space-y-4">
          <Link
            href="/register"
            className="block w-full px-6 py-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 active:bg-gray-800 transition text-center"
          >
            Create Account
          </Link>

          <Link
            href="/login"
            className="block w-full px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-500 active:bg-gray-700 transition text-center"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted">
          <p>Simple. Secure. Straightforward.</p>
        </div>
      </div>
    </main>
  )
}
