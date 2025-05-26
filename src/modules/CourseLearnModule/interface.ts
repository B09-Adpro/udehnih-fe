export interface CourseContent {
  id: number
  title: string
  category: string
  instructor: string
  price: number
  description: string
  created_at: string
  updated_at: string
  sections: Section[]
  _free: boolean
}

export interface Section {
  id: number
  title: string
  order: number
  articles: Article[]
}

export interface Article {
  id: number
  title: string
  content_Type: "TEXT" | "VIDEO" | "PDF"
  content: string
  order: number
}

export interface CourseLearnModuleProps {
  courseId: string
}

export interface SidebarProps {
  course: CourseContent
  activeArticleId: number | null
  onSelectArticle: (sectionId: number, articleId: number) => void
}

export interface ArticleContentProps {
  article: Article | null
  courseTitle: string
}

export interface SectionItemProps {
  section: Section
  isActive: boolean
  activeArticleId: number | null
  onSelectArticle: (sectionId: number, articleId: number) => void
}