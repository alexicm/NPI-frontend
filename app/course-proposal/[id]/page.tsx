import CourseDetailsPage from "@/components/CourseDetailsPage"

interface CourseDetailsRouteProps {
  params: {
    id: string
  }
}

export default function CourseDetailsRoute({ params }: CourseDetailsRouteProps) {
  return <CourseDetailsPage courseId={params.id} />
}
