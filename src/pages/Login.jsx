import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const from = location.state?.from || '/account'

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const result = login({
      email: String(formData.get('email') || ''),
      password: String(formData.get('password') || '')
    })

    if (!result.ok) {
      setError(result.message)
      setLoading(false)
      return
    }

    navigate(from, { replace: true })
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
      <section className="rounded-[2rem] border border-white/60 bg-white/85 p-8 shadow-xl dark:border-white/10 dark:bg-slate-950/75">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700 dark:text-cyan-200/70">Authentication UI</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950 dark:text-white">Login to access your profile and order history.</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">Use your account credentials to continue to checkout securely.</p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <Field label="Email" name="email" type="email" placeholder="you@example.com" required />
          <Field label="Password" name="password" type="password" placeholder="••••••••" required />
          {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
          <button type="submit" disabled={loading} className="btn-primary w-full rounded-full px-5 py-4 text-sm font-semibold transition disabled:opacity-60">
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">
          New here? <Link to="/signup" className="font-semibold text-brand-700 dark:text-cyan-200">Create an account</Link>
        </p>
      </section>

      <aside className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/70">Account benefits</p>
        <div className="mt-4 space-y-4">
          {['Track orders', 'Save delivery details', 'Faster checkout', 'View purchase history'].map((item) => (
            <div key={item} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm font-medium">{item}</div>
          ))}
        </div>
      </aside>
    </div>
  )
}

function Field(props) {
  return (
    <label className="theme-input block rounded-2xl px-4 py-3">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{props.label}</span>
      <input {...props} className="mt-2 w-full border-0 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]" />
    </label>
  )
}