import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/money'

export default function ProductCard({data}){
  const { addToCart, beginCheckout } = useCart()
  const navigate = useNavigate()
  const [quantity, setQuantity] = React.useState(1)

  const handleAddToCart = () => addToCart(data, quantity)
  const handleOrderNow = () => {
    beginCheckout([{ ...data, quantity }], 'direct')
    navigate('/checkout')
  }

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="theme-card glow-dark group overflow-hidden rounded-[1.75rem] backdrop-blur-xl transition"
    >
      <div className="relative overflow-hidden">
        <img src={data.image || data.img} alt={data.name || data.title} className="h-56 w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <span className="rounded-full bg-[var(--bg-secondary)]/85 px-3 py-1 text-xs font-semibold text-[var(--text-primary)] backdrop-blur">
            {data.badge || 'Premium'}
          </span>
          {data.featured ? <span className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-slate-950">Featured</span> : null}
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">{data.category || 'Electronics'}</p>
          <h3 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">{data.name || data.title}</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            {data.description || `Premium, brand-new ${String(data.name || data.title).toLowerCase()} sourced from authorised channels.`}
          </p>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs text-[var(--text-muted)]">Starting at</p>
            <div className="mt-1 text-2xl font-bold text-[var(--text-primary)]">{formatCurrency(data.price || 0)}</div>
          </div>

          <div className="inline-flex items-center rounded-full border border-[var(--border-soft)] bg-[var(--surface-glass)] p-1">
            <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="h-9 w-9 rounded-full text-lg font-medium text-[var(--text-primary)] transition hover:bg-[var(--bg-secondary)]" aria-label="Decrease quantity">-</button>
            <span className="w-10 text-center text-sm font-semibold text-[var(--text-primary)]">{quantity}</span>
            <button type="button" onClick={() => setQuantity((value) => value + 1)} className="h-9 w-9 rounded-full text-lg font-medium text-[var(--text-primary)] transition hover:bg-[var(--bg-secondary)]" aria-label="Increase quantity">+</button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={handleAddToCart} className="btn-secondary rounded-full px-4 py-3 text-sm font-semibold transition hover:-translate-y-0.5">
            Add to Cart
          </button>
          <button type="button" onClick={handleOrderNow} className="btn-primary rounded-full px-4 py-3 text-sm font-semibold transition hover:-translate-y-0.5">
            Order Now
          </button>
        </div>
      </div>
    </motion.article>
  )
}
