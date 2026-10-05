import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, TrendingUp, Award, Users } from 'lucide-react';

export default function StaffAnalytics() {
  const { subjects, sessions } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Class & Subject Analytics</h1>
        <p className="text-slate-500 text-sm mt-0.5">Comprehensive statistical insights into attendance patterns and student engagement.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Subject-wise breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-4">Subject Attendance Breakdown</h3>
          <div className="space-y-4">
            {subjects.map((sub, idx) => {
              const percentages = [92, 87, 94, 90, 89];
              const pct = percentages[idx % percentages.length];
              return (
                <div key={sub.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-xs font-bold text-slate-900">{sub.name}</span>
                      <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-mono bg-indigo-100 text-indigo-700">{sub.code}</span>
                    </div>
                    <span className="text-xs font-extrabold text-slate-900">{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-4">Monthly Attendance Trend</h3>
            <div className="space-y-4">
              {[
                { month: 'June 2026', pct: 87 },
                { month: 'July 2026', pct: 89 },
                { month: 'August 2026', pct: 91 },
                { month: 'September 2026', pct: 93 },
              ].map(m => (
                <div key={m.month} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">{m.month}</span>
                    <span className="text-xs font-bold text-emerald-600">{m.pct}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${m.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center space-x-3">
            <TrendingUp className="w-5 h-5 text-indigo-600 shrink-0" />
            <p className="text-xs text-indigo-900">
              Attendance has increased by <strong>6%</strong> compared to previous semester.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
