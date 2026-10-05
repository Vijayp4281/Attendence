import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, BookOpen, Calendar, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';

interface StudentDashboardProps {
  setCurrentTab: (tab: string) => void;
}

export default function StudentDashboard({ setCurrentTab }: StudentDashboardProps) {
  const { students, activeStudentId, subjects, sessions } = useApp();
  const currentStudent = students.find(s => s.id === activeStudentId) || students[0];

  // Calculate student specific attendance
  let totalAttended = 0;
  let totalClasses = 0;
  sessions.forEach(s => {
    s.records.forEach(r => {
      if (r.studentId === currentStudent.id) {
        totalClasses++;
        if (r.status === 'PRESENT' || r.status === 'LATE') {
          totalAttended++;
        }
      }
    });
  });

  const overallPct = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 89;
  const isDefaulter = overallPct < 75;

  return (
    <div className="space-y-6">
      {/* Student Greeting Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <img 
              src={currentStudent.profilePhoto} 
              alt={currentStudent.name} 
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400/50 shadow-md"
            />
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
                Student Portal — {currentStudent.rollNumber}
              </span>
              <h1 className="text-2xl font-bold tracking-tight">Welcome, {currentStudent.name} 👋</h1>
              <p className="text-slate-300 text-xs mt-0.5">{currentStudent.email} • Computer Science Engineering</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 text-center shrink-0">
            <div className="text-3xl font-extrabold text-white">{overallPct}%</div>
            <div className="text-xs text-emerald-300 font-medium uppercase tracking-wider mt-0.5">Overall Attendance</div>
          </div>
        </div>
      </div>

      {/* Warning Alert if < 75% */}
      {isDefaulter && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center space-x-3 text-sm">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <strong>Attendance Warning:</strong> Your overall attendance is currently below the mandatory 75% threshold. Please consult your faculty advisor.
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Classes Attended</span>
          <div className="mt-3 text-3xl font-bold text-slate-900">{totalAttended} <span className="text-xs text-slate-400 font-normal">/ {totalClasses}</span></div>
          <p className="text-xs text-emerald-600 mt-1 font-semibold">Regular standing</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Classes Missed (Absent)</span>
          <div className="mt-3 text-3xl font-bold text-slate-900">{totalClasses - totalAttended}</div>
          <p className="text-xs text-rose-600 mt-1 font-semibold">Excused or unexcused</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Academic Standing</span>
          <div className="mt-3 text-3xl font-bold text-emerald-600">Good</div>
          <p className="text-xs text-slate-500 mt-1">Eligible for semester exams</p>
        </div>
      </div>

      {/* Subject-Wise Attendance list */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900">Subject-Wise Attendance Summary</h3>
          <button 
            onClick={() => setCurrentTab('student-subjects')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Detailed Breakdown
          </button>
        </div>

        <div className="space-y-4">
          {subjects.map((sub, idx) => {
            const pct = [92, 85, 94, 88, 91][idx % 5];
            return (
              <div key={sub.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-bold text-slate-900">{sub.name}</span>
                    <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800">{sub.code}</span>
                  </div>
                  <span className="text-sm font-extrabold text-slate-900">{pct}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
