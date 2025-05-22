import { z } from 'zod';
import { createReportSchema } from './constant';

export type CreateReportFormValues = z.infer<typeof createReportSchema>;

export interface Report {
  id: number;
  title: string;
  detail: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}