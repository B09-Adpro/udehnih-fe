"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function PaymentTransactionsRedirectPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/payments/history')
  }, [router])

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Mengarahkan ke halaman riwayat pembayaran...</p>
    </div>
  )
}
