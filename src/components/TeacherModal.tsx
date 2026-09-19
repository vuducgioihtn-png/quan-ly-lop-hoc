import React, { useState, useEffect } from 'react';
import {
  X,
  UserCheck,
  Mail,
  Phone,
  GraduationCap,
  Sparkles,
  School,
  Check,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff,
  RefreshCw,
  Copy,
  ShieldCheck
} from 'lucide-react';
import { User, ClassRoom } from '../types';

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (teacherData: User, assignedClassIds: string[]) => void;
  classes: ClassRoom[];
  initialTeacher?: User | null;
}

const TEACHER_AVATARS = [
  'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
];

const SPECIALTY_OPTIONS = [
  'Lead ESL Teacher (Trưởng Khối Tiếng Anh)',
  'Native Speaking Specialist (Chuyên Gia Bản Ngữ)',
  'Phonics & Pronunciation Coach (Luyện Âm & Phonics)',
  'Cambridge Starters / Movers Coach (Luyện Thi Chứng Chỉ)',
  'Grammar & Mindmap Mentor (Ngữ Pháp & Tư Duy Từ Vựng)'
];

export const TeacherModal: React.FC<TeacherModalProps> = ({
  isOpen,
  onClose,
  onSave,
  classes,
  initialTeacher
}) => {
  const isEdit = !!initialTeacher;

  const [name, setName] = useState('');
  const [englishName, setEnglishName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('starkids2026');
  const [showPassword, setShowPassword] = useState(false);
  const [copiedCredentials, setCopiedCredentials] = useState(false);
  const [phone, setPhone] = useState('');
  const [levelTitle, setLevelTitle] = useState(SPECIALTY_OPTIONS[0]);
  const [avatar, setAvatar] = useState(TEACHER_AVATARS[0]);
  const [status, setStatus] = useState<'approved' | 'pending' | 'rejected'>('approved');
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTeacher) {
      setName(initialTeacher.name || '');
      setEnglishName(initialTeacher.englishName || '');
      setEmail(initialTeacher.email || '');
      setPassword(initialTeacher.password || 'starkids2026');
      setPhone(initialTeacher.phone || '');
      setLevelTitle(initialTeacher.levelTitle || SPECIALTY_OPTIONS[0]);
      setAvatar(initialTeacher.avatar || TEACHER_AVATARS[0]);
      setStatus(initialTeacher.status || 'approved');

      // Find classes currently assigned to this teacher
      const assigned = classes
        .filter(
          (c) =>
            c.teacherName.includes(initialTeacher.name) ||
            (initialTeacher.englishName && c.teacherName.includes(initialTeacher.englishName))
        )
        .map((c) => c.id);
      setSelectedClassIds(assigned);
    } else {
      setName('');
      setEnglishName('');
      setEmail('');
      setPassword('starkids2026');
      setPhone('');
      setLevelTitle(SPECIALTY_OPTIONS[0]);
      setAvatar(TEACHER_AVATARS[Math.floor(Math.random() * TEACHER_AVATARS.length)]);
      setStatus('approved');
      setSelectedClassIds([]);
    }
    setError(null);
    setCopiedCredentials(false);
  }, [initialTeacher, isOpen, classes]);

  if (!isOpen) return null;

  const toggleClassSelection = (classId: string) => {
    setSelectedClassIds((prev) =>
      prev.includes(classId) ? prev.filter((id) => id !== classId) : [...prev, classId]
    );
  };

  const handleGeneratePassword = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
    let rand = '';
    for (let i = 0; i < 6; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const newPass = `SK@${rand}`;
    setPassword(newPass);
    setShowPassword(true);
  };

  const handleCopyCredentials = () => {
    const text = `Tài khoản giáo viên StarKids:\n- Họ tên: ${name || 'Giáo viên'}\n- Email: ${email || 'Chưa nhập'}\n- Mật khẩu: ${password}\n- Cổng đăng nhập: Chọn vai trò "Giáo viên phụ trách"`;
    navigator.clipboard?.writeText(text);
    setCopiedCredentials(true);
    setTimeout(() => setCopiedCredentials(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Vui lòng nhập họ và tên giáo viên');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Vui lòng nhập email hợp lệ');
      return;
    }
    if (!password.trim() || password.trim().length < 6) {
      setError('Vui lòng cấp mật khẩu đăng nhập (ít nhất 6 ký tự)');
      return;
    }

    const teacherObj: User = {
      id: initialTeacher?.id || `teacher-${Date.now()}`,
      name: name.trim(),
      englishName: englishName.trim() || undefined,
      avatar,
      role: 'teacher',
      email: email.trim().toLowerCase(),
      password: password.trim(),
      phone: phone.trim() || '0912 345 678',
      status,
      registeredAt: initialTeacher?.registeredAt || new Date().toISOString().split('T')[0],
      levelTitle
    };

    onSave(teacherObj, selectedClassIds);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h3 className="text-lg font-black font-heading">
                {isEdit ? 'Chỉnh Sửa Hồ Sơ Giáo Viên' : 'Thêm Mới Giáo Viên Tiếng Anh'}
              </h3>
              <p className="text-xs text-emerald-100">
                {isEdit
                  ? `Cập nhật thông tin và phân công lớp dạy cho ${initialTeacher.name}`
                  : 'Gia nhập đội ngũ sư phạm StarKids English Club'}
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

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Avatar selection */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
              Chọn ảnh đại diện sư phạm:
            </label>
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {TEACHER_AVATARS.map((av, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setAvatar(av)}
                  className={`relative rounded-2xl p-0.5 border-2 transition-all shrink-0 cursor-pointer ${
                    avatar === av ? 'border-emerald-600 ring-2 ring-emerald-400/40 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={av}
                    alt="avatar"
                    className="w-13 h-13 rounded-xl object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {avatar === av && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Name and English Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Họ và tên giáo viên <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Cô Emily (Thu Hương)..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tên tiếng Anh (English Name)
              </label>
              <input
                type="text"
                value={englishName}
                onChange={(e) => setEnglishName(e.target.value)}
                placeholder="VD: Teacher Emily / Teacher Mike..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Email công vụ & Cấp mật khẩu đăng nhập */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email công vụ (Tên đăng nhập) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="giaovien@starkids.edu.vn"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Cấp mật khẩu đăng nhập <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-[10.5px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                    title="Tự động tạo mật khẩu ngẫu nhiên an toàn"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    <span>Tạo mới</span>
                  </button>
                  <span className="text-slate-300 text-[10px]">•</span>
                  <button
                    type="button"
                    onClick={() => {
                      setPassword('starkids2026');
                      setShowPassword(true);
                    }}
                    className="text-[10.5px] font-bold text-slate-500 hover:text-slate-700 hover:underline cursor-pointer"
                    title="Đặt lại mật khẩu mặc định: starkids2026"
                  >
                    Mặc định
                  </button>
                </div>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập hoặc cấp mật khẩu..."
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showPassword ? 'Ẩn mật khẩu' : 'Xem mật khẩu'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Hộp cấp tài khoản & nút sao chép gửi giáo viên */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11.5px] text-emerald-950 font-bold truncate">
                  Cấp quyền truy cập cổng giảng dạy:
                </p>
                <p className="text-[11px] text-emerald-800 truncate">
                  Tài khoản: <strong className="font-mono">{email || 'Chưa nhập email'}</strong> • Mật khẩu: <strong className="font-mono">{password || 'starkids2026'}</strong>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopyCredentials}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-all border cursor-pointer flex items-center gap-1.5 ${
                copiedCredentials
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white hover:bg-emerald-100/70 text-emerald-800 border-emerald-300'
              }`}
            >
              {copiedCredentials ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Đã sao chép</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép gửi GV</span>
                </>
              )}
            </button>
          </div>

          {/* Phone and Specialty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Số điện thoại liên hệ
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912 345 678"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Chức danh / Chuyên môn
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <select
                  value={levelTitle}
                  onChange={(e) => setLevelTitle(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {SPECIALTY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Trạng thái giảng dạy */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Trạng thái giảng dạy
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="approved">🟢 Đang công tác & Giảng dạy</option>
              <option value="pending">🟡 Chờ sắp xếp lịch dạy</option>
              <option value="rejected">🔴 Tạm nghỉ / Nghỉ phép</option>
            </select>
          </div>

          {/* Assigned Classes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                Phân công các lớp giảng dạy ({selectedClassIds.length} lớp đã chọn):
              </label>
              <span className="text-[11px] text-indigo-600 font-bold">
                Tự động cập nhật vào thời khóa biểu lớp
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
              {classes.map((cls) => {
                const isChecked = selectedClassIds.includes(cls.id);
                return (
                  <button
                    type="button"
                    key={cls.id}
                    onClick={() => toggleClassSelection(cls.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-2xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isChecked ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        <School className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black truncate">{cls.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">
                          Khối {cls.grade} • {cls.scheduleDescription}
                        </p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ml-2 ${
                      isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-md shadow-emerald-200 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isEdit ? 'Lưu Thay Đổi' : 'Thêm Giáo Viên'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
