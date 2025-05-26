import { DescriptionProps } from "../interface"

export function Description({ description }: DescriptionProps) {
  return (
    <div className="prose prose-sm md:prose-base max-w-none">
      <h2 className="text-xl font-semibold mb-4">Tentang Kursus</h2>
      <div className="text-gray-700 whitespace-pre-wrap">
        {description.split("\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  )
}