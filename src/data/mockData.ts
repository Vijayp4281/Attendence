import { Department, AcademicYear, ClassRoom, Subject, Student, Staff, AttendanceSession } from '../types';

export const initialDepartments: Department[] = [
  { id: 'dept-1', name: 'Computer Science & Engineering', code: 'CSE' },
  { id: 'dept-2', name: 'Information Technology', code: 'IT' },
  { id: 'dept-3', name: 'Electronics & Communication', code: 'ECE' },
  { id: 'dept-4', name: 'Mechanical Engineering', code: 'MECH' },
];

export const initialAcademicYears: AcademicYear[] = [
  { id: 'ay-1', yearName: '2025-2026', isActive: false },
  { id: 'ay-2', yearName: '2026-2027', isActive: true },
];

export const initialClasses: ClassRoom[] = [
  { id: 'cls-1', departmentId: 'dept-1', academicYearId: 'ay-2', yearNumber: 2, section: 'A' },
  { id: 'cls-2', departmentId: 'dept-1', academicYearId: 'ay-2', yearNumber: 2, section: 'B' },
  { id: 'cls-3', departmentId: 'dept-1', academicYearId: 'ay-2', yearNumber: 3, section: 'A' },
  { id: 'cls-4', departmentId: 'dept-2', academicYearId: 'ay-2', yearNumber: 2, section: 'A' },
];

export const initialSubjects: Subject[] = [
  { id: 'sub-1', code: 'CS301', name: 'Database Management Systems', departmentId: 'dept-1' },
  { id: 'sub-2', code: 'CS302', name: 'Advanced Web Development', departmentId: 'dept-1' },
  { id: 'sub-3', code: 'CS303', name: 'Python & Data Structures', departmentId: 'dept-1' },
  { id: 'sub-4', code: 'CS304', name: 'Probability & Statistics', departmentId: 'dept-1' },
  { id: 'sub-5', code: 'IT201', name: 'Computer Networks', departmentId: 'dept-2' },
];

export const initialStudents: Student[] = [
  {
    id: 'stu-1',
    rollNumber: 'CSE2026001',
    name: 'Arun Kumar',
    email: 'arun.kumar@college.edu',
    departmentId: 'dept-1',
    classId: 'cls-1',
    phone: '+91 98765 43210',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'stu-2',
    rollNumber: 'CSE2026002',
    name: 'Ravi Sharma',
    email: 'ravi.sharma@college.edu',
    departmentId: 'dept-1',
    classId: 'cls-1',
    phone: '+91 98765 43211',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'stu-3',
    rollNumber: 'CSE2026003',
    name: 'Priya Patel',
    email: 'priya.patel@college.edu',
    departmentId: 'dept-1',
    classId: 'cls-1',
    phone: '+91 98765 43212',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'stu-4',
    rollNumber: 'CSE2026004',
    name: 'Vijay Verma',
    email: 'vijay.verma@college.edu',
    departmentId: 'dept-1',
    classId: 'cls-1',
    phone: '+91 98765 43213',
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'stu-5',
    rollNumber: 'CSE2026005',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@college.edu',
    departmentId: 'dept-1',
    classId: 'cls-1',
    phone: '+91 98765 43214',
    profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'stu-6',
    rollNumber: 'CSE2026006',
    name: 'Karthik Raja',
    email: 'karthik.raja@college.edu',
    departmentId: 'dept-1',
    classId: 'cls-1',
    phone: '+91 98765 43215',
    profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'stu-7',
    rollNumber: 'CSE2026007',
    name: 'Neha Gupta',
    email: 'neha.gupta@college.edu',
    departmentId: 'dept-1',
    classId: 'cls-1',
    phone: '+91 98765 43216',
    profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'stu-8',
    rollNumber: 'CSE2026008',
    name: 'Rahul Dravid',
    email: 'rahul.dravid@college.edu',
    departmentId: 'dept-1',
    classId: 'cls-1',
    phone: '+91 98765 43217',
    profilePhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
  },
];

