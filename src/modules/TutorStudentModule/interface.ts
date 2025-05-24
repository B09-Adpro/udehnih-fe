export interface EnrolledStudent {
  studentId: string;
  studentName: string;
  enrolledAt: string;
  status?: 'ENROLLED' | 'PENDING' | 'DROPPED';
}

export interface StudentStats {
  totalStudents: number;
  enrolledStudents: number;
  pendingStudents: number;
  droppedStudents: number;
}

export interface StudentFilter {
  searchTerm: string;
  status?: 'ENROLLED' | 'PENDING' | 'DROPPED' | 'ALL';
  sortBy: 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc';
}