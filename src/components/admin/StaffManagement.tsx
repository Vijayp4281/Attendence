import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck, Plus, Trash2, Mail, Phone, Building, X, BookOpen } from 'lucide-react';

export default function StaffManagement() {
  const { staff, departments, subjects, addStaff, deleteStaff } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || '');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !username || !password) return;

    const staffData = {
      id: `staff-${Date.now()}`,
      name,
      email,
      departmentId,
      phone: phone || '+91 94433 00000',
      profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
      assignedSubjectIds: [subjects[0]?.id || 'sub-1'],
      assignedClassIds: ['cls-1'],
      username,
      password
    };

    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(staffData)
      });
      const data = await res.json();
      if (!data.success) {
        console.warn('MySQL staff save warning:', data.error);
      }
    } catch (err) {
      console.warn('Failed to save staff to Aiven MySQL, saved locally:', err);
    }

    addStaff(staffData);

    setName('');
    setEmail('');
    setPhone('');
    setUsername('');
    setPassword('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Staff & Faculty Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Assign faculty members to departments and subjects, with SQL cloud credentials.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center space-x-2 shadow-md shadow-indigo-600/30 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Faculty Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map(member => {
          const dept = departments.find(d => d.id === member.departmentId);
          const memberSubjects = subjects.filter(s => member.assignedSubjectIds.includes(s.id));

          return (
            <div key={member.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-base shadow-xs">
                      {member.name.split(' ').pop()?.[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{member.name}</h3>
                      <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700">
                        {dept?.name || 'Computer Science'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteStaff(member.id)}
                    className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{member.phone}</span>
                  </div>
                  {member.username && (
                    <div className="flex items-center space-x-2 font-mono text-indigo-600 bg-indigo-50/50 px-2 py-1 rounded-lg">
                      <span>Username: {member.username}</span>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Assigned Subjects</span>
                  <div className="flex flex-wrap gap-1.5">
                    {memberSubjects.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">No subjects assigned</span>
                    ) : (
                      memberSubjects.map(sub => (
                        <span key={sub.id} className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                          {sub.code}: {sub.name}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Status: <strong className="text-emerald-600">Active</strong></span>
                <span className="font-semibold text-indigo-600">ID: {member.id}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Add Faculty Member & Credentials</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Subburaj"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="subburaj@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Department</label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 94433..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Username (Login)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. subburaj"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30"
                >
                  Save Faculty & Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