export const initialStaff: Staff[] = [
  {
    id: 'staff-1',
    name: 'Dr. Ramesh Kumar',
    email: 'ramesh.kumar@college.edu',
    departmentId: 'dept-1',
    phone: '+91 94433 11223',
    assignedSubjectIds: ['sub-1', 'sub-2'],
    assignedClassIds: ['cls-1', 'cls-2'],
  },
  {
    id: 'staff-2',
    name: 'Prof. Sunita Sundaram',
    email: 'sunita.s@college.edu',
    departmentId: 'dept-1',
    phone: '+91 94433 22334',
    assignedSubjectIds: ['sub-3', 'sub-4'],
    assignedClassIds: ['cls-1', 'cls-3'],
  },
];

const todayStr = new Date().toISOString().split('T')[0];
const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const dayBeforeYesterday = new Date(Date.now() - 172800000).toISOString().split('T')[0];

export const initialSessions: AttendanceSession[] = [
  {
    id: 'sess-1',
    staffId: 'staff-1',
    subjectId: 'sub-1',
    classId: 'cls-1',
    date: yesterdayStr,
    startTime: '09:00',
    endTime: '09:50',
    status: 'CLOSED',
    createdAt: `${yesterdayStr}T09:00:00Z`,
    records: [
      { id: 'rec-1', sessionId: 'sess-1', studentId: 'stu-1', status: 'PRESENT', markedAt: `${yesterdayStr}T09:02:00Z` },
      { id: 'rec-2', sessionId: 'sess-1', studentId: 'stu-2', status: 'PRESENT', markedAt: `${yesterdayStr}T09:02:00Z` },
      { id: 'rec-3', sessionId: 'sess-1', studentId: 'stu-3', status: 'PRESENT', markedAt: `${yesterdayStr}T09:03:00Z` },
      { id: 'rec-4', sessionId: 'sess-1', studentId: 'stu-4', status: 'ABSENT', markedAt: `${yesterdayStr}T09:03:00Z` },
      { id: 'rec-5', sessionId: 'sess-1', studentId: 'stu-5', status: 'PRESENT', markedAt: `${yesterdayStr}T09:04:00Z` },
      { id: 'rec-6', sessionId: 'sess-1', studentId: 'stu-6', status: 'LATE', markedAt: `${yesterdayStr}T09:12:00Z` },
      { id: 'rec-7', sessionId: 'sess-1', studentId: 'stu-7', status: 'PRESENT', markedAt: `${yesterdayStr}T09:04:00Z` },
      { id: 'rec-8', sessionId: 'sess-1', studentId: 'stu-8', status: 'PRESENT', markedAt: `${yesterdayStr}T09:05:00Z` },
    ],
  },
  {
    id: 'sess-2',
    staffId: 'staff-2',
    subjectId: 'sub-3',
    classId: 'cls-1',
    date: dayBeforeYesterday,
    startTime: '10:00',
    endTime: '10:50',
    status: 'CLOSED',
    createdAt: `${dayBeforeYesterday}T10:00:00Z`,
    records: [
      { id: 'rec-21', sessionId: 'sess-2', studentId: 'stu-1', status: 'PRESENT', markedAt: `${dayBeforeYesterday}T10:01:00Z` },
      { id: 'rec-22', sessionId: 'sess-2', studentId: 'stu-2', status: 'ABSENT', markedAt: `${dayBeforeYesterday}T10:01:00Z` },
      { id: 'rec-23', sessionId: 'sess-2', studentId: 'stu-3', status: 'PRESENT', markedAt: `${dayBeforeYesterday}T10:02:00Z` },
      { id: 'rec-24', sessionId: 'sess-2', studentId: 'stu-4', status: 'PRESENT', markedAt: `${dayBeforeYesterday}T10:02:00Z` },
      { id: 'rec-25', sessionId: 'sess-2', studentId: 'stu-5', status: 'PRESENT', markedAt: `${dayBeforeYesterday}T10:03:00Z` },
      { id: 'rec-26', sessionId: 'sess-2', studentId: 'stu-6', status: 'PRESENT', markedAt: `${dayBeforeYesterday}T10:03:00Z` },
      { id: 'rec-27', sessionId: 'sess-2', studentId: 'stu-7', status: 'ABSENT', markedAt: `${dayBeforeYesterday}T10:03:00Z` },
      { id: 'rec-28', sessionId: 'sess-2', studentId: 'stu-8', status: 'PRESENT', markedAt: `${dayBeforeYesterday}T10:04:00Z` },
    ],
  }
];
