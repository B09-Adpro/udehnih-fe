import { z } from 'zod';
import { loginSchema } from './constant';

export type LoginFormValues = z.infer<typeof loginSchema>;

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
}