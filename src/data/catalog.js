export const categories = [
  { id: 'all', title: 'All Products' },
  { id: 'tv', title: 'Smart TVs' },
  { id: 'laptop', title: 'Laptops' },
  { id: 'audio', title: 'Audio' },
  { id: 'ac', title: 'Air Conditioners' },
  { id: 'accessory', title: 'Accessories' }
]

export const products = [
  {
    id: 'sh-tv-neo-55',
    name: 'NeoView 55" 4K Smart TV',
    category: 'tv',
    price: 44990,
    badge: 'Best seller',
    description: 'Ultra-clear 4K panel, HDR, streaming apps, and a slim premium frame for modern living rooms.',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    latest: true
  },
  {
    id: 'sh-laptop-ultra-14',
    name: 'UltraBook Pro 14',
    category: 'laptop',
    price: 72990,
    badge: 'New arrival',
    description: 'Lightweight aluminum build with fast multitasking performance for work and entertainment.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    latest: true
  },
  {
    id: 'sh-soundbar-max',
    name: 'CinemaMax Soundbar',
    category: 'audio',
    price: 18990,
    badge: 'Premium audio',
    description: 'Room-filling sound with wireless subwoofer and rich bass tuned for movies and music.',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    latest: false
  },
  {
    id: 'sh-ac-frost-1t',
    name: 'FrostAir 1 Ton Inverter AC',
    category: 'ac',
    price: 35990,
    badge: 'Energy saving',
    description: 'Efficient inverter cooling with turbo mode and low-noise operation for compact spaces.',
    image: 'https://images.unsplash.com/photo-1631547457902-8ea8f4b1dbee?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    latest: true
  },
  {
    id: 'sh-headphone-elite',
    name: 'Elite Wireless Headphones',
    category: 'audio',
    price: 9990,
    badge: 'Travel ready',
    description: 'Active noise cancellation, long battery life, and soft memory foam cushions.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    latest: true
  },
  {
    id: 'sh-monitor-27',
    name: 'VisionEdge 27" Monitor',
    category: 'accessory',
    price: 19990,
    badge: 'Office essential',
    description: 'Crisp full-HD panel with thin bezels for productive dual-screen setups.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    latest: false
  },
  {
    id: 'sh-keyboard-mech',
    name: 'Aero Mechanical Keyboard',
    category: 'accessory',
    price: 6990,
    badge: 'Creator favorite',
    description: 'Tactile switches, RGB accents, and an aluminum frame built for long typing sessions.',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    latest: true
  },
  {
    id: 'sh-tablet-lite',
    name: 'LiteTab 11" Tablet',
    category: 'accessory',
    price: 24990,
    badge: 'Portable',
    description: 'A bright display, all-day battery, and a clean UI for work, study, and streaming.',
    image: 'https://images.unsplash.com/photo-1553484771-cc0d9b8c6f2b?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    latest: true
  },
  {
    id: 'sh-router-pro',
    name: 'ProMesh Wi-Fi Router',
    category: 'accessory',
    price: 8990,
    badge: 'Fast network',
    description: 'Reliable coverage and stable speeds for smart homes, offices, and retail spaces.',
    image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    latest: false
  }
]

export const promotionalBanners = [
  {
    title: 'Premium electronics for modern homes',
    copy: 'Discover curated devices, attractive offers, and smooth checkout in one place.'
  },
  {
    title: 'Bulk and corporate orders made simple',
    copy: 'Clear pricing, fast support, and flexible checkout for businesses and teams.'
  }
]