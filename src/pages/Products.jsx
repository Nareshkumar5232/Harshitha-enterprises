import React from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import Loading from '../components/Loading'
import { categories } from '../data/catalog'
import { useAdminData } from '../context/AdminDataContext'

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price low to high' },
  { value: 'price-desc', label: 'Price high to low' },
  { value: 'latest', label: 'Latest products' }
]

export default function Products(){
  const [ready, setReady] = React.useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const { products } = useAdminData()
  const [search, setSearch] = React.useState(searchParams.get('q') || '')
  const [category, setCategory] = React.useState(searchParams.get('category') || 'all')
  const [sort, setSort] = React.useState(searchParams.get('sort') || 'featured')
  const pageSize = 8
  const [page, setPage] = React.useState(1)

  React.useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 200)
    return () => window.clearTimeout(timer)
  }, [])

  React.useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('q', search)
    if (category !== 'all') params.set('category', category)
    if (sort !== 'featured') params.set('sort', sort)
    setSearchParams(params, { replace: true })
  }, [category, search, setSearchParams, sort])

  const filteredProducts = React.useMemo(() => {
    const query = search.trim().toLowerCase()

    let result = products.filter((product) => {
      const matchesSearch = !query || [product.name, product.description, product.badge, product.category].join(' ').toLowerCase().includes(query)
      const matchesCategory = category === 'all' || product.category === category
      return matchesSearch && matchesCategory
    })

    if (sort === 'price-asc') {
      result = [...result].sort((left, right) => left.price - right.price)
    } else if (sort === 'price-desc') {
      result = [...result].sort((left, right) => right.price - left.price)
    } else if (sort === 'latest') {
      result = [...result].sort((left, right) => Number(Boolean(right.latest)) - Number(Boolean(left.latest)))
    } else {
      result = [...result].sort((left, right) => Number(Boolean(right.featured)) - Number(Boolean(left.featured)))
    }

    return result
  }, [category, search, sort])

  React.useEffect(() => {
    setPage(1)
  }, [search, category, sort])

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize))
  const visibleProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="mx-auto max-w-7xl overflow-x-hidden px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-xl dark:border-white/10 dark:bg-slate-950/75">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700 dark:text-cyan-200/70">Catalog</p>
            <h1 className="mt-3 text-3xl font-black text-slate-950 dark:text-white sm:text-4xl">Shop premium electronics with powerful search and filters.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              Search by product name, filter by category, and sort by price or latest arrivals to find the right item quickly.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Stat label="Live products" value={`${products.length}`} />
            <Stat label="Filtered results" value={`${filteredProducts.length}`} />
          </div>
        </div>
      </div>

      <section className="mt-8 rounded-[2rem] border border-white/60 bg-white/80 p-5 shadow-xl dark:border-white/10 dark:bg-slate-950/75">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <label className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Search</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products, categories, or badges"
              className="mt-2 w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
            />
          </label>

          <label className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Category</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 w-full border-0 bg-transparent text-sm font-medium text-slate-900 outline-none dark:text-white">
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </label>

          <label className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Sort</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="mt-2 w-full border-0 bg-transparent text-sm font-medium text-slate-900 outline-none dark:text-white">
              {sortOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategory(item.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${category === item.id ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10'}`}
            >
              {item.title}
            </button>
          ))}
        </div>
      </section>

      {!ready ? (
        <div className="mt-8">
          <Loading count={8} />
        </div>
      ) : (
        <section className="mt-8">
          {filteredProducts.length ? (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} data={product} />
                ))}
              </div>

              {pageCount > 1 ? (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={page === 1}
                    className="btn-secondary rounded-full px-4 py-2 text-sm font-semibold transition disabled:opacity-50"
                  >
                    Prev
                  </button>
                  {Array.from({ length: pageCount }).map((_, index) => {
                    const pageNo = index + 1
                    return (
                      <button
                        key={pageNo}
                        type="button"
                        onClick={() => setPage(pageNo)}
                        className={`h-10 w-10 rounded-full text-sm font-semibold transition ${pageNo === page ? 'btn-primary' : 'btn-secondary'}`}
                      >
                        {pageNo}
                      </button>
                    )
                  })}
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
                    disabled={page === pageCount}
                    className="btn-secondary rounded-full px-4 py-2 text-sm font-semibold transition disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <EmptyState onReset={() => {
              setSearch('')
              setCategory('all')
              setSort('featured')
            }} />
          )}
        </section>
      )}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{value}</div>
    </div>
  )
}

function EmptyState({ onReset }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 px-6 py-14 text-center shadow-lg dark:border-white/10 dark:bg-slate-950/60">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/10 text-2xl text-brand-500">🔎</div>
      <h2 className="mt-5 text-2xl font-bold text-slate-950 dark:text-white">No matching products found</h2>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
        Try clearing the search or switching to a different category and sorting option.
      </p>
      <button type="button" onClick={onReset} className="mt-6 rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/20">
        Reset filters
      </button>
    </div>
  )
}
