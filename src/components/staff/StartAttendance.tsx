import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceStatus } from '../../types';
import { CheckSquare, Play, CheckCircle2, UserCheck, UserX, Clock, ArrowLeft, Send } from 'lucide-react';

interface StartAttendanceProps {
  onSuccess: () => void;
}

export default function StartAttendance({ onSuccess }: StartAttendanceProps) {
  const { subjects, classes, students, activeStaffId, startAttendanceSession, submitAttendanceSession } = useApp();

  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.id || '');
  const [selectedClass, setSelectedClass] = useState(classes[0]?.id || '');
  const [sessionStarted, setSessionStarted] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState('');

  // Attendance status mapping for each student in the class
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>({});

  const classStudents = students.filter(s => s.classId === selectedClass);

  const handleStartSession = (e: React.FormEvent) => {
    e.preventDefault();
    const sessionId = `sess-${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    startAttendanceSession(sessionId, activeStaffId, selectedSubject, selectedClass, today, time);
    setCurrentSessionId(sessionId);

    // Default all students to PRESENT initially
    const initialMap: Record<string, AttendanceStatus> = {};
    classStudents.forEach(stu => {
      initialMap[stu.id] = 'PRESENT';
    });
    setAttendanceMap(initialMap);
    setSessionStarted(true);
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmitAttendance = () => {
    const recordsList = Object.entries(attendanceMap).map(([studentId, status]) => ({
      studentId,
      status
    }));

    submitAttendanceSession(currentSessionId, recordsList);
    onSuccess();
  };

  const presentCount = Object.values(attendanceMap).filter(s => s === 'PRESENT').length;
  const absentCount = Object.values(attendanceMap).filter(s => s === 'ABSENT').length;
  const lateCount = Object.values(attendanceMap).filter(s => s === 'LATE').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Live Attendance Marking</h1>
        <p className="text-slate-500 text-sm mt-0.5">Select class and subject to open an active attendance session.</p>
      </div>

      {!sessionStarted ? (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs max-w-xl mx-auto">
          <form onSubmit={handleStartSession} className="space-y-5">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Initialize Attendance Session</h3>
                <p className="text-xs text-slate-500">Session status will open immediately upon confirmation</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Select Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                {subjects.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.code} — {sub.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Select Class & Section</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>Year {cls.yearNumber} — Section {cls.section}</option>
                ))}
              </select>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-900">
              <strong>Note:</strong> Starting this session enables students in the selected class section to register via student portal or allows faculty to mark roll call directly.
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-600/30 transition-colors flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Session Now</span>
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Session Header Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Session Active (OPEN)</span>
                <h3 className="font-bold text-lg text-slate-900">
                  {subjects.find(s => s.id === selectedSubject)?.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 text-xs font-semibold">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg">Present: {presentCount}</span>
                <span className="px-3 py-1 bg-rose-50 text-rose-700 rounded-lg">Absent: {absentCount}</span>
                <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg">Late: {lateCount}</span>
              </div>

              <button
                onClick={handleSubmitAttendance}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 transition-colors flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit & Close Session</span>
              </button>
            </div>
          </div>

          {/* Student Attendance List */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Student Roll Call List ({classStudents.length} Students)</span>
              <span className="text-xs text-slate-400">Click buttons to change status</span>
            </div>

            <div className="divide-y divide-slate-100">
              {classStudents.map((student, index) => {
                const currentStatus = attendanceMap[student.id] || 'PRESENT';
                return (
                  <div key={student.id} className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                    <div className="flex items-center space-x-3">
                      <span className="w-6 text-xs font-mono font-bold text-slate-400">0{index + 1}</span>
                      <img 
                        src={student.profilePhoto} 
                        alt={student.name} 
                        className="w-10 h-10 rounded-full object-cover border border-slate-200" 
                      />
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{student.name}</div>
                        <div className="text-xs font-mono text-indigo-600">{student.rollNumber}</div>
                      </div>
                    </div>

                    {/* Status Toggle Buttons */}
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'PRESENT')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          currentStatus === 'PRESENT'
                            ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'ABSENT')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          currentStatus === 'ABSENT'
                            ? 'bg-rose-600 text-white shadow-xs shadow-rose-600/30'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Absent
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'LATE')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          currentStatus === 'LATE'
                            ? 'bg-amber-500 text-white shadow-xs shadow-amber-500/30'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Late
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
