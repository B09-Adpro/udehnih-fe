export interface EnrollmentResponse {
  message: string;
  enrollmentId: number;
  courseTitle: string;
  status: string;
  enrolledAt: string;
}

export interface CheckoutSummaryProps {
  title: string;
  instructor: string;
  price: number;
  category: string;
}