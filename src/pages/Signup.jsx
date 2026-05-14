import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const navigate = useNavigate()
  const { register } = useAuth()

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')

    const formData = new FormData(event.currentTarget)
    const password = String(formData.get('password') || '')
    const confirmPassword = String(formData.get('confirmPassword') || '')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    const result = register({
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      mobile: String(formData.get('mobile') || ''),
      password
    })

    if (!result.ok) {
      setError(result.message)
      setLoading(false)
      return
    }

    navigate('/account', { replace: true })
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
      <section className="rounded-[2rem] border border-white/60 bg-white/85 p-8 shadow-xl dark:border-white/10 dark:bg-slate-950/75">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700 dark:text-cyan-200/70">Create account</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950 dark:text-white">Create a profile for a faster checkout experience.</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">Create your account to access protected checkout and order history.</p>

        <form className="mt-8 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <Field label="Full name" name="name" placeholder="Your name" required />
          <Field label="Mobile" name="mobile" placeholder="Mobile number" required />
          <div className="sm:col-span-2"><Field label="Email" name="email" type="email" placeholder="you@example.com" required /></div>
          <div className="sm:col-span-2"><Field label="Password" name="password" type="password" placeholder="Create a secure password" required /></div>
          <div className="sm:col-span-2"><Field label="Confirm password" name="confirmPassword" type="password" placeholder="Repeat password" required /></div>
          {error ? <p className="sm:col-span-2 text-sm font-medium text-rose-600">{error}</p> : null}
          <button type="submit" disabled={loading} className="btn-primary sm:col-span-2 w-full rounded-full px-5 py-4 text-sm font-semibold transition disabled:opacity-60">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">
          Already have an account? <Link to="/login" className="font-semibold text-brand-700 dark:text-cyan-200">Login here</Link>
        </p>
      </section>

      <aside className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/70">Why create a profile</p>
        <div className="mt-4 space-y-4">
          {['Save your addresses', 'Access order history', 'Checkout faster', 'Track business purchases'].map((item) => (
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