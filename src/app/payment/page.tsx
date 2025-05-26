"use client"

import React from "react"
import { useSearchParams } from "next/navigation"
import PaymentModule from "@/modules/PaymentModule"

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const courseId = searchParams.get('courseId')
  const courseTitle = searchParams.get('courseTitle')
  const tutorName = searchParams.get('tutorName')
  const amount = searchParams.get('amount')

  return (
    <PaymentModule
      courseId={courseId ? parseInt(courseId, 10) : undefined}
      courseTitle={courseTitle || undefined}
      tutorName={tutorName || undefined}
      amount={amount ? parseFloat(amount) : undefined}
    />
  )
}
