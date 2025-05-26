import { useState } from "react"
import { ChevronDown, ChevronRight, FileText } from "lucide-react"
import { SectionItemProps } from "../interface"

export function SectionItem({ 
  section, 
  isActive, 
  activeArticleId,
  onSelectArticle 
}: SectionItemProps) {
  const [isExpanded, setIsExpanded] = useState(isActive)
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }
  
  return (
    <div className="border-b border-gray-100 last:border-none">
      {/* Section header */}
      <button 
        onClick={toggleExpand}
        className="flex items-center justify-between w-full px-4 py-3 text-left focus:outline-none"
      >
        <div className="flex items-center">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-gray-500 mr-2" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500 mr-2" />
          )}
          <span className="font-medium text-gray-900">{section.title}</span>
        </div>
        <span className="text-xs text-gray-500">{section.articles.length} artikel</span>
      </button>
      
      {/* Articles list */}
      {isExpanded && (
        <div className="ml-6 mr-2 mb-3 border-l border-gray-100 pl-2">
          {section.articles.sort((a, b) => a.order - b.order).map(article => (
            <button
              key={article.id}
              onClick={() => onSelectArticle(section.id, article.id)}
              className={`flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-gray-100 ${
                activeArticleId === article.id 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-gray-700'
              }`}
            >
              <FileText className="h-4 w-4 mr-2" />
              <span className="text-left">{article.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}