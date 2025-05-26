"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function DemoPaymentPage() {
  const router = useRouter()
  
  // Demo course data
  const courseData = {
    courseId: 1,
    courseTitle: "Advanced React Development",
    tutorName: "John Doe",
    amount: 299.99,
    studentId: 2001
  }
  
  const handleCheckout = () => {
    const params = new URLSearchParams({
      courseId: courseData.courseId.toString(),
      courseTitle: courseData.courseTitle,
      tutorName: courseData.tutorName,
      amount: courseData.amount.toString(),
      studentId: courseData.studentId.toString()
    })
    
    router.push(`/payment?${params.toString()}`)
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Demo Checkout Kursus</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{courseData.courseTitle}</CardTitle>
          <CardDescription>Pengajar: {courseData.tutorName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Biaya Kursus:</span>
              <span className="font-medium">Rp {courseData.amount.toLocaleString('id-ID')}</span>
            </div>
            
            <div className="pt-4 border-t">
              <Button onClick={handleCheckout} className="w-full">
                Checkout Sekarang
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Navigasi Demo</h2>
        <div className="flex flex-col space-y-2">
          <Button variant="outline" onClick={() => router.push('/payment/history')}>
            Lihat Riwayat Pembayaran
          </Button>
          <Button variant="outline" onClick={() => router.push('/payment/123456')}>
            Lihat Detail Transaksi (#123456)
          </Button>
        </div>
      </div>
    </div>
  )
}
