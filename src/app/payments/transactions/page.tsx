"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// Redirects to history page from /payment/transactions
export default function PaymentTransactionsRedirectPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/payment/history')
  }, [router])

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Mengarahkan ke halaman riwayat pembayaran...</p>
    </div>
  )
}
