import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, BookOpen, Layers, Plus, Check } from 'lucide-react';

export default function AcademicManagement() {
  const { departments, classes, subjects, addDepartment, addClassRoom, addSubject } = useApp();

  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');

  const [newSubCode, setNewSubCode] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [newSubDept, setNewSubDept] = useState(departments[0]?.id || '');

  const [classYear, setClassYear] = useState(2);
  const [classSection, setClassSection] = useState('A');
  const [classDept, setClassDept] = useState(departments[0]?.id || '');

  const handleDeptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName || !newDeptCode) return;
    addDepartment(newDeptName, newDeptCode);
    setNewDeptName('');
    setNewDeptCode('');
  };

  const handleSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubCode || !newSubName) return;
    addSubject({ code: newSubCode, name: newSubName, departmentId: newSubDept });
    setNewSubCode('');
    setNewSubName('');
  };

  const handleClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addClassRoom({
      departmentId: classDept,
      academicYearId: 'ay-2',
      yearNumber: Number(classYear),
      section: classSection
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Academic Structure Management</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage college departments, course subjects, and class sections.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Departments Panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 mb-4">
              <Building2 className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">Departments</h3>
            </div>

            <div className="space-y-2 mb-6">
              {departments.map(d => (
                <div key={d.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                  <span className="text-sm font-semibold text-slate-800">{d.name}</span>
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-bold">{d.code}</span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleDeptSubmit} className="pt-4 border-t border-slate-100 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Add Department</span>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Department Name"
                value={newDeptName}
                onChange={(e) => setNewDeptName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Code (e.g. EEE)"
                  value={newDeptCode}
                  onChange={(e) => setNewDeptCode(e.target.value)}
                  className="w-28 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase"
                />
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold py-2 transition-colors shadow-xs"
                >
                  Add Dept
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Subjects Panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-emerald-600 mb-4">
              <BookOpen className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">Course Subjects</h3>
            </div>

            <div className="space-y-2 mb-6 max-h-56 overflow-y-auto">
              {subjects.map(s => (
                <div key={s.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                  <div>
                    <div className="text-xs font-bold text-slate-900">{s.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{s.code}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubjectSubmit} className="pt-4 border-t border-slate-100 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Add Subject</span>
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Code"
                  value={newSubCode}
                  onChange={(e) => setNewSubCode(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase"
                />
                <input
                  type="text"
                  placeholder="Subject Name"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  className="col-span-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold py-2 transition-colors shadow-xs"
              >
                Add Subject
              </button>
            </div>
          </form>
        </div>

        {/* Classes Panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-amber-600 mb-4">
              <Layers className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">Class Rooms & Sections</h3>
            </div>

            <div className="space-y-2 mb-6 max-h-56 overflow-y-auto">
              {classes.map(c => {
                const dept = departments.find(d => d.id === c.departmentId);
                return (
                  <div key={c.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                    <span className="text-xs font-bold text-slate-900">Year {c.yearNumber} — Sec {c.section}</span>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-bold">{dept?.code}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleClassSubmit} className="pt-4 border-t border-slate-100 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Add Class Section</span>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={classYear}
                onChange={(e) => setClassYear(Number(e.target.value))}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value={1}>Year 1</option>
                <option value={2}>Year 2</option>
                <option value={3}>Year 3</option>
                <option value={4}>Year 4</option>
              </select>
              <input
                type="text"
                placeholder="Section (A/B)"
                value={classSection}
                onChange={(e) => setClassSection(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold py-2 transition-colors shadow-xs"
            >
              Add Class Section
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
