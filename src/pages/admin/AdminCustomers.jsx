import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { useAdminData } from '../../context/AdminDataContext'

export default function AdminCustomers() {
  const { users, blockedUsers, blockCustomer, unblockCustomer, removeCustomer } = useAuth()
  const { orders } = useAdminData()
  const [search, setSearch] = React.useState('')
  const [selected, setSelected] = React.useState(null)

  const filteredUsers = React.useMemo(() => {
    const query = search.trim().toLowerCase()
    return users.filter((user) => [user.name, user.email, user.mobile].join(' ').toLowerCase().includes(query))
  }, [search, users])

  const selectedOrders = selected ? orders.filter((order) => order.customer?.email === selected.email) : []

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-xl dark:border-white/10 dark:bg-slate-950/75">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700 dark:text-cyan-200/70">Customers</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">Customer management</h1>
        <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">Search registered users, review order history, and manage customer access.</p>

        <label className="mt-5 block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Search customers</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, email, or mobile" className="mt-2 w-full border-0 bg-transparent text-sm text-slate-900 outline-none dark:text-white" />
        </label>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-4">
          {filteredUsers.map((user) => {
            const blocked = blockedUsers.includes(user.email)
            return (
              <article key={user.id} className="rounded-[1.75rem] border border-white/60 bg-white/85 p-5 shadow-xl dark:border-white/10 dark:bg-slate-950/75">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-bold text-slate-950 dark:text-white">{user.name || 'Customer'}</div>
                    <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{user.email} · {user.mobile || 'No mobile'}</div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${blocked ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300' : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'}`}>{blocked ? 'Blocked' : 'Active'}</span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <Metric label="Orders" value={`${orders.filter((order) => order.customer?.email === user.email).length}`} />
                  <Metric label="Latest order" value={orders.find((order) => order.customer?.email === user.email)?.id || '—'} />
                  <Metric label="State" value={user.mobile ? 'Verified contact' : 'Pending'} />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" onClick={() => setSelected(user)} className="rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold text-white">View orders</button>
                  {blocked ? (
                    <button type="button" onClick={() => unblockCustomer(user.email)} className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 dark:border-white/10 dark:text-slate-200">Unblock</button>
                  ) : (
                    <button type="button" onClick={() => blockCustomer(user.email)} className="rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-800 dark:border-amber-400/40 dark:bg-amber-500/10 dark:text-amber-300">Block</button>
                  )}
                  <button type="button" onClick={() => removeCustomer(user.email)} className="rounded-full border border-rose-300 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 dark:border-rose-400/40 dark:bg-rose-500/10 dark:text-rose-300">Remove</button>
                </div>
              </article>
            )
          })}
        </section>

        <aside className="rounded-[2rem] border border-white/60 bg-slate-950 p-6 text-white shadow-xl shadow-slate-950/20 dark:border-white/10">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/70">Customer detail</div>
          {selected ? (
            <div className="mt-4 space-y-4">
              <div>
                <div className="text-2xl font-bold text-white">{selected.name || 'Customer'}</div>
                <div className="mt-1 text-sm text-slate-300">{selected.email}</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                <div className="font-semibold text-white">Order history</div>
                <div className="mt-3 space-y-3">
                  {selectedOrders.length ? selectedOrders.map((order) => (
                    <div key={order.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <div className="font-semibold text-white">{order.id}</div>
                      <div className="mt-1 text-xs text-slate-400">{order.status} · {new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                  )) : <div>No orders yet.</div>}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-3xl border border-dashed border-white/15 bg-white/5 p-5 text-sm text-slate-300">Select a customer to inspect their order history.</div>
          )}
        </aside>
      </div>
    </div>
  )
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
      <div className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-950 dark:text-white">{value}</div>
    </div>
  )
}
