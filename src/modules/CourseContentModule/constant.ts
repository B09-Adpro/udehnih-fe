import { z } from 'zod';

export const sectionSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Judul section wajib diisi' })
    .max(255, { message: 'Judul maksimal 255 karakter' })
});

export const articleSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Judul artikel wajib diisi' })
    .max(255, { message: 'Judul maksimal 255 karakter' }),
  content: z
    .string()
    .min(1, { message: 'Konten artikel wajib diisi' }),
  contentType: z
    .string()
    .min(1, { message: 'Tipe konten wajib dipilih' })
});

export type SectionFormValues = z.infer<typeof sectionSchema>;
export type ArticleFormValues = z.infer<typeof articleSchema>;

export const CONTENT_TYPES = [
  { value: 'TEXT', label: 'Teks' },
  { value: 'VIDEO_URL', label: 'URL Video' },
  { value: 'IMAGE_URL', label: 'URL Gambar' },
  { value: 'MARKDOWN', label: 'Markdown' }
] as const;