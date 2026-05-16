import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { API_BASE_URL } from '../lib/api'

const USERS_STORAGE_KEY = 'sh-enterprises-users-v1'
const SESSION_STORAGE_KEY = 'sh-enterprises-session-v1'
const AUTH_TOKEN_STORAGE_KEY = 'sh-enterprises-token-v1'
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
  const [authToken, setAuthToken] = useState(() => readStorage(AUTH_TOKEN_STORAGE_KEY, ''))
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
    if (authToken) {
      window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, JSON.stringify(authToken))
    } else {
      window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
    }
  }, [authToken])

  useEffect(() => {
    window.localStorage.setItem(BLOCKED_STORAGE_KEY, JSON.stringify(blockedUsers))
  }, [blockedUsers])

  useEffect(() => {
    if (!authToken) {
      return undefined
    }

    let cancelled = false

    const syncProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        })

        if (!response.ok) {
          return
        }

        const data = await response.json()

        if (!cancelled && data?.user) {
          setCurrentUser((current) => ({
            ...(current || {}),
            ...data.user,
            token: authToken
          }))
        }
      } catch {
        // Keep any locally restored session if the remote profile request fails.
      }
    }

    syncProfile()

    return () => {
      cancelled = true
    }
  }, [authToken])

  const register = async ({ name, email, mobile, password }) => {
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

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: String(name || '').trim(),
          email: normalizedEmail,
          password: String(password || '')
        })
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        return { ok: false, message: data.message || 'Unable to register at the moment' }
      }

      const nextUser = {
        id: data.user?.id || data.user?._id || `u-${Date.now()}`,
        name: data.user?.name || String(name || '').trim(),
        email: data.user?.email || normalizedEmail,
        mobile: String(mobile || '').trim(),
        role: data.user?.role || 'user',
        token: data.token || ''
      }

      setUsers((current) => {
        const sanitized = {
          id: nextUser.id,
          name: nextUser.name,
          email: nextUser.email,
          mobile: nextUser.mobile,
          role: nextUser.role
        }

        const remaining = current.filter((user) => user.email !== nextUser.email)
        return [...remaining, sanitized]
      })
      setCurrentUser(nextUser)
      setAuthToken(data.token || '')

      return { ok: true, user: nextUser }
    } catch {
      return { ok: false, message: 'Unable to register at the moment' }
    }
  }

  const login = async ({ email, password }) => {
    const normalizedEmail = String(email || '').trim().toLowerCase()
    if (blockedUsers.includes(normalizedEmail)) {
      return { ok: false, message: 'Account has been blocked by admin' }
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password: String(password || '')
        })
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        return { ok: false, message: data.message || 'Invalid email or password' }
      }

      const nextUser = {
        id: data.user?.id || data.user?._id || `u-${Date.now()}`,
        name: data.user?.name || '',
        email: data.user?.email || normalizedEmail,
        role: data.user?.role || 'user',
        token: data.token || ''
      }

      setUsers((current) => {
        const sanitized = {
          id: nextUser.id,
          name: nextUser.name,
          email: nextUser.email,
          role: nextUser.role
        }
        const remaining = current.filter((user) => user.email !== nextUser.email)
        return [...remaining, sanitized]
      })
      setCurrentUser(nextUser)
      setAuthToken(data.token || '')

      return { ok: true, user: nextUser }
    } catch {
      return { ok: false, message: 'Unable to sign in at the moment' }
    }
  }

  const logout = () => {
    setAuthToken('')
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
    authToken,
    users,
    blockedUsers,
    register,
    login,
    logout,
    blockCustomer,
    unblockCustomer,
    removeCustomer
  }), [currentUser, authToken, users, blockedUsers])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
