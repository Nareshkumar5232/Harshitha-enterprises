import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAdminData } from './AdminDataContext'
import { useAuth } from './AuthContext'
import { API_BASE_URL } from '../lib/api'
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

function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

function toBackendItems(items = []) {
  return items.map((item) => ({
    product: item.id,
    quantity: Math.max(1, Number(item.quantity || 1))
  }))
}

function mapRemoteItems(remoteItems = [], products = []) {
  return remoteItems
    .map((item, index) => {
      const productId = item?.product?._id || item?.product?.id || item?.product || item?.productId
      const fallback = products.find((product) => product.id === productId || product._id === productId) || products[index] || {}

      return normalizeItem({
        ...fallback,
        id: productId || fallback.id,
        quantity: item.quantity
      })
    })
    .filter((item) => Boolean(item?.id))
}

function buildOrderSnapshot({ orderId, customer, paymentMethod, items, totals, source, paymentSession, backendOrder }) {
  return {
    id: orderId || createOrderId(),
    customer,
    paymentMethod,
    status: paymentMethod === 'cod' ? 'Confirmed' : 'Pending',
    items,
    totals,
    createdAt: backendOrder?.createdAt || new Date().toISOString(),
    updatedAt: backendOrder?.updatedAt || backendOrder?.createdAt || new Date().toISOString(),
    source,
    backendOrder,
    paymentSession
  }
}

