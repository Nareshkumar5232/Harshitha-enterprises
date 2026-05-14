import React from 'react'
import { useAdminData } from '../../context/AdminDataContext'
import { formatCurrency } from '../../utils/money'

const emptyProduct = {
  name: '',
  description: '',
  price: '',
  category: 'accessory',
  stockQuantity: '',
  image: '',
  brand: '',
  badge: '',
  gallery: '',
  specifications: ''
}

export default function AdminProducts() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useAdminData()
  const [search, setSearch] = React.useState('')
  const [category, setCategory] = React.useState('all')
  const [page, setPage] = React.useState(1)
  const [modalOpen, setModalOpen] = React.useState(false)
  const [editingProduct, setEditingProduct] = React.useState(null)
  const [formState, setFormState] = React.useState(emptyProduct)

  const pageSize = 6

  const filteredProducts = React.useMemo(() => {
    const query = search.trim().toLowerCase()

    return products.filter((product) => {
      const matchesCategory = category === 'all' || product.category === category
      const matchesSearch = !query || [product.name, product.description, product.brand, product.badge, product.category].join(' ').toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })
  }, [category, products, search])

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize))
  const visibleProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize)

  React.useEffect(() => {
    setPage(1)
  }, [search, category])

  const openCreate = () => {
    setEditingProduct(null)
    setFormState(emptyProduct)
    setModalOpen(true)
  }

  const openEdit = (product) => {
    setEditingProduct(product)
    setFormState({
      name: product.name || '',
      description: product.description || '',
      price: String(product.price || ''),
      category: product.category || 'accessory',
      stockQuantity: String(product.stockQuantity || 0),
      image: product.image || '',
      brand: product.brand || '',
      badge: product.badge || '',
      gallery: Array.isArray(product.gallery) ? product.gallery.join('\n') : '',
      specifications: Array.isArray(product.specifications) ? product.specifications.join('\n') : ''
    })
    setModalOpen(true)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const payload = {
      ...formState,
      price: Number(formState.price || 0),
      stockQuantity: Number(formState.stockQuantity || 0),
      gallery: String(formState.gallery || '')
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
      specifications: String(formState.specifications || '')
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean)
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, payload)
    } else {
      addProduct(payload)
    }

    setModalOpen(false)
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-xl dark:border-white/10 dark:bg-slate-950/75">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700 dark:text-cyan-200/70">Products</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">Product management</h1>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">Add, edit, delete, search, and filter products in the storefront catalog.</p>
          </div>
          <button type="button" onClick={openCreate} className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/20">Add product</button>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <label className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Search</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" className="mt-2 w-full border-0 bg-transparent text-sm text-slate-900 outline-none dark:text-white" />
          </label>
          <label className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Category</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 w-full border-0 bg-transparent text-sm text-slate-900 outline-none dark:text-white">
              <option value="all">All</option>
              {categories.filter((item) => item.id !== 'all').map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
            </select>
          </label>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Total products</div>
            <div className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{filteredProducts.length}</div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/85 shadow-xl dark:border-white/10 dark:bg-slate-950/75">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-white/10">
            <thead className="bg-slate-50 dark:bg-white/5">
              <tr className="text-left text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Stock</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              {visibleProducts.map((product) => (
                <tr key={product.id} className="align-top">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="h-14 w-14 rounded-2xl object-cover" />
                      <div>
                        <div className="font-semibold text-slate-950 dark:text-white">{product.name}</div>
                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{product.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">{product.category}</td>
                  <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">{product.stockQuantity}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-slate-950 dark:text-white">{formatCurrency(product.price)}</td>
                  <td className="px-5 py-4"><StockBadge stock={product.stockQuantity} /></td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => openEdit(product)} className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-white/10 dark:text-slate-200">Edit</button>
                      <button type="button" onClick={() => deleteProduct(product.id)} className="rounded-full border border-rose-300 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 dark:border-rose-400/40 dark:bg-rose-500/10 dark:text-rose-300">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pageCount > 1 ? (
          <div className="flex items-center justify-center gap-2 border-t border-slate-200 px-5 py-4 dark:border-white/10">
            <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold disabled:opacity-40 dark:border-white/10">Prev</button>
            <div className="text-sm text-slate-500 dark:text-slate-400">Page {page} of {pageCount}</div>
            <button type="button" onClick={() => setPage((value) => Math.min(pageCount, value + 1))} disabled={page === pageCount} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold disabled:opacity-40 dark:border-white/10">Next</button>
          </div>
        ) : null}
      </section>

      {modalOpen ? (
        <Modal onClose={() => setModalOpen(false)} title={editingProduct ? 'Edit product' : 'Add product'}>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            <Field label="Product name" value={formState.name} onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))} required />
            <Field label="Brand" value={formState.brand} onChange={(event) => setFormState((current) => ({ ...current, brand: event.target.value }))} required />
            <Field label="Price" type="number" value={formState.price} onChange={(event) => setFormState((current) => ({ ...current, price: event.target.value }))} required />
            <Field label="Stock quantity" type="number" value={formState.stockQuantity} onChange={(event) => setFormState((current) => ({ ...current, stockQuantity: event.target.value }))} required />
            <label className="sm:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Category</span>
              <select value={formState.category} onChange={(event) => setFormState((current) => ({ ...current, category: event.target.value }))} className="mt-2 w-full border-0 bg-transparent text-sm text-slate-900 outline-none dark:text-white">
                {categories.filter((item) => item.id !== 'all').map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
              </select>
            </label>
            <Field label="Badge" value={formState.badge} onChange={(event) => setFormState((current) => ({ ...current, badge: event.target.value }))} />
            <Field label="Image URL" value={formState.image} onChange={(event) => setFormState((current) => ({ ...current, image: event.target.value }))} />
            <label className="sm:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Description</span>
              <textarea value={formState.description} onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))} className="mt-2 h-28 w-full resize-none border-0 bg-transparent text-sm text-slate-900 outline-none dark:text-white" required />
            </label>
            <label className="sm:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Gallery URLs</span>
              <textarea value={formState.gallery} onChange={(event) => setFormState((current) => ({ ...current, gallery: event.target.value }))} placeholder="One image URL per line" className="mt-2 h-24 w-full resize-none border-0 bg-transparent text-sm text-slate-900 outline-none dark:text-white" />
            </label>
            <label className="sm:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Specifications</span>
              <textarea value={formState.specifications} onChange={(event) => setFormState((current) => ({ ...current, specifications: event.target.value }))} placeholder="One spec per line" className="mt-2 h-28 w-full resize-none border-0 bg-transparent text-sm text-slate-900 outline-none dark:text-white" />
            </label>
            <button type="submit" className="sm:col-span-2 rounded-full bg-brand-500 px-5 py-4 text-sm font-semibold text-white">{editingProduct ? 'Update product' : 'Save product'}</button>
          </form>
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
          <div>
            <div className="text-lg font-bold text-[var(--text-primary)]">{title}</div>
            <div className="mt-1 text-sm text-[var(--text-muted)]">Use line-separated lists for gallery URLs and specifications.</div>
          </div>
          <button type="button" onClick={onClose} className="rounded-full px-3 py-2 text-lg">×</button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  )
}

function Field({ label, ...props }) {
  return (
    <label className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{label}</span>
      <input {...props} className="mt-2 w-full border-0 bg-transparent text-sm text-slate-900 outline-none dark:text-white" />
    </label>
  )
}

function StockBadge({ stock }) {
  const tone = stock <= 5 ? 'bg-rose-500/10 text-rose-600 dark:text-rose-300' : stock <= 12 ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300' : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
  const label = stock <= 5 ? 'Low stock' : stock <= 12 ? 'Moderate' : 'Healthy'

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>{label}</span>
}
