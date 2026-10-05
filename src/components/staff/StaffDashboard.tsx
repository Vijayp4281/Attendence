import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckSquare, Clock, BarChart3, Users, ArrowRight, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

interface StaffDashboardProps {
  setCurrentTab: (tab: string) => void;
}

export default function StaffDashboard({ setCurrentTab }: StaffDashboardProps) {
  const { staff, activeStaffId, sessions, subjects, classes } = useApp();
  const currentStaff = staff.find(s => s.id === activeStaffId) || staff[0];

  const staffSessions = sessions.filter(s => s.staffId === activeStaffId);
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysSessions = staffSessions.filter(s => s.date === todayStr);

  return (
    <div className="space-y-6">
      {/* Staff Greeting Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3">
            Faculty Portal — {currentStaff.name}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome Back, Professor 👋</h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            You have 4 scheduled classes this week. Start a live attendance session now or review student submission histories.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setCurrentTab('staff-start')}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center space-x-2 shadow-md shadow-indigo-600/30"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Start Attendance Session</span>
            </button>
            <button
              onClick={() => setCurrentTab('staff-history')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center space-x-2 border border-white/10"
            >
              <Clock className="w-4 h-4" />
              <span>View History</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Assigned Subjects</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-bold text-slate-900">{currentStaff.assignedSubjectIds.length}</div>
          <p className="text-xs text-slate-500 mt-1">Computer Science Department</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Sessions Recorded</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-bold text-slate-900">{staffSessions.length + 12}</div>
          <p className="text-xs text-slate-500 mt-1">This semester</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Average Attendance</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-bold text-slate-900">91.4%</div>
          <p className="text-xs text-slate-500 mt-1">Optimal student engagement</p>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900">Recent Attendance Sessions</h3>
          <button 
            onClick={() => setCurrentTab('staff-history')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
          >
            <span>View All History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {staffSessions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No attendance sessions recorded yet. Click "Start Attendance Session" above to begin.
            </div>
          ) : (
            staffSessions.map(sess => {
              const sub = subjects.find(s => s.id === sess.subjectId);
              const cls = classes.find(c => c.id === sess.classId);
              const presentCount = sess.records.filter(r => r.status === 'PRESENT' || r.status === 'LATE').length;
              const totalCount = Math.max(sess.records.length, 8);
              const pct = Math.round((presentCount / totalCount) * 100);

              return (
                <div key={sess.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      {sub?.code || 'CS'}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{sub?.name || 'Subject Course'}</h4>
                      <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                        <span>Class Year {cls?.yearNumber} — Sec {cls?.section}</span>
                        <span>•</span>
                        <span>{sess.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900">{presentCount}/{totalCount} Present</span>
                    <div className="text-xs font-semibold text-emerald-600">{pct}% Attendance</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
