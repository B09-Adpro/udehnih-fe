import { z } from 'zod';
import { courseCreateSchema, courseUpdateSchema } from './constant';

export type CourseCreateFormValues = z.infer<typeof courseCreateSchema>;
export type CourseUpdateFormValues = z.infer<typeof courseUpdateSchema>;

export interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  enrollmentCount: number;
  createdAt: string;
  updatedAt: string;
  status: 'DRAFT' | 'PENDING_REVIEW' | 'REJECTED' | 'PUBLISHED';
}

export interface CourseFormData {
  title: string;
  description: string;
  category: string;
  price: number;
}

export type CourseStatus = 'DRAFT' | 'PENDING_REVIEW' | 'REJECTED' | 'PUBLISHED';

export interface CourseStats {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalEnrollments: number;
}