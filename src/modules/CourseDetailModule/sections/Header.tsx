import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeaderProps } from "../interface"

export function Header({ title, category, instructor, onBack }: HeaderProps) {
  return (
    <div className="bg-white border-b py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          
          <div>
            <div className="flex items-center mb-2">
              <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                {category}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {title}
            </h1>
            <p className="text-gray-700">
              Oleh: <span className="font-medium">{instructor}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}