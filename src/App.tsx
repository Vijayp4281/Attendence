import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import SignInPage from './components/SignInPage';

// Admin views
import AdminDashboard from './components/admin/AdminDashboard';
import StudentManagement from './components/admin/StudentManagement';
import StaffManagement from './components/admin/StaffManagement';
import AcademicManagement from './components/admin/AcademicManagement';
import ReportsView from './components/admin/ReportsView';
import AivenDatabaseView from './components/AivenDatabaseView';

// Staff views
import StaffDashboard from './components/staff/StaffDashboard';
import StartAttendance from './components/staff/StartAttendance';
import AttendanceHistory from './components/staff/AttendanceHistory';
import StaffAnalytics from './components/staff/StaffAnalytics';

// Student views
import StudentDashboard from './components/student/StudentDashboard';
import StudentCalendar from './components/student/StudentCalendar';
import StudentSubjects from './components/student/StudentSubjects';
import StudentProfile from './components/student/StudentProfile';

function MainLayout() {
  const { role, isLoggedIn } = useApp();
  const [currentTab, setCurrentTab] = useState('staff-dash');

  // Reset tab when role changes
  useEffect(() => {
    if (role === 'ADMIN') setCurrentTab('admin-dash');
    else if (role === 'STAFF') setCurrentTab('staff-dash');
    else if (role === 'STUDENT') setCurrentTab('student-dash');
  }, [role]);

  if (!isLoggedIn) {
    return <SignInPage />;
  }

  const renderContent = () => {
    switch (currentTab) {
      // Admin
      case 'admin-dash': return <AdminDashboard setCurrentTab={setCurrentTab} />;
      case 'admin-students': return <StudentManagement />;
      case 'admin-staff': return <StaffManagement />;
      case 'admin-academic': return <AcademicManagement />;
      case 'admin-reports': return <ReportsView />;
      case 'aiven-db': return <AivenDatabaseView />;

      // Staff
      case 'staff-dash': return <StaffDashboard setCurrentTab={setCurrentTab} />;
      case 'staff-start': return <StartAttendance onSuccess={() => setCurrentTab('staff-history')} />;
      case 'staff-history': return <AttendanceHistory />;
      case 'staff-analytics': return <StaffAnalytics />;
      case 'staff-students': return <StudentManagement />;

      // Student
      case 'student-dash': return <StudentDashboard setCurrentTab={setCurrentTab} />;
      case 'student-calendar': return <StudentCalendar />;
      case 'student-subjects': return <StudentSubjects />;
      case 'student-profile': return <StudentProfile />;

      default: return <StaffDashboard setCurrentTab={setCurrentTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />
      <div className="flex-1 flex flex-row">
        <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
