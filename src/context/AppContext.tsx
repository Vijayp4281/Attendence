import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, Department, AcademicYear, ClassRoom, Subject, 
  Student, Staff, AttendanceSession, AttendanceStatus, NotificationItem 
} from '../types';
import { 
  initialDepartments, initialAcademicYears, initialClasses, 
  initialSubjects, initialStudents, initialStaff, initialSessions 
} from '../data/mockData';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isLoggedIn: boolean;
  loginAs: (role: UserRole, email?: string) => void;
  logout: () => void;
  activeStudentId: string;
  setActiveStudentId: (id: string) => void;
  activeStaffId: string;
  setActiveStaffId: (id: string) => void;
  departments: Department[];
  academicYears: AcademicYear[];
  classes: ClassRoom[];
  subjects: Subject[];
  students: Student[];
  staff: Staff[];
  sessions: AttendanceSession[];
  notifications: NotificationItem[];
  
  // Actions
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  addStaff: (staff: Omit<Staff, 'id'>) => void;
  updateStaff: (id: string, staff: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;

  addDepartment: (name: string, code: string) => void;
  addClassRoom: (classRoom: Omit<ClassRoom, 'id'>) => void;
  addSubject: (subject: Omit<Subject, 'id'>) => void;

  startAttendanceSession: (sessionId: string, staffId: string, subjectId: string, classId: string, date: string, startTime: string) => void;
  submitAttendanceSession: (sessionId: string, records: { studentId: string; status: AttendanceStatus }[]) => void;
  updateAttendanceRecord: (sessionId: string, studentId: string, status: AttendanceStatus) => void;
  
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>('STAFF');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [activeStudentId, setActiveStudentId] = useState<string>('stu-1');
  const [activeStaffId, setActiveStaffId] = useState<string>('staff-1');

  const loginAs = (selectedRole: UserRole, email?: string) => {
    setRole(selectedRole);
    setIsLoggedIn(true);
    addNotification('Login Successful', `Signed in successfully as ${selectedRole.toLowerCase()}${email ? ` (${email})` : ''}`, 'success');
  };

  const logout = () => {
    setIsLoggedIn(false);
    addNotification('Signed Out', 'You have been safely signed out of CampusAttend.', 'info');
  };

  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem('campus_departments');
    return saved ? JSON.parse(saved) : initialDepartments;
  });
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(() => {
    const saved = localStorage.getItem('campus_academic_years');
    return saved ? JSON.parse(saved) : initialAcademicYears;
  });
  const [classes, setClasses] = useState<ClassRoom[]>(() => {
    const saved = localStorage.getItem('campus_classes');
    return saved ? JSON.parse(saved) : initialClasses;
  });
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('campus_subjects');
    return saved ? JSON.parse(saved) : initialSubjects;
  });
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('campus_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });
  const [staff, setStaff] = useState<Staff[]>(() => {
    const saved = localStorage.getItem('campus_staff');
    return saved ? JSON.parse(saved) : initialStaff;
  });
  const [sessions, setSessions] = useState<AttendanceSession[]>(() => {
    const saved = localStorage.getItem('campus_sessions');
    return saved ? JSON.parse(saved) : initialSessions;
  });

  useEffect(() => {
    fetch('/api/attendance/sessions')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.sessions && data.sessions.length > 0) {
          setSessions(data.sessions);
        }
      })
      .catch(err => console.warn('Failed to fetch attendance sessions from MySQL:', err));

    fetch('/api/departments')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.departments && data.departments.length > 0) {
          setDepartments(data.departments);
        }
      })
      .catch(err => console.warn('Failed to fetch departments from MySQL:', err));

    fetch('/api/classes')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.classes && data.classes.length > 0) {
          setClasses(data.classes);
        }
      })
      .catch(err => console.warn('Failed to fetch classes from MySQL:', err));
  }, []);

  useEffect(() => {
    localStorage.setItem('campus_departments', JSON.stringify(departments));
  }, [departments]);
  useEffect(() => {
    localStorage.setItem('campus_academic_years', JSON.stringify(academicYears));
  }, [academicYears]);
  useEffect(() => {
    localStorage.setItem('campus_classes', JSON.stringify(classes));
  }, [classes]);
  useEffect(() => {
    localStorage.setItem('campus_subjects', JSON.stringify(subjects));
  }, [subjects]);
  useEffect(() => {
    localStorage.setItem('campus_students', JSON.stringify(students));
  }, [students]);
  useEffect(() => {
    localStorage.setItem('campus_staff', JSON.stringify(staff));
  }, [staff]);
  useEffect(() => {
    localStorage.setItem('campus_sessions', JSON.stringify(sessions));
  }, [sessions]);
  
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'System Initialized',
      message: 'CampusAttend college attendance system is running normally with MySQL mock persistence.',
      type: 'success',
      timestamp: new Date().toLocaleTimeString(),
      read: false
    },
    {
      id: 'notif-2',
      title: 'Attendance Warning',
      message: 'Arun Kumar has 88% overall attendance. Database Management session completed yesterday.',
      type: 'info',
      timestamp: new Date().toLocaleTimeString(),
      read: false
    }
  ]);

  // Student Actions
  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `stu-${Date.now()}`
    };
    setStudents(prev => [newStudent, ...prev]);
    addNotification('Student Added', `${newStudent.name} (${newStudent.rollNumber}) was successfully registered.`, 'success');
  };

  const updateStudent = (id: string, updatedFields: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updatedFields } : s));
    addNotification('Student Updated', 'Student profile details were updated successfully.', 'success');
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    addNotification('Student Deleted', 'Student record removed from system.', 'warning');
  };

  // Staff Actions
  const addStaff = (staffData: Omit<Staff, 'id'>) => {
    const newStaff: Staff = {
      ...staffData,
      id: `staff-${Date.now()}`
    };
    setStaff(prev => [newStaff, ...prev]);
    addNotification('Staff Added', `${newStaff.name} was successfully registered as faculty.`, 'success');
  };

  const updateStaff = (id: string, updatedFields: Partial<Staff>) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, ...updatedFields } : s));
    addNotification('Staff Updated', 'Faculty profile updated successfully.', 'success');
  };

  const deleteStaff = (id: string) => {
    setStaff(prev => prev.filter(s => s.id !== id));
    addNotification('Staff Removed', 'Faculty member removed from system.', 'warning');
  };

  // Academic Setup Actions
  const addDepartment = async (name: string, code: string) => {
    const newDept: Department = { id: `dept-${Date.now()}`, name, code };
    setDepartments(prev => [...prev, newDept]);
    addNotification('Department Added', `${name} (${code}) created.`, 'success');

    try {
      await fetch('/api/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDept)
      });
    } catch (err) {
      console.warn('Failed to save department to MySQL:', err);
    }
  };

  const addClassRoom = async (classData: Omit<ClassRoom, 'id'>) => {
    const newClass: ClassRoom = { ...classData, id: `cls-${Date.now()}` };
    setClasses(prev => [...prev, newClass]);
    addNotification('Class Added', `Year ${newClass.yearNumber} - Section ${newClass.section} created.`, 'success');

    try {
      await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClass)
      });
    } catch (err) {
      console.warn('Failed to save class to MySQL:', err);
    }
  };

  const addSubject = (subjectData: Omit<Subject, 'id'>) => {
    const newSub: Subject = { ...subjectData, id: `sub-${Date.now()}` };
    setSubjects(prev => [...prev, newSub]);
    addNotification('Subject Added', `${newSub.name} (${newSub.code}) created.`, 'success');
  };

  // Attendance Session & Records Actions
  const startAttendanceSession = async (sessionId: string, staffId: string, subjectId: string, classId: string, date: string, startTime: string) => {
    const newSession: AttendanceSession = {
      id: sessionId,
      staffId,
      subjectId,
      classId,
      date,
      startTime,
      endTime: '10:00', // default
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      records: []
    };
    setSessions(prev => [newSession, ...prev]);
    addNotification('Attendance Started', 'Active attendance session opened for class.', 'success');

    try {
      await fetch('/api/attendance/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSession)
      });
    } catch (err) {
      console.warn('Failed to save session to MySQL:', err);
    }
  };

  const submitAttendanceSession = async (sessionId: string, recordsList: { studentId: string; status: AttendanceStatus }[]) => {
    const now = new Date().toISOString();
    const formattedRecords = recordsList.map((rec, index) => ({
      id: `rec-${sessionId}-${index}-${Date.now()}`,
      sessionId,
      studentId: rec.studentId,
      status: rec.status,
      markedAt: now
    }));

    setSessions(prev => prev.map(sess => {
      if (sess.id === sessionId) {
        return {
          ...sess,
          status: 'CLOSED',
          records: formattedRecords
        };
      }
      return sess;
    }));

    const presentCount = recordsList.filter(r => r.status === 'PRESENT').length;
    addNotification('Attendance Submitted', `Session closed successfully. ${presentCount}/${recordsList.length} students marked present.`, 'success');

    try {
      await fetch('/api/attendance/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, records: recordsList })
      });
    } catch (err) {
      console.warn('Failed to submit attendance records to MySQL:', err);
    }
  };

  const updateAttendanceRecord = (sessionId: string, studentId: string, status: AttendanceStatus) => {
    setSessions(prev => prev.map(sess => {
      if (sess.id === sessionId) {
        const existingRecordIndex = sess.records.findIndex(r => r.studentId === studentId);
        let updatedRecords = [...sess.records];
        if (existingRecordIndex >= 0) {
          updatedRecords[existingRecordIndex] = { ...updatedRecords[existingRecordIndex], status };
        } else {
          updatedRecords.push({
            id: `rec-mod-${Date.now()}`,
            sessionId,
            studentId,
            status,
            markedAt: new Date().toISOString()
          });
        }
        return { ...sess, records: updatedRecords };
      }
      return sess;
    }));
    addNotification('Attendance Updated', 'Student record updated in audit log.', 'success');
  };

  const addNotification = (title: string, message: string, type: 'success' | 'warning' | 'info') => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider value={{
      role, setRole,
      isLoggedIn, loginAs, logout,
      activeStudentId, setActiveStudentId,
      activeStaffId, setActiveStaffId,
      departments, academicYears, classes, subjects,
      students, staff, sessions, notifications,
      addStudent, updateStudent, deleteStudent,
      addStaff, updateStaff, deleteStaff,
      addDepartment, addClassRoom, addSubject,
      startAttendanceSession, submitAttendanceSession, updateAttendanceRecord,
      markNotificationRead, clearAllNotifications
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
