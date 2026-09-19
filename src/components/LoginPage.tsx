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
      password: 'starkids2026',
      status: 'approved',
      registeredAt: '2025-11-01',
      levelTitle: 'Ban Giám Hiệu'
    } as User);

  const allTeacherUsers = allUsers.filter((u) => u.role === 'teacher');
  const allStudentUsers = allUsers.filter((u) => u.role === 'student' && u.status === 'approved');

  // Derive parent accounts: explicit parent users + parent contacts from students
  const parentAccountsList: User[] = [
    ...allUsers.filter((u) => u.role === 'parent'),
    ...allUsers
      .filter(
        (u) =>
          u.role === 'student' &&
          (u.parentName || u.parentEmail || u.parentPhone) &&
          !allUsers.some((p) => p.role === 'parent' && p.studentId === u.id)
      )
      .map((s) => ({
        id: `parent-${s.id}`,
        name: s.parentName || `Phụ huynh em ${s.name}`,
        avatar:
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        role: 'parent' as const,
        email: s.parentEmail || `${(s.englishName || 'parent').toLowerCase()}.parent@gmail.com`,
        phone: s.parentPhone || s.phone || '0988 123 456',
        password: s.parentPassword || 'starkids2026',
        studentId: s.id,
        status: 'approved' as const,
        registeredAt: s.registeredAt
      }))
  ];

  const teacherUser =
    allTeacherUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) ||
    allTeacherUsers[0] ||
    ({
      id: 'teacher-1',
      name: 'Cô Emily (Thu Hương)',
      englishName: 'Teacher Emily',
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
      role: 'teacher',
      email: 'emily.teacher@starkids.edu.vn',
      password: 'starkids2026',
      status: 'approved',
      registeredAt: '2026-01-10',
      levelTitle: 'Lead ESL Teacher'
    } as User);

  const studentTommy =
    allStudentUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) ||
    allStudentUsers.find((u) => u.id === 'stu-1') ||
    allStudentUsers[0] ||
    ({
      id: 'stu-1',
      name: 'Nguyễn Minh Khôi',
      englishName: 'Tommy',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'student',
      email: 'tommy.khoi@gmail.com',
      password: 'starkids2026',
      grade: 3,
      classId: 'class-3',
      stars: 175,
      status: 'approved',
      registeredAt: '2026-02-15'
    } as User);

  const parentUser =
    parentAccountsList.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() ||
        (u.phone && email.replace(/\D/g, '') && u.phone.replace(/\D/g, '') === email.replace(/\D/g, ''))
    ) ||
    parentAccountsList[0] ||
    ({
      id: 'parent-1',
      name: 'Chị Nguyễn Thu Hà',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      role: 'parent',
      email: 'thuha.mom@gmail.com',
      phone: '0988 123 456',
      password: 'starkids2026',
      studentId: 'stu-1',
      status: 'approved',
      registeredAt: '2026-02-15'
    } as User);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError(null);
    if (role === 'admin') {
      setEmail(adminUser.email);
      setPassword(adminUser.password || 'starkids2026');
    } else if (role === 'teacher') {
      setEmail(teacherUser.email);
      setPassword(teacherUser.password || 'starkids2026');
    } else if (role === 'student') {
      setEmail(studentTommy.email);
      setPassword(studentTommy.password || 'starkids2026');
    } else if (role === 'parent') {
      setEmail(parentUser.email);
      setPassword(parentUser.password || 'starkids2026');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const inputClean = email.trim().toLowerCase();
    const phoneClean = email.trim().replace(/\D/g, '');

    // 1. Exact match by role & email or phone or username
    // Also allow students with isAdmin: true to log in when selectedRole is 'admin'
    let matchedUser = allUsers.find((u) => {
      const isRoleAllowed = u.role === selectedRole || (selectedRole === 'admin' && Boolean(u.isAdmin));
      if (!isRoleAllowed) return false;
      const uEmail = (u.email || '').toLowerCase();
      const uPhone = (u.phone || '').replace(/\D/g, '');
      const pPhone = (u.parentPhone || '').replace(/\D/g, '');
      const pEmail = (u.parentEmail || '').toLowerCase();

      if (uEmail === inputClean) return true;
      if (phoneClean.length >= 8 && (uPhone === phoneClean || pPhone === phoneClean)) return true;
      if (pEmail && pEmail === inputClean) return true;
      return false;
    });

    // 2. If logging in as parent, check if a student has matching parent info
    if (!matchedUser && selectedRole === 'parent') {
      const studentWithParent = allUsers.find((u) => {
        if (u.role !== 'student') return false;
        const pEmail = (u.parentEmail || '').toLowerCase();
        const pPhone = (u.parentPhone || u.phone || '').replace(/\D/g, '');
        return pEmail === inputClean || (phoneClean.length >= 8 && pPhone === phoneClean);
      });
      if (studentWithParent) {
        matchedUser = {
          id: `parent-${studentWithParent.id}`,
          name: studentWithParent.parentName || `Phụ huynh em ${studentWithParent.name}`,
          avatar:
            'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          role: 'parent',
          email: studentWithParent.parentEmail || `${studentWithParent.englishName || 'parent'}.parent@gmail.com`,
          phone: studentWithParent.parentPhone || '0988 123 456',
          password: studentWithParent.parentPassword || 'starkids2026',
          studentId: studentWithParent.id,
          status: 'approved',
          registeredAt: studentWithParent.registeredAt
        };
      }
    }

    // 3. General fallback by email
    if (!matchedUser) {
      matchedUser = allUsers.find((u) => {
        if (u.email.toLowerCase() !== inputClean) return false;
        if (selectedRole === 'admin') {
          return u.role === 'admin' || Boolean(u.isAdmin);
        }
        return u.role === selectedRole;
      });
    }

    if (matchedUser) {
      const expectedPassword = matchedUser.password || 'starkids2026';
      if (password.trim() && expectedPassword.trim() !== password.trim()) {
        setError('Mật khẩu không chính xác! Vui lòng kiểm tra lại mật khẩu do Admin cấp.');
        return;
      }
      // If student is logging in under Admin role
      if (selectedRole === 'admin' && matchedUser.role === 'student' && matchedUser.isAdmin) {
        onLogin({
          ...matchedUser,
          role: 'admin',
          levelTitle: matchedUser.adminRoleTitle || 'Học sinh kiêm Admin'
        });
        return;
      }
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

          {/* Student Admin Selector if students have been granted admin privileges */}
          {selectedRole === 'admin' && allUsers.some((u) => u.isAdmin) && (
            <div className="mb-5 p-3.5 bg-purple-50/70 rounded-2xl border border-purple-200/80">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-bold text-purple-950 flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                  <span>Học sinh được cấp đặc quyền Quản trị viên (Admin):</span>
                </label>
                <span className="text-[10px] text-purple-700 font-black">
                  {allUsers.filter((u) => u.isAdmin).length} tài khoản
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {allUsers
                  .filter((u) => u.isAdmin)
                  .map((s) => {
                    const isSelected = email.toLowerCase() === s.email.toLowerCase();
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setEmail(s.email);
                          setPassword(s.password || 'starkids2026');
                          setError(null);
                        }}
                        className={`p-2 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white border-purple-500 text-purple-950 font-bold shadow-xs ring-2 ring-purple-500/20'
                            : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-white'
                        }`}
                      >
                        <img
                          src={s.avatar}
                          alt={s.name}
                          className="w-7 h-7 rounded-lg object-cover ring-1 ring-purple-300 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold truncate leading-tight flex items-center gap-1">
                            <span>{s.name}</span>
                            <Crown className="w-3 h-3 text-amber-500 shrink-0" />
                          </p>
                          <p className="text-[10px] text-purple-700 font-bold truncate">
                            {s.adminRoleTitle || 'Học sinh kiêm Admin'}
                          </p>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Teacher Selector if multiple teachers exist */}
          {selectedRole === 'teacher' && allTeacherUsers.length > 1 && (
            <div className="mb-5 p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200/80">
              <label className="block text-[11px] font-bold text-emerald-900 mb-2">
                Chọn tài khoản giáo viên để thử nghiệm:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {allTeacherUsers.map((t) => {
                  const isSelected = email.toLowerCase() === t.email.toLowerCase();
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setEmail(t.email);
                        setPassword(t.password || 'starkids2026');
                        setError(null);
                      }}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white border-emerald-500 text-emerald-950 font-bold shadow-xs ring-2 ring-emerald-500/20'
                          : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-white'
                      }`}
                    >
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold truncate leading-tight">{t.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{t.email}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Student Selector */}
          {selectedRole === 'student' && allStudentUsers.length > 1 && (
            <div className="mb-5 p-3 bg-amber-50/60 rounded-2xl border border-amber-200/80">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-bold text-amber-950">
                  Chọn học sinh để kiểm tra tài khoản đã cấp:
                </label>
                <span className="text-[10px] text-amber-700 font-semibold">{allStudentUsers.length} học sinh</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {allStudentUsers.map((s) => {
                  const isSelected = email.toLowerCase() === s.email.toLowerCase();
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setEmail(s.email);
                        setPassword(s.password || 'starkids2026');
                        setError(null);
                      }}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white border-amber-500 text-amber-950 font-bold shadow-xs ring-2 ring-amber-500/20'
                          : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-white'
                      }`}
                    >
                      <img
                        src={s.avatar}
                        alt={s.name}
                        className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold truncate leading-tight flex items-center gap-1">
                          <span>{s.englishName || s.name}</span>
                          <span className="text-[10px] text-slate-500 font-normal">({s.name})</span>
                          {s.isAdmin && (
                            <span title="Học sinh có quyền Admin">
                              <Crown className="w-3 h-3 text-amber-500 shrink-0" />
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate font-mono">{s.email}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Parent Selector */}
          {selectedRole === 'parent' && parentAccountsList.length > 1 && (
            <div className="mb-5 p-3 bg-purple-50/60 rounded-2xl border border-purple-200/80">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-bold text-purple-950">
                  Chọn phụ huynh để kiểm tra đăng nhập:
                </label>
                <span className="text-[10px] text-purple-700 font-semibold">{parentAccountsList.length} tài khoản</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {parentAccountsList.map((p) => {
                  const isSelected =
                    email.toLowerCase() === p.email.toLowerCase() ||
                    (p.phone && email.replace(/\D/g, '') && p.phone.replace(/\D/g, '') === email.replace(/\D/g, ''));
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setEmail(p.email);
                        setPassword(p.password || 'starkids2026');
                        setError(null);
                      }}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white border-purple-500 text-purple-950 font-bold shadow-xs ring-2 ring-purple-500/20'
                          : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-white'
                      }`}
                    >
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold truncate leading-tight">{p.name}</p>
                        <p className="text-[10px] text-slate-500 truncate font-mono">
                          {p.phone ? `${p.phone} • ` : ''}{p.email}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Standard Login Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {selectedRole === 'parent'
                  ? 'Email hoặc Số điện thoại Phụ huynh:'
                  : selectedRole === 'student'
                  ? 'Email / Tên đăng nhập của Học sinh:'
                  : selectedRole === 'teacher'
                  ? 'Email Giáo viên:'
                  : 'Email Quản trị viên (Admin):'}
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
                  placeholder={
                    selectedRole === 'parent'
                      ? 'Nhập email hoặc SĐT phụ huynh (VD: 0988 123 456)...'
                      : selectedRole === 'student'
                      ? 'Nhập email học sinh (VD: tommy.khoi@gmail.com)...'
                      : 'Nhập email đăng nhập...'
                  }
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
