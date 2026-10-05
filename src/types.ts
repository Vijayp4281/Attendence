export type UserRole = 'ADMIN' | 'STAFF' | 'STUDENT';

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface AcademicYear {
  id: string;
  yearName: string;
  isActive: boolean;
}

export interface ClassRoom {
  id: string;
  departmentId: string;
  academicYearId: string;
  yearNumber: number; // 1, 2, 3, 4
  section: string; // A, B, C
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  departmentId: string;
}

export interface Student {
  id: string;
  rollNumber: string;
  name: string;
  email: string;
  departmentId: string;
  classId: string;
  phone: string;
  profilePhoto?: string;
  overallAttendance?: number;
  username?: string;
  password?: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  departmentId: string;
  phone: string;
  assignedSubjectIds: string[];
  assignedClassIds: string[];
  username?: string;
  password?: string;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE';

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  status: AttendanceStatus;
  markedAt: string;
}

export interface AttendanceSession {
  id: string;
  staffId: string;
  subjectId: string;
  classId: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  status: 'OPEN' | 'CLOSED';
  createdAt: string;
  records: AttendanceRecord[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info';
  timestamp: string;
  read: boolean;
}
