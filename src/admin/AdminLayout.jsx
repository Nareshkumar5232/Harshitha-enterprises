import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'
import { useAdminAuth } from '../context/AdminAuthContext'
import { useAdminData } from '../context/AdminDataContext'
import AdminToastStack from './components/AdminToastStack'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/messages', label: 'Messages' },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/settings', label: 'Settings' }
]

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [notificationsOpen, setNotificationsOpen] = React.useState(false)
  const navigate = useNavigate()
  const { logout, adminSession } = useAdminAuth()
  const { unreadMessages, notifications, markNotificationRead, pendingOrders } = useAdminData()

  const unreadCount = notifications.filter((item) => !item.read).length + unreadMessages + pendingOrders

  const handleLogout = () => {
    logout()
    navigate('/admin-login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.18),transparent_24%),radial-gradient(circle_at_top_right,rgba(6,182,212,0.16),transparent_22%),linear-gradient(180deg,var(--bg-primary),var(--bg-secondary))] text-[var(--text-primary)]">
      <AdminToastStack />
      <div className="mx-auto flex min-h-screen max-w-[1800px] flex-col lg:flex-row">
        <aside className={`fixed inset-y-0 left-0 z-50 w-[18rem] border-r border-[var(--border-soft)] bg-[var(--surface-glass)] px-5 py-6 backdrop-blur-2xl transition-transform duration-300 lg:static lg:translate-x-0 ${menuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="flex items-center justify-between gap-3">
            <Link to="/admin/dashboard" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-cyan)] text-lg font-extrabold text-white">AD</div>
              <div>
                <div className="text-sm font-bold text-[var(--text-primary)]">Admin Panel</div>
                <div className="text-xs text-[var(--text-muted)]">Sree Harshitha Enterprises</div>
              </div>
            </Link>
            <button type="button" className="lg:hidden" onClick={() => setMenuOpen(false)}>
              ×
            </button>
          </div>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => `flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'}`}
              >
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-card)] p-4 shadow-[var(--shadow-soft)]">
            <div className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Signed in as</div>
            <div className="mt-2 text-sm font-semibold text-[var(--text-primary)]">{adminSession?.email || 'admin@gmail.com'}</div>
            <div className="mt-1 text-xs text-[var(--text-muted)]">Full ecommerce control</div>
          </div>
        </aside>

        <div className="flex-1 lg:min-w-0">
          <header className="sticky top-0 z-40 border-b border-[var(--border-soft)] bg-[var(--surface-glass)] backdrop-blur-2xl">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setMenuOpen(true)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--surface-card)] text-lg lg:hidden">
                  ☰
                </button>
                <div>
                  <div className="text-sm font-semibold text-[var(--text-primary)]">Admin operations</div>
                  <div className="text-xs text-[var(--text-muted)]">Manage products, orders, messages, and customers</div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative">
                  <button type="button" onClick={() => setNotificationsOpen((value) => !value)} className="relative inline-flex h-11 items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface-card)] px-4 text-sm font-semibold shadow-[var(--shadow-soft)]">
                    <span>🔔</span>
                    <span className="hidden sm:inline">Alerts</span>
                    {unreadCount ? <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs text-white">{unreadCount}</span> : null}
                  </button>

                  <AnimatePresence>
                    {notificationsOpen ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-3 w-[22rem] overflow-hidden rounded-[1.5rem] border border-[var(--border-soft)] bg-[var(--surface-card)] shadow-2xl"
                      >
                        <div className="border-b border-[var(--border-soft)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)]">Notifications</div>
                        <div className="max-h-[24rem] divide-y divide-[var(--border-soft)] overflow-auto">
                          {notifications.length ? notifications.map((item) => (
                            <button key={item.id} type="button" onClick={() => markNotificationRead(item.id)} className="block w-full px-4 py-3 text-left transition hover:bg-[var(--bg-secondary)]">
                              <div className="flex items-start gap-3">
                                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-500" />
                                <div className="min-w-0">
                                  <div className="text-sm font-semibold text-[var(--text-primary)]">{item.title}</div>
                                  <div className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{item.message}</div>
                                </div>
                              </div>
                            </button>
                          )) : <div className="px-4 py-6 text-sm text-[var(--text-muted)]">No notifications yet.</div>}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>

                <ThemeToggle />

                <button type="button" onClick={handleLogout} className="hidden h-11 rounded-full border border-rose-300 bg-rose-50 px-4 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-400/40 dark:bg-rose-500/10 dark:text-rose-300 sm:inline-flex">
                  Logout
                </button>
              </div>
            </div>
          </header>

          <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
