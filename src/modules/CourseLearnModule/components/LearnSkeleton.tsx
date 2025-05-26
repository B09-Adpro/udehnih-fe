export function LearnSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header skeleton */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-gray-200 animate-pulse mr-3"></div>
            <div className="space-y-2">
              <div className="h-5 w-48 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content skeleton */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar skeleton */}
        <div className="w-80 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto hidden md:block">
          <div className="py-4">
            <div className="px-4 mb-6">
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
            </div>
            
            <div className="space-y-4 px-4">
              {Array(3).fill(null).map((_, index) => (
                <div key={index} className="space-y-3">
                  <div className="h-5 w-full bg-gray-200 animate-pulse rounded"></div>
                  
                  {index === 0 && (
                    <div className="ml-4 space-y-2">
                      {Array(3).fill(null).map((_, artIndex) => (
                        <div key={`art-${artIndex}`} className="h-4 w-5/6 bg-gray-200 animate-pulse rounded"></div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Article content skeleton */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-3xl mx-auto">
            <div className="h-8 w-3/4 bg-gray-200 animate-pulse rounded mb-6"></div>
            
            <div className="space-y-4">
              {Array(5).fill(null).map((_, index) => (
                <div 
                  key={index} 
                  className="h-4 bg-gray-200 animate-pulse rounded" 
                  style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}