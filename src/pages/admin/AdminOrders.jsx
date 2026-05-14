import React from 'react'
import { formatCurrency } from '../../utils/money'
import { useAdminData } from '../../context/AdminDataContext'

const orderStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useAdminData()
  const [search, setSearch] = React.useState('')
  const [status, setStatus] = React.useState('all')
  const [sort, setSort] = React.useState('latest')
  const [selectedOrder, setSelectedOrder] = React.useState(null)

  const filteredOrders = React.useMemo(() => {
    const query = search.trim().toLowerCase()
    let result = orders.filter((order) => {
      const matchesStatus = status === 'all' || order.status === status
      const matchesSearch = !query || [order.id, order.customer?.fullName, order.customer?.email, order.customer?.mobile].join(' ').toLowerCase().includes(query)
      return matchesStatus && matchesSearch
    })

    result.sort((left, right) => {
      const leftDate = new Date(left.createdAt).getTime()
      const rightDate = new Date(right.createdAt).getTime()
      return sort === 'oldest' ? leftDate - rightDate : rightDate - leftDate
    })

    return result
  }, [orders, search, sort, status])

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-xl dark:border-white/10 dark:bg-slate-950/75">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700 dark:text-cyan-200/70">Orders</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">Order management</h1>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">Search, filter, sort, inspect order details, and change statuses in one place.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Total orders</div>
            <div className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{orders.length}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <label className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Search</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search orders or customers" className="mt-2 w-full border-0 bg-transparent text-sm text-slate-900 outline-none dark:text-white" />
          </label>
          <label className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="mt-2 w-full border-0 bg-transparent text-sm text-slate-900 outline-none dark:text-white">
              <option value="all">All</option>
              {orderStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Sort</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="mt-2 w-full border-0 bg-transparent text-sm text-slate-900 outline-none dark:text-white">
              <option value="latest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/85 shadow-xl dark:border-white/10 dark:bg-slate-950/75">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-white/10">
            <thead className="bg-slate-50 dark:bg-white/5">
              <tr className="text-left text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                <th className="px-5 py-4">Order</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Total</th>
                <th className="px-5 py-4">Payment</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-950 dark:text-white">{order.id}</div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{order.items.length} items</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-950 dark:text-white">{order.customer?.fullName || 'Customer'}</div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{order.customer?.email}</div>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-slate-950 dark:text-white">{formatCurrency(order.totals?.grandTotal || 0)}</td>
                  <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">{order.paymentMethod?.toUpperCase?.()}</td>
                  <td className="px-5 py-4">
                    <select value={order.status} onChange={(event) => updateOrderStatus(order.id, event.target.value)} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-100">
                      {orderStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <button type="button" onClick={() => setSelectedOrder(order)} className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-white/10 dark:text-slate-200">View details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedOrder ? (
        <Modal title={selectedOrder.id} onClose={() => setSelectedOrder(null)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Info label="Customer" value={selectedOrder.customer?.fullName || 'Customer'} />
            <Info label="Email" value={selectedOrder.customer?.email || '-'} />
            <Info label="Mobile" value={selectedOrder.customer?.mobile || '-'} />
            <Info label="Address" value={selectedOrder.customer?.address || '-'} />
            <Info label="Payment" value={selectedOrder.paymentMethod?.toUpperCase?.()} />
            <Info label="Order date" value={new Date(selectedOrder.createdAt).toLocaleString()} />
          </div>

          <div className="mt-5 space-y-3">
            {selectedOrder.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
                <img src={item.image} alt={item.name} className="h-14 w-14 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-slate-950 dark:text-white">{item.name}</div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Qty {item.quantity}</div>
                </div>
                <div className="text-sm font-semibold text-slate-950 dark:text-white">{formatCurrency(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>
        </Modal>
      ) : null}
    </div>
  )
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/60 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-[2rem] border border-white/20 bg-[var(--surface-card)] p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="text-lg font-bold text-[var(--text-primary)]">{title}</div>
          <button type="button" onClick={onClose} className="rounded-full px-3 py-2 text-lg">×</button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
      <div className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-950 dark:text-white">{value}</div>
    </div>
  )
}
