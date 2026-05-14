import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar(){
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [profileOpen, setProfileOpen] = React.useState(false)
  const { cartCount, closeCart } = useCart()
  const { isAuthenticated, currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const goToCart = () => {
    closeCart()
    setMenuOpen(false)
    navigate('/cart')
  }

  const linkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
        : 'text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/5'
    }`

  return (
    <header className="glow-dark sticky top-0 z-40 border-b border-[var(--border-soft)] bg-[var(--surface-glass)] backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setMenuOpen(false)}>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-cyan)] text-lg font-extrabold text-white shadow-[var(--shadow-soft)]">SH</div>
          <div className="min-w-0">
            <div className="truncate text-base font-bold text-[var(--text-primary)] sm:text-lg">Sree Harshitha Enterprises</div>
            <div className="truncate text-xs text-[var(--text-muted)]">Premium electronics and appliances</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 xl:flex">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/products" className={linkClass}>Products</NavLink>
          <NavLink to="/cart" className={linkClass}>Cart</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <button
            type="button"
            onClick={goToCart}
            className="relative inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
          >
            <span>Cart</span>
            <span className="rounded-full bg-brand-500 px-2 py-0.5 text-xs text-white">{cartCount}</span>
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((value) => !value)}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
            >
              {isAuthenticated ? (currentUser?.name || 'Account') : 'Account'}
              <span>▾</span>
            </button>

            <AnimatePresence>
              {profileOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-3 w-52 overflow-hidden rounded-3xl border border-white/60 bg-white p-2 shadow-2xl dark:border-white/10 dark:bg-slate-950"
                >
                  {isAuthenticated ? (
                    <>
                      <ProfileLink to="/account" label="My profile" onClose={() => setProfileOpen(false)} />
                      <button
                        type="button"
                        onClick={() => {
                          logout()
                          setProfileOpen(false)
                          navigate('/')
                        }}
                        className="block w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-rose-600 transition hover:bg-slate-100 dark:hover:bg-white/5"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <ProfileLink to="/login" label="Login" onClose={() => setProfileOpen(false)} />
                      <ProfileLink to="/signup" label="Create account" onClose={() => setProfileOpen(false)} />
                    </>
                  )}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <button
            type="button"
            onClick={goToCart}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
          >
            Cart <span className="rounded-full bg-brand-500 px-2 py-0.5 text-xs text-white">{cartCount}</span>
          </button>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-xl text-slate-900 shadow-sm dark:border-white/10 dark:bg-slate-900 dark:text-white"
          >
            {menuOpen ? '×' : '☰'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-t border-[var(--border-soft)] bg-[var(--surface-card)] px-4 pb-5 pt-3 shadow-[var(--shadow-soft)] xl:hidden"
          >
            <div className="mx-auto grid max-w-7xl gap-2">
              <NavLink to="/" className={linkClass} onClick={() => setMenuOpen(false)}>Home</NavLink>
              <NavLink to="/products" className={linkClass} onClick={() => setMenuOpen(false)}>Products</NavLink>
              <NavLink to="/cart" className={linkClass} onClick={() => setMenuOpen(false)}>Cart</NavLink>
              <NavLink to="/about" className={linkClass} onClick={() => setMenuOpen(false)}>About</NavLink>
              <NavLink to="/contact" className={linkClass} onClick={() => setMenuOpen(false)}>Contact</NavLink>
              {isAuthenticated ? (
                <>
                  <NavLink to="/account" className={linkClass} onClick={() => setMenuOpen(false)}>My profile</NavLink>
                  <button
                    type="button"
                    onClick={() => {
                      logout()
                      setMenuOpen(false)
                      navigate('/')
                    }}
                    className="rounded-full px-4 py-2 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:hover:bg-white/5"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className={linkClass} onClick={() => setMenuOpen(false)}>Login</NavLink>
                  <NavLink to="/signup" className={linkClass} onClick={() => setMenuOpen(false)}>Signup</NavLink>
                </>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}

function ProfileLink({ to, label, onClose }) {
  return (
    <Link
      to={to}
      onClick={onClose}
      className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
    >
      {label}
    </Link>
  )
}
