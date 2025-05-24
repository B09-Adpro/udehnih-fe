import { z } from 'zod';

export const tutorApplicationSchema = z.object({
  experience: z
    .string()
    .min(1, { message: 'Pengalaman mengajar wajib diisi' })
    .max(2000, { message: 'Pengalaman maksimal 2000 karakter' }),
  qualifications: z
    .string()
    .min(1, { message: 'Kualifikasi wajib diisi' })
    .max(1000, { message: 'Kualifikasi maksimal 1000 karakter' }),
  bio: z
    .string()
    .min(1, { message: 'Bio wajib diisi' })
    .max(500, { message: 'Bio maksimal 500 karakter' })
});

export type TutorApplicationFormValues = z.infer<typeof tutorApplicationSchema>;