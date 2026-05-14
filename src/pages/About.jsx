import React from 'react'

export default function About(){
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <section className="rounded-[2rem] border border-white/60 bg-white/85 p-8 shadow-xl dark:border-white/10 dark:bg-slate-950/75">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700 dark:text-cyan-200/70">About us</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950 dark:text-white">A dependable electronics partner for premium product supply.</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          Sree Harshitha Enterprises is a Chennai-based general trading company specializing in premium electronics and home appliances. We focus on genuine products, responsive service, and clean buying experiences for retail, corporate, and direct customers.
        </p>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        {[
          ['Our vision', 'Be the preferred supplier of high-quality electronics and appliances across South India.'],
          ['Our mission', 'Deliver genuine products with reliable service and professional support.'],
          ['Our values', 'Trust, quality, customer satisfaction, and seamless order fulfillment.']
        ].map(([title, copy]) => (
          <div key={title} className="rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-xl dark:border-white/10 dark:bg-slate-950/75">
            <h3 className="text-lg font-semibold text-slate-950 dark:text-white">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{copy}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
