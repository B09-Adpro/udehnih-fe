import { z } from 'zod';
import { createReportSchema } from './constant';

export type CreateReportFormValues = z.infer<typeof createReportSchema>;

export interface Report {
  reportId: number;
  studentId: string;
  title: string;
  detail: string;
  status: string;
  rejectionMessage: string | null;
  rejectionMessageText: string | null;
  createdAt: string;
  updatedAt: string;
}