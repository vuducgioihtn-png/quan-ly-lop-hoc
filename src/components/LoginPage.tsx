import React, { useState } from 'react';
import {
  Sparkles,
  Crown,
  ShieldCheck,
  GraduationCap,
  Users,
  Lock,
  Mail,
  ArrowRight,
  UserPlus,
  Eye,
  EyeOff,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { User, UserRole } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onOpenRegister: () => void;
  allUsers: User[];
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  onOpenRegister,
  allUsers
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('teacher');
  const [email, setEmail] = useState('emily.teacher@starkids.edu.vn');
  const [password, setPassword] = useState('starkids2026');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Representative user for each role
  const adminUser =
    allUsers.find((u) => u.role === 'admin') ||
    ({
      id: 'admin-1',
      name: 'Quản trị viên (Thầy David)',
      englishName: 'David Admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      role: 'admin',
      email: 'admin@starkids.edu.vn',
      status: 'approved',
      registeredAt: '2025-11-01',
      levelTitle: 'Ban Giám Hiệu'
    } as User);

  const teacherUser =
    allUsers.find((u) => u.role === 'teacher') ||
    ({
      id: 'teacher-1',
      name: 'Cô Emily (Thu Hương)',
      englishName: 'Teacher Emily',
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
      role: 'teacher',
      email: 'emily.teacher@starkids.edu.vn',
      status: 'approved',
      registeredAt: '2026-01-10',
      levelTitle: 'Lead ESL Teacher'
    } as User);

  const studentTommy =
    allUsers.find((u) => u.id === 'stu-1') ||
    allUsers.find((u) => u.role === 'student' && u.status === 'approved') ||
    ({
      id: 'stu-1',
      name: 'Nguyễn Minh Khôi',
      englishName: 'Tommy',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'student',
      email: 'tommy.khoi@gmail.com',
      grade: 3,
      classId: 'class-3',
      stars: 175,
      status: 'approved',
      registeredAt: '2026-02-15'
    } as User);

  const parentUser =
    allUsers.find((u) => u.role === 'parent') ||
    ({
      id: 'parent-1',
      name: 'Chị Nguyễn Thu Hà',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      role: 'parent',
      email: 'thuha.mom@gmail.com',
      studentId: 'stu-1',
      status: 'approved',
      registeredAt: '2026-02-15'
    } as User);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError(null);
    if (role === 'admin') {
      setEmail(adminUser.email);
    } else if (role === 'teacher') {
      setEmail(teacherUser.email);
    } else if (role === 'student') {
      setEmail(studentTommy.email);
    } else if (role === 'parent') {
      setEmail(parentUser.email);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Find user by email or matching role
    const matchedUser = allUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (matchedUser) {
      onLogin(matchedUser);
      return;
    }

    // Fallback to role default
    if (selectedRole === 'admin') onLogin(adminUser);
    else if (selectedRole === 'teacher') onLogin(teacherUser);
    else if (selectedRole === 'student') onLogin(studentTommy);
    else if (selectedRole === 'parent') onLogin(parentUser);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

      {/* Header Branding */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-400 text-white shadow-xl shadow-amber-200 mb-4 ring-4 ring-white">
          <Sparkles className="w-8 h-8 animate-pulse" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight font-heading">
          StarKids<span className="text-amber-500">English</span>
        </h2>
        <p className="mt-2 text-sm text-slate-600 font-medium max-w-sm mx-auto">
          Cổng Đăng Nhập Hệ Thống Quản Lý Dạy & Học Tiếng Anh Khối Tiểu Học (Lớp 1 - 5)
        </p>
      </div>

      {/* Main Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10 px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-200/80">
          {/* Step 1: Role Selector Tabs for Login */}
          <div className="mb-6">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-3 text-center">
              Chọn vai trò đăng nhập của bạn:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* Admin Button */}
              <button
                type="button"
                onClick={() => handleRoleSelect('admin')}
                className={`p-3 rounded-2xl flex flex-col items-center text-center transition-all cursor-pointer border ${
                  selectedRole === 'admin'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-xs ring-2 ring-emerald-400/30'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 ${
                  selectedRole === 'admin' ? 'bg-emerald-500 text-white shadow-xs' : 'bg-white text-emerald-600 border border-slate-200'
                }`}>
                  <Crown className="w-4 h-4" />
                </div>
                <span className="text-xs font-black">Admin</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Ban Giám Hiệu</span>
              </button>

              {/* Teacher Button */}
              <button
                type="button"
                onClick={() => handleRoleSelect('teacher')}
                className={`p-3 rounded-2xl flex flex-col items-center text-center transition-all cursor-pointer border ${
                  selectedRole === 'teacher'
                    ? 'bg-teal-50 border-teal-400 text-teal-950 shadow-xs ring-2 ring-teal-400/30'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 ${
                  selectedRole === 'teacher' ? 'bg-teal-500 text-white shadow-xs' : 'bg-white text-teal-600 border border-slate-200'
                }`}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-black">Giáo Viên</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Cô Emily</span>
              </button>

              {/* Student Button */}
              <button
                type="button"
                onClick={() => handleRoleSelect('student')}
                className={`p-3 rounded-2xl flex flex-col items-center text-center transition-all cursor-pointer border ${
                  selectedRole === 'student'
                    ? 'bg-amber-50 border-amber-400 text-amber-950 shadow-xs ring-2 ring-amber-400/30'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 ${
                  selectedRole === 'student' ? 'bg-amber-500 text-white shadow-xs' : 'bg-white text-amber-600 border border-slate-200'
                }`}>
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="text-xs font-black">Học Sinh</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Bé Tommy</span>
              </button>

              {/* Parent Button */}
              <button
                type="button"
                onClick={() => handleRoleSelect('parent')}
                className={`p-3 rounded-2xl flex flex-col items-center text-center transition-all cursor-pointer border ${
                  selectedRole === 'parent'
                    ? 'bg-purple-50 border-purple-400 text-purple-950 shadow-xs ring-2 ring-purple-400/30'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 ${
                  selectedRole === 'parent' ? 'bg-purple-500 text-white shadow-xs' : 'bg-white text-purple-600 border border-slate-200'
                }`}>
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-xs font-black">Phụ Huynh</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Mẹ Tommy</span>
              </button>
            </div>
          </div>

          {/* Selected Account Preview */}
          <div className="mb-6 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={
                  selectedRole === 'admin'
                    ? adminUser.avatar
                    : selectedRole === 'teacher'
                    ? teacherUser.avatar
                    : selectedRole === 'student'
                    ? studentTommy.avatar
                    : parentUser.avatar
                }
                alt="Avatar"
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-white shadow-xs"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="text-xs font-extrabold text-slate-800">
                  {selectedRole === 'admin'
                    ? adminUser.name
                    : selectedRole === 'teacher'
                    ? teacherUser.name
                    : selectedRole === 'student'
                    ? `${studentTommy.name} (${studentTommy.englishName})`
                    : parentUser.name}
                </p>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>
                    {selectedRole === 'admin' && 'Tài khoản Quản trị viên • Toàn quyền hệ thống'}
                    {selectedRole === 'teacher' && 'Giáo viên phụ trách • Điểm danh, Chấm bài'}
                    {selectedRole === 'student' && 'Học sinh Lớp 3 • Làm bài tập, Tích lũy sao'}
                    {selectedRole === 'parent' && 'Phụ huynh học sinh • Sổ liên lạc, Học phí'}
                  </span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (selectedRole === 'admin') onLogin(adminUser);
                else if (selectedRole === 'teacher') onLogin(teacherUser);
                else if (selectedRole === 'student') onLogin(studentTommy);
                else if (selectedRole === 'parent') onLogin(parentUser);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <span>Vào Ngay</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Standard Login Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email hoặc Tên tài khoản:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 font-medium"
                  placeholder="Nhập email đăng nhập..."
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Mật khẩu:
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Vui lòng liên hệ Văn phòng StarKids hoặc Cô Emily để được cấp lại mật khẩu.');
                  }}
                  className="text-xs text-amber-600 hover:text-amber-700 font-bold"
                >
                  Quên mật khẩu?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 font-medium"
                  placeholder="Nhập mật khẩu..."
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm shadow-md shadow-amber-200 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Đăng Nhập Vào Hệ Thống</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Registration link */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <p className="text-xs text-slate-500 font-medium">
                Chưa có tài khoản học viên tại StarKids?
              </p>
              <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 justify-center sm:justify-start mt-0.5">
                <span>🏛️</span>
                <span>Lớp miễn phí tại Nhà văn hóa Thôn 16</span>
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenRegister}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs font-black text-amber-700 transition-all cursor-pointer shadow-xs"
            >
              <UserPlus className="w-4 h-4 text-amber-600" />
              <span>Đăng ký tuyển sinh & Ký cam kết</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Notes */}
      <div className="mt-8 text-center text-xs text-slate-400">
        © 2026 StarKids English Center • Tiếng Anh Tiểu Học Toàn Diện
      </div>
    </div>
  );
};
