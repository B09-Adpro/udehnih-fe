import { z } from 'zod';
import { tutorApplicationSchema } from './constant';

export type TutorApplicationFormValues = z.infer<typeof tutorApplicationSchema>;

export interface TutorApplicationStatus {
  applicationId: number;
  status: 'PENDING' | 'ACCEPTED' | 'DENIED';
  submittedAt: string;
  experience: string;
  qualifications: string;
}

export interface TutorApplicationResponse {
  message: string;
  applicationId: number;
  status: 'PENDING' | 'ACCEPTED' | 'DENIED';
}
