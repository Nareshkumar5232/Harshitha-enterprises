import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAdminData } from '../../context/AdminDataContext'

const toneClasses = {
  order: 'border-amber-300/40 bg-slate-950/95 text-white',
  message: 'border-cyan-300/40 bg-slate-950/95 text-white',
  product: 'border-brand-300/40 bg-slate-950/95 text-white',
  stock: 'border-rose-300/40 bg-slate-950/95 text-white',
  settings: 'border-emerald-300/40 bg-slate-950/95 text-white',
  info: 'border-white/20 bg-slate-950/95 text-white'
}

export default function AdminToastStack() {
  const { alerts, dismissAlert } = useAdminData()

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[80] flex w-[min(92vw,24rem)] flex-col items-end gap-3">
      <AnimatePresence>
        {alerts.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.97 }}
            className={`pointer-events-auto w-full rounded-3xl border px-4 py-3 shadow-2xl backdrop-blur-xl ${toneClasses[item.type] || toneClasses.info}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2.5 w-2.5 rounded-full bg-white/80" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">{item.title}</div>
                <div className="mt-1 text-sm text-white/80">{item.message}</div>
              </div>
              <button type="button" onClick={() => dismissAlert(item.id)} className="rounded-full px-2 text-white/70 transition hover:bg-white/10 hover:text-white">
                ×
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
