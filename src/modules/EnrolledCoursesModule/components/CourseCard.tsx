import { BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"
import { CourseCardProps } from "../interface"

export function CourseCard({ id, title, instructor }: CourseCardProps) {
  const router = useRouter()
  
  const handleClick = () => {
    router.push(`/course/${id}/content`)
  }
  
  return (
    <div 
      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="h-48 bg-gray-200 relative flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
        <BookOpen className="h-12 w-12 text-gray-400" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="text-white font-medium">{title}</div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-600">
          Oleh: <span className="font-medium">{instructor}</span>
        </p>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded">
            Terdaftar
          </div>
          
          <span className="text-sm text-primary font-medium">Lihat Konten</span>
        </div>
      </div>
    </div>
  )
}