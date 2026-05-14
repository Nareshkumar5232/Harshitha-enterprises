import React from 'react'

export default function WhatsAppButton({phone}){
  const url = `https://wa.me/${phone.replace(/\D/g,'')}`
  return (
    <a href={url} aria-label="WhatsApp" target="_blank" rel="noreferrer" className="fixed right-4 bottom-4 z-50 sm:right-5 sm:bottom-5">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_18px_50px_rgba(37,211,102,0.4)] transition hover:scale-105">💬</div>
    </a>
  )
}
