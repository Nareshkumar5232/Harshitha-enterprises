import React from 'react'
import { useAdminData } from '../../context/AdminDataContext'

export default function AdminMessages() {
  const { messages, toggleMessageRead, deleteMessage } = useAdminData()
  const [selected, setSelected] = React.useState(null)

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-xl dark:border-white/10 dark:bg-slate-950/75">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700 dark:text-cyan-200/70">Messages</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">Contact messages inbox</h1>
        <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">Read, mark, delete, and reply to contact enquiries submitted from the storefront.</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-4">
          {messages.map((message) => (
            <article key={message.id} className={`rounded-[1.75rem] border p-5 shadow-xl ${message.read ? 'border-white/60 bg-white/85 dark:border-white/10 dark:bg-slate-950/75' : 'border-emerald-300/60 bg-emerald-50/90 dark:border-emerald-400/20 dark:bg-emerald-500/10'}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-bold text-slate-950 dark:text-white">{message.subject}</div>
                  <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{message.customerName} · {message.email} · {message.phone}</div>
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{new Date(message.createdAt).toLocaleString()}</div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300 line-clamp-3">{message.message}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" onClick={() => setSelected(message)} className="rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold text-white">Reply</button>
                <button type="button" onClick={() => toggleMessageRead(message.id, !message.read)} className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 dark:border-white/10 dark:text-slate-200">{message.read ? 'Mark unread' : 'Mark read'}</button>
                <button type="button" onClick={() => deleteMessage(message.id)} className="rounded-full border border-rose-300 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 dark:border-rose-400/40 dark:bg-rose-500/10 dark:text-rose-300">Delete</button>
              </div>
            </article>
          ))}
        </section>

        <aside className="rounded-[2rem] border border-white/60 bg-slate-950 p-6 text-white shadow-xl shadow-slate-950/20 dark:border-white/10">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/70">Reply panel</div>
          <h2 className="mt-2 text-2xl font-bold">Quick reply UI</h2>
          <p className="mt-2 text-sm leading-7 text-slate-300">Click any message to prepare a reply draft. Wire this section to email or WhatsApp when backend is ready.</p>

          {selected ? (
            <div className="mt-6 space-y-4 rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold text-white">Replying to {selected.customerName}</div>
              <label className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Reply message</span>
                <textarea className="mt-2 h-28 w-full resize-none border-0 bg-transparent text-sm text-white outline-none" placeholder="Type your reply here" defaultValue={`Hello ${selected.customerName},\n\n`} />
              </label>
              <button type="button" className="w-full rounded-full bg-brand-500 px-4 py-3 text-sm font-semibold text-white">Send reply</button>
            </div>
          ) : (
            <div className="mt-6 rounded-3xl border border-dashed border-white/15 bg-white/5 p-5 text-sm text-slate-300">Select a message to show a reply draft.</div>
          )}
        </aside>
      </div>
    </div>
  )
}
