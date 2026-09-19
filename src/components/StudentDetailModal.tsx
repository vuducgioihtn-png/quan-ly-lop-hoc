import React, { useState } from 'react';
import {
  X,
  User,
  Star,
  School,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  Award,
  BookOpen,
  ArrowRightLeft,
  AlertCircle,
  Plus,
  Send,
  Sparkles,
  FileText,
  Printer,
  Home,
  ShieldCheck,
  KeyRound,
  CreditCard,
  Crown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User as UserType, ClassRoom, AttendanceRecord, HomeworkSubmission } from '../types';
import { CommitmentDocumentModal } from './CommitmentDocumentModal';
import { SecureSensitiveDisplay } from './SecureSensitiveDisplay';

interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: UserType;
  classes: ClassRoom[];
  attendanceRecords: AttendanceRecord[];
  submissions: HomeworkSubmission[];
  onTransferClass?: (studentId: string, newClassId: string) => void;
  onAwardStars?: (studentId: string, starsToAdd: number, reason: string) => void;
  onOpenCredentialsModal?: (student: UserType) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  isOpen,
  onClose,
  student,
  classes,
  attendanceRecords,
  submissions,
  onTransferClass,
  onAwardStars,
  onOpenCredentialsModal
}) => {
  const [selectedNewClassId, setSelectedNewClassId] = useState(student.classId || '');
  const [isTransferring, setIsTransferring] = useState(false);
  const [bonusStars, setBonusStars] = useState(10);
  const [starReason, setStarReason] = useState('Khen thưởng chuyên cần & học tập xuất sắc');
  const [showStarAward, setShowStarAward] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showCommitmentDoc, setShowCommitmentDoc] = useState(false);

  if (!isOpen) return null;

  const assignedClass = classes.find((c) => c.id === student.classId);

  // Student specific records
  const studentAttendance = attendanceRecords.filter((a) => a.studentId === student.id);
  const presentCount = studentAttendance.filter((a) => a.status === 'present').length;
  const lateCount = studentAttendance.filter((a) => a.status === 'late').length;
  const excusedCount = studentAttendance.filter((a) => a.status === 'excused').length;
  const absentCount = studentAttendance.filter((a) => a.status === 'absent').length;
  const attendanceRate =
    studentAttendance.length > 0
      ? Math.round(((presentCount + lateCount * 0.8) / studentAttendance.length) * 100)
      : 100;

  // Student submissions
  const studentSubmissions = submissions.filter((s) => s.studentId === student.id);
  const averageScore =
    studentSubmissions.length > 0
      ? (
          studentSubmissions.reduce((acc, curr) => acc + (curr.score ?? 0), 0) /
          studentSubmissions.length
        ).toFixed(1)
      : '9.0';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleConfirmTransfer = () => {
    if (!selectedNewClassId || selectedNewClassId === student.classId) return;
    onTransferClass?.(student.id, selectedNewClassId);
    const targetClass = classes.find((c) => c.id === selectedNewClassId);
    showToast(`Đã chuyển bé sang lớp ${targetClass?.name || 'mới'} thành công!`);
    setIsTransferring(false);
  };

  const handleGiveStars = () => {
    if (bonusStars <= 0) return;
    onAwardStars?.(student.id, bonusStars, starReason);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    showToast(`Đã tặng +${bonusStars}⭐ sao cho ${student.name}!`);
    setShowStarAward(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 font-heading">
                Hồ Sơ Học Vụ Học Sinh
              </h3>
              <p className="text-xs text-slate-500">
                Mã học sinh: <strong className="text-slate-800">{student.id}</strong> • Khối {student.grade || 3}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toast alert */}
        {toastMessage && (
          <div className="p-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-md flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Student Profile Card Overview */}
        <div className="bg-gradient-to-br from-indigo-50/60 via-purple-50/40 to-white rounded-3xl p-5 border border-indigo-100/80 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative shrink-0">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-md"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black shadow-xs flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-slate-900" />
              <span>{student.stars ?? 120}</span>
            </span>
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-black text-slate-900 text-lg leading-tight truncate">
                {student.name}
              </h4>
              {student.englishName && (
                <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 text-indigo-800 font-black text-xs">
                  {student.englishName}
                </span>
              )}
              {student.isAdmin && (
                <span className="px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs flex items-center gap-1 shadow-xs">
                  <Crown className="w-3 h-3 text-amber-300" />
                  <span>{student.adminRoleTitle || 'Quyền Admin'}</span>
                </span>
              )}
              <span
                className={`px-2.5 py-0.5 rounded-lg text-xs font-black ${
                  student.status === 'approved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : student.status === 'pending'
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {student.status === 'approved'
                  ? '✓ Đang Theo Học'
                  : student.status === 'pending'
                  ? '⏳ Chờ Duyệt Hồ Sơ'
                  : 'Đã Rút Đơn'}
              </span>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Cấp độ: <strong className="text-indigo-600">{student.levelTitle || 'Starters Explorer'}</strong> • Ngày đăng ký: {student.registeredAt}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowStarAward(!showStarAward)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Thưởng Thêm Sao ⭐</span>
              </button>
              <button
                onClick={() => setIsTransferring(!isTransferring)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Chuyển Lớp Học</span>
              </button>
              {onOpenCredentialsModal && (
                <button
                  type="button"
                  onClick={() => onOpenCredentialsModal(student)}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Cấp Quyền & Mật Khẩu</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bonus Stars Panel (conditionally expanded) */}
        {showStarAward && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-600 fill-amber-500" />
                Khen Thưởng & Tặng Sao Động Viên Bé
              </span>
              <button
                onClick={() => setShowStarAward(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Đóng
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-amber-800 mb-1">
                  Số sao muốn tặng
                </label>
                <div className="flex items-center gap-2">
                  {[5, 10, 20, 50].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setBonusStars(val)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
                        bonusStars === val
                          ? 'bg-amber-600 text-white shadow-xs scale-105'
                          : 'bg-white text-amber-900 border border-amber-200'
                      }`}
                    >
                      +{val}⭐
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-amber-800 mb-1">
                  Lý do khen thưởng
                </label>
                <input
                  type="text"
                  value={starReason}
                  onChange={(e) => setStarReason(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-amber-300 bg-white font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={handleGiveStars}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Xác Nhận Tặng +{bonusStars}⭐</span>
              </button>
            </div>
          </div>
        )}

        {/* Transfer Class Panel (conditionally expanded) */}
        {isTransferring && (
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-indigo-900 flex items-center gap-1.5">
                <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
                Điều Chuyển Học Sinh Sang Lớp Mới
              </span>
              <button
                onClick={() => setIsTransferring(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Hủy
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-indigo-800 mb-1">
                Chọn lớp học tiếp nhận bé {student.name}:
              </label>
              <select
                value={selectedNewClassId}
                onChange={(e) => setSelectedNewClassId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-indigo-300 bg-white font-bold text-slate-800"
              >
                <option value="">-- Chưa xếp lớp --</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.gradeLabel || (typeof cls.grade === 'number' ? `Khối ${cls.grade}` : cls.grade)}) - {cls.scheduleDescription} - GV: {cls.teacherName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setIsTransferring(false)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmTransfer}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-sm cursor-pointer"
              >
                Lưu Chuyển Lớp
              </button>
            </div>
          </div>
        )}

        {/* Info Grid: Family Contact & Current Class */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Box 1: Lớp học hiện tại */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
              Thông Tin Lớp Học Phụ Trách
            </span>
            {assignedClass ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 text-sm">{assignedClass.name}</span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                    {assignedClass.gradeLabel || (typeof assignedClass.grade === 'number' ? `Khối ${assignedClass.grade}` : assignedClass.grade)}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Phòng: <strong className="text-slate-800">{assignedClass.roomNumber}</strong>
                </p>
                <p className="text-xs text-slate-600">
                  Lịch học: <strong className="text-indigo-700">{assignedClass.scheduleDescription}</strong>
                </p>
                <p className="text-xs text-slate-600">
                  Giáo viên: <strong className="text-slate-800">{assignedClass.teacherName}</strong>
                </p>
                <p className="text-[11px] text-slate-400">
                  Giáo trình: {assignedClass.currentUnit}
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                <span>Học sinh hiện chưa được phân vào lớp học nào.</span>
                <button
                  onClick={() => setIsTransferring(true)}
                  className="mt-1.5 px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold block cursor-pointer"
                >
                  Xếp lớp ngay
                </button>
              </div>
            )}
          </div>

          {/* Box 2: Thông tin phụ huynh & gia đình */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
              Liên Hệ Phụ Huynh & Gia Đình
            </span>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  Phụ huynh: <strong className="text-slate-800">{student.parentName || 'Chưa cập nhật'}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="flex items-center gap-1.5 flex-wrap">
                  Số điện thoại:
                  <SecureSensitiveDisplay
                    value={student.parentPhone || student.phone || '0988 123 456'}
                    type="phone"
                  />
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="flex items-center gap-1.5 flex-wrap">
                  CCCD / CMND:
                  <SecureSensitiveDisplay
                    value={student.parentCitizenId || student.citizenId || '001201012345'}
                    type="citizenId"
                  />
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">
                  Email: <strong className="text-slate-800">{student.email}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Ngày đăng ký: {student.registeredAt}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Credentials Overview Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/90 to-purple-50/90 border border-indigo-200/80 space-y-3 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-indigo-950">
                  Tài Khoản Đăng Nhập Hệ Thống (Học Sinh & Phụ Huynh)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Cấp quyền truy cập trực tiếp cho bé làm bài tập & phụ huynh theo dõi sổ liên lạc
                </p>
              </div>
            </div>
            {onOpenCredentialsModal && (
              <button
                type="button"
                onClick={() => onOpenCredentialsModal(student)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Cấp / Đổi Mật Khẩu</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-indigo-100 space-y-1 shadow-2xs">
              <span className="text-[10.5px] font-black text-indigo-700 uppercase block">🎒 Cổng Học Sinh (Bé)</span>
              <p className="text-slate-600 truncate">
                Tên đăng nhập: <strong className="font-mono text-slate-900">{student.email}</strong>
              </p>
              <p className="text-slate-600">
                Mật khẩu: <strong className="font-mono text-indigo-700">{student.password || 'starkids2026'}</strong>
              </p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-purple-100 space-y-1 shadow-2xs">
              <span className="text-[10.5px] font-black text-purple-700 uppercase block">👨‍👩‍👧 Cổng Phụ Huynh (Ba/Mẹ)</span>
              <p className="text-slate-600 truncate">
                Tên đăng nhập: <strong className="font-mono text-slate-900">{student.parentEmail || student.parentPhone || student.phone || 'Chưa thiết lập'}</strong>
              </p>
              <p className="text-slate-600">
                Mật khẩu: <strong className="font-mono text-purple-700">{student.parentPassword || 'starkids2026'}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Commitment Status & Cultural House Document */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-black text-slate-900">
                  Cam Kết Cơ Sở Vật Chất Nhà Văn Hóa Thôn 16
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Đã Ký Cam Kết
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Địa chỉ: <strong className="text-slate-800">{student.address || 'Thôn 16, địa phương'}</strong> • Ngày ký: {student.commitmentDate || student.registeredAt}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Người ký: Phụ huynh ({student.parentSignedName || student.parentName || 'Gia đình'}) & Học sinh ({student.studentSignedName || student.name})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowCommitmentDoc(true)}
            className="px-4 py-2 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-300 text-amber-900 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
          >
            <Printer className="w-3.5 h-3.5 text-amber-700" />
            <span>Xem & In Đơn Đăng Ký (A4)</span>
          </button>
        </div>

        {/* Academic Performance KPI Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
              Chuyên Cần
            </span>
            <span className="text-xl font-black text-emerald-800 font-heading">
              {attendanceRate}%
            </span>
            <span className="text-[10px] text-emerald-600 block">
              {presentCount}/{studentAttendance.length || 1} buổi có mặt
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100 text-center">
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
              Sao Thưởng
            </span>
            <span className="text-xl font-black text-amber-800 font-heading flex items-center justify-center gap-0.5">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              {student.stars ?? 120}
            </span>
            <span className="text-[10px] text-amber-600 block">Tích lũy toàn khóa</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-center">
            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
              Bài Tập Đã Nộp
            </span>
            <span className="text-xl font-black text-indigo-800 font-heading">
              {studentSubmissions.length} bài
            </span>
            <span className="text-[10px] text-indigo-600 block">Đã chấm điểm đầy đủ</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100 text-center">
            <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
              Điểm Trung Bình
            </span>
            <span className="text-xl font-black text-purple-800 font-heading">
              {averageScore}/10
            </span>
            <span className="text-[10px] text-purple-600 block">Học lực Giỏi ⭐</span>
          </div>
        </div>

        {/* Attendance History */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Lịch Sử Điểm Danh Gần Nhất ({studentAttendance.length} buổi)
            </span>
          </div>

          {studentAttendance.length > 0 ? (
            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
              {studentAttendance.slice(0, 5).map((att) => (
                <div
                  key={att.id}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-700">{att.date}</span>
                    <span className="text-[11px] text-slate-400">({att.checkInTime || '17:30'})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                        att.status === 'present'
                          ? 'bg-emerald-100 text-emerald-800'
                          : att.status === 'late'
                          ? 'bg-amber-100 text-amber-800'
                          : att.status === 'excused'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {att.status === 'present'
                        ? 'Có mặt'
                        : att.status === 'late'
                        ? 'Đi muộn'
                        : att.status === 'excused'
                        ? 'Nghỉ có phép'
                        : 'Vắng mặt'}
                    </span>
                    {att.note && <span className="text-[11px] text-slate-500 italic">"{att.note}"</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic p-2 bg-slate-50 rounded-xl">
              Chưa có dữ liệu điểm danh riêng của buổi học gần đây.
            </p>
          )}
        </div>

        {/* Footer Close Button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            StarKids English Center • Quản trị dữ liệu học sinh an toàn
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Đóng Hồ Sơ
          </button>
        </div>
      </div>

      {/* Official A4 Commitment Modal */}
      <CommitmentDocumentModal
        isOpen={showCommitmentDoc}
        onClose={() => setShowCommitmentDoc(false)}
        status={student.status}
        studentData={{
          fullName: student.name,
          englishName: student.englishName,
          birthDate: student.birthDate,
          grade: student.grade,
          gradeLabel: assignedClass?.gradeLabel || student.gradeLabel,
          schoolName: student.schoolName,
          parentName: student.parentName || 'Phụ huynh học sinh',
          parentRelationship: student.parentRelationship,
          parentPhone: student.parentPhone || student.phone || '',
          address: student.address || 'Thôn 16, địa phương',
          className: assignedClass ? `${assignedClass.name} (${assignedClass.scheduleDescription})` : undefined,
          commitmentDate: student.commitmentDate || student.registeredAt,
          studentSignedName: student.studentSignedName || student.name,
          parentSignedName: student.parentSignedName || student.parentName,
          locationName: student.locationName || 'Nhà văn hóa Thôn 16',
          policyCategory: student.policyCategory || 'standard',
          operatingFundAmount: student.operatingFundAmount || '50.000',
          sessionsCount: student.sessionsCount || '16',
          academicAbility: student.academicAbility || 'basic',
          subjectName: student.subjectName || 'Tiếng Anh tiểu học & Kỹ năng giao tiếp',
          courseProgram:
            student.courseProgram ||
            (assignedClass ? `Lớp ${assignedClass.name}` : `Chương trình Bổ trợ & Nâng cao Tiếng Anh Lớp ${student.grade || 3}`),
          learningGoal: student.learningGoal || 'Củng cố nền tảng phát âm, tự tin giao tiếp và đạt điểm tốt môn Tiếng Anh',
          preferredSchedule:
            student.preferredSchedule || assignedClass?.scheduleDescription || 'Ca học các ngày trong tuần (17h30 - 19h00)',
          departmentHead: student.departmentHead || 'Tiếng Anh (CLB StarKids - Nhà văn hóa Thôn 16)'
        }}
      />
    </div>
  );
};
