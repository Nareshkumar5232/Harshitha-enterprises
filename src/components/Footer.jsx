import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer(){
  return (
    <footer className="relative overflow-hidden border-t border-[var(--border-soft)] bg-[var(--surface-glass)] text-[var(--text-primary)] backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.15),transparent_34%),radial-gradient(circle_at_top_right,rgba(6,182,212,0.14),transparent_28%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <div className="text-xl font-bold text-[var(--text-primary)]">Sree Harshitha Enterprises</div>
          <p className="mt-3 max-w-lg text-sm leading-7 text-[var(--text-muted)]">
            Premium electronics, appliances, and dependable support for homes, offices, and bulk procurement.
          </p>
          <div className="mt-5 space-y-2 text-sm">
            <p>Phone: +91 9363706040</p>
            <p>Email: care.harshithaenterprises@gmail.com</p>
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Quick links</div>
          <ul className="mt-4 space-y-3 text-sm font-medium">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/account">Profile</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Store info</div>
          <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">
            3rd Floor, Flat No: C3, 7A & 7B, 467/2, Saraswathi Nagar Main Road, Thirumullaivoyal, Chennai - 600062
          </p>
        </div>
      </div>
      <div className="relative border-t border-[var(--border-soft)] px-4 py-4 text-center text-sm text-[var(--text-muted)] sm:px-6 lg:px-8">
        © {new Date().getFullYear()} Sree Harshitha Enterprises. All rights reserved.
      </div>
    </footer>
  )
}
