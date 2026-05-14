import React from 'react'

export default function Loading({ variant = 'grid', count = 4 }){
  if (variant === 'hero') {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-xl dark:border-white/10 dark:bg-slate-950/70">
          <div className="h-4 w-32 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="h-12 w-full animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-5/6 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-2/3 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="flex gap-3 pt-4">
            <div className="h-12 w-36 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-12 w-28 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
        <div className="h-[22rem] animate-pulse rounded-[2rem] bg-slate-200 dark:bg-slate-800" />
      </div>
    )
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/80 shadow-xl dark:border-white/10 dark:bg-slate-950/70">
          <div className="h-52 animate-pulse bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-1/3 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-6 w-4/5 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-full animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="grid gap-3 pt-2 sm:grid-cols-2">
              <div className="h-11 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="h-11 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
