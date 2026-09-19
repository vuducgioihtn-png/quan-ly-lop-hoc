import React, { useState } from 'react';
import { X, Send, MessageSquare, Sparkles, User, AlertCircle } from 'lucide-react';
import { User as UserType } from '../types';

interface DirectMessageTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: UserType | null;
  onSend: (teacherName: string, title: string, message: string) => void;
}

const MESSAGE_TEMPLATES = [
  {
    title: 'Khen thưởng & Động viên tuần học',
    text: 'Ban Giám Hiệu gửi lời khen ngợi tinh thần giảng dạy nhiệt huyết, lớp học sôi nổi và sự chuẩn bị bài giảng chu đáo của thầy/cô trong tuần qua!'
  },
  {
    title: 'Nhắc nhở cập nhật chấm bài tập & điểm danh',
    text: 'Thầy/cô vui lòng kiểm tra và hoàn thành chấm điểm các bài tập về nhà còn tồn đọng của học sinh trước 18h00 chiều nay nhé.'
  },
  {
    title: 'Triệu tập cuộc họp chuyên môn định kỳ',
    text: 'Kính mời thầy/cô tham dự buổi họp sinh hoạt chuyên môn khối Tiểu học vào lúc 14h00 thứ Sáu tuần này tại Phòng họp 2.'
  },
  {
    title: 'Kế hoạch tổ chức English Festival',
    text: 'Đề nghị thầy/cô chuẩn bị danh sách các tiết mục kịch nghệ và thuyết trình tiếng Anh của học sinh lớp mình cho sự kiện StarKids Festival sắp tới.'
  }
];

export const DirectMessageTeacherModal: React.FC<DirectMessageTeacherModalProps> = ({
  isOpen,
  onClose,
  teacher,
  onSend
}) => {
  const [title, setTitle] = useState(MESSAGE_TEMPLATES[0].title);
  const [message, setMessage] = useState(MESSAGE_TEMPLATES[0].text);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !teacher) return null;

  const handleApplyTemplate = (tmpl: { title: string; text: string }) => {
    setTitle(tmpl.title);
    setMessage(tmpl.text);
    setError(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setError('Vui lòng nhập tiêu đề và nội dung lời nhắn');
      return;
    }
    onSend(teacher.name, title.trim(), message.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-700 to-purple-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <h3 className="text-lg font-black font-heading">
                Gửi Lời Nhắn Đến {teacher.englishName || teacher.name}
              </h3>
              <p className="text-xs text-indigo-200">
                Chỉ đạo sư phạm & thông báo trực tiếp từ Ban Giám Hiệu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Teacher Summary badge */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <img
              src={teacher.avatar}
              alt={teacher.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-400"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <p className="text-xs font-black text-slate-800 truncate">{teacher.name}</p>
              <p className="text-[11px] text-indigo-600 font-semibold truncate">
                {teacher.levelTitle || 'Giáo viên StarKids'} • {teacher.email}
              </p>
            </div>
          </div>

          {/* Quick template suggestions */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
              Mẫu lời nhắn nhanh:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {MESSAGE_TEMPLATES.map((tmpl, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleApplyTemplate(tmpl)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-semibold text-[11px] transition-colors cursor-pointer text-left"
                >
                  ⚡ {tmpl.title}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tiêu đề thông điệp
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Khen thưởng tuần học / Chỉ đạo nghiệp vụ..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Message Body */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nội dung lời nhắn
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập nội dung thông điệp gửi tới giáo viên..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
          </div>

          {/* Footer Action */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md shadow-indigo-200 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Gửi Ngay Tới Giáo Viên</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
