import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { categories, products as catalogProducts } from '../data/catalog'
import { calculateTotals, DEFAULT_PRICING_SETTINGS } from '../utils/pricing'

const ADMIN_DATA_STORAGE_KEY = 'sh-admin-panel-v1'

const AdminDataContext = createContext(null)

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

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function buildSeedProducts() {
  const categoryBrandMap = {
    tv: 'NeoView',
    laptop: 'UltraBook',
    audio: 'CinemaMax',
    ac: 'FrostAir',
    accessory: 'Harshitha'
  }

  return catalogProducts.map((product, index) => ({
    ...product,
    gallery: [product.image],
    brand: categoryBrandMap[product.category] || 'Harshitha',
    stockQuantity: 18 + index * 3,
    specifications: [
      'Warranty included',
      'Genuine retailer stock',
      'GST invoice available'
    ],
    active: true
  }))
}

function buildDemoOrders(productsList) {
  const first = productsList[0]
  const second = productsList[1]

  if (!first || !second) return []

  const firstItems = [{ ...first, quantity: 1 }]
  const secondItems = [{ ...first, quantity: 2 }, { ...second, quantity: 1 }]

  return [
    {
      id: 'SH-260501-A1',
      customer: {
        fullName: 'Demo Customer',
        mobile: '9999999999',
        email: 'customer@example.com',
        address: 'Thirumullaivoyal, Chennai',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600062'
      },
      paymentMethod: 'cod',
      status: 'Delivered',
      items: firstItems,
      totals: calculateTotals(firstItems, DEFAULT_PRICING_SETTINGS),
      createdAt: '2026-05-01T10:15:00.000Z',
      updatedAt: '2026-05-02T09:30:00.000Z',
      source: 'cart'
    },
    {
      id: 'SH-260506-B4',
      customer: {
        fullName: 'Retail Buyer',
        mobile: '8888888888',
        email: 'buyer@example.com',
        address: 'Anna Nagar, Chennai',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600040'
      },
      paymentMethod: 'upi',
      status: 'Pending',
      items: secondItems,
      totals: calculateTotals(secondItems, DEFAULT_PRICING_SETTINGS),
      createdAt: '2026-05-06T13:20:00.000Z',
      updatedAt: '2026-05-06T13:20:00.000Z',
      source: 'direct'
    }
  ]
}

function buildDemoMessages() {
  return [
    {
      id: 'msg-1001',
      customerName: 'Asha',
      email: 'asha@example.com',
      phone: '9876543210',
      subject: 'Bulk order for office',
      message: 'Need pricing for 12 laptops and delivery options for next week.',
      createdAt: '2026-05-12T08:30:00.000Z',
      read: false
    },
    {
      id: 'msg-1002',
      customerName: 'Ravi',
      email: 'ravi@example.com',
      phone: '9123456780',
      subject: 'Service availability',
      message: 'Checking if you can share invoice details for a TV purchase.',
      createdAt: '2026-05-11T16:05:00.000Z',
      read: true
    }
  ]
}

function buildInitialState() {
  const stored = readStorage(ADMIN_DATA_STORAGE_KEY, null)
  const seedProducts = buildSeedProducts()

  if (!stored) {
    return {
      products: seedProducts,
      orders: buildDemoOrders(seedProducts),
      messages: buildDemoMessages(),
      notifications: [],
      alerts: [],
      settings: {
        storeName: 'Sree Harshitha Enterprises',
        contactEmail: 'care.harshithaenterprises@gmail.com',
        contactPhone: '+91 9363706040',
        whatsapp: '+919363706040',
        address: '3rd Floor, Flat No: C3, 7A & 7B, 467/2, Saraswathi Nagar Main Road, Thirumullaivoyal, Chennai 600062',
        gstRate: 18,
        deliveryCharge: 299,
        freeDeliveryThreshold: 25000,
        lowStockThreshold: 5,
        themePreference: 'system'
      }
    }
  }

  return {
    products: Array.isArray(stored.products) && stored.products.length ? stored.products : seedProducts,
    orders: Array.isArray(stored.orders) ? stored.orders : buildDemoOrders(seedProducts),
    messages: Array.isArray(stored.messages) ? stored.messages : buildDemoMessages(),
    notifications: Array.isArray(stored.notifications) ? stored.notifications : [],
    alerts: [],
    settings: {
      storeName: 'Sree Harshitha Enterprises',
      contactEmail: 'care.harshithaenterprises@gmail.com',
      contactPhone: '+91 9363706040',
      whatsapp: '+919363706040',
      address: '3rd Floor, Flat No: C3, 7A & 7B, 467/2, Saraswathi Nagar Main Road, Thirumullaivoyal, Chennai 600062',
      gstRate: 18,
      deliveryCharge: 299,
      freeDeliveryThreshold: 25000,
      lowStockThreshold: 5,
      themePreference: 'system',
      ...(stored.settings || {})
    }
  }
}

