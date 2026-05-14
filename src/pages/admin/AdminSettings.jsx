import React from 'react'
import { useAdminData } from '../../context/AdminDataContext'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function AdminSettings() {
  const { settings, updateSettings } = useAdminData()
  const { updateAdminPassword } = useAdminAuth()
  const [websiteForm, setWebsiteForm] = React.useState(settings)
  const [passwordForm, setPasswordForm] = React.useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [passwordError, setPasswordError] = React.useState('')
  const [passwordMessage, setPasswordMessage] = React.useState('')

  React.useEffect(() => {
    setWebsiteForm(settings)
  }, [settings])

  const saveWebsiteSettings = (event) => {
    event.preventDefault()
    updateSettings(websiteForm)
  }

  const savePassword = async (event) => {
    event.preventDefault()
    setPasswordError('')
    setPasswordMessage('')

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    const result = await updateAdminPassword(passwordForm)
    if (!result.ok) {
      setPasswordError(result.message || 'Unable to update password')
      return
    }

    setPasswordMessage('Admin password updated successfully')
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-xl dark:border-white/10 dark:bg-slate-950/75">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700 dark:text-cyan-200/70">Settings</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">Admin settings</h1>
        <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">Change password, contact details, delivery charge, GST, and theme preferences for the admin demo panel.</p>
      </section>

      <div className="grid gap-8 xl:grid-cols-2">
        <form onSubmit={saveWebsiteSettings} className="rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-xl dark:border-white/10 dark:bg-slate-950/75">
          <SectionTitle title="Website settings" copy="Store details, tax, delivery, and theme preferences." />
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Store name" value={websiteForm.storeName || ''} onChange={(event) => setWebsiteForm((current) => ({ ...current, storeName: event.target.value }))} />
            <Field label="Contact email" value={websiteForm.contactEmail || ''} onChange={(event) => setWebsiteForm((current) => ({ ...current, contactEmail: event.target.value }))} />
            <Field label="Contact phone" value={websiteForm.contactPhone || ''} onChange={(event) => setWebsiteForm((current) => ({ ...current, contactPhone: event.target.value }))} />
            <Field label="WhatsApp" value={websiteForm.whatsapp || ''} onChange={(event) => setWebsiteForm((current) => ({ ...current, whatsapp: event.target.value }))} />
            <Field label="GST %" type="number" value={websiteForm.gstRate || 0} onChange={(event) => setWebsiteForm((current) => ({ ...current, gstRate: Number(event.target.value) }))} />
            <Field label="Delivery charge" type="number" value={websiteForm.deliveryCharge || 0} onChange={(event) => setWebsiteForm((current) => ({ ...current, deliveryCharge: Number(event.target.value) }))} />
            <Field label="Free delivery threshold" type="number" value={websiteForm.freeDeliveryThreshold || 0} onChange={(event) => setWebsiteForm((current) => ({ ...current, freeDeliveryThreshold: Number(event.target.value) }))} />
            <Field label="Low stock threshold" type="number" value={websiteForm.lowStockThreshold || 0} onChange={(event) => setWebsiteForm((current) => ({ ...current, lowStockThreshold: Number(event.target.value) }))} />
            <label className="sm:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Address</span>
              <textarea value={websiteForm.address || ''} onChange={(event) => setWebsiteForm((current) => ({ ...current, address: event.target.value }))} className="mt-2 h-28 w-full resize-none border-0 bg-transparent text-sm text-slate-900 outline-none dark:text-white" />
            </label>
            <label className="sm:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Theme preference</span>
              <select value={websiteForm.themePreference || 'system'} onChange={(event) => setWebsiteForm((current) => ({ ...current, themePreference: event.target.value }))} className="mt-2 w-full border-0 bg-transparent text-sm text-slate-900 outline-none dark:text-white">
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
          </div>
          <button type="submit" className="mt-5 rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white">Save website settings</button>
        </form>

        <form onSubmit={savePassword} className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-xl shadow-slate-950/20 dark:border-white/10">
          <SectionTitle title="Admin security" copy="Change the admin password for the current local demo account." dark />
          <div className="mt-5 space-y-4">
            <Field label="Current password" type="password" value={passwordForm.currentPassword} onChange={(event) => setPasswordForm((current) => ({ ...current, currentPassword: event.target.value }))} dark />
            <Field label="New password" type="password" value={passwordForm.newPassword} onChange={(event) => setPasswordForm((current) => ({ ...current, newPassword: event.target.value }))} dark />
            <Field label="Confirm new password" type="password" value={passwordForm.confirmPassword} onChange={(event) => setPasswordForm((current) => ({ ...current, confirmPassword: event.target.value }))} dark />
            {passwordError ? <div className="text-sm font-medium text-rose-300">{passwordError}</div> : null}
            {passwordMessage ? <div className="text-sm font-medium text-emerald-300">{passwordMessage}</div> : null}
            <button type="submit" className="w-full rounded-full bg-gradient-to-r from-brand-500 to-accent px-5 py-4 text-sm font-semibold text-white">Update admin password</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function SectionTitle({ title, copy, dark = false }) {
  return (
    <div>
      <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${dark ? 'text-cyan-200/70' : 'text-brand-700'}`}>Configuration</p>
      <h2 className={`mt-2 text-2xl font-bold ${dark ? 'text-white' : 'text-slate-950 dark:text-white'}`}>{title}</h2>
      <p className={`mt-2 text-sm leading-7 ${dark ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'}`}>{copy}</p>
    </div>
  )
}

function Field({ label, dark = false, ...props }) {
  return (
    <label className={`rounded-2xl px-4 py-3 ${dark ? 'border border-white/10 bg-white/5' : 'border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5'}`}>
      <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${dark ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>{label}</span>
      <input {...props} className={`mt-2 w-full border-0 bg-transparent text-sm outline-none ${dark ? 'text-white placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400 dark:text-white'}`} />
    </label>
  )
}
