import { z } from 'zod';
import { sectionSchema, articleSchema } from './constant';

export type SectionFormValues = z.infer<typeof sectionSchema>;
export type ArticleFormValues = z.infer<typeof articleSchema>;

export interface Section {
  id: number;
  title: string;
  courseId: number;
  articles?: Article[];
}

export interface Article {
  id: number;
  title: string;
  content: string;
  contentType: string;
  sectionId: number;
}

export interface CourseContent {
  sections: Section[];
  totalSections: number;
  totalArticles: number;
}

export interface ContentStats {
  totalSections: number;
  totalArticles: number;
  completionRate: number;
}