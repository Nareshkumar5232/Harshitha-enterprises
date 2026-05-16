import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/money'

export default function OrderSuccess() {
  const location = useLocation()
  const { lastOrder } = useCart()
  const order = location.state?.order || lastOrder
  const payment = location.state?.payment || order?.paymentSession
  const isPaymentPending = Boolean(payment)

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        className="w-full rounded-[2rem] border border-white/60 bg-white/90 p-8 text-center shadow-2xl dark:border-white/10 dark:bg-slate-950/80"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-4xl text-emerald-500">✓</div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">Order confirmed</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950 dark:text-white sm:text-4xl">Thank you for shopping with Sree Harshitha Enterprises.</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">Your order has been placed successfully. Our team will contact you shortly with confirmation and delivery details.</p>
        {isPaymentPending ? <p className="mt-3 text-sm font-medium text-amber-600 dark:text-amber-300">Payment session created. Complete payment using the checkout flow to confirm the order.</p> : null}

        <div className="mt-8 grid gap-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 text-left dark:border-white/10 dark:bg-white/5 sm:grid-cols-2">
          <Info label="Order ID" value={order?.id || 'SH-000000-XXXX'} />
          <Info label="Payment method" value={order?.paymentMethod?.toUpperCase?.() || 'COD'} />
          <Info label="Items" value={`${order?.items?.length || 0}`} />
          <Info label="Grand total" value={formatCurrency(order?.totals?.grandTotal || 0)} />
          {payment ? <Info label="Payment session" value={payment.payment_session_id || payment.paymentSessionId || payment.cf_order_id || payment.cfOrderId || 'Pending'} /> : null}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/products" className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/20">
            Continue shopping
          </Link>
          <Link to="/account" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-100">
            View order history
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-3 shadow-sm dark:bg-slate-950/80">
      <div className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-950 dark:text-white">{value}</div>
    </div>
  )
}