export function CartProvider({ children }) {
  const { settings, addOrder, products } = useAdminData()
  const { authToken } = useAuth()
  const [cartItems, setCartItems] = useState(() => readStorage(CART_STORAGE_KEY, []))
  const [checkoutDraft, setCheckoutDraft] = useState(() => readStorage(CHECKOUT_STORAGE_KEY, null))
  const [lastOrder, setLastOrder] = useState(() => readStorage(ORDER_STORAGE_KEY, null))
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [toasts, setToasts] = useState([])
  const cartItemsRef = React.useRef(cartItems)

  useEffect(() => {
    cartItemsRef.current = cartItems
  }, [cartItems])

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

  const syncRemoteCart = async (token, items) => {
    for (const item of items) {
      const response = await fetch(`${API_BASE_URL}/api/cart/add_item/${item.id}`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ quantity: item.quantity })
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'Unable to sync cart with the server')
      }
    }
  }

  const loadRemoteCart = async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/cart`, {
      headers: authHeaders(token)
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.message || 'Unable to load cart')
    }

    const remoteCart = await response.json()
    return mapRemoteItems(Array.isArray(remoteCart) ? remoteCart : [], products)
  }

  useEffect(() => {
    if (!authToken) {
      return undefined
    }

    let cancelled = false

    const hydrateCart = async () => {
      try {
        const remoteCart = await loadRemoteCart(authToken)

        if (cancelled) {
          return
        }

        if (remoteCart.length) {
          setCartItems(remoteCart)
          return
        }

        const localCart = cartItemsRef.current
        if (localCart.length) {
          await syncRemoteCart(authToken, localCart)
          if (cancelled) {
            return
          }
          const syncedCart = await loadRemoteCart(authToken)
          if (!cancelled) {
            setCartItems(syncedCart)
          }
        }
      } catch {
        // Keep the local cart if the deployed backend is unavailable.
      }
    }

    hydrateCart()

    return () => {
      cancelled = true
    }
  }, [authToken, products])

  const addToCart = async (product, quantity = 1) => {
    const normalized = normalizeItem({ ...product, quantity })

    if (authToken) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/cart/add_item/${normalized.id}`, {
          method: 'POST',
          headers: authHeaders(authToken),
          body: JSON.stringify({ quantity: normalized.quantity })
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(data.message || 'Unable to add item to cart')
        }

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
        return { ok: true }
      } catch (error) {
        pushToast(error.message || 'Unable to add item to cart', 'error')
        return { ok: false, message: error.message }
      }
    }

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
    return { ok: true }
  }

  const updateQuantity = async (id, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(id)
      return
    }

    if (authToken) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/cart/items/${id}`, {
          method: 'PATCH',
          headers: authHeaders(authToken),
          body: JSON.stringify({ quantity })
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(data.message || 'Unable to update cart item')
        }

        setCartItems((current) => current.map((item) => (item.id === id ? { ...item, quantity } : item)))
        return { ok: true }
      } catch (error) {
        pushToast(error.message || 'Unable to update cart item', 'error')
        return { ok: false, message: error.message }
      }
    }

    setCartItems((current) => current.map((item) => (item.id === id ? { ...item, quantity } : item)))
    return { ok: true }
  }

  const removeFromCart = async (id) => {
    if (authToken) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/cart/items/${id}`, {
          method: 'DELETE',
          headers: authHeaders(authToken)
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(data.message || 'Unable to remove item from cart')
        }

        setCartItems((current) => {
          const itemToRemove = current.find((item) => item.id === id)
          const next = current.filter((item) => item.id !== id)
          if (itemToRemove) {
            pushToast('Item removed from cart', 'info')
          }
          return next
        })
        return { ok: true }
      } catch (error) {
        pushToast(error.message || 'Unable to remove item from cart', 'error')
        return { ok: false, message: error.message }
      }
    }

    setCartItems((current) => {
      const itemToRemove = current.find((item) => item.id === id)
      const next = current.filter((item) => item.id !== id)
      if (itemToRemove) {
        pushToast('Item removed from cart', 'info')
      }
      return next
    })
    return { ok: true }
  }

  const clearCart = async () => {
    if (authToken) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/cart`, {
          method: 'DELETE',
          headers: authHeaders(authToken)
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(data.message || 'Unable to clear cart')
        }
      } catch (error) {
        pushToast(error.message || 'Unable to clear cart', 'error')
        return { ok: false, message: error.message }
      }
    }

    setCartItems([])
    pushToast('All items removed from cart', 'info')
    return { ok: true }
  }

  const beginCheckout = (items, source = 'direct') => {
    const normalizedItems = items.map(normalizeItem)
    setCheckoutDraft({ source, items: normalizedItems, createdAt: new Date().toISOString() })
    setIsCartOpen(false)
  }

  const clearCheckoutDraft = () => {
    setCheckoutDraft(null)
  }

  const placeOrder = async (customer, paymentMethod) => {
    const items = checkoutDraft?.items?.length ? checkoutDraft.items : cartItemsRef.current

    if (!items.length) {
      return null
    }

    const totals = calculateTotals(items, settings)
    const source = checkoutDraft?.source || 'direct'

    if (authToken) {
      if (paymentMethod === 'cod') {
        try {
          const response = await fetch(`${API_BASE_URL}/api/order`, {
            method: 'POST',
            headers: authHeaders(authToken),
            body: JSON.stringify({
              items: toBackendItems(items),
              total_amount: totals.grandTotal,
              payment_type: 'cod'
            })
          })

          const data = await response.json().catch(() => ({}))

          if (!response.ok) {
            throw new Error(data.message || 'Unable to place order')
          }

          const storedOrder = addOrder(
            buildOrderSnapshot({
              orderId: data.order?._id || data.order?.id,
              customer,
              paymentMethod: 'cod',
              items,
              totals,
              source,
              backendOrder: data.order
            })
          )

          setLastOrder(storedOrder)
          clearCheckoutDraft()

          if (source === 'cart') {
            await clearCart()
          }

          return storedOrder
        } catch (error) {
          pushToast(error.message || 'Unable to place order', 'error')
          return null
        }
      }

      try {
        const paymentResponse = await fetch(`${API_BASE_URL}/api/payment/create-intent`, {
          method: 'POST',
          headers: authHeaders(authToken),
          body: JSON.stringify({
            amount: totals.grandTotal,
            currency: 'INR',
            mobile_no: customer.mobile
          })
        })

        const paymentData = await paymentResponse.json().catch(() => ({}))

        if (!paymentResponse.ok) {
          throw new Error(paymentData.message || 'Unable to create payment session')
        }

        const pendingOrder = buildOrderSnapshot({
          orderId: paymentData.order_id,
          customer,
          paymentMethod: 'online_payment',
          items,
          totals,
          source,
          paymentSession: {
            internalOrderId: paymentData.internal_order_id,
            cfOrderId: paymentData.cf_order_id,
            paymentSessionId: paymentData.payment_session_id
          }
        })

        setLastOrder(pendingOrder)
        clearCheckoutDraft()
        return { ok: true, paymentRequired: true, order: pendingOrder, payment: paymentData }
      } catch (error) {
        pushToast(error.message || 'Unable to create payment session', 'error')
        return null
      }
    }

    const order = {
      id: createOrderId(),
      customer,
      paymentMethod,
      status: 'Pending',
      items,
      totals,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source
    }

    const storedOrder = addOrder(order)
    setLastOrder(storedOrder)
    clearCheckoutDraft()

    if (storedOrder.source === 'cart') {
      await clearCart()
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