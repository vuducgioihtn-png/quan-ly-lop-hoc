import React, { useState } from 'react';
import { X, Bell, Calendar, BookOpen, CheckCircle, Award, Sparkles, CheckCheck } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onSendTestReminder: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onSendTestReminder
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  if (!isOpen) return null;

  const filtered = notifications.filter((n) => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'schedule':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'homework':
        return <BookOpen className="w-5 h-5 text-amber-600" />;
      case 'attendance':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'award':
        return <Award className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-black font-heading">
                Thông Báo & Nhắc Nhở Tự Động
              </h3>
              <p className="text-[11px] text-slate-400">
                Lịch học, điểm danh tức thì, kết quả bài tập & vinh danh
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'schedule', label: 'Lịch học' },
              { id: 'attendance', label: 'Điểm danh' },
              { id: 'homework', label: 'Bài tập' },
              { id: 'award', label: 'Vinh danh' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  filterType === tab.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={onMarkAllRead}
            className="text-[11px] font-bold text-amber-600 hover:text-amber-700 whitespace-nowrap flex items-center gap-1 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Đã đọc hết
          </button>
        </div>

        {/* Notifications list */}
        <div className="p-4 overflow-y-auto flex-1 divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs font-semibold">
              Không có thông báo nào trong mục này.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className={`py-3.5 px-2 flex items-start gap-3 rounded-2xl transition-colors ${
                  !item.read ? 'bg-amber-50/50' : 'hover:bg-slate-50'
                }`}
              >
                <div className="p-2 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-black text-slate-800 truncate">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {item.createdAt}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {item.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer simulation button */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onSendTestReminder}
            className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Gửi thông báo nhắc lịch học mẫu
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