function normalizeProduct(product) {
  const gallery = Array.isArray(product.gallery) && product.gallery.length ? product.gallery : [product.image].filter(Boolean)

  return {
    id: product.id || createId('prd'),
    name: String(product.name || '').trim(),
    description: String(product.description || '').trim(),
    price: Number(product.price || 0),
    category: String(product.category || 'accessory'),
    stockQuantity: Math.max(0, Number(product.stockQuantity ?? 0)),
    brand: String(product.brand || 'Harshitha').trim(),
    badge: String(product.badge || 'Premium').trim(),
    image: gallery[0] || product.image || '',
    gallery,
    featured: Boolean(product.featured),
    latest: Boolean(product.latest),
    active: product.active !== false,
    specifications: Array.isArray(product.specifications)
      ? product.specifications.filter(Boolean)
      : String(product.specifications || '')
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean)
  }
}

function normalizeOrder(order) {
  const items = Array.isArray(order.items) ? order.items.map((item) => ({ ...item, quantity: Math.max(1, Number(item.quantity || 1)) })) : []
  return {
    id: order.id || createId('order'),
    customer: order.customer || {},
    paymentMethod: order.paymentMethod || 'cod',
    status: order.status || 'Pending',
    items,
    totals: order.totals || calculateTotals(items, DEFAULT_PRICING_SETTINGS),
    createdAt: order.createdAt || new Date().toISOString(),
    updatedAt: order.updatedAt || order.createdAt || new Date().toISOString(),
    source: order.source || 'direct'
  }
}

function normalizeMessage(message) {
  return {
    id: message.id || createId('msg'),
    customerName: String(message.customerName || '').trim(),
    email: String(message.email || '').trim(),
    phone: String(message.phone || '').trim(),
    subject: String(message.subject || 'General enquiry').trim(),
    message: String(message.message || '').trim(),
    createdAt: message.createdAt || new Date().toISOString(),
    read: Boolean(message.read)
  }
}

function normalizeNotification(notification) {
  return {
    id: notification.id || createId('note'),
    type: notification.type || 'info',
    title: String(notification.title || 'Notification').trim(),
    message: String(notification.message || '').trim(),
    createdAt: notification.createdAt || new Date().toISOString(),
    read: Boolean(notification.read)
  }
}

