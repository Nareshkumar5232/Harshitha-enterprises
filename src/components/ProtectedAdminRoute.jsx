import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'

export default function ProtectedAdminRoute({ children }) {
  const { isAdminAuthenticated } = useAdminAuth()
  const location = useLocation()

  if (!isAdminAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
