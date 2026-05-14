import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ADMIN_EMAIL = 'admin@gmail.com'
const ADMIN_AUTH_STORAGE_KEY = 'sh-admin-auth-v1'
const ADMIN_SESSION_STORAGE_KEY = 'sh-admin-session-v1'
const DEFAULT_ADMIN_PASSWORD_HASH = '7676aaafb027c825bd9abab78b234070e702752f625b752e55e55b48e607e358'

const AdminAuthContext = createContext(null)

function readStorage(key, fallback) {
  if (typeof window === 'undefined') return fallback

  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeStorage(key, value) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, JSON.stringify(value))
}

async function hashPassword(password) {
  const buffer = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(password || '')))
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

function getInitialCredentials() {
  return readStorage(ADMIN_AUTH_STORAGE_KEY, {
    email: ADMIN_EMAIL,
    passwordHash: DEFAULT_ADMIN_PASSWORD_HASH
  })
}

export function AdminAuthProvider({ children }) {
  const [credentials, setCredentials] = useState(getInitialCredentials)
  const [session, setSession] = useState(() => readStorage(ADMIN_SESSION_STORAGE_KEY, null))

  useEffect(() => {
    writeStorage(ADMIN_AUTH_STORAGE_KEY, credentials)
  }, [credentials])

  useEffect(() => {
    if (session) {
      writeStorage(ADMIN_SESSION_STORAGE_KEY, session)
    } else if (typeof window !== 'undefined') {
      window.localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY)
    }
  }, [session])

  const login = async ({ email, password }) => {
    const normalizedEmail = String(email || '').trim().toLowerCase()

    if (normalizedEmail !== ADMIN_EMAIL) {
      return { ok: false, message: 'Invalid Admin Credentials' }
    }

    const passwordHash = await hashPassword(password)
    if (passwordHash !== credentials.passwordHash) {
      return { ok: false, message: 'Invalid Admin Credentials' }
    }

    const nextSession = {
      email: ADMIN_EMAIL,
      role: 'admin',
      loginAt: new Date().toISOString(),
      token: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    }

    setSession(nextSession)
    return { ok: true }
  }

  const logout = () => {
    setSession(null)
  }

  const updateAdminPassword = async ({ currentPassword, newPassword }) => {
    const currentHash = await hashPassword(currentPassword)
    if (currentHash !== credentials.passwordHash) {
      return { ok: false, message: 'Current password is incorrect' }
    }

    const nextHash = await hashPassword(newPassword)
    setCredentials({ email: ADMIN_EMAIL, passwordHash: nextHash })
    return { ok: true }
  }

  const value = useMemo(() => ({
    adminEmail: ADMIN_EMAIL,
    isAdminAuthenticated: Boolean(session),
    adminSession: session,
    login,
    logout,
    updateAdminPassword
  }), [session, credentials])

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)

  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }

  return context
}
