import { Metadata } from "next"
import { CourseDetailModule } from "@/modules/CourseDetailModule"

interface CourseDetailPageProps {
  params: {
    id: string
  }
}

export const generateMetadata = ({ params }: CourseDetailPageProps): Metadata => {
  return {
    title: `Detail Kursus - Udehnih`,
    description: "Detail kursus di platform pembelajaran Udehnih"
  }
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = params
  return <CourseDetailModule courseId={id} />
}