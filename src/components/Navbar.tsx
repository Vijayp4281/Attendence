import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, Bell, CheckCircle2, 
  AlertCircle, Info, X, Sparkles 
} from 'lucide-react';

export default function Navbar() {
  const { role, students, staff, activeStudentId, activeStaffId, notifications, markNotificationRead, clearAllNotifications } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const currentStudent = students.find(s => s.id === activeStudentId) || students[0];
  const currentStaff = staff.find(s => s.id === activeStaffId) || staff[0];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 text-lg tracking-tight">CampusAttend</span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                v2.5 Enterprise
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">College Attendance & Academic Management System</p>
          </div>
        </div>

        {/* Center / Right actions */}
        <div className="flex items-center space-x-3 sm:space-x-4">

          {/* Notifications Toggle */}
          <div className="relative">
            <button
              onClick={() => { setShowNotifications(!showNotifications); }}
              className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-xl relative transition-colors"
              title="System Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span className="font-semibold text-sm text-slate-900">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {notifications.length > 0 && (
                      <button 
                        onClick={clearAllNotifications}
                        className="text-xs text-slate-500 hover:text-slate-700 underline"
                      >
                        Clear
                      </button>
                    )}
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-sm text-slate-400">
                      No notifications at this time.
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        onClick={() => markNotificationRead(notif.id)}
                        className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start space-x-3 ${!notif.read ? 'bg-indigo-50/30' : ''}`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {notif.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                          {notif.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-500" />}
                          {notif.type === 'info' && <Info className="w-4 h-4 text-indigo-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-xs font-semibold ${!notif.read ? 'text-slate-900' : 'text-slate-700'}`}>
                              {notif.title}
                            </p>
                            <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{notif.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="hidden md:flex items-center space-x-3 pl-3 border-l border-slate-200">
            {role === 'STUDENT' ? (
              <div className="flex items-center space-x-2.5">
                <img 
                  src={currentStudent.profilePhoto} 
                  alt={currentStudent.name} 
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-xs"
                />
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-800">{currentStudent.name}</div>
                  <div className="text-[10px] text-slate-500">{currentStudent.rollNumber}</div>
                </div>
              </div>
            ) : role === 'STAFF' ? (
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                  {currentStaff.name.split(' ').pop()?.[0]}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-800">{currentStaff.name}</div>
                  <div className="text-[10px] text-slate-500">Faculty Staff</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs">
                  AD
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-800">System Admin</div>
                  <div className="text-[10px] text-slate-500">Administrator</div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
