import { z } from 'zod';
import { PasswordCriterion, PasswordStrengthLevel } from './interface';

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Nama wajib diisi' })
    .max(50, { message: 'Nama maksimal 50 karakter' }),
  email: z
    .string()
    .min(1, { message: 'Email wajib diisi' })
    .email({ message: 'Format email tidak valid' }),
  password: z
    .string()
    .min(8, { message: 'Password minimal 8 karakter' })
    .regex(/[A-Z]/, { message: 'Password harus memiliki minimal 1 huruf besar' })
    .regex(/[0-9]/, { message: 'Password harus memiliki minimal 1 angka' }),
  terms: z
    .boolean()
    .refine((val) => val === true, {
      message: 'Anda harus menyetujui Syarat dan Ketentuan'
    })
});

export const PASSWORD_CRITERIA: PasswordCriterion[] = [
  {
    id: 'length',
    label: 'Minimal 8 karakter',
    regex: /^.{8,}$/
  },
  {
    id: 'uppercase',
    label: 'Minimal 1 huruf besar',
    regex: /[A-Z]/
  },
  {
    id: 'number',
    label: 'Minimal 1 angka',
    regex: /[0-9]/
  },
  {
    id: 'special',
    label: 'Minimal 1 karakter khusus (opsional)',
    regex: /[^A-Za-z0-9]/,
    optional: true
  }
];

export const PASSWORD_STRENGTH: Record<number, PasswordStrengthLevel> = {
  0: {
    label: 'Lemah',
    color: 'bg-red-500'
  },
  1: {
    label: 'Cukup',
    color: 'bg-orange-500'
  },
  2: {
    label: 'Sedang',
    color: 'bg-yellow-500'
  },
  3: {
    label: 'Kuat',
    color: 'bg-green-500'
  },
  4: {
    label: 'Sangat Kuat',
    color: 'bg-green-600'
  }
};