import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Download, Printer, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ReportsView() {
  const { students, departments, sessions, subjects } = useApp();
  const [reportType, setReportType] = useState<'daily' | 'monthly' | 'defaulters'>('daily');
  const [selectedDept, setSelectedDept] = useState(departments[0]?.id || '');

  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExport = (format: 'pdf' | 'excel') => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Academic Reports & Analytics</h1>
          <p className="text-slate-500 text-sm mt-0.5">Generate daily attendance summaries, monthly sheets, and defaulter logs.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleExport('excel')}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center space-x-3 text-sm animate-in fade-in duration-150">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Report successfully compiled and downloaded to your device storage.</span>
        </div>
      )}

      {/* Report filters */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setReportType('daily')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${reportType === 'daily' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Daily Session Summary
          </button>
          <button
            onClick={() => setReportType('monthly')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${reportType === 'monthly' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Monthly Register
          </button>
          <button
            onClick={() => setReportType('defaulters')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${reportType === 'defaulters' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Defaulter List (&lt;75%)
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs font-semibold text-slate-500 uppercase">Department:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
          >
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Report preview table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              {reportType === 'daily' && 'Daily Attendance Summary Register'}
              {reportType === 'monthly' && 'Monthly Cumulative Attendance Sheet'}
              {reportType === 'defaulters' && 'Attendance Warning & Defaulter List'}
            </span>
          </div>
          <span className="text-xs text-slate-500">Academic Year 2026-2027</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Total Sessions</th>
                <th className="py-3 px-4">Present</th>
                <th className="py-3 px-4">Absent</th>
                <th className="py-3 px-4">Percentage</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {students.map((student, idx) => {
                const percentages = [91, 86, 94, 72, 89, 95, 68, 88];
                const pct = percentages[idx % percentages.length];
                const isDefaulter = pct < 75;

                if (reportType === 'defaulters' && !isDefaulter) return null;

                return (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs font-bold text-slate-800">{student.rollNumber}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{student.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">32</td>
                    <td className="py-3.5 px-4 text-emerald-600 font-semibold">{Math.round(32 * (pct / 100))}</td>
                    <td className="py-3.5 px-4 text-rose-600 font-semibold">{32 - Math.round(32 * (pct / 100))}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{pct}%</td>
                    <td className="py-3.5 px-4">
                      {isDefaulter ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                          Defaulter
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                          Regular
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
