import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Mail, Phone, Building, CheckCircle2, Shield } from 'lucide-react';

export default function StudentProfile() {
  const { students, activeStudentId, departments } = useApp();
  const currentStudent = students.find(s => s.id === activeStudentId) || students[0];
  const dept = departments.find(d => d.id === currentStudent.departmentId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Digital ID & Profile</h1>
        <p className="text-slate-500 text-sm mt-0.5">Official college identity card and enrolled student record.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xl max-w-xl mx-auto overflow-hidden">
        {/* ID Card Header */}
        <div className="bg-gradient-to-r from-slate-900 to-emerald-950 p-6 text-white text-center relative">
          <div className="absolute top-4 left-4 text-xs font-bold tracking-widest text-emerald-400 uppercase">
            CampusAttend ID
          </div>
          <div className="mt-4">
            <img 
              src={currentStudent.profilePhoto} 
              alt={currentStudent.name} 
              className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-white/20 shadow-xl"
            />
          </div>
          <h2 className="text-xl font-bold mt-3">{currentStudent.name}</h2>
          <p className="text-xs text-emerald-300 font-mono mt-0.5">{currentStudent.rollNumber}</p>
        </div>

        {/* ID Card Body */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50">
              <span className="text-slate-400 font-semibold block uppercase">Department</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{dept?.name || 'Computer Science'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50">
              <span className="text-slate-400 font-semibold block uppercase">Academic Year</span>
              <span className="font-bold text-slate-900 mt-0.5 block">Year II — Section A</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50">
              <span className="text-slate-400 font-semibold block uppercase">Email</span>
              <span className="font-bold text-slate-900 mt-0.5 block truncate">{currentStudent.email}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50">
              <span className="text-slate-400 font-semibold block uppercase">Phone</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{currentStudent.phone}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Identity Verified by Registrar Office</span>
            </div>
            <span className="font-bold">Active Status</span>
          </div>
        </div>
      </div>
    </div>
  );
}
