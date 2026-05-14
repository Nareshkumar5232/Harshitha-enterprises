import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle(){
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="inline-flex h-11 items-center rounded-full border border-[var(--border-soft)] bg-[var(--surface-glass)] px-2 py-1 text-sm font-semibold text-[var(--text-primary)] shadow-[var(--shadow-soft)] backdrop-blur-xl transition"
    >
      <span className="px-2 text-xs tracking-[0.08em] text-[var(--text-muted)]">{isDark ? 'Dark' : 'Light'}</span>
      <span className="relative inline-flex h-8 w-14 items-center rounded-full bg-[var(--surface-secondary)] px-1">
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          className="absolute left-1 top-1 h-6 w-6 rounded-full bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-cyan)] shadow-lg"
          animate={{ x: isDark ? 24 : 0 }}
        />
        <span className="relative z-10 flex w-full items-center justify-between px-1 text-xs">
          <span>☀</span>
          <span>☾</span>
        </span>
      </span>
    </button>
  )
}
