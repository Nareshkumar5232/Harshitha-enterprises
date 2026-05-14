import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from '../context/CartContext'

const toneStyles = {
  success: 'border-success/40 bg-emerald-500/90 text-white',
  info: 'border-brand-300/40 bg-slate-900/90 text-white'
}

export default function ToastStack() {
  const { toasts, dismissToast } = useCart()

  return (
    <div className="fixed bottom-5 left-4 right-4 z-[70] flex flex-col items-end gap-3 pointer-events-none sm:left-auto sm:right-5 sm:max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-xl ${toneStyles[toast.tone] || toneStyles.info}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-white/90" />
              <div className="min-w-0">
                <div className="text-sm font-semibold">{toast.message}</div>
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="ml-2 rounded-full px-2 text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                ×
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}