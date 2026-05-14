export const DEFAULT_PRICING_SETTINGS = {
  gstRate: 18,
  deliveryCharge: 299,
  freeDeliveryThreshold: 25000
}

export function calculateTotals(items, settings = DEFAULT_PRICING_SETTINGS) {
  const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0)
  const gstRate = Number(settings.gstRate ?? DEFAULT_PRICING_SETTINGS.gstRate)
  const deliveryCharge = Number(settings.deliveryCharge ?? DEFAULT_PRICING_SETTINGS.deliveryCharge)
  const freeDeliveryThreshold = Number(settings.freeDeliveryThreshold ?? DEFAULT_PRICING_SETTINGS.freeDeliveryThreshold)
  const gst = Math.round((subtotal * gstRate) / 100)
  const delivery = subtotal === 0 ? 0 : subtotal >= freeDeliveryThreshold ? 0 : deliveryCharge

  return {
    subtotal,
    gst,
    delivery,
    grandTotal: subtotal + gst + delivery
  }
}