export function AdminDataProvider({ children }) {
  const [state, setState] = useState(buildInitialState)
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    writeStorage(ADMIN_DATA_STORAGE_KEY, {
      products: state.products,
      orders: state.orders,
      messages: state.messages,
      notifications: state.notifications,
      settings: state.settings
    })
  }, [state])

  const pushNotification = (notification) => {
    const entry = normalizeNotification(notification)
    setState((current) => ({
      ...current,
      notifications: [entry, ...current.notifications].slice(0, 50)
    }))
    setAlerts((current) => [entry, ...current].slice(0, 4))
    return entry
  }

  const dismissAlert = (id) => {
    setAlerts((current) => current.filter((item) => item.id !== id))
  }

  const markNotificationRead = (id) => {
    setState((current) => ({
      ...current,
      notifications: current.notifications.map((item) => (item.id === id ? { ...item, read: true } : item))
    }))
  }

  const clearNotification = (id) => {
    setState((current) => ({
      ...current,
      notifications: current.notifications.filter((item) => item.id !== id)
    }))
  }

  const addProduct = (product) => {
    const created = normalizeProduct(product)
    setState((current) => ({
      ...current,
      products: [created, ...current.products]
    }))
    pushNotification({ type: 'product', title: 'Product added', message: `${created.name} was added to the catalog.` })
    return created
  }

  const updateProduct = (id, patch) => {
    let updatedProduct = null
    setState((current) => {
      const products = current.products.map((product) => {
        if (product.id !== id) return product
        updatedProduct = normalizeProduct({ ...product, ...patch, id })
        return updatedProduct
      })

      return { ...current, products }
    })

    if (updatedProduct && Number(updatedProduct.stockQuantity) <= Number(state.settings.lowStockThreshold || 5)) {
      pushNotification({ type: 'stock', title: 'Low stock alert', message: `${updatedProduct.name} stock is low.` })
    }

    return updatedProduct
  }

  const deleteProduct = (id) => {
    setState((current) => ({
      ...current,
      products: current.products.filter((product) => product.id !== id)
    }))
    pushNotification({ type: 'product', title: 'Product removed', message: 'A product was removed from the catalog.' })
  }

  const addOrder = (order) => {
    const normalizedOrder = normalizeOrder(order)
    const lowStockAlerts = []

    setState((current) => {
      const nextProducts = current.products.map((product) => {
        const match = normalizedOrder.items.find((item) => item.id === product.id)
        if (!match) return product

        const nextStock = Math.max(0, Number(product.stockQuantity || 0) - Number(match.quantity || 0))
        if (nextStock <= Number(current.settings.lowStockThreshold || 5)) {
          lowStockAlerts.push(product.name)
        }
        return { ...product, stockQuantity: nextStock }
      })

      return {
        ...current,
        orders: [normalizedOrder, ...current.orders],
        products: nextProducts
      }
    })

    pushNotification({ type: 'order', title: 'New Order Received', message: `${normalizedOrder.id} has been placed.` })
    lowStockAlerts.slice(0, 3).forEach((productName) => {
      pushNotification({ type: 'stock', title: 'Product Low Stock', message: `${productName} stock is running low.` })
    })
    return normalizedOrder
  }

  const updateOrderStatus = (id, status) => {
    let updatedOrder = null
    setState((current) => {
      const orders = current.orders.map((order) => {
        if (order.id !== id) return order
        updatedOrder = { ...order, status, updatedAt: new Date().toISOString() }
        return updatedOrder
      })
      return { ...current, orders }
    })

    if (updatedOrder) {
      pushNotification({ type: 'order', title: 'Order Status Updated', message: `${updatedOrder.id} is now ${status}.` })
    }

    return updatedOrder
  }

  const addMessage = (message) => {
    const normalizedMessage = normalizeMessage(message)
    setState((current) => ({
      ...current,
      messages: [normalizedMessage, ...current.messages]
    }))
    pushNotification({ type: 'message', title: 'New Contact Message', message: `${normalizedMessage.customerName || 'A customer'} sent a message.` })
    return normalizedMessage
  }

  const toggleMessageRead = (id, read) => {
    setState((current) => ({
      ...current,
      messages: current.messages.map((message) => (message.id === id ? { ...message, read: typeof read === 'boolean' ? read : !message.read } : message))
    }))
  }

  const deleteMessage = (id) => {
    setState((current) => ({
      ...current,
      messages: current.messages.filter((message) => message.id !== id)
    }))
  }

  const updateSettings = (patch) => {
    setState((current) => ({
      ...current,
      settings: { ...current.settings, ...patch }
    }))
    pushNotification({ type: 'settings', title: 'Settings saved', message: 'Website settings were updated.' })
  }

  const value = useMemo(() => {
    const unreadMessages = state.messages.filter((message) => !message.read).length
    const pendingOrders = state.orders.filter((order) => order.status === 'Pending').length
    const deliveredOrders = state.orders.filter((order) => order.status === 'Delivered').length
    const totalRevenue = state.orders.reduce((sum, order) => sum + Number(order.totals?.grandTotal || 0), 0)
    const totalCustomers = 0
    const lowStockProducts = state.products.filter((product) => Number(product.stockQuantity || 0) <= Number(state.settings.lowStockThreshold || 5))
    const recentOrders = [...state.orders].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt)).slice(0, 5)
    const recentMessages = [...state.messages].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt)).slice(0, 5)

    return {
      ...state,
      alerts,
      unreadMessages,
      pendingOrders,
      deliveredOrders,
      totalRevenue,
      totalCustomers,
      lowStockProducts,
      recentOrders,
      recentMessages,
      categories,
      addProduct,
      updateProduct,
      deleteProduct,
      addOrder,
      updateOrderStatus,
      addMessage,
      toggleMessageRead,
      deleteMessage,
      updateSettings,
      pushNotification,
      markNotificationRead,
      clearNotification,
      dismissAlert
    }
  }, [alerts, state])

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>
}

export function useAdminData() {
  const context = useContext(AdminDataContext)

  if (!context) {
    throw new Error('useAdminData must be used within AdminDataProvider')
  }

  return context
}
