export const TUTOR_STATS_CARDS = [
  {
    title: 'Total Kursus',
    key: 'totalCourses',
    icon: 'BookOpen',
    color: 'text-blue-600'
  },
  {
    title: 'Kursus Diterbitkan',
    key: 'publishedCourses',
    icon: 'Eye',
    color: 'text-green-600'
  },
  {
    title: 'Total Siswa',
    key: 'totalStudents',
    icon: 'Users',
    color: 'text-purple-600'
  },
  {
    title: 'Pendapatan',
    key: 'totalRevenue',
    icon: 'DollarSign',
    color: 'text-yellow-600'
  }
] as const;

export const QUICK_ACTIONS = [
  {
    title: 'Buat Kursus Baru',
    description: 'Mulai membuat kursus untuk berbagi pengetahuan',
    href: '/tutor/courses/create',
    icon: 'Plus',
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    title: 'Kelola Kursus',
    description: 'Edit dan kelola kursus yang sudah ada',
    href: '/tutor/courses',
    icon: 'BookOpen',
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    title: 'Lihat Siswa',
    description: 'Pantau siswa yang terdaftar di kursus Anda',
    href: '/tutor/courses',
    icon: 'Users',
    color: 'bg-purple-500 hover:bg-purple-600'
  }
] as const;