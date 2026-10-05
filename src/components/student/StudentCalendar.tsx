import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar as CalendarIcon, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function StudentCalendar() {
  const { sessions, activeStudentId } = useApp();

  // Generate days of September 2026
  const daysInMonth = 30;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Attendance Calendar</h1>
        <p className="text-slate-500 text-sm mt-0.5">September 2026 daily attendance log and session records.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">September 2026 Academic Calendar</h3>
          </div>
          <div className="flex items-center space-x-4 text-xs font-semibold">
            <span className="flex items-center space-x-1"><span className="w-3 h-3 rounded-full bg-emerald-500"></span><span>Present</span></span>
            <span className="flex items-center space-x-1"><span className="w-3 h-3 rounded-full bg-rose-500"></span><span>Absent</span></span>
            <span className="flex items-center space-x-1"><span className="w-3 h-3 rounded-full bg-slate-200"></span><span>No Class</span></span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-3">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center font-bold text-xs text-slate-400 uppercase py-2">
              {day}
            </div>
          ))}

          {days.map(day => {
            const isWeekend = day % 7 === 0 || day % 7 === 6;
            const status = isWeekend ? 'none' : day % 9 === 0 ? 'absent' : 'present';

            return (
              <div 
                key={day} 
                className={`h-24 rounded-xl border p-2 flex flex-col justify-between transition-all ${
                  isWeekend 
                    ? 'bg-slate-50/50 border-slate-100 text-slate-300' 
                    : status === 'present'
                    ? 'bg-emerald-50/40 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50/40 border-rose-200 text-rose-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">{day}</span>
                  {!isWeekend && (
                    status === 'present' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    )
                  )}
                </div>

                {!isWeekend && (
                  <div className="text-[10px] font-medium leading-tight">
                    {status === 'present' ? 'Python / DBMS (Present)' : 'Missed Session'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
