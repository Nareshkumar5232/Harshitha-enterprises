import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/money'

export default function Cart() {
  const { cartItems, cartTotals, updateQuantity, removeFromCart, beginCheckout, clearCart } = useCart()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (!cartItems.length) {
      return
    }

    beginCheckout(cartItems, 'cart')
    navigate('/checkout')
  }

  return (
    <div className="mx-auto max-w-7xl overflow-x-hidden px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-xl dark:border-white/10 dark:bg-slate-950/75">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700 dark:text-cyan-200/70">Shopping cart</p>
              <h1 className="mt-3 text-3xl font-black text-slate-950 dark:text-white">Review your products before checkout.</h1>
            </div>
            <Link to="/products" className="rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-100">
              Continue shopping
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {cartItems.length ? (
              <>
                <div className="flex justify-end">
                  <button type="button" onClick={clearCart} className="btn-secondary rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition">
                    Remove all
                  </button>
                </div>
                <AnimatePresence initial={false}>
                  {cartItems.map((item) => (
                    <motion.article
                      key={item.id}
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.97 }}
                      className="theme-card rounded-3xl p-4"
                    >
                      <div className="flex gap-4 sm:items-center">
                        <img src={item.image} alt={item.name} className="h-24 w-24 rounded-2xl object-cover" />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">{item.badge}</p>
                              <h2 className="mt-1 text-lg font-semibold text-[var(--text-primary)]">{item.name}</h2>
                              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{item.description}</p>
                            </div>
                            <button type="button" onClick={() => removeFromCart(item.id)} className="text-base text-rose-500 transition hover:scale-105" aria-label="Remove item">
                              🗑
                            </button>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                            <div className="inline-flex items-center rounded-full border border-[var(--border-soft)] bg-[var(--surface-glass)] p-1">
                              <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-9 w-9 rounded-full text-lg font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]">-</button>
                              <span className="w-10 text-center text-sm font-bold text-[var(--text-primary)]">{item.quantity}</span>
                              <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-9 w-9 rounded-full text-lg font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]">+</button>
                            </div>
                            <div className="text-right">
                              <div className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Item total</div>
                              <div className="mt-1 text-xl font-bold text-[var(--text-primary)]">{formatCurrency(item.price * item.quantity)}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </>
            ) : <EmptyCart />}
          </div>
        </section>

        <aside className="rounded-[2rem] border border-white/60 bg-slate-950 p-6 text-white shadow-xl shadow-slate-950/20 dark:border-white/10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/70">Order summary</p>
          {cartItems.length ? (
            <div className="mt-4 space-y-3 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm">
              <Row label="Subtotal" value={formatCurrency(cartTotals.subtotal)} />
              <Row label="GST (18%)" value={formatCurrency(cartTotals.gst)} />
              <Row label="Delivery" value={cartTotals.delivery === 0 ? 'Free' : formatCurrency(cartTotals.delivery)} />
              <div className="border-t border-white/10 pt-3">
                <Row label="Grand total" value={formatCurrency(cartTotals.grandTotal)} strong />
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-3xl border border-dashed border-white/20 bg-white/5 p-5 text-sm text-slate-300">
              Add products to see billing calculations.
            </div>
          )}

          <button
            type="button"
            onClick={handleCheckout}
            disabled={!cartItems.length}
            className="mt-5 w-full rounded-full bg-gradient-to-r from-brand-500 to-accent px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cartItems.length ? 'Proceed to Checkout' : 'Checkout unavailable'}
          </button>

          <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-300">
            Secure checkout, GST invoice support, and dedicated order confirmation after purchase.
          </div>
        </aside>
      </div>
    </div>
  )
}

function Row({ label, value, strong = false }) {
  return (
    <div className={`flex items-center justify-between gap-4 ${strong ? 'text-base font-semibold text-white' : 'text-slate-200'}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}

function EmptyCart() {
  return (
    <div className="rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center dark:border-white/10 dark:bg-white/5">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/10 text-2xl text-brand-500">🛒</div>
      <h2 className="mt-5 text-2xl font-bold text-slate-950 dark:text-white">Your cart is empty</h2>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">Add items from the products page to build your order.</p>
      <Link to="/products" className="mt-6 inline-flex rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/20">
        Browse products
      </Link>
    </div>
  )
}