import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import ToastStack from './components/ToastStack'
import Home from './pages/Home'
import About from './pages/About'
import Products from './pages/Products'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Account from './pages/Account'
import WhatsAppButton from './components/WhatsAppButton'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { AdminDataProvider } from './context/AdminDataContext'
import { AdminAuthProvider } from './context/AdminAuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminMessages from './pages/admin/AdminMessages'
import AdminCustomers from './pages/admin/AdminCustomers'
import AdminSettings from './pages/admin/AdminSettings'

export default function App(){
  const location = useLocation()

  return (
    <ThemeProvider>
      <AdminDataProvider>
        <AdminAuthProvider>
          <AuthProvider>
            <CartProvider>
              <div className="relative min-h-screen overflow-x-hidden text-[var(--text-primary)]">
                <ScrollToTop />
                <Navbar />
                <CartDrawer />
                <ToastStack />
                <main className="overflow-x-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={location.pathname}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                    >
                      <Routes location={location}>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                        <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
                          <Route index element={<Navigate to="dashboard" replace />} />
                          <Route path="dashboard" element={<AdminDashboard />} />
                          <Route path="products" element={<AdminProducts />} />
                          <Route path="orders" element={<AdminOrders />} />
                          <Route path="messages" element={<AdminMessages />} />
                          <Route path="customers" element={<AdminCustomers />} />
                          <Route path="settings" element={<AdminSettings />} />
                        </Route>
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </motion.div>
                  </AnimatePresence>
                </main>
                <Footer />
                <WhatsAppButton phone="+919363706040" />
              </div>
            </CartProvider>
          </AuthProvider>
        </AdminAuthProvider>
      </AdminDataProvider>
    </ThemeProvider>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [pathname])

  return null
}
