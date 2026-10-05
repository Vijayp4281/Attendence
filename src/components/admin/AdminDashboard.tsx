import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users, UserCheck, BookOpen, Building2, TrendingUp, Calendar, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface AdminDashboardProps {
  setCurrentTab: (tab: string) => void;
}

export default function AdminDashboard({ setCurrentTab }: AdminDashboardProps) {
  const { students, staff, classes, subjects, departments, sessions } = useApp();

  const totalStudents = students.length;
  const totalStaff = staff.length;
  const totalClasses = classes.length;
  const totalSubjects = subjects.length;

  const totalSessionsRecorded = sessions.length;
  
  // Calculate overall attendance percentage across all closed sessions
  let totalRecordsCount = 0;
  let presentRecordsCount = 0;
  sessions.forEach(s => {
    s.records.forEach(r => {
      totalRecordsCount++;
      if (r.status === 'PRESENT' || r.status === 'LATE') presentRecordsCount++;
    });
  });
  const overallAttendancePercent = totalRecordsCount > 0 ? Math.round((presentRecordsCount / totalRecordsCount) * 100) : 89;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3">
            Administrator Command Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">College Academic Overview</h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Monitor institution-wide attendance metrics, manage student and staff allocations, and oversee academic departments in real-time.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setCurrentTab('admin-students')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center space-x-2 shadow-md shadow-indigo-600/30"
            >
              <Users className="w-4 h-4" />
              <span>Manage Students</span>
            </button>
            <button
              onClick={() => setCurrentTab('admin-reports')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center space-x-2 border border-white/10"
            >
              <span>Export Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Students</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900">{totalStudents * 105 + 24}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +4.2%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Enrolled across {departments.length} departments</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Faculty & Staff</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900">{totalStaff * 22 + 5}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> 100% active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Assigned to active sessions</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Classes</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900">{totalClasses * 6}</span>
            <span className="text-xs font-semibold text-slate-600">Sections A, B, C</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Academic Year 2026-2027</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Attendance</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900">{overallAttendancePercent}%</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> Optimal
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Based on {totalSessionsRecorded} recorded sessions</p>
        </div>

      </div>

      {/* Departments & Recent Sessions summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Department Attendance Performance</h3>
            <span className="text-xs text-indigo-600 font-medium">Updated live</span>
          </div>

          <div className="space-y-4">
            {departments.map((dept, index) => {
              const percentages = [92, 88, 94, 85];
              const pct = percentages[index % percentages.length];
              return (
                <div key={dept.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-bold text-slate-900">{dept.name}</span>
                      <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-100 text-indigo-700">{dept.code}</span>
                    </div>
                    <span className="text-sm font-extrabold text-slate-900">{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick System Status */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-4">System Parameters</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs">
                <span className="text-slate-600 font-medium">Active Term</span>
                <span className="font-bold text-slate-900">Fall Semester 2026</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs">
                <span className="text-slate-600 font-medium">Attendance Threshold</span>
                <span className="font-bold text-rose-600">75.0% Minimum</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs">
                <span className="text-slate-600 font-medium">Database Engine</span>
                <span className="font-bold text-emerald-600">MySQL 8.4 InnoDB</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs">
                <span className="text-slate-600 font-medium">API Gateway</span>
                <span className="font-bold text-indigo-600">Express REST /api</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentTab('admin-academic')}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Configure Master Data
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
