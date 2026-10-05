import React from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, CheckCircle2 } from 'lucide-react';

export default function StudentSubjects() {
  const { subjects } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Subject-Wise Attendance Details</h1>
        <p className="text-slate-500 text-sm mt-0.5">Detailed breakdown of total lectures attended per enrolled subject.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((sub, idx) => {
          const totalClasses = 35;
          const attended = [32, 30, 34, 31][idx % 4];
          const pct = Math.round((attended / totalClasses) * 100);

          return (
            <div key={sub.id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-mono font-bold">
                    {sub.code}
                  </span>
                  <span className="text-lg font-extrabold text-slate-900">{pct}%</span>
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1">{sub.name}</h3>
                <p className="text-xs text-slate-500 mb-4">Department of Computer Science & Engineering</p>

                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center text-xs">
                  <div>
                    <div className="text-slate-400 font-semibold uppercase text-[10px]">Total</div>
                    <div className="font-bold text-slate-900 mt-0.5">{totalClasses}</div>
                  </div>
                  <div>
                    <div className="text-emerald-600 font-semibold uppercase text-[10px]">Attended</div>
                    <div className="font-bold text-emerald-600 mt-0.5">{attended}</div>
                  </div>
                  <div>
                    <div className="text-rose-600 font-semibold uppercase text-[10px]">Absent</div>
                    <div className="font-bold text-rose-600 mt-0.5">{totalClasses - attended}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Passing Threshold: <strong>75%</strong></span>
                <span className="text-emerald-600 font-semibold flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Satisfactory
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
