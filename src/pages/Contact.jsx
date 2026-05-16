import React from 'react'
import { useAdminData } from '../context/AdminDataContext'

export default function Contact(){
  const { addMessage, settings } = useAdminData()
  const address = settings.address || '3rd Floor, Flat No: C3, 7A & 7B, 467/2, Saraswathi Nagar Main Road, Thirumullaivoyal, Chennai 600062'
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
  const [success, setSuccess] = React.useState('')
  const contactStats = [
    { value: 'Same-day', label: 'Reply goal' },
    { value: 'Mon-Sat', label: 'Business days' },
    { value: 'Bulk orders', label: 'Best for' }
  ]

  const handleSubmit = (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    addMessage({
      customerName: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      phone: String(formData.get('phone') || ''),
      subject: String(formData.get('subject') || 'General enquiry'),
      message: String(formData.get('message') || '')
    })

    event.currentTarget.reset()
    setSuccess('Your message has been sent successfully.')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
        <section className="theme-card relative overflow-hidden rounded-[2.25rem] p-8 sm:p-10 lg:p-12 xl:p-14 min-h-full">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.14),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.12),transparent_28%)]" />
          <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700 dark:text-cyan-200/70">Contact</p>
          <h1 className="mt-3 max-w-xl text-4xl font-black leading-tight text-slate-950 dark:text-white sm:text-5xl">Get support for product enquiries and bulk orders.</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">Use the direct contact options below instead of an embedded map for a cleaner, more trustworthy experience. The page is intentionally sized larger so the contact details feel like a proper destination, not a quick form.</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {contactStats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-glass)] px-5 py-4 shadow-[var(--shadow-soft)]">
                <p className="text-2xl font-black text-[var(--text-primary)]">{stat.value}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 rounded-[1.9rem] bg-[var(--bg-secondary)]/80 p-6 sm:grid-cols-2 lg:p-7">
            <ContactTile icon="🏢" label="Company" value={settings.storeName} />
            <ContactTile icon="📍" label="Address" value={address} />
            <ContactTile icon="📞" label="Phone" value={settings.contactPhone || '+91 44 3539 5138'} />
            <ContactTile icon="✉️" label="Email" value={settings.contactEmail} />
            <ContactTile icon="🕒" label="Business hours" value="Mon-Sat, 10:00 AM - 7:00 PM" />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={`tel:${String(settings.contactPhone || '+91 44 3539 5138').replace(/[^0-9+]/g, '')}`} className="btn-primary rounded-full px-6 py-3.5 text-sm font-semibold transition">
              Call Now
            </a>
            <a href={`mailto:${settings.contactEmail}`} className="btn-secondary rounded-full px-6 py-3.5 text-sm font-semibold transition">
              Email Us
            </a>
            <a href={`https://wa.me/${String(settings.whatsapp || '+919363706040').replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="rounded-full border border-emerald-300 bg-emerald-500/10 px-6 py-3.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-500/15 dark:border-emerald-400/30 dark:text-emerald-300">
              Chat on WhatsApp
            </a>
            <a href={directionsUrl} target="_blank" rel="noreferrer" className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-glass)] px-6 py-3.5 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--bg-secondary)]">
              Get Directions
            </a>
          </div>
          </div>
        </section>

        <section className="glow-dark theme-card rounded-[2.25rem] p-8 sm:p-10 lg:p-12 xl:p-14 min-h-full">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/70">Message form</p>
          <h2 className="mt-3 text-3xl font-black text-[var(--text-primary)] sm:text-4xl">Send a message</h2>
          <p className="mt-4 max-w-xl text-base leading-8 text-[var(--text-muted)]">Tell us what you need and we will route it to the right person. Add order details, delivery questions, or product requirements in one message.</p>
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {success ? <p className="rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300">{success}</p> : null}
            <Field label="Name" name="name" placeholder="Your name" required />
            <Field label="Email" name="email" type="email" placeholder="you@example.com" required />
            <Field label="Phone" name="phone" placeholder="Phone number" required />
            <Field label="Subject" name="subject" placeholder="How can we help?" required />
            <label className="theme-input block rounded-2xl px-4 py-3">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">Message</span>
              <textarea name="message" placeholder="Tell us about your order or enquiry" className="mt-2 h-44 w-full resize-none border-0 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]" required />
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
    <label className="theme-input block rounded-2xl px-4 py-3.5">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">{label}</span>
      <input {...props} className="mt-2.5 w-full border-0 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]" />
    </label>
  )
}

function ContactTile({ icon, label, value }) {
  return (
    <div className="flex min-h-36 flex-col justify-center rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-card)] p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-cyan)] text-xl text-white shadow-lg">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">{label}</p>
          <p className="mt-1 text-sm leading-6 text-[var(--text-primary)] break-words">{value}</p>
        </div>
      </div>
    </div>
  )
}
