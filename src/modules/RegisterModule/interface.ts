import { z } from 'zod';
import { registerSchema } from './constant';

export type RegisterFormValues = z.infer<typeof registerSchema>;

export interface PasswordCriterion {
  id: string;
  label: string;
  regex: RegExp;
  optional?: boolean;
}

export interface PasswordStrengthLevel {
  label: string;
  color: string;
}