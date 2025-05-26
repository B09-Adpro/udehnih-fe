"use client"

import { useParams } from "next/navigation"
import { PaymentDetailSection } from "@/modules/PaymentModule"

export default function PaymentDetailPage() {
  const params = useParams()
  const transactionId = parseInt(params.id as string, 10)

  return <PaymentDetailSection transactionId={transactionId} />
}