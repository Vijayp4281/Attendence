import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, Search, Edit3, X, Check, Calendar } from 'lucide-react';
import { AttendanceStatus } from '../../types';

export default function AttendanceHistory() {
  const { sessions, subjects, classes, students, updateAttendanceRecord } = useApp();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const selectedSession = sessions.find(s => s.id === selectedSessionId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Attendance Session History</h1>
        <p className="text-slate-500 text-sm mt-0.5">Review past class roll calls, audit entries, and correct attendance records.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recorded Sessions ({sessions.length})</span>
          <span className="text-xs text-indigo-600 font-semibold">MySQL Synchronized</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Attendance Summary</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No past sessions found.
                  </td>
                </tr>
              ) : (
                sessions.map(sess => {
                  const sub = subjects.find(s => s.id === sess.subjectId);
                  const cls = classes.find(c => c.id === sess.classId);
                  const presentCount = sess.records.filter(r => r.status === 'PRESENT' || r.status === 'LATE').length;
                  const total = Math.max(sess.records.length, 8);

                  return (
                    <tr key={sess.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-slate-900 flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>{sess.date} ({sess.startTime})</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-indigo-600">{sub?.name || 'Subject'}</td>
                      <td className="py-3.5 px-4 text-slate-700">Year {cls?.yearNumber} - Sec {cls?.section}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${sess.status === 'CLOSED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {sess.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {presentCount} / {total} Present ({Math.round((presentCount / total) * 100)}%)
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedSessionId(sess.id)}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold transition-colors"
                        >
                          View / Edit Records
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Session Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 shrink-0">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Edit Attendance Session Records</h3>
                <p className="text-xs text-slate-500">Modify individual student attendance with real-time audit logging.</p>
              </div>
              <button 
                onClick={() => setSelectedSessionId(null)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-slate-100 pr-2">
              {students.map(student => {
                const record = selectedSession.records.find(r => r.studentId === student.id);
                const currentStatus = record?.status || 'PRESENT';

                return (
                  <div key={student.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={student.profilePhoto} alt={student.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{student.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{student.rollNumber}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {(['PRESENT', 'ABSENT', 'LATE'] as AttendanceStatus[]).map(st => (
                        <button
                          key={st}
                          onClick={() => updateAttendanceRecord(selectedSession.id, student.id, st)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            currentStatus === st
                              ? st === 'PRESENT' ? 'bg-emerald-600 text-white' : st === 'ABSENT' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedSessionId(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
              >
                Done & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
