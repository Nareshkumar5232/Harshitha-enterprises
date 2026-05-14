import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/money'
import { useAuth } from '../context/AuthContext'

export default function Account() {
  const { lastOrder } = useCart()
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-7xl overflow-x-hidden px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-xl dark:border-white/10 dark:bg-slate-950/75">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700 dark:text-cyan-200/70">Profile</p>
          <h1 className="mt-3 text-3xl font-black text-slate-950 dark:text-white">Account dashboard</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Manage profile, review your orders, and continue shopping with a faster checkout flow.
          </p>

          <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-white/10 dark:bg-white/5">
            <div className="font-semibold text-slate-900 dark:text-white">{currentUser?.name || 'Customer'}</div>
            <div className="mt-1 text-slate-600 dark:text-slate-300">{currentUser?.email || 'No email'}</div>
            <div className="text-slate-500 dark:text-slate-400">{currentUser?.mobile || 'No mobile number'}</div>
          </div>

          <div className="mt-6 grid gap-4">
            {['Edit profile', 'Saved addresses', 'Saved payments', 'Notifications'].map((item) => (
              <div key={item} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-100">
                {item}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              logout()
              navigate('/', { replace: true })
            }}
            className="mt-6 rounded-full border border-rose-300 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-400/40 dark:bg-rose-500/10 dark:text-rose-300"
          >
            Logout
          </button>
        </section>

        <section className="rounded-[2rem] border border-white/60 bg-slate-950 p-6 text-white shadow-xl shadow-slate-950/20 dark:border-white/10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/70">Orders</p>
              <h2 className="mt-3 text-2xl font-bold">Order history</h2>
            </div>
            <Link to="/products" className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15">
              Shop now
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {lastOrder ? (
              <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">{lastOrder.id}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">{new Date(lastOrder.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">Confirmed</div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Metric label="Items" value={`${lastOrder.items.length}`} />
                  <Metric label="Amount" value={formatCurrency(lastOrder.totals.grandTotal)} />
                  <Metric label="Payment" value={String(lastOrder.paymentMethod).toUpperCase()} />
                  <Metric label="Source" value={lastOrder.source} />
                </div>

                <div className="mt-4 space-y-3">
                  {lastOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-white/5 p-3 text-sm">
                      <img src={item.image} alt={item.name} className="h-12 w-12 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-white">{item.name}</div>
                        <div className="text-xs text-slate-400">Qty {item.quantity}</div>
                      </div>
                      <div className="font-semibold text-white">{formatCurrency(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>
              </article>
            ) : (
              <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-6 text-sm text-slate-300">
                No orders yet. Place your first order to populate this section.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/5 p-4">
      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
    </div>
  )
}