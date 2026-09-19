import React, { useState, useEffect } from 'react';
import {
  X,
  KeyRound,
  ShieldCheck,
  Mail,
  Phone,
  User as UserIcon,
  RefreshCw,
  Copy,
  Check,
  Eye,
  EyeOff,
  AlertCircle,
  GraduationCap,
  Heart,
  Send,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2
} from 'lucide-react';
import { User, ClassRoom } from '../types';

interface AccountCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: User | null;
  assignedClass?: ClassRoom;
  allUsers: User[];
  onSaveCredentials: (
    studentId: string,
    studentData: {
      email: string;
      password: string;
      status: 'approved' | 'pending' | 'rejected';
    },
    parentData: {
      name: string;
      email: string;
      phone: string;
      password: string;
    }
  ) => void;
}

export const AccountCredentialsModal: React.FC<AccountCredentialsModalProps> = ({
  isOpen,
  onClose,
  student,
  assignedClass,
  allUsers,
  onSaveCredentials
}) => {
  // Student Credential States
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('starkids2026');
  const [showStudentPassword, setShowStudentPassword] = useState(false);
  const [studentStatus, setStudentStatus] = useState<'approved' | 'pending' | 'rejected'>('approved');

  // Parent Credential States
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPassword, setParentPassword] = useState('starkids2026');
  const [showParentPassword, setShowParentPassword] = useState(false);

  // UI States
  const [copiedZalo, setCopiedZalo] = useState(false);
  const [copiedStudent, setCopiedStudent] = useState(false);
  const [copiedParent, setCopiedParent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (student && isOpen) {
      // Find parent user linked to student if exists
      const existingParent = allUsers.find(
        (u) => u.role === 'parent' && (u.studentId === student.id || (student.email && u.email === student.parentEmail))
      );

      // Default student email fallback
      const defaultStuEmail =
        student.email ||
        `${student.englishName?.toLowerCase().replace(/\s+/g, '') || 'hocsinh'}.${student.id}@starkids.edu.vn`;

      setStudentEmail(defaultStuEmail);
      setStudentPassword(student.password || 'starkids2026');
      setStudentStatus(student.status || 'approved');

      // Parent details fallback
      const pName = existingParent?.name || student.parentName || `Phụ huynh em ${student.name}`;
      const pPhone = existingParent?.phone || student.parentPhone || student.phone || '0988 123 456';
      const cleanPhoneDigits = pPhone.replace(/\D/g, '');
      const defaultParentEmail =
        existingParent?.email ||
        student.parentEmail ||
        (student.englishName
          ? `${student.englishName.toLowerCase().replace(/\s+/g, '')}.parent@gmail.com`
          : `phuhuynh.${cleanPhoneDigits || student.id}@starkids.edu.vn`);

      setParentName(pName);
      setParentPhone(pPhone);
      setParentEmail(defaultParentEmail);
      setParentPassword(existingParent?.password || student.parentPassword || 'starkids2026');

      setShowStudentPassword(false);
      setShowParentPassword(false);
      setErrorMessage(null);
      setSaveSuccess(false);
      setCopiedZalo(false);
      setCopiedStudent(false);
      setCopiedParent(false);
    }
  }, [student, isOpen, allUsers]);

  if (!isOpen || !student) return null;

  // Generate random safe password
  const generateRandomPassword = (prefix: string = 'SK') => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
    let rand = '';
    for (let i = 0; i < 5; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${prefix}@${rand}`;
  };

  const handleCopyZaloMessage = () => {
    const message = `🌟 THÔNG TIN TÀI KHOẢN TRUY CẬP HỆ THỐNG STARKIDS ENGLISH 🌟
Kính gửi Quý Phụ huynh em: ${student.name} ${student.englishName ? `(${student.englishName})` : ''} - Lớp: ${assignedClass?.name || 'Khối Tiểu Học'}

Ban Giám Hiệu StarKids xin gửi thông tin tài khoản đăng nhập hệ thống học tập & sổ liên lạc điện tử:

1️⃣ TÀI KHOẢN PHỤ HUYNH (Sổ Liên Lạc Điện Tử):
- Mục đích: Theo dõi điểm danh, lịch học, kết quả bài tập, sao thưởng, học phí & liên hệ giáo viên.
- Tên đăng nhập: ${parentEmail} (hoặc SĐT: ${parentPhone})
- Mật khẩu: ${parentPassword}
- Cổng đăng nhập: Chọn vai trò "Phụ huynh học sinh"

2️⃣ TÀI KHOẢN HỌC SINH (Dành riêng cho bé):
- Mục đích: Bé đăng nhập làm bài tập tương tác, luyện từ vựng, nộp bài & tích lũy sao thưởng.
- Tên đăng nhập: ${studentEmail}
- Mật khẩu: ${studentPassword}
- Cổng đăng nhập: Chọn vai trò "Học sinh tiểu học"

Quý Phụ huynh vui lòng bảo mật thông tin và đồng hành cùng con trong suốt khóa học.
Trân trọng cảm ơn Quý Phụ huynh!`;

    navigator.clipboard?.writeText(message);
    setCopiedZalo(true);
    setTimeout(() => setCopiedZalo(false), 3000);
  };

  const handleCopyStudentOnly = () => {
    const text = `Tài khoản Học sinh StarKids:\n- Bé: ${student.name} (${student.englishName || ''})\n- Đăng nhập: ${studentEmail}\n- Mật khẩu: ${studentPassword}\n- Cổng: Học sinh tiểu học`;
    navigator.clipboard?.writeText(text);
    setCopiedStudent(true);
    setTimeout(() => setCopiedStudent(false), 2500);
  };

  const handleCopyParentOnly = () => {
    const text = `Tài khoản Phụ huynh StarKids:\n- Phụ huynh: ${parentName}\n- Đăng nhập: ${parentEmail} (hoặc SĐT: ${parentPhone})\n- Mật khẩu: ${parentPassword}\n- Cổng: Phụ huynh học sinh`;
    navigator.clipboard?.writeText(text);
    setCopiedParent(true);
    setTimeout(() => setCopiedParent(false), 2500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!studentEmail.trim()) {
      setErrorMessage('Vui lòng nhập email / tên đăng nhập của học sinh');
      return;
    }
    if (!studentPassword.trim() || studentPassword.trim().length < 6) {
      setErrorMessage('Mật khẩu học sinh cần có ít nhất 6 ký tự');
      return;
    }
    if (!parentEmail.trim()) {
      setErrorMessage('Vui lòng nhập email đăng nhập của phụ huynh');
      return;
    }
    if (!parentPassword.trim() || parentPassword.trim().length < 6) {
      setErrorMessage('Mật khẩu phụ huynh cần có ít nhất 6 ký tự');
      return;
    }

    onSaveCredentials(
      student.id,
      {
        email: studentEmail.trim().toLowerCase(),
        password: studentPassword.trim(),
        status: studentStatus
      },
      {
        name: parentName.trim() || `Phụ huynh em ${student.name}`,
        email: parentEmail.trim().toLowerCase(),
        phone: parentPhone.trim() || student.parentPhone || '0988 123 456',
        password: parentPassword.trim()
      }
    );

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white flex items-center justify-between shrink-0 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

          <div className="flex items-center gap-3.5 relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-amber-400 shadow-inner">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg sm:text-xl font-heading tracking-tight">
                  Cấp Quyền & Tài Khoản Đăng Nhập
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-[10.5px]">
                  Bảo Mật Hệ Thống
                </span>
              </div>
              <p className="text-xs text-indigo-200/80 mt-0.5">
                Thiết lập tài khoản đăng nhập cho Học sinh & Phụ huynh theo chuẩn phân quyền
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Banner Overview */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-200"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 text-sm">{student.name}</span>
                {student.englishName && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-black text-xs">
                    {student.englishName}
                  </span>
                )}
                <span className="text-[11px] font-mono text-slate-400">#{student.id.toUpperCase()}</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Lớp: <strong className="text-indigo-700">{assignedClass?.name || 'Chưa phân lớp'}</strong> • Khối: {student.grade ? `Lớp ${student.grade}` : 'Tiểu học'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Trạng thái hồ sơ:</span>
            <select
              value={studentStatus}
              onChange={(e) => setStudentStatus(e.target.value as any)}
              className="text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              <option value="approved">🟢 Kích hoạt bình thường</option>
              <option value="pending">🟡 Chờ kích hoạt</option>
              <option value="rejected">🔴 Tạm khóa tài khoản</option>
            </select>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-800 font-bold animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-bold animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Đã lưu và kích hoạt tài khoản thành công cho Học sinh và Phụ huynh!</span>
            </div>
          )}

          {/* Dual Account Configuration Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* CARD 1: STUDENT ACCOUNT */}
            <div className="bg-gradient-to-b from-indigo-50/50 to-white rounded-2xl border-2 border-indigo-100 p-4.5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-indigo-950">
                      Tài Khoản Học Sinh (Bé)
                    </h4>
                    <p className="text-[10.5px] text-slate-500">
                      Dành cho bé làm bài tập, thi đua sao thưởng
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyStudentOnly}
                  className="text-[11px] font-bold text-indigo-700 hover:text-indigo-800 hover:underline flex items-center gap-1 cursor-pointer"
                  title="Sao chép tài khoản học sinh"
                >
                  {copiedStudent ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedStudent ? 'Đã chép' : 'Sao chép'}</span>
                </button>
              </div>

              {/* Student Email / Username */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Email / Tên đăng nhập học sinh <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const eng = (student.englishName || 'stu').toLowerCase().replace(/\s+/g, '');
                      const viet = student.name.split(' ').pop()?.toLowerCase() || 'em';
                      setStudentEmail(`${eng}.${viet}@starkids.edu.vn`);
                    }}
                    className="text-[10px] text-indigo-600 hover:underline font-bold"
                  >
                    Tạo email chuẩn
                  </button>
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="VD: tommy.khoi@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white"
                  />
                </div>
              </div>

              {/* Student Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Mật khẩu học sinh <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setStudentPassword(generateRandomPassword('SK'));
                        setShowStudentPassword(true);
                      }}
                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      <span>Tạo mới</span>
                    </button>
                    <span className="text-slate-300 text-[10px]">•</span>
                    <button
                      type="button"
                      onClick={() => {
                        setStudentPassword('starkids2026');
                        setShowStudentPassword(true);
                      }}
                      className="text-[10px] font-bold text-slate-500 hover:text-slate-700 hover:underline cursor-pointer"
                    >
                      Mặc định
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showStudentPassword ? 'text' : 'password'}
                    required
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)..."
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowStudentPassword(!showStudentPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showStudentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-950 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Bé chọn vai trò <strong>"Học sinh tiểu học"</strong> tại cổng đăng nhập để vào học.</span>
              </div>
            </div>

            {/* CARD 2: PARENT ACCOUNT */}
            <div className="bg-gradient-to-b from-purple-50/50 to-white rounded-2xl border-2 border-purple-100 p-4.5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-purple-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-purple-950">
                      Tài Khoản Phụ Huynh (Ba/Mẹ)
                    </h4>
                    <p className="text-[10.5px] text-slate-500">
                      Sổ liên lạc, điểm danh, nộp học phí, ký đơn
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyParentOnly}
                  className="text-[11px] font-bold text-purple-700 hover:text-purple-800 hover:underline flex items-center gap-1 cursor-pointer"
                  title="Sao chép tài khoản phụ huynh"
                >
                  {copiedParent ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedParent ? 'Đã chép' : 'Sao chép'}</span>
                </button>
              </div>

              {/* Parent Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Họ tên Phụ huynh
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="VD: Chị Nguyễn Thu Hà"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-hidden bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      placeholder="0988 123 456"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-hidden bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Parent Email / Username */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email đăng nhập Phụ huynh <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    placeholder="VD: thuha.mom@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-hidden bg-white"
                  />
                </div>
              </div>

              {/* Parent Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Mật khẩu Phụ huynh <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setParentPassword(generateRandomPassword('SK'));
                        setShowParentPassword(true);
                      }}
                      className="text-[10px] font-bold text-purple-600 hover:text-purple-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      <span>Tạo mới</span>
                    </button>
                    <span className="text-slate-300 text-[10px]">•</span>
                    <button
                      type="button"
                      onClick={() => {
                        setParentPassword('starkids2026');
                        setShowParentPassword(true);
                      }}
                      className="text-[10px] font-bold text-slate-500 hover:text-slate-700 hover:underline cursor-pointer"
                    >
                      Mặc định
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showParentPassword ? 'text' : 'password'}
                    required
                    value={parentPassword}
                    onChange={(e) => setParentPassword(e.target.value)}
                    placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)..."
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-purple-500 focus:outline-hidden bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowParentPassword(!showParentPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showParentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-100 text-[11px] text-purple-950 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>Phụ huynh có thể đăng nhập bằng <strong>Email</strong> hoặc <strong>Số điện thoại</strong>.</span>
              </div>
            </div>
          </div>

          {/* Quick Zalo Copy Box */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-black text-amber-950">
                  Gửi thông tin tài khoản cho Phụ huynh qua Zalo / SMS
                </p>
                <p className="text-[11px] text-amber-800/80 mt-0.5">
                  Tự động soạn sẵn tin nhắn thông báo trang trọng kèm tên đăng nhập và mật khẩu của cả 2 cổng.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyZaloMessage}
              className={`px-4 py-2.5 rounded-xl text-xs font-black shrink-0 transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                copiedZalo
                  ? 'bg-emerald-600 text-white shadow-emerald-200'
                  : 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-200'
              }`}
            >
              {copiedZalo ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Đã sao chép tin nhắn Zalo</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Sao chép tin nhắn Zalo</span>
                </>
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Đóng lại
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md shadow-indigo-200 transition-all flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Lưu & Kích Hoạt Tài Khoản</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
