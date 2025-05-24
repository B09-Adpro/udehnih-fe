export const STUDENT_STATUS = {
  ENROLLED: {
    label: 'Terdaftar',
    color: 'bg-green-100 text-green-800'
  },
  PENDING: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800'
  },
  DROPPED: {
    label: 'Keluar',
    color: 'bg-red-100 text-red-800'
  }
} as const;

export const STUDENT_SORT_OPTIONS = [
  { value: 'name-asc', label: 'Nama (A-Z)' },
  { value: 'name-desc', label: 'Nama (Z-A)' },
  { value: 'date-asc', label: 'Bergabung Terlama' },
  { value: 'date-desc', label: 'Bergabung Terbaru' }
] as const;