import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/money'

export default function CartDrawer() {
  const {
    cartItems,
    cartTotals,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    beginCheckout,
    clearCart
  } = useCart()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (!cartItems.length) {
      return
    }

    beginCheckout(cartItems, 'cart')
    navigate('/checkout')
  }

  return (
    <AnimatePresence>
      {isCartOpen ? (
        <>
          <motion.button
            aria-label="Close cart"
            className="fixed inset-0 z-[59] bg-slate-950/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          <motion.aside
            className="glow-dark fixed right-0 top-0 z-[60] flex h-full w-full max-w-[28rem] flex-col border-l border-[var(--border-soft)] bg-[var(--bg-secondary)]/95 text-[var(--text-primary)] shadow-[var(--shadow-strong)]"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          >
            <div className="flex items-center justify-between border-b border-[var(--border-soft)] px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">Your cart</p>
                <h2 className="text-xl font-semibold">Shopping Cart</h2>
              </div>
              <button type="button" onClick={closeCart} className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-glass)] px-3 py-1 text-sm">
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 no-scrollbar">
              {!cartItems.length ? (
                <div className="theme-card flex h-full flex-col items-center justify-center rounded-3xl border border-dashed px-6 py-10 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface-glass)] text-2xl">🛒</div>
                  <h3 className="text-lg font-semibold">Your cart is empty</h3>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">Add products to compare, save, and checkout anytime.</p>
                  <Link
                    to="/products"
                    onClick={closeCart}
                    className="btn-primary mt-6 rounded-full px-5 py-3 text-sm font-semibold transition"
                  >
                    Continue shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={clearCart}
                      className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-glass)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)] transition hover:text-[var(--text-primary)]"
                    >
                      Remove all
                    </button>
                  </div>
                  <AnimatePresence initial={false}>
                    {cartItems.map((item) => (
                      <motion.article
                        key={item.id}
                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.96 }}
                        className="theme-card rounded-3xl p-4"
                      >
                        <div className="flex gap-4">
                          <img src={item.image} alt={item.name} className="h-20 w-20 rounded-2xl object-cover" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm text-[var(--text-muted)]">{item.badge}</p>
                                <h3 className="mt-1 text-base font-semibold leading-snug">{item.name}</h3>
                              </div>
                              <button type="button" onClick={() => removeFromCart(item.id)} className="text-base text-rose-500 transition hover:scale-105" aria-label="Remove item">
                                🗑
                              </button>
                            </div>
                            <div className="mt-3 flex items-center justify-between gap-3">
                              <div className="inline-flex items-center rounded-full border border-[var(--border-soft)] bg-[var(--surface-glass)] p-1">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="h-8 w-8 rounded-full text-lg leading-none text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                                >
                                  -
                                </button>
                                <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="h-8 w-8 rounded-full text-lg leading-none text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                                >
                                  +
                                </button>
                              </div>
                              <div className="text-right text-sm font-semibold">{formatCurrency(item.price * item.quantity)}</div>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 border-t border-[var(--border-soft)] bg-[var(--bg-secondary)]/95 px-5 py-4 backdrop-blur-xl">
              {cartItems.length ? (
                <div className="theme-card space-y-2 rounded-3xl p-4 text-sm">
                  <Row label="Subtotal" value={formatCurrency(cartTotals.subtotal)} />
                  <Row label="GST (18%)" value={formatCurrency(cartTotals.gst)} />
                  <Row label="Delivery" value={cartTotals.delivery === 0 ? 'Free' : formatCurrency(cartTotals.delivery)} />
                  <div className="mt-2 border-t border-[var(--border-soft)] pt-2">
                    <Row label="Grand total" value={formatCurrency(cartTotals.grandTotal)} strong />
                  </div>
                </div>
              ) : null}

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="btn-secondary rounded-full px-4 py-3 text-center text-sm font-semibold transition"
                >
                  View cart
                </Link>
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={!cartItems.length}
                  className="btn-primary rounded-full px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Checkout
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}

function Row({ label, value, strong = false }) {
  return (
    <div className={`flex items-center justify-between gap-4 ${strong ? 'text-base font-semibold text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}