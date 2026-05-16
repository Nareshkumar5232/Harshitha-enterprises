import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/money'

const paymentMethods = [
  { id: 'cod', label: 'Cash on Delivery', note: 'Pay after the product is delivered.' },
  { id: 'upi', label: 'UPI', note: 'Scan and pay using any UPI app.' },
  { id: 'card', label: 'Credit / Debit Card', note: 'Secure card payment experience.' },
  { id: 'netbanking', label: 'Net Banking', note: 'Pay through your bank portal.' }
]

export default function Checkout() {
  const { checkoutItems, checkoutTotals, placeOrder } = useCart()
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = React.useState('cod')
  const [step, setStep] = React.useState(1)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const customer = {
      fullName: String(formData.get('fullName') || ''),
      mobile: String(formData.get('mobile') || ''),
      email: String(formData.get('email') || ''),
      address: String(formData.get('address') || ''),
      city: String(formData.get('city') || ''),
      state: String(formData.get('state') || ''),
      pincode: String(formData.get('pincode') || '')
    }

    let result = null

    try {
      result = await placeOrder(customer, paymentMethod)
    } catch {
      setError('Unable to complete checkout right now. Please try again.')
    } finally {
      setLoading(false)
    }

    if (!result) {
      setError('Unable to complete checkout right now. Please try again.')
      return
    }

    if (result.paymentRequired) {
      navigate('/order-success', { state: { order: result.order, payment: result.payment } })
      return
    }

    if (result) {
      navigate('/order-success', { state: { order: result } })
    }
  }

  if (!checkoutItems.length) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/60 bg-white/85 p-8 shadow-xl dark:border-white/10 dark:bg-slate-950/75">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/10 text-2xl text-brand-500">🧾</div>
          <h1 className="mt-5 text-3xl font-black text-slate-950 dark:text-white">Checkout is empty</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">Add products to the cart or use Order Now from a product card to start checkout.</p>
          <Link to="/products" className="mt-6 inline-flex rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/20">
            Shop products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl overflow-x-hidden px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-xl dark:border-white/10 dark:bg-slate-950/75">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700 dark:text-cyan-200/70">Checkout</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950 dark:text-white">Complete your order in a secure checkout flow.</h1>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {['Review order', 'Enter details', 'Choose payment'].map((label, index) => (
            <Step key={label} number={index + 1} label={label} active={step >= index + 1} />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6 rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-xl dark:border-white/10 dark:bg-slate-950/75">
          <StepHeader number={1} title="Customer details" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" name="fullName" placeholder="Enter your full name" onFocus={() => setStep(2)} required />
            <Field label="Mobile number" name="mobile" type="tel" placeholder="10-digit mobile number" onFocus={() => setStep(2)} required />
            <Field label="Email" name="email" type="email" placeholder="you@example.com" onFocus={() => setStep(2)} required />
            <Field label="City" name="city" placeholder="City" onFocus={() => setStep(2)} required />
            <Field label="State" name="state" placeholder="State" onFocus={() => setStep(2)} required />
            <Field label="Pincode" name="pincode" placeholder="Pincode" onFocus={() => setStep(2)} required />
            <label className="sm:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Full delivery address</span>
              <textarea
                name="address"
                rows="4"
                placeholder="Street, building, area, landmark"
                onFocus={() => setStep(2)}
                className="mt-2 w-full resize-none border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                required
              />
            </label>
          </div>

          <StepHeader number={2} title="Payment method" />
          <div className="grid gap-4">
            {paymentMethods.map((method) => (
              <label key={method.id} className={`cursor-pointer rounded-3xl border p-4 transition ${paymentMethod === method.id ? 'border-brand-500 bg-brand-500/5 shadow-lg shadow-brand-500/10' : 'border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5'}`}>
                <input type="radio" name="paymentMethod" value={method.id} checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} className="sr-only" />
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/10 text-lg">{paymentIcon(method.id)}</div>
                  <div>
                    <div className="font-semibold text-slate-950 dark:text-white">{method.label}</div>
                    <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{method.note}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm leading-7 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            Secure payment UI, invoice-ready order summary, and clear delivery information are shown before order placement.
          </div>

          {error ? <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-200">{error}</div> : null}

          <button type="submit" onClick={() => setStep(3)} disabled={loading} className="w-full rounded-full bg-gradient-to-r from-brand-500 to-accent px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Placing order...' : 'Place order securely'}
          </button>
        </section>

        <aside className="rounded-[2rem] border border-white/60 bg-slate-950 p-6 text-white shadow-xl shadow-slate-950/20 dark:border-white/10">
          <StepHeader number={3} title="Order summary" dark />
          <div className="mt-5 space-y-4">
            {checkoutItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-4">
                <img src={item.image} alt={item.name} className="h-16 w-16 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-white">{item.name}</div>
                  <div className="mt-1 text-xs text-slate-300">Qty: {item.quantity}</div>
                </div>
                <div className="text-sm font-semibold text-white">{formatCurrency(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm">
            <Row label="Subtotal" value={formatCurrency(checkoutTotals.subtotal)} />
            <Row label="GST (18%)" value={formatCurrency(checkoutTotals.gst)} />
            <Row label="Delivery" value={checkoutTotals.delivery === 0 ? 'Free' : formatCurrency(checkoutTotals.delivery)} />
            <div className="border-t border-white/10 pt-3">
              <Row label="Grand total" value={formatCurrency(checkoutTotals.grandTotal)} strong />
            </div>
          </div>

          <div className="mt-5 grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300 sm:grid-cols-2">
            <InfoPill label="Secure payment" value="Encrypted UI" />
            <InfoPill label="Payment mode" value={paymentMethods.find((item) => item.id === paymentMethod)?.label} />
          </div>
        </aside>
      </form>
    </div>
  )
}

function Field({ label, ...props }) {
  return (
    <label className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{label}</span>
      <input {...props} className="mt-2 w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white" />
    </label>
  )
}

function Step({ number, label, active }) {
  return (
    <div className={`rounded-3xl border p-4 ${active ? 'border-brand-500 bg-brand-500/5' : 'border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5'}`}>
      <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${active ? 'bg-brand-500 text-white' : 'bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-white'}`}>
        {number}
      </div>
      <div className="mt-3 text-sm font-semibold text-slate-950 dark:text-white">{label}</div>
    </div>
  )
}

function StepHeader({ number, title, dark = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${dark ? 'bg-white/10 text-white' : 'bg-brand-500 text-white'}`}>{number}</div>
      <h2 className={`text-xl font-bold ${dark ? 'text-white' : 'text-slate-950 dark:text-white'}`}>{title}</h2>
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

function InfoPill({ label, value }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
    </div>
  )
}

function paymentIcon(id) {
  switch (id) {
    case 'upi':
      return '⌁'
    case 'card':
      return '◫'
    case 'netbanking':
      return '⌂'
    default:
      return '₹'
  }
}