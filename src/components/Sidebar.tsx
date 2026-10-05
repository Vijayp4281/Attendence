import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, Users, UserCheck, BookOpen, Building2, 
  Calendar, BarChart3, FileText, Settings, Award, Clock, CheckSquare, LogOut, Shield, User as UserIcon, Database
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export default function Sidebar({ currentTab, setCurrentTab }: SidebarProps) {
  const { role, logout, students, staff, departments, activeStudentId, activeStaffId } = useApp();

  const currentStudent = students.find(s => s.id === activeStudentId) || students[0];
  const currentStaff = staff.find(s => s.id === activeStaffId) || staff[0];
  const currentStaffDept = departments.find(d => d.id === currentStaff?.departmentId)?.name || 'Faculty Dept';

  const getRoleInfo = () => {
    switch (role) {
      case 'ADMIN': return { title: 'Administrator', name: 'System Admin', sub: 'Master Control' };
      case 'STAFF': return { title: 'Faculty Portal', name: currentStaff?.name || 'Faculty', sub: currentStaffDept };
      case 'STUDENT': return { title: 'Student Portal', name: currentStudent?.name || 'Student', sub: currentStudent?.rollNumber || 'Roll #001' };
    }
  };

  const roleInfo = getRoleInfo();

  const getNavItems = () => {
    switch (role) {
      case 'ADMIN':
        return [
          { id: 'admin-dash', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'admin-students', label: 'Student Management', icon: Users },
          { id: 'admin-staff', label: 'Staff Management', icon: UserCheck },
          { id: 'admin-academic', label: 'Departments & Classes', icon: Building2 },
          { id: 'admin-reports', label: 'Reports & Export', icon: FileText },
          { id: 'aiven-db', label: 'Aiven MySQL DB', icon: Database },
        ];
      case 'STAFF':
        return [
          { id: 'staff-dash', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'staff-start', label: 'Start Attendance', icon: CheckSquare },
          { id: 'staff-history', label: 'Attendance History', icon: Clock },
          { id: 'staff-analytics', label: 'Class Analytics', icon: BarChart3 },
          { id: 'staff-students', label: 'Student Directory', icon: Users },
        ];
      case 'STUDENT':
        return [
          { id: 'student-dash', label: 'My Dashboard', icon: LayoutDashboard },
          { id: 'student-calendar', label: 'Attendance Calendar', icon: Calendar },
          { id: 'student-subjects', label: 'Subject Breakdown', icon: BookOpen },
          { id: 'student-profile', label: 'My Profile & ID', icon: Award },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-72 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800 min-h-[calc(100vh-4rem)]">
      <div className="p-4 w-full">
        {/* User Profile / Role Badge at Top of Sidebar */}
        <div className="mb-6 p-3 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md ${
            role === 'ADMIN' ? 'bg-rose-600' : role === 'STAFF' ? 'bg-indigo-600' : 'bg-emerald-600'
          }`}>
            {role === 'ADMIN' ? <Shield className="w-5 h-5" /> : role === 'STAFF' ? <UserCheck className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-white truncate">{roleInfo.name}</div>
            <div className="text-[11px] text-indigo-300 font-medium">{roleInfo.title}</div>
            <div className="text-[10px] text-slate-400 truncate">{roleInfo.sub}</div>
          </div>
        </div>

        <div className="px-3 py-1 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Navigation Toolbar
        </div>

        <nav className="flex flex-col space-y-1.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50 font-semibold' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Sign Out in Sidebar */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 text-xs">
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>MySQL DB Connected</span>
          </div>
          <p className="text-slate-400 text-[11px]">Academic Year 2026-27 Active</p>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white font-semibold text-xs border border-rose-500/20 transition-all shadow-xs cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Portal</span>
        </button>
      </div>
    </aside>
  );
}
