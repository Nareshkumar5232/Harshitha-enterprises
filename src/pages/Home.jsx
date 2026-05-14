import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductCard from '../components/ProductCard'
import Loading from '../components/Loading'
import { categories, promotionalBanners } from '../data/catalog'
import { useAdminData } from '../context/AdminDataContext'

export default function Home(){
  const [ready, setReady] = React.useState(false)
  const { products } = useAdminData()
  const featuredProducts = products.filter((product) => product.featured).slice(0, 4)
  const relatedProducts = products.slice(2, 8)

  React.useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 240)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className="mx-auto max-w-7xl overflow-x-hidden px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      {!ready ? (
        <Loading variant="hero" />
      ) : (
        <>
          <section className="grid items-center gap-8 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-300/40 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-700 shadow-sm dark:border-white/10 dark:bg-slate-950/80 dark:text-cyan-200">
                Premium electronics marketplace
              </div>

              <div className="space-y-5">
                <motion.h1
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-3xl text-4xl font-black leading-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl"
                >
                  Upgrade your store experience with a modern, trusted electronics checkout flow.
                </motion.h1>
                <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
                  Browse premium TVs, laptops, audio gear, ACs, and accessories with smooth cart actions, clean checkout, and a premium UI built for mobile and desktop.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link to="/products" className="rounded-full bg-gradient-to-r from-brand-500 to-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:-translate-y-0.5 hover:brightness-110">
                  Shop Products
                </Link>
                <Link to="/checkout" className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-100">
                  Quick Checkout
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Stat label="Products" value="100% genuine" />
                <Stat label="Checkout" value="Secure flow" />
                <Stat label="Support" value="Fast response" />
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-4 top-8 h-32 w-32 rounded-full bg-accent/20 blur-3xl" />
              <div className="absolute -right-6 bottom-6 h-40 w-40 rounded-full bg-gold/20 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/90 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-slate-950/75">
                <img
                  src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1400&q=80"
                  alt="Electronics showcase"
                  className="h-[24rem] w-full rounded-[1.5rem] object-cover"
                />
                <div className="absolute bottom-7 left-7 right-7 grid gap-3 sm:grid-cols-3">
                  <GlassBadge title="Fast delivery" copy="City-wide support" />
                  <GlassBadge title="GST invoice" copy="Business-ready orders" />
                  <GlassBadge title="Easy checkout" copy="Cart and direct order" />
                </div>
              </div>
            </div>
          </section>

          <section className="mt-12 grid gap-4 lg:grid-cols-2">
            {promotionalBanners.map((banner, index) => (
              <div
                key={banner.title}
                className={`overflow-hidden rounded-[2rem] bg-gradient-to-r ${index === 0 ? 'from-brand-500 to-[#0e6a9d]' : 'from-[#b78c11] to-brand-500'} p-6 text-white shadow-xl shadow-brand-500/15`}
              >
                <p className="text-xs uppercase tracking-[0.24em] text-white/70">Promotional banner</p>
                <h2 className="mt-3 text-2xl font-bold">{banner.title}</h2>
                <p className="mt-2 max-w-xl text-sm leading-7 text-white/85">{banner.copy}</p>
              </div>
            ))}
          </section>

          <section className="mt-14">
            <SectionHeader title="Featured products" copy="Curated picks with quick add-to-cart and instant checkout actions." />
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} data={product} />
              ))}
            </div>
          </section>

          <section className="mt-14 grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-xl dark:border-white/10 dark:bg-slate-950/75">
              <SectionHeader title="Shop by category" copy="Move quickly through the core storefront categories." />
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {categories.filter((category) => category.id !== 'all').map((category) => (
                  <Link key={category.id} to={`/products?category=${category.id}`} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-white/5 dark:text-slate-100">
                    {category.title}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/60 bg-slate-950 p-6 text-white shadow-xl shadow-slate-950/20">
              <SectionHeader title="Why customers choose us" copy="A dependable storefront built for easy discovery, rich product cards, and safe checkout." dark />
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  ['Premium build', 'Rich product visuals and elegant motion.'],
                  ['Cart first UX', 'Cart drawer, quantity controls, and subtotal logic.'],
                  ['Checkout ready', 'Customer details, payment modes, and order success.']
                ].map(([title, copy]) => (
                  <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <h3 className="font-semibold text-white">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-14">
            <SectionHeader title="Related products" copy="A paginated showcase to help shoppers discover more premium options." />
            <RelatedProducts products={relatedProducts} />
          </section>
        </>
      )}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/85 p-4 shadow-lg dark:border-white/10 dark:bg-slate-950/70">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{label}</p>
      <div className="mt-2 text-lg font-bold text-slate-950 dark:text-white">{value}</div>
    </div>
  )
}

function GlassBadge({ title, copy }) {
  return (
    <div className="rounded-3xl border border-white/20 bg-slate-950/70 p-4 text-white shadow-2xl backdrop-blur">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-xs leading-5 text-slate-300">{copy}</div>
    </div>
  )
}

function SectionHeader({ title, copy, dark = false }) {
  return (
    <div>
      <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${dark ? 'text-cyan-200/70' : 'text-brand-700'}`}>Storefront highlights</p>
      <h2 className={`mt-3 text-2xl font-bold sm:text-3xl ${dark ? 'text-white' : 'text-slate-950 dark:text-white'}`}>{title}</h2>
      <p className={`mt-2 max-w-2xl text-sm leading-7 ${dark ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'}`}>{copy}</p>
    </div>
  )
}

function RelatedProducts({ products }) {
  const pageSize = 3
  const pages = Math.max(1, Math.ceil(products.length / pageSize))
  const [page, setPage] = React.useState(0)

  const visibleProducts = products.slice(page * pageSize, page * pageSize + pageSize)

  return (
    <div className="mt-6 rounded-[2rem] border border-white/60 bg-white/85 p-5 shadow-xl dark:border-white/10 dark:bg-slate-950/75">
      <div className="flex items-center justify-between gap-3 pb-4">
        <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Page {page + 1} of {pages}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setPage((value) => (value - 1 + pages) % pages)} className="h-11 w-11 rounded-full border border-slate-200 bg-white text-xl font-semibold text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white">←</button>
          <button type="button" onClick={() => setPage((value) => (value + 1) % pages)} className="h-11 w-11 rounded-full bg-brand-500 text-xl font-semibold text-white shadow-lg shadow-brand-500/20">→</button>
        </div>
      </div>

      <motion.div key={page} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }} className="grid gap-5 lg:grid-cols-3">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} data={product} />
        ))}
      </motion.div>
    </div>
  )
}
