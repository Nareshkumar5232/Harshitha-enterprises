import React from 'react'

export default function Contact(){
  const address = '3rd Floor, Flat No: C3, 7A & 7B, 467/2, Saraswathi Nagar Main Road, Thirumullaivoyal, Chennai 600062'
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="theme-card relative overflow-hidden rounded-[2rem] p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.14),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.12),transparent_28%)]" />
          <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700 dark:text-cyan-200/70">Contact</p>
          <h1 className="mt-3 text-4xl font-black text-slate-950 dark:text-white">Get support for product enquiries and bulk orders.</h1>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">Use the direct contact options below instead of an embedded map for a cleaner, more trustworthy experience.</p>

          <div className="mt-6 grid gap-4 rounded-[1.75rem] bg-[var(--bg-secondary)]/80 p-5 sm:grid-cols-2">
            <ContactTile icon="🏢" label="Company" value="Sree Harshitha Enterprises" />
            <ContactTile icon="📍" label="Address" value="3rd Floor, Flat No: C3, 7A & 7B, 467/2, Saraswathi Nagar Main Road, Thirumullaivoyal, Chennai – 600062" />
            <ContactTile icon="📞" label="Phone" value="+91 9363706040" />
            <ContactTile icon="✉️" label="Email" value="care.harshithaenterprises@gmail.com" />
            <ContactTile icon="🕒" label="Business hours" value="Mon-Sat, 10:00 AM - 7:00 PM" />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href="tel:+919363706040" className="btn-primary rounded-full px-5 py-3 text-sm font-semibold transition">
              Call Now
            </a>
            <a href="mailto:care.harshithaenterprises@gmail.com" className="btn-secondary rounded-full px-5 py-3 text-sm font-semibold transition">
              Email Us
            </a>
            <a href="https://wa.me/919363706040" target="_blank" rel="noreferrer" className="rounded-full border border-emerald-300 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-500/15 dark:border-emerald-400/30 dark:text-emerald-300">
              Chat on WhatsApp
            </a>
            <a href={directionsUrl} target="_blank" rel="noreferrer" className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-glass)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--bg-secondary)]">
              Get Directions
            </a>
          </div>
          </div>
        </section>

        <section className="glow-dark theme-card rounded-[2rem] p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/70">Message form</p>
          <h2 className="mt-3 text-3xl font-black text-[var(--text-primary)]">Send a message</h2>
          <form className="mt-6 space-y-4">
            <Field label="Name" placeholder="Your name" />
            <Field label="Email" placeholder="you@example.com" />
            <Field label="Phone" placeholder="Phone number" />
            <label className="theme-input block rounded-2xl px-4 py-3">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">Message</span>
              <textarea placeholder="Tell us about your order or enquiry" className="mt-2 h-32 w-full resize-none border-0 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]" />
            </label>
            <button type="submit" className="btn-primary w-full rounded-full px-5 py-4 text-sm font-semibold transition">
              Submit enquiry
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}

function Field({ label, ...props }) {
  return (
    <label className="theme-input block rounded-2xl px-4 py-3">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">{label}</span>
      <input {...props} className="mt-2 w-full border-0 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]" />
    </label>
  )
}

function ContactTile({ icon, label, value }) {
  return (
    <div className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-card)] p-4 shadow-[var(--shadow-soft)]">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-cyan)] text-lg text-white shadow-lg">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">{label}</p>
          <p className="mt-1 text-sm leading-6 text-[var(--text-primary)]">{value}</p>
        </div>
      </div>
    </div>
  )
}
