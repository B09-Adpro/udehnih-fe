import { SidebarProps } from "../interface"
import { SectionItem } from "./SectionItem"

export function LearnSidebar({ course, activeArticleId, onSelectArticle }: SidebarProps) {
  return (
    <div className="py-4">
      <div className="px-4 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Materi Kursus</h2>
        <p className="text-sm text-gray-600">{course.sections.length} Bab</p>
      </div>
      
      <nav className="space-y-2">
        {course.sections.sort((a, b) => a.order - b.order).map(section => (
          <SectionItem 
            key={section.id}
            section={section}
            isActive={section.articles.some(article => article.id === activeArticleId)}
            activeArticleId={activeArticleId}
            onSelectArticle={onSelectArticle}
          />
        ))}
      </nav>
    </div>
  )
}