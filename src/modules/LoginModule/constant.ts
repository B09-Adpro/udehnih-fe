import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email wajib diisi' })
    .email({ message: 'Format email tidak valid' }),
  password: z
    .string()
    .min(1, { message: 'Password wajib diisi' }),
  remember: z
    .boolean()
    .default(false)
});

export type LoginFormValues = z.infer<typeof loginSchema>;
