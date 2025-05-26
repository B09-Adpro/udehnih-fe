import { ArticleContentProps } from "../interface"
import { BookOpen } from "lucide-react"

export function ArticleContent({ article, courseTitle }: ArticleContentProps) {
  if (!article) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Pilih materi untuk memulai</h3>
          <p className="text-gray-600">Klik pada artikel di sidebar untuk melihat isinya</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <article>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{article.title}</h1>
        
        {article.content_Type === "TEXT" && (
          <div className="prose prose-sm sm:prose-base max-w-none">
            {article.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        )}
        
        {article.content_Type === "VIDEO" && (
          <div className="aspect-w-16 aspect-h-9 mb-6">
            <iframe 
              src={article.content} 
              className="w-full h-full rounded-md"
              title={`${courseTitle} - ${article.title}`}
              allowFullScreen
            ></iframe>
          </div>
        )}
        
        {article.content_Type === "PDF" && (
          <div className="bg-gray-50 border rounded-md p-6 text-center">
            <p className="mb-4">Dokumen PDF tersedia untuk diunduh</p>
            <a 
              href={article.content} 
              download
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none"
            >
              Unduh PDF
            </a>
          </div>
        )}
      </article>
    </div>
  )
}