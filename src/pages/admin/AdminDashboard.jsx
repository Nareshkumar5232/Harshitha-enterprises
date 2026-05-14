import React from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../../utils/money'
import { useAdminData } from '../../context/AdminDataContext'
import { useAuth } from '../../context/AuthContext'

export default function AdminDashboard() {
  const { products, orders, messages, recentOrders, recentMessages, unreadMessages, pendingOrders, deliveredOrders, totalRevenue, lowStockProducts } = useAdminData()
  const { users } = useAuth()

  const stats = [
    { label: 'Total Orders', value: `${orders.length}` },
    { label: 'Total Revenue', value: formatCurrency(totalRevenue) },
    { label: 'Total Customers', value: `${users.length}` },
    { label: 'Pending Orders', value: `${pendingOrders}` },
    { label: 'Delivered Orders', value: `${deliveredOrders}` },
    { label: 'Contact Messages Count', value: `${messages.length}` }
  ]

  const orderCount = orders.length

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-xl dark:border-white/10 dark:bg-slate-950/75">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700 dark:text-cyan-200/70">Overview</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-950 dark:text-white">Admin dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">Monitor orders, customers, products, and contact messages from one premium operations console.</p>
          </div>
          <Link to="/admin/products" className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/20">Manage products</Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((item) => (
          <Card key={item.label} label={item.label} value={item.value} />
        ))}
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-xl dark:border-white/10 dark:bg-slate-950/75">
          <SectionTitle title="Revenue and order activity" copy="Simple live dashboard chart based on recent order volume." />
          <div className="mt-6 flex h-52 items-end gap-3 rounded-[1.5rem] bg-[var(--bg-secondary)]/70 p-4">
            {buildChart(orderCount).map((bar) => (
              <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-full w-full items-end rounded-2xl bg-white/50 p-1 dark:bg-white/5">
                  <div className="w-full rounded-xl bg-gradient-to-t from-brand-500 to-accent" style={{ height: `${bar.height}%` }} />
                </div>
                <div className="text-xs font-semibold text-[var(--text-muted)]">{bar.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/60 bg-slate-950 p-6 text-white shadow-xl shadow-slate-950/20 dark:border-white/10">
          <SectionTitle title="Alerts" copy="Low stock and unread message highlights." dark />
          <div className="mt-5 space-y-3">
            <MiniAlert title="Unread messages" value={`${unreadMessages}`} />
            <MiniAlert title="Low stock products" value={`${lowStockProducts.length}`} />
            <MiniAlert title="Total products" value={`${products.length}`} />
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <Panel title="Recent orders" copy="Latest order activity and customer checkout details.">
          {recentOrders.length ? recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-4">
              <div>
                <div className="text-sm font-semibold text-white">{order.id}</div>
                <div className="mt-1 text-xs text-slate-300">{order.customer?.fullName || order.customer?.email || 'Customer'}</div>
              </div>
              <div className="text-right text-sm font-semibold text-white">{formatCurrency(order.totals?.grandTotal || 0)}</div>
            </div>
          )) : <EmptyText>No orders yet.</EmptyText>}
        </Panel>

        <Panel title="Customer activity" copy="Recent customer registrations and contact activity.">
          {users.length ? users.slice(0, 5).map((user) => (
            <div key={user.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold text-white">{user.name || 'Customer'}</div>
              <div className="mt-1 text-xs text-slate-300">{user.email}</div>
            </div>
          )) : <EmptyText>No registered customers yet.</EmptyText>}
        </Panel>
      </section>

      <section className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <Panel title="Message notifications" copy="Unread customer enquiries and recent communication.">
          {recentMessages.length ? recentMessages.map((message) => (
            <div key={message.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-white">{message.subject}</div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${message.read ? 'bg-white/10 text-slate-300' : 'bg-emerald-500/15 text-emerald-300'}`}>{message.read ? 'Read' : 'New'}</span>
              </div>
              <div className="mt-2 text-xs text-slate-300">{message.customerName} · {message.email}</div>
            </div>
          )) : <EmptyText>No messages yet.</EmptyText>}
        </Panel>

        <Panel title="Top products" copy="Fast access to the products that need attention.">
          {products.slice(0, 5).map((product) => (
            <div key={product.id} className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-4">
              <img src={product.image} alt={product.name} className="h-14 w-14 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-white">{product.name}</div>
                <div className="mt-1 text-xs text-slate-300">{product.brand}</div>
              </div>
              <div className="text-sm font-semibold text-white">{product.stockQuantity} stock</div>
            </div>
          ))}
        </Panel>
      </section>
    </div>
  )
}

function buildChart(orderCount) {
  return [
    { label: 'Mon', height: Math.min(100, 24 + orderCount * 6) },
    { label: 'Tue', height: Math.min(100, 38 + orderCount * 5) },
    { label: 'Wed', height: Math.min(100, 52 + orderCount * 4) },
    { label: 'Thu', height: Math.min(100, 66 + orderCount * 3) },
    { label: 'Fri', height: Math.min(100, 42 + orderCount * 6) },
    { label: 'Sat', height: Math.min(100, 58 + orderCount * 4) }
  ]
}

function Card({ label, value }) {
  return (
    <div className="rounded-[1.75rem] border border-white/60 bg-white/85 p-5 shadow-xl dark:border-white/10 dark:bg-slate-950/75">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-3 text-2xl font-black text-slate-950 dark:text-white">{value}</div>
    </div>
  )
}

function SectionTitle({ title, copy, dark = false }) {
  return (
    <div>
      <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${dark ? 'text-cyan-200/70' : 'text-brand-700'}`}>Analytics</p>
      <h2 className={`mt-2 text-2xl font-bold ${dark ? 'text-white' : 'text-slate-950 dark:text-white'}`}>{title}</h2>
      <p className={`mt-2 text-sm leading-7 ${dark ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'}`}>{copy}</p>
    </div>
  )
}

function Panel({ title, copy, children }) {
  return (
    <div className="rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-xl dark:border-white/10 dark:bg-slate-950/75">
      <SectionTitle title={title} copy={copy} />
      <div className="mt-5 space-y-3">{children}</div>
    </div>
  )
}

function MiniAlert({ title, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{title}</div>
      <div className="mt-1 text-2xl font-bold text-white">{value}</div>
    </div>
  )
}

function EmptyText({ children }) {
  return <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-slate-300">{children}</div>
}
