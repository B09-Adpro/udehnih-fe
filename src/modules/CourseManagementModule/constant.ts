import { z } from 'zod';

export const courseCreateSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Judul kursus wajib diisi' })
    .max(255, { message: 'Judul maksimal 255 karakter' }),
  description: z
    .string()
    .min(1, { message: 'Deskripsi wajib diisi' })
    .max(1000, { message: 'Deskripsi maksimal 1000 karakter' }),
  category: z
    .string()
    .min(1, { message: 'Kategori wajib dipilih' })
    .max(100, { message: 'Kategori maksimal 100 karakter' }),
  price: z
    .number()
    .min(0, { message: 'Harga tidak boleh negatif' })
    .max(99999999, { message: 'Harga terlalu besar' })
});

export const courseUpdateSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Judul kursus wajib diisi' })
    .max(255, { message: 'Judul maksimal 255 karakter' })
    .optional(),
  description: z
    .string()
    .min(1, { message: 'Deskripsi wajib diisi' })
    .max(1000, { message: 'Deskripsi maksimal 1000 karakter' })
    .optional(),
  price: z
    .number()
    .min(0, { message: 'Harga tidak boleh negatif' })
    .max(99999999, { message: 'Harga terlalu besar' })
    .optional()
});

export type CourseCreateFormValues = z.infer<typeof courseCreateSchema>;
export type CourseUpdateFormValues = z.infer<typeof courseUpdateSchema>;

export const COURSE_CATEGORIES = [
  { value: 'Matematika', label: 'Matematika' },
  { value: 'Fisika', label: 'Fisika' },
  { value: 'Kimia', label: 'Kimia' },
  { value: 'Biologi', label: 'Biologi' },
  { value: 'Bahasa Indonesia', label: 'Bahasa Indonesia' },
  { value: 'Bahasa Inggris', label: 'Bahasa Inggris' },
  { value: 'Sejarah', label: 'Sejarah' },
  { value: 'Geografi', label: 'Geografi' },
  { value: 'Ekonomi', label: 'Ekonomi' },
  { value: 'Sosiologi', label: 'Sosiologi' },
  { value: 'Komputer', label: 'Komputer' },
  { value: 'Seni', label: 'Seni' },
  { value: 'Olahraga', label: 'Olahraga' },
  { value: 'Lainnya', label: 'Lainnya' }
];

export const COURSE_STATUS_LABELS = {
  DRAFT: {
    label: 'Draft',
    color: 'bg-gray-100 text-gray-800',
    description: 'Kursus masih dalam tahap penyusunan'
  },
  PENDING_REVIEW: {
    label: 'Menunggu Review',
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Kursus sedang direview oleh tim'
  },
  REJECTED: {
    label: 'Ditolak',
    color: 'bg-red-100 text-red-800',
    description: 'Kursus perlu diperbaiki'
  },
  PUBLISHED: {
    label: 'Diterbitkan',
    color: 'bg-green-100 text-green-800',
    description: 'Kursus sudah tersedia untuk siswa'
  }
} as const;
