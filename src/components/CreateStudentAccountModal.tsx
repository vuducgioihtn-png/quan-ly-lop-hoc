import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Crown,
  Sparkles,
  ShieldCheck,
  Mail,
  KeyRound,
  GraduationCap,
  Heart,
  Eye,
  EyeOff,
  RefreshCw,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { User, ClassRoom } from '../types';
import { SecureSensitiveInput } from './SecureSensitiveInput';

interface CreateStudentAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: ClassRoom[];
  onAddStudent: (
    studentData: User,
    parentData: {
      name: string;
      phone: string;
      email: string;
      password: string;
      citizenId?: string;
    }
  ) => void;
}

export const CreateStudentAccountModal: React.FC<CreateStudentAccountModalProps> = ({
  isOpen,
  onClose,
  classes,
  onAddStudent
}) => {
  // Student Fields
  const [studentName, setStudentName] = useState('');
  const [englishName, setEnglishName] = useState('');
  const [grade, setGrade] = useState<number>(3);
  const [classId, setClassId] = useState<string>(classes[0]?.id || '');
  const [studentCitizenId, setStudentCitizenId] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('starkids2026');
  const [showStudentPassword, setShowStudentPassword] = useState(false);

  // Admin Privilege Option
  const [grantAdmin, setGrantAdmin] = useState(false);
  const [adminRoleTitle, setAdminRoleTitle] = useState('Học sinh kiêm Quản trị viên (Admin)');

  // Parent Fields
  const [parentName, setParentName] = useState('');
  const [parentRelationship, setParentRelationship] = useState('Mẹ');
  const [parentPhone, setParentPhone] = useState('');
  const [parentCitizenId, setParentCitizenId] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPassword, setParentPassword] = useState('starkids2026');
  const [showParentPassword, setShowParentPassword] = useState(false);

  // Status & Success state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdSuccess, setCreatedSuccess] = useState(false);
  const [createdStudent, setCreatedStudent] = useState<User | null>(null);
  const [copiedZalo, setCopiedZalo] = useState(false);

  if (!isOpen) return null;

  const generateRandomPassword = (prefix: string = 'SK') => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
    let rand = '';
    for (let i = 0; i < 5; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${prefix}@${rand}`;
  };

  const handleAutoFillEmail = () => {
    const eng = (englishName || 'stu').trim().toLowerCase().replace(/\s+/g, '');
    const viet = studentName.trim().split(' ').pop()?.toLowerCase() || 'em';
    const rand = Math.floor(100 + Math.random() * 900);
    const stuMail = `${eng}.${viet}${rand}@starkids.edu.vn`;
    setStudentEmail(stuMail);

    if (parentPhone.trim()) {
      setParentEmail(`${eng}.parent${rand}@gmail.com`);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!studentName.trim()) {
      setErrorMessage('Vui lòng nhập họ và tên của học sinh');
      return;
    }
    if (!studentEmail.trim()) {
      setErrorMessage('Vui lòng nhập email đăng nhập của học sinh');
      return;
    }
    if (!studentPassword.trim() || studentPassword.length < 6) {
      setErrorMessage('Mật khẩu học sinh cần có ít nhất 6 ký tự');
      return;
    }
    if (!parentName.trim()) {
      setErrorMessage('Vui lòng nhập họ và tên phụ huynh');
      return;
    }
    if (!parentPhone.trim()) {
      setErrorMessage('Vui lòng nhập số điện thoại phụ huynh');
      return;
    }

    const pEmail =
      parentEmail.trim() ||
      `${(englishName || 'phuhuynh').toLowerCase().replace(/\s+/g, '')}.${parentPhone.replace(/\D/g, '').slice(-4)}@starkids.edu.vn`;

    const newStudentId = `stu-${Date.now().toString().slice(-6)}`;
    const studentAvatar = `https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80`;

    const newStudent: User = {
      id: newStudentId,
      name: studentName.trim(),
      englishName: englishName.trim() || undefined,
      avatar: studentAvatar,
      role: 'student',
      email: studentEmail.trim().toLowerCase(),
      password: studentPassword.trim(),
      phone: parentPhone.trim(),
      grade,
      classId: classId || undefined,
      status: 'approved',
      registeredAt: new Date().toISOString().split('T')[0],
      citizenId: studentCitizenId.trim() || undefined,
      parentName: parentName.trim(),
      parentPhone: parentPhone.trim(),
      parentEmail: pEmail.toLowerCase(),
      parentPassword: parentPassword.trim(),
      parentRelationship,
      parentCitizenId: parentCitizenId.trim() || undefined,
      stars: 50, // Welcome star gift
      isAdmin: grantAdmin,
      adminRoleTitle: grantAdmin ? adminRoleTitle : undefined
    };

    onAddStudent(newStudent, {
      name: parentName.trim(),
      phone: parentPhone.trim(),
      email: pEmail.toLowerCase(),
      password: parentPassword.trim(),
      citizenId: parentCitizenId.trim() || undefined
    });

    setCreatedStudent(newStudent);
    setCreatedSuccess(true);
  };

  const handleCopyZalo = () => {
    if (!createdStudent) return;
    const targetClass = classes.find((c) => c.id === createdStudent.classId);
    const adminNote = createdStudent.isAdmin
      ? `\n\n👑 ĐẶC QUYỀN HỆ THỐNG: Học sinh được cấp thêm quyền QUẢN TRỊ VIÊN (${createdStudent.adminRoleTitle || 'Admin'}). Bé có thể chọn cổng "Quản trị viên (Admin)" để truy cập bảng quản lý hoặc cổng "Học sinh tiểu học" để học bài.`
      : '';

    const text = `🌟 THÔNG TIN TÀI KHOẢN TRUY CẬP HỆ THỐNG STARKIDS ENGLISH 🌟
Kính gửi Quý Phụ huynh em: ${createdStudent.name} ${createdStudent.englishName ? `(${createdStudent.englishName})` : ''} - Lớp: ${targetClass?.name || `Khối Lớp ${createdStudent.grade}`}

Ban Quản Trị StarKids xin gửi thông tin tài khoản đăng nhập hệ thống:

1️⃣ TÀI KHOẢN PHỤ HUYNH (Sổ Liên Lạc Điện Tử):
- Tên đăng nhập: ${createdStudent.parentEmail} (hoặc SĐT: ${createdStudent.parentPhone})
- Mật khẩu: ${createdStudent.parentPassword}
- Cổng đăng nhập: Chọn vai trò "Phụ huynh học sinh"

2️⃣ TÀI KHOẢN HỌC SINH (Dành riêng cho bé):
- Tên đăng nhập: ${createdStudent.email}
- Mật khẩu: ${createdStudent.password}
- Cổng đăng nhập: Chọn vai trò "Học sinh tiểu học"${createdStudent.isAdmin ? ' HOẶC "Quản trị viên (Admin)"' : ''}${adminNote}

Trân trọng cảm ơn Quý Phụ huynh!`;

    navigator.clipboard?.writeText(text);
    setCopiedZalo(true);
    setTimeout(() => setCopiedZalo(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-amber-300 shadow-inner">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg sm:text-xl font-heading tracking-tight">
                  Tạo Tài Khoản Học Sinh Mới
                </h3>
                {grantAdmin && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 font-bold text-[10px] flex items-center gap-1">
                    <Crown className="w-2.5 h-2.5 text-amber-300" />
                    Kèm Quyền Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-purple-200/80 mt-0.5">
                Cấp tài khoản đăng nhập cho học sinh & phụ huynh kèm tùy chọn phân quyền Quản trị viên
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        {createdSuccess && createdStudent ? (
          <div className="p-6 space-y-5 text-center my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-black text-slate-800 font-heading">
                Đã Tạo Tài Khoản Học Sinh Thành Công!
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Học sinh <strong>{createdStudent.name}</strong> ({createdStudent.englishName || 'Học viên'}) đã được thêm vào hệ thống với{' '}
                {createdStudent.isAdmin ? (
                  <span className="text-purple-700 font-bold">đặc quyền Quản trị viên (Admin)</span>
                ) : (
                  <span className="text-indigo-700 font-bold">quyền Học sinh tiêu chuẩn</span>
                )}.
              </p>
            </div>

            {/* Quick credentials card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-lg mx-auto space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-500">Tài khoản học sinh:</span>
                {createdStudent.isAdmin && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black flex items-center gap-1">
                    <Crown className="w-2.5 h-2.5 text-amber-600" />
                    Có quyền Admin
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-slate-400 font-sans block text-[10px]">Tên đăng nhập:</span>
                  <span className="font-bold text-slate-800">{createdStudent.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans block text-[10px]">Mật khẩu:</span>
                  <span className="font-bold text-slate-800">{createdStudent.password}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopyZalo}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
              >
                {copiedZalo ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
                <span>{copiedZalo ? 'Đã Sao Chép Tin Nhắn Zalo' : 'Sao Chép Tin Nhắn Zalo'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm cursor-pointer transition-colors"
              >
                Đóng & Xem Danh Sách
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
            {errorMessage && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* SECTION 1: HỌC SINH */}
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-indigo-100">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-indigo-950">
                    1. Thông Tin Học Sinh
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={handleAutoFillEmail}
                  className="text-[10.5px] font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Gợi ý Email Chuẩn</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Họ và tên học sinh <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="VD: Lê Bảo Nam"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tên Tiếng Anh (English Name)
                  </label>
                  <input
                    type="text"
                    value={englishName}
                    onChange={(e) => setEnglishName(e.target.value)}
                    placeholder="VD: Leo / Alex"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Khối Lớp</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={1}>Khối Lớp 1 (Starters)</option>
                    <option value={2}>Khối Lớp 2 (Starters / Movers)</option>
                    <option value={3}>Khối Lớp 3 (Movers)</option>
                    <option value={4}>Khối Lớp 4 (Movers / Flyers)</option>
                    <option value={5}>Khối Lớp 5 (Flyers)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lớp Học Phân Công</label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">-- Chưa xếp lớp (Xếp sau) --</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.roomNumber}) - GV: {c.teacherName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email / Tên đăng nhập học sinh <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      placeholder="VD: leo.nam@starkids.edu.vn"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Mật khẩu học sinh <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setStudentPassword(generateRandomPassword('SK'));
                        setShowStudentPassword(true);
                      }}
                      className="text-[10px] text-indigo-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      <span>Tạo ngẫu nhiên</span>
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type={showStudentPassword ? 'text' : 'password'}
                      required
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2 text-xs rounded-xl border border-slate-300 bg-white font-mono font-bold focus:ring-2 focus:ring-indigo-500"
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
              </div>

              <SecureSensitiveInput
                label="Mã định danh / CCCD học sinh (Nếu có)"
                value={studentCitizenId}
                onChange={setStudentCitizenId}
                icon="idCard"
                placeholder="001201098765"
                badgeLabel="Mã số học sinh 12 số"
              />

              {/* TOGGLE CẤP ĐẶC QUYỀN ADMIN CHO HỌC SINH */}
              <div
                className={`p-3.5 rounded-2xl border transition-all ${
                  grantAdmin
                    ? 'bg-gradient-to-r from-purple-50 via-amber-50/50 to-indigo-50 border-purple-300 ring-2 ring-purple-400/20'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        grantAdmin ? 'bg-purple-600 text-amber-300 shadow-xs' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      <Crown className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-black text-slate-800">
                          Cấp Quyền Quản Trị Viên (Admin) Cho Học Sinh
                        </span>
                        {grantAdmin && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black flex items-center gap-0.5 shadow-2xs">
                            <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                            Admin Active
                          </span>
                        )}
                      </div>
                      <p className="text-[10.5px] text-slate-500 mt-0.5">
                        {grantAdmin
                          ? 'Học sinh này được phép đăng nhập Cổng Quản Trị Viên (Admin Portal)'
                          : 'Tạo tài khoản học sinh kiêm quyền quản trị hệ thống'}
                      </p>
                    </div>
                  </div>

                  {/* Switch Toggle */}
                  <button
                    type="button"
                    onClick={() => setGrantAdmin(!grantAdmin)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      grantAdmin ? 'bg-purple-600' : 'bg-slate-300'
                    }`}
                    role="switch"
                    aria-checked={grantAdmin}
                    title="Bật/Tắt cấp quyền Admin cho học sinh"
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        grantAdmin ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {grantAdmin && (
                  <div className="mt-3 pt-3 border-t border-purple-200/70 space-y-2 animate-fadeIn">
                    <div>
                      <label className="block text-[11px] font-bold text-purple-950 mb-1">
                        Chức danh Admin hiển thị:
                      </label>
                      <select
                        value={adminRoleTitle}
                        onChange={(e) => setAdminRoleTitle(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-purple-200 bg-white text-xs font-bold text-purple-900 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                      >
                        <option value="Học sinh kiêm Quản trị viên (Admin)">👑 Học sinh kiêm Quản trị viên (Admin)</option>
                        <option value="Trợ giảng kiêm Cán bộ lớp (Admin)">⭐ Trợ giảng kiêm Cán bộ lớp (Admin)</option>
                        <option value="Cán sự Tiếng Anh / Admin Quản Lý">🛡️ Cán sự Tiếng Anh / Admin Quản Lý</option>
                        <option value="Admin Quản trị viên Hệ thống">⚡ Admin Quản trị viên Hệ thống Toàn quyền</option>
                      </select>
                    </div>
                    <p className="text-[10.5px] text-purple-900 bg-purple-100/80 p-2 rounded-xl border border-purple-200">
                      💡 <strong>Ghi chú:</strong> Học sinh có thể chọn đăng nhập tại cổng <strong>"Quản trị viên (Admin)"</strong> để quản lý dữ liệu hoặc cổng <strong>"Học sinh tiểu học"</strong> để vào học.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 2: PHỤ HUYNH */}
            <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3.5">
              <div className="flex items-center gap-2 pb-2 border-b border-purple-100">
                <Heart className="w-4 h-4 text-purple-600" />
                <h4 className="text-xs font-black uppercase tracking-wider text-purple-950">
                  2. Thông Tin Phụ Huynh (Sổ Liên Lạc Điện Tử)
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Họ và tên Phụ huynh <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="VD: Lê Văn Tuấn"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mối quan hệ</label>
                  <select
                    value={parentRelationship}
                    onChange={(e) => setParentRelationship(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Mẹ">Mẹ</option>
                    <option value="Ba">Ba</option>
                    <option value="Người giám hộ">Người giám hộ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SecureSensitiveInput
                  label="Số điện thoại Phụ huynh (Zalo nhận tin)"
                  value={parentPhone}
                  onChange={setParentPhone}
                  icon="phone"
                  placeholder="09xx xxx xxx"
                  required
                  badgeLabel="Bảo mật SĐT"
                />

                <SecureSensitiveInput
                  label="CCCD Phụ huynh (Nếu có)"
                  value={parentCitizenId}
                  onChange={setParentCitizenId}
                  icon="idCard"
                  placeholder="001201xxxxxx"
                  badgeLabel="Định danh 12 số"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Phụ huynh
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      placeholder="VD: tuan.parent@gmail.com"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">Mật khẩu Phụ huynh</label>
                    <button
                      type="button"
                      onClick={() => {
                        setParentPassword(generateRandomPassword('SK'));
                        setShowParentPassword(true);
                      }}
                      className="text-[10px] text-purple-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      <span>Tạo ngẫu nhiên</span>
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type={showParentPassword ? 'text' : 'password'}
                      value={parentPassword}
                      onChange={(e) => setParentPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2 text-xs rounded-xl border border-slate-300 bg-white font-mono font-bold focus:ring-2 focus:ring-purple-500"
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
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Tạo Tài Khoản & Kích Hoạt</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
