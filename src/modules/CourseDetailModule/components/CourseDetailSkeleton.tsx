import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export function CourseDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <Button 
              variant="ghost" 
              className="mb-4"
              disabled
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
            
            <div>
              <div className="flex items-center mb-2">
                <div className="h-6 w-20 bg-primary/20 animate-pulse rounded-full"></div>
              </div>
              <div className="h-10 w-3/4 bg-gray-200 animate-pulse rounded-md mb-2"></div>
              <div className="h-6 w-1/3 bg-gray-200 animate-pulse rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="h-8 w-40 bg-gray-200 animate-pulse rounded-md mb-4"></div>
            <div className="space-y-3">
              {Array(5).fill(0).map((_, index) => (
                <div key={index} className="h-4 bg-gray-200 animate-pulse rounded-md" style={{width: `${Math.random() * 30 + 70}%`}}></div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <div className="h-6 w-40 bg-gray-200 animate-pulse rounded-md mb-4"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array(4).fill(0).map((_, index) => (
                  <div key={index} className="flex items-center">
                    <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-md mr-3"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-20 bg-gray-200 animate-pulse rounded-md"></div>
                      <div className="h-5 w-24 bg-gray-200 animate-pulse rounded-md"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <div className="border rounded-lg p-4">
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded-md mb-3"></div>
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded-md mb-4"></div>
              <div className="space-y-3 mb-4">
                {Array(3).fill(0).map((_, index) => (
                  <div key={index} className="flex items-start">
                    <div className="h-4 w-4 bg-gray-200 animate-pulse rounded-md mr-2 mt-1"></div>
                    <div className="h-4 bg-gray-200 animate-pulse rounded-md flex-1"></div>
                  </div>
                ))}
              </div>
              <div className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}