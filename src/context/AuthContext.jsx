import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const USERS_STORAGE_KEY = 'sh-enterprises-users-v1'
const SESSION_STORAGE_KEY = 'sh-enterprises-session-v1'
const BLOCKED_STORAGE_KEY = 'sh-enterprises-blocked-users-v1'

const AuthContext = createContext(null)

function readStorage(key, fallback) {
  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => readStorage(USERS_STORAGE_KEY, []))
  const [currentUser, setCurrentUser] = useState(() => readStorage(SESSION_STORAGE_KEY, null))
  const [blockedUsers, setBlockedUsers] = useState(() => readStorage(BLOCKED_STORAGE_KEY, []))

  useEffect(() => {
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
  }, [users])

  useEffect(() => {
    if (currentUser) {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(currentUser))
    } else {
      window.localStorage.removeItem(SESSION_STORAGE_KEY)
    }
  }, [currentUser])

  useEffect(() => {
    window.localStorage.setItem(BLOCKED_STORAGE_KEY, JSON.stringify(blockedUsers))
  }, [blockedUsers])

  const register = ({ name, email, mobile, password }) => {
    const normalizedEmail = String(email || '').trim().toLowerCase()
    if (!normalizedEmail) {
      return { ok: false, message: 'Email is required' }
    }

    if (users.some((user) => user.email === normalizedEmail)) {
      return { ok: false, message: 'Account already exists with this email' }
    }

    if (blockedUsers.includes(normalizedEmail)) {
      return { ok: false, message: 'Account has been blocked by admin' }
    }

    const user = {
      id: `u-${Date.now()}`,
      name: String(name || '').trim(),
      email: normalizedEmail,
      mobile: String(mobile || '').trim(),
      password: String(password || '')
    }

    setUsers((current) => [...current, user])
    setCurrentUser({ id: user.id, name: user.name, email: user.email, mobile: user.mobile })

    return { ok: true }
  }

  const login = ({ email, password }) => {
    const normalizedEmail = String(email || '').trim().toLowerCase()
    if (blockedUsers.includes(normalizedEmail)) {
      return { ok: false, message: 'Account has been blocked by admin' }
    }

    const match = users.find((user) => user.email === normalizedEmail && user.password === String(password || ''))

    if (!match) {
      return { ok: false, message: 'Invalid email or password' }
    }

    setCurrentUser({ id: match.id, name: match.name, email: match.email, mobile: match.mobile })
    return { ok: true }
  }

  const logout = () => {
    setCurrentUser(null)
  }

  const blockCustomer = (email) => {
    const normalizedEmail = String(email || '').trim().toLowerCase()
    if (!normalizedEmail) return
    setBlockedUsers((current) => (current.includes(normalizedEmail) ? current : [...current, normalizedEmail]))
    setUsers((current) => current.filter((user) => user.email !== normalizedEmail))
    if (currentUser?.email === normalizedEmail) {
      setCurrentUser(null)
    }
  }

  const unblockCustomer = (email) => {
    const normalizedEmail = String(email || '').trim().toLowerCase()
    setBlockedUsers((current) => current.filter((item) => item !== normalizedEmail))
  }

  const removeCustomer = (email) => {
    const normalizedEmail = String(email || '').trim().toLowerCase()
    setUsers((current) => current.filter((user) => user.email !== normalizedEmail))
    setBlockedUsers((current) => current.filter((item) => item !== normalizedEmail))
    if (currentUser?.email === normalizedEmail) {
      setCurrentUser(null)
    }
  }

  const value = useMemo(() => ({
    isAuthenticated: Boolean(currentUser),
    currentUser,
    users,
    blockedUsers,
    register,
    login,
    logout,
    blockCustomer,
    unblockCustomer,
    removeCustomer
  }), [currentUser, users, blockedUsers])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
