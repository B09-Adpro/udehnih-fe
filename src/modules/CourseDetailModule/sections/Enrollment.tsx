"use client"

import { Check, ShoppingCart, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { formatPriceIDR } from "../utils"
import { useUserData } from "../hooks/useUserData"
import { EnrollmentProps } from "../interface"

export function Enrollment({ 
  courseId, 
  price, 
  title, 
  isFree,
  enrolling,
  onEnroll,
  onViewContent
}: EnrollmentProps) {
  const { isAuthenticated, enrolledCourses } = useUserData()
  
  // Check if user has enrolled in this course
  const isEnrolled = enrolledCourses?.includes(courseId)

  return (
    <Card className="sticky top-24">
      <CardHeader className="pb-3">
        <h3 className="text-lg font-semibold">Gabung Kursus</h3>
        <p className="text-2xl font-bold text-primary">
          {isFree ? "Gratis" : formatPriceIDR(price)}
        </p>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-start">
            <Check className="h-4 w-4 text-primary mr-2 mt-1" />
            <p>Akses materi seumur hidup</p>
          </div>
          <div className="flex items-start">
            <Check className="h-4 w-4 text-primary mr-2 mt-1" />
            <p>Sertifikat penyelesaian</p>
          </div>
          <div className="flex items-start">
            <Check className="h-4 w-4 text-primary mr-2 mt-1" />
            <p>Dukungan dari instruktur</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-3">
        {isEnrolled ? (
          // User has already enrolled, show access content button
          <Button 
            className="w-full"
            onClick={onViewContent}
          >
            <Play className="mr-2 h-4 w-4" />
            Lihat Konten Kursus
          </Button>
        ) : (
          // User hasn't enrolled, show purchase button
          <Button 
            className="w-full"
            onClick={onEnroll}
            disabled={enrolling || !isAuthenticated}
          >
            {enrolling ? "Processing..." : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                {isFree ? "Ikuti Kursus Gratis" : "Beli Sekarang"}
              </>
            )}
          </Button>
        )}
        
        {!isAuthenticated && (
          <p className="text-xs text-center text-red-500">
            Silakan login terlebih dahulu untuk mengikuti kursus ini.
          </p>
        )}
      </CardFooter>
    </Card>
  )
}