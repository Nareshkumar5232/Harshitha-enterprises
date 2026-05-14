import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAdminData } from './AdminDataContext'
import { calculateTotals } from '../utils/pricing'

const CartContext = createContext(null)

const CART_STORAGE_KEY = 'sh-enterprises-cart-v1'
const CHECKOUT_STORAGE_KEY = 'sh-enterprises-checkout-v1'
const ORDER_STORAGE_KEY = 'sh-enterprises-last-order-v1'
const TOAST_LIFETIME = 2800

function readStorage(key, fallback) {
  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function normalizeItem(item) {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    price: Number(item.price || 0),
    image: item.image,
    description: item.description,
    badge: item.badge,
    quantity: Math.max(1, Number(item.quantity || 1))
  }
}

function createOrderId() {
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `SH-${Date.now().toString().slice(-6)}-${suffix}`
}

function sameItemSnapshot(leftItems = [], rightItems = []) {
  if (leftItems.length !== rightItems.length) {
    return false
  }

  return leftItems.every((left, index) => {
    const right = rightItems[index]
    return left?.id === right?.id && left?.quantity === right?.quantity
  })
}

export function CartProvider({ children }) {
  const { settings, addOrder } = useAdminData()
  const [cartItems, setCartItems] = useState(() => readStorage(CART_STORAGE_KEY, []))
  const [checkoutDraft, setCheckoutDraft] = useState(() => readStorage(CHECKOUT_STORAGE_KEY, null))
  const [lastOrder, setLastOrder] = useState(() => readStorage(ORDER_STORAGE_KEY, null))
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    if (checkoutDraft) {
      window.localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(checkoutDraft))
    } else {
      window.localStorage.removeItem(CHECKOUT_STORAGE_KEY)
    }
  }, [checkoutDraft])

  useEffect(() => {
    if (lastOrder) {
      window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(lastOrder))
    }
  }, [lastOrder])

  useEffect(() => {
    if (!checkoutDraft || checkoutDraft.source !== 'cart') {
      return
    }

    if (!cartItems.length) {
      setCheckoutDraft(null)
      return
    }

    setCheckoutDraft((current) => {
      if (!current || current.source !== 'cart') {
        return current
      }

      if (sameItemSnapshot(current.items, cartItems)) {
        return current
      }

      return {
        ...current,
        items: cartItems.map((item) => normalizeItem(item))
      }
    })
  }, [cartItems, checkoutDraft])

  useEffect(() => {
    if (!toasts.length) {
      return undefined
    }

    const timers = toasts.map((toast) => window.setTimeout(() => dismissToast(toast.id), TOAST_LIFETIME))
    return () => timers.forEach((timer) => window.clearTimeout(timer))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toasts])

  const pushToast = (message, tone = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    setToasts((current) => [...current, { id, message, tone }])
  }

  const dismissToast = (id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }

  const addToCart = (product, quantity = 1) => {
    const normalized = normalizeItem({ ...product, quantity })

    setCartItems((current) => {
      const existingIndex = current.findIndex((item) => item.id === normalized.id)

      if (existingIndex >= 0) {
        const updated = [...current]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + normalized.quantity
        }
        return updated
      }

      return [...current, normalized]
    })

    pushToast(`${normalized.name} added to cart`)
  }

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    setCartItems((current) => current.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const removeFromCart = (id) => {
    setCartItems((current) => {
      const itemToRemove = current.find((item) => item.id === id)
      const next = current.filter((item) => item.id !== id)
      if (itemToRemove) {
        pushToast('Item removed from cart', 'info')
      }
      return next
    })
  }

  const clearCart = () => {
    setCartItems([])
    pushToast('All items removed from cart', 'info')
  }

  const beginCheckout = (items, source = 'direct') => {
    const normalizedItems = items.map(normalizeItem)
    setCheckoutDraft({ source, items: normalizedItems, createdAt: new Date().toISOString() })
    setIsCartOpen(false)
  }

  const clearCheckoutDraft = () => {
    setCheckoutDraft(null)
  }

  const placeOrder = (customer, paymentMethod) => {
    const items = checkoutDraft?.items?.length ? checkoutDraft.items : cartItems

    if (!items.length) {
      return null
    }

    const totals = calculateTotals(items, settings)
    const order = {
      id: createOrderId(),
      customer,
      paymentMethod,
      status: 'Pending',
      items,
      totals,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: checkoutDraft?.source || 'direct'
    }

    const storedOrder = addOrder(order)
    setLastOrder(storedOrder)
    clearCheckoutDraft()

    if (storedOrder.source === 'cart') {
      clearCart()
    }

    return storedOrder
  }

  const checkoutItems = checkoutDraft?.items?.length ? checkoutDraft.items : cartItems
  const cartTotals = useMemo(() => calculateTotals(cartItems, settings), [cartItems, settings])
  const checkoutTotals = useMemo(() => calculateTotals(checkoutItems, settings), [checkoutItems, settings])
  const cartCount = useMemo(() => cartItems.reduce((count, item) => count + item.quantity, 0), [cartItems])

  const value = {
    cartItems,
    cartCount,
    checkoutItems,
    cartTotals,
    checkoutTotals,
    totals: checkoutTotals,
    lastOrder,
    checkoutDraft,
    isCartOpen,
    setIsCartOpen,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    beginCheckout,
    clearCheckoutDraft,
    placeOrder,
    toasts,
    pushToast,
    dismissToast
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }

  return context
}