import React, { useState } from 'react';
import {
  Users,
  GraduationCap,
  School,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  UserPlus,
  ShieldCheck,
  TrendingUp,
  Calendar,
  Sparkles,
  Phone,
  Mail,
  Award,
  BookOpen,
  DollarSign,
  Layers,
  ChevronRight,
  AlertCircle,
  Plus,
  Edit3,
  Trash2,
  MessageSquare,
  Send,
  Star,
  UserCheck,
  BadgeCheck,
  Briefcase,
  ShieldAlert
} from 'lucide-react';
import { User, ClassRoom, AttendanceRecord, AppNotification, HomeworkSubmission } from '../types';
import { TeacherModal } from './TeacherModal';
import { DirectMessageTeacherModal } from './DirectMessageTeacherModal';
import { CreateClassModal } from './CreateClassModal';
import { ClassRosterModal } from './ClassRosterModal';
import { StudentDetailModal } from './StudentDetailModal';

interface AdminPortalProps {
  adminUser: User;
  allUsers: User[];
  classes: ClassRoom[];
  attendanceRecords: AttendanceRecord[];
  submissions?: HomeworkSubmission[];
  onApproveStudent: (studentId: string, approved: boolean) => void;
  onCreateClass: (newClass: Omit<ClassRoom, 'id'>, enrolledStudentIds?: string[]) => void;
  onUpdateClass?: (cls: ClassRoom, enrolledStudentIds?: string[]) => void;
  onDeleteClass?: (classId: string) => void;
  onEnrollStudents?: (classId: string, studentIdsToAdd: string[]) => void;
  onRemoveStudentFromClass?: (studentId: string) => void;
  onTransferStudentClass?: (studentId: string, newClassId: string) => void;
  onChangeClassTeacher?: (classId: string, newTeacherName: string) => void;
  onAwardStars?: (studentId: string, starsToAdd: number, reason: string) => void;
  onAddTeacher?: (newTeacher: User, assignedClassIds: string[]) => void;
  onUpdateTeacher?: (updatedTeacher: User, assignedClassIds: string[]) => void;
  onDeleteTeacher?: (teacherId: string) => void;
  onBroadcastNotification: (
    title: string,
    message: string,
    type: 'schedule' | 'homework' | 'attendance' | 'announcement'
  ) => void;
  onOpenCreateClassModal?: () => void;
  activeTab?: 'overview' | 'teachers' | 'approvals' | 'classes' | 'students';
  onTabChange?: (tab: 'overview' | 'teachers' | 'approvals' | 'classes' | 'students') => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  adminUser,
  allUsers,
  classes,
  attendanceRecords,
  submissions = [],
  onApproveStudent,
  onCreateClass,
  onUpdateClass,
  onDeleteClass,
  onEnrollStudents,
  onRemoveStudentFromClass,
  onTransferStudentClass,
  onChangeClassTeacher,
  onAwardStars,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
  onBroadcastNotification,
  onOpenCreateClassModal,
  activeTab: controlledTab,
  onTabChange
}) => {
  const [internalTab, setInternalTab] = useState<'overview' | 'teachers' | 'approvals' | 'classes' | 'students'>('overview');
  const activeTab = controlledTab ?? internalTab;
  const setActiveTab = (tab: 'overview' | 'teachers' | 'approvals' | 'classes' | 'students') => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };
  const [approvalFilter, setApprovalFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchStudent, setSearchStudent] = useState('');
  const [searchTeacher, setSearchTeacher] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
  const [actionToast, setActionToast] = useState<string | null>(null);

  // Class Management States
  const [isCreateClassModalOpen, setIsCreateClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);
  const [selectedClassForRoster, setSelectedClassForRoster] = useState<ClassRoom | null>(null);
  const [classToDelete, setClassToDelete] = useState<ClassRoom | null>(null);
  const [classGradeFilter, setClassGradeFilter] = useState<string | number | 'all'>('all');
  const [classSearch, setClassSearch] = useState('');

  // Student Directory States
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<User | null>(null);
  const [studentDirectorySearch, setStudentDirectorySearch] = useState('');
  const [studentGradeFilter, setStudentGradeFilter] = useState<string | number | 'all'>('all');
  const [studentClassFilter, setStudentClassFilter] = useState<string | 'all'>('all');
  const [studentStatusFilter, setStudentStatusFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [studentSortBy, setStudentSortBy] = useState<'stars' | 'name' | 'grade'>('stars');

  // Teacher Management States
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<User | null>(null);
  const [messagingTeacher, setMessagingTeacher] = useState<User | null>(null);
  const [teacherToDelete, setTeacherToDelete] = useState<User | null>(null);
  const [teacherStatusFilter, setTeacherStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [teacherSpecialtyFilter, setTeacherSpecialtyFilter] = useState<'all' | 'native' | 'lead' | 'phonics'>('all');

  // Stats calculation
  const allStudents = allUsers.filter((u) => u.role === 'student');
  const pendingStudents = allStudents.filter((u) => u.status === 'pending');
  const approvedStudents = allStudents.filter((u) => u.status === 'approved');
  const allTeachers = allUsers.filter((u) => u.role === 'teacher');
  const allParents = allUsers.filter((u) => u.role === 'parent');

  // Attendance rate today
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendanceRecords.filter((a) => a.date === todayStr);
  const presentToday = todayAttendance.filter((a) => a.status === 'present' || a.status === 'late').length;
  const attendanceRateToday = todayAttendance.length > 0
    ? Math.round((presentToday / todayAttendance.length) * 100)
    : 96;

  // Grade breakdown
  const gradeDistribution = [1, 2, 3, 4, 5].map((gr) => {
    const count = approvedStudents.filter((s) => s.grade === gr).length;
    return { grade: gr, count, label: `Khối ${gr}` };
  });

  const showToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 4000);
  };

  const handleApprove = (student: User) => {
    onApproveStudent(student.id, true);
    showToast(`✅ Đã phê duyệt hồ sơ và cộng 20 Sao chào mừng cho bé ${student.englishName || student.name}!`);
  };

  const handleReject = (student: User) => {
    onApproveStudent(student.id, false);
    showToast(`❌ Đã từ chối đơn đăng ký của bé ${student.name}.`);
  };

  // Teacher Handlers
  const handleSaveNewTeacher = (newTeacher: User, assignedClassIds: string[]) => {
    onAddTeacher?.(newTeacher, assignedClassIds);
    showToast(`✅ Đã thêm giáo viên ${newTeacher.name} và phân công ${assignedClassIds.length} lớp học thành công!`);
  };

  const handleSaveEditTeacher = (updatedTeacher: User, assignedClassIds: string[]) => {
    onUpdateTeacher?.(updatedTeacher, assignedClassIds);
    showToast(`✅ Đã cập nhật thông tin & phân công lớp cho ${updatedTeacher.name}!`);
  };

  const handleConfirmDeleteTeacher = () => {
    if (!teacherToDelete) return;
    onDeleteTeacher?.(teacherToDelete.id);
    showToast(`🗑️ Đã xóa giáo viên ${teacherToDelete.name} khỏi hệ thống.`);
    setTeacherToDelete(null);
  };

  const handleSendTeacherMessage = (teacherName: string, title: string, message: string) => {
    onBroadcastNotification(
      `💬 Lời nhắn từ Ban Giám Hiệu gửi ${teacherName}: ${title}`,
      message,
      'announcement'
    );
    showToast(`📨 Đã gửi trực tiếp lời nhắn chỉ đạo tới giáo viên ${teacherName}!`);
  };

  // Filtered pending / student list
  const filteredStudents = allStudents.filter((s) => {
    if (approvalFilter !== 'all' && s.status !== approvalFilter) return false;
    if (selectedGrade !== 'all' && s.grade !== selectedGrade) return false;
    if (searchStudent.trim()) {
      const q = searchStudent.toLowerCase();
      const matchName = (s.name || '').toLowerCase().includes(q);
      const matchEng = (s.englishName || '').toLowerCase().includes(q);
      const matchParent = (s.parentName || '').toLowerCase().includes(q);
      const matchPhone = (s.parentPhone || s.phone || '').includes(q);
      if (!matchName && !matchEng && !matchParent && !matchPhone) return false;
    }
    return true;
  });

  // Filtered teachers list
  const filteredTeachers = allTeachers.filter((t) => {
    if (teacherStatusFilter !== 'all' && t.status !== teacherStatusFilter) return false;
    if (teacherSpecialtyFilter !== 'all') {
      const title = (t.levelTitle || '').toLowerCase();
      if (teacherSpecialtyFilter === 'lead' && !title.includes('lead') && !title.includes('trưởng')) return false;
      if (teacherSpecialtyFilter === 'native' && !title.includes('native') && !title.includes('bản ngữ')) return false;
      if (teacherSpecialtyFilter === 'phonics' && !title.includes('phonics') && !title.includes('phát âm')) return false;
    }
    if (searchTeacher.trim()) {
      const q = searchTeacher.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        (t.englishName || '').toLowerCase().includes(q) ||
        (t.email || '').toLowerCase().includes(q) ||
        (t.phone || '').includes(q) ||
        (t.levelTitle || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Toast alert */}
      {actionToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-top-4">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{actionToast}</span>
        </div>
      )}

      {/* Admin Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <img
              src={adminUser.avatar}
              alt={adminUser.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-4 border-white/20 shadow-md ring-4 ring-indigo-400/30"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider mb-2 border border-emerald-400/30">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Ban Giám Hiệu & Quản Trị Hệ Thống
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
                {adminUser.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Quản lý toàn diện học sinh, đội ngũ giáo viên và các lớp học StarKids English Club
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => {
                onBroadcastNotification(
                  '📢 Thông báo chung từ Ban Giám Hiệu',
                  'StarKids phát động tuần lễ thi đua nói Tiếng Anh và đổi quà thưởng sao vàng cho tất cả các khối lớp!',
                  'announcement'
                );
                showToast('📢 Đã gửi thông báo từ Ban Giám Hiệu đến toàn thể học sinh & phụ huynh!');
              }}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Phát Động Toàn Trường</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'overview', label: '📊 Thống Kê Sĩ Số Toàn Trường' },
          { id: 'teachers', label: '👩‍🏫 Quản Trị Đội Ngũ Giáo Viên', count: allTeachers.length },
          { id: 'approvals', label: '👤 Duyệt Đơn Đăng Ký Học', count: pendingStudents.length, alert: pendingStudents.length > 0 },
          { id: 'classes', label: '🏫 Quản Lý Các Lớp Học', count: classes.length },
          { id: 'students', label: '🎓 Danh Sách Học Sinh', count: allStudents.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-md scale-102 ring-2 ring-indigo-500/40'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  tab.alert
                    ? 'bg-rose-500 text-white animate-pulse'
                    : activeTab === tab.id
                    ? 'bg-indigo-700 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: THỐNG KÊ SĨ SỐ TOÀN TRƯỜNG */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 4 Big KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Tổng Sĩ Số Học Viên
                </span>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                  <GraduationCap className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 font-heading">
                  {approvedStudents.length}
                </span>
                <span className="text-xs text-slate-400 font-semibold">em đang học</span>
              </div>
              <div className="mt-2 text-xs text-emerald-600 font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+{pendingStudents.length} đơn đang chờ duyệt</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Tỷ Lệ Chuyên Cần
                </span>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-600 font-heading">
                  {attendanceRateToday}%
                </span>
                <span className="text-xs text-slate-400 font-semibold">hôm nay</span>
              </div>
              <div className="mt-2 text-xs text-slate-500 font-medium">
                Dựa trên điểm danh {classes.length} lớp học
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Lớp Học Đang Mở
                </span>
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-black">
                  <School className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 font-heading">
                  {classes.length}
                </span>
                <span className="text-xs text-slate-400 font-semibold">lớp (Khối 1 - 5)</span>
              </div>
              <div className="mt-2 text-xs text-sky-600 font-bold">
                100% phòng học trang bị máy chiếu
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Đội Ngũ Giáo Viên
                </span>
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 font-heading">
                  {allTeachers.length}
                </span>
                <span className="text-xs text-slate-400 font-semibold">thầy cô</span>
              </div>
              <div className="mt-2 text-xs text-purple-600 font-bold">
                Giáo viên bản ngữ & cử nhân sư phạm
              </div>
            </div>
          </div>

          {/* Sĩ số phân bổ theo Khối Lớp 1 - 5 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-800 text-lg font-heading">
                  Phân Bổ Sĩ Số Học Sinh Theo Khối Lớp (Lớp 1 - 5)
                </h3>
                <p className="text-xs text-slate-500">
                  Thống kê học sinh chính thức đang theo học các cấp độ Starters, Movers, Flyers
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
                ⭐ StarKids Tiểu Học
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
              {gradeDistribution.map((gd) => {
                const percentage = approvedStudents.length > 0 ? Math.round((gd.count / approvedStudents.length) * 100) : 20;
                return (
                  <div
                    key={gd.grade}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-800 text-sm">
                        Khối {gd.grade}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-black">
                        {percentage}%
                      </span>
                    </div>
                    <div className="text-2xl font-black text-indigo-700">
                      {gd.count} <span className="text-xs font-medium text-slate-500">học sinh</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all"
                        style={{ width: `${Math.max(10, percentage)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Class Occupancy Overview */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-800 text-lg font-heading">
                Tình Hình Sĩ Số & Lịch Dạy Các Lớp Học
              </h3>
              <button
                onClick={() => setActiveTab('classes')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Xem chi tiết & Mở lớp</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.map((cls) => {
                const studentsInClass = approvedStudents.filter((s) => s.classId === cls.id);
                return (
                  <div
                    key={cls.id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 text-indigo-900 font-black text-xs">
                        Khối {cls.grade}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {cls.roomNumber}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-base">{cls.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Giáo viên: <strong className="text-slate-700">{cls.teacherName}</strong>
                      </p>
                      <p className="text-xs text-slate-500">
                        Lịch: <span className="font-semibold text-slate-700">{cls.scheduleDescription}</span>
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Sĩ số hiện tại:</span>
                      <span className="font-black text-slate-800 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                        {studentsInClass.length} học sinh
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: QUẢN TRỊ GIÁO VIÊN */}
      {activeTab === 'teachers' && (
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-1.5 border border-emerald-200">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span>Đội Ngũ Giảng Dạy & Sư Phạm</span>
              </div>
              <h3 className="font-black text-slate-900 text-xl font-heading">
                Quản Trị Đội Ngũ Giáo Viên & Phân Công Giảng Dạy
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Theo dõi hồ sơ chuyên môn, phân công lớp học, gửi thông điệp và giám sát hiệu suất giảng dạy
              </p>
            </div>

            <button
              onClick={() => setIsAddTeacherOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-200 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Thêm Giáo Viên Mới</span>
            </button>
          </div>

          {/* Teacher Stats KPI row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Tổng Giáo Viên
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                  {allTeachers.length}
                </span>
                <span className="text-xs text-slate-500 font-semibold">thầy cô</span>
              </div>
              <p className="mt-1 text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>100% đạt chuẩn sư phạm quốc tế</span>
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Đang Giảng Dạy
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-emerald-600 font-heading">
                  {allTeachers.filter((t) => t.status === 'approved').length}
                </span>
                <span className="text-xs text-slate-500 font-semibold">đang đứng lớp</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500 font-medium">
                {allTeachers.filter((t) => t.status === 'pending').length} chờ sắp xếp lịch
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Giáo Viên Bản Ngữ
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-purple-600 font-heading">
                  {allTeachers.filter((t) => (t.levelTitle || '').toLowerCase().includes('native') || t.name.toLowerCase().includes('michael') || t.name.toLowerCase().includes('david')).length}
                </span>
                <span className="text-xs text-slate-500 font-semibold">chuyên gia</span>
              </div>
              <p className="mt-1 text-[11px] text-purple-600 font-bold">
                Phụ trách phát âm & giao tiếp
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Độ Bao Phủ Lớp Học
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-indigo-600 font-heading">
                  {classes.filter((c) => c.teacherName && !c.teacherName.includes('Đang xếp')).length}/{classes.length}
                </span>
                <span className="text-xs text-slate-500 font-semibold">lớp có GV</span>
              </div>
              <p className="mt-1 text-[11px] text-indigo-600 font-bold">
                Đảm bảo sĩ số chuẩn 10-15 bé/lớp
              </p>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Tìm theo tên giáo viên, email, số điện thoại hoặc chuyên môn..."
                value={searchTeacher}
                onChange={(e) => setSearchTeacher(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar shrink-0">
              {[
                { id: 'all', label: `Tất cả (${allTeachers.length})` },
                { id: 'approved', label: `🟢 Đang công tác (${allTeachers.filter((t) => t.status === 'approved').length})` },
                { id: 'pending', label: `🟡 Chờ xếp lớp (${allTeachers.filter((t) => t.status === 'pending').length})` },
                { id: 'rejected', label: `🔴 Tạm nghỉ (${allTeachers.filter((t) => t.status === 'rejected').length})` }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setTeacherStatusFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    teacherStatusFilter === f.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Teachers Cards Grid */}
          {filteredTeachers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredTeachers.map((teacher) => {
                const assignedClasses = classes.filter(
                  (c) =>
                    c.teacherName.includes(teacher.name) ||
                    (teacher.englishName && c.teacherName.includes(teacher.englishName)) ||
                    teacher.name.includes(c.teacherName.split(' ')[0])
                );
                const studentsUnderTeacher = approvedStudents.filter((s) =>
                  assignedClasses.some((c) => c.id === s.classId)
                );

                return (
                  <div
                    key={teacher.id}
                    className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group"
                  >
                    <div>
                      {/* Teacher Card Header */}
                      <div className="flex items-start gap-3.5">
                        <div className="relative shrink-0">
                          <img
                            src={teacher.avatar}
                            alt={teacher.name}
                            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/30 shadow-xs"
                            referrerPolicy="no-referrer"
                          />
                          <span
                            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                              teacher.status === 'approved'
                                ? 'bg-emerald-500'
                                : teacher.status === 'pending'
                                ? 'bg-amber-400'
                                : 'bg-rose-500'
                            }`}
                            title={teacher.status === 'approved' ? 'Đang công tác' : 'Chờ xếp lớp'}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                              Giáo Viên
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">
                              <Star className="w-3 h-3 fill-amber-400" />
                              <span>4.9</span>
                            </span>
                          </div>

                          <h4 className="font-black text-slate-900 text-base leading-snug truncate">
                            {teacher.name}
                          </h4>
                          {teacher.englishName && (
                            <p className="text-xs font-bold text-indigo-600 truncate">
                              ({teacher.englishName})
                            </p>
                          )}
                          <p className="text-[11px] font-semibold text-slate-500 mt-0.5 truncate">
                            {teacher.levelTitle || 'Giáo viên tiếng Anh'}
                          </p>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate font-medium">{teacher.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-semibold text-slate-700">{teacher.phone || '0912 345 678'}</span>
                        </div>
                      </div>

                      {/* Assigned Classes */}
                      <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                            Lớp Phụ Trách ({assignedClasses.length}):
                          </span>
                          <button
                            onClick={() => setEditingTeacher(teacher)}
                            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                          >
                            + Phân công
                          </button>
                        </div>

                        {assignedClasses.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                            {assignedClasses.map((cls) => (
                              <span
                                key={cls.id}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-bold text-[11px] transition-colors"
                              >
                                {cls.name} <span className="text-slate-400">({cls.roomNumber})</span>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="p-2 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-800 text-xs flex items-center justify-between">
                            <span className="text-[11px] font-semibold">Chưa có lớp giảng dạy</span>
                            <button
                              onClick={() => setEditingTeacher(teacher)}
                              className="px-2 py-0.5 bg-amber-600 text-white rounded-md text-[10px] font-bold hover:bg-amber-700 cursor-pointer"
                            >
                              Gán lớp ngay
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Performance summary pill */}
                      <div className="mt-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-around text-center text-xs">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400">Sĩ số phụ trách</p>
                          <p className="font-black text-slate-800">{studentsUnderTeacher.length} học sinh</p>
                        </div>
                        <div className="w-px h-6 bg-slate-200" />
                        <div>
                          <p className="text-[10px] font-bold text-slate-400">Trạng thái</p>
                          <p className={`font-black text-[11px] ${
                            teacher.status === 'approved' ? 'text-emerald-600' : 'text-amber-600'
                          }`}>
                            {teacher.status === 'approved' ? 'Đang công tác' : 'Chờ sắp lịch'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons Toolbar */}
                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => setEditingTeacher(teacher)}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Chỉnh sửa thông tin & phân công lớp"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Sửa & Phân Công</span>
                      </button>

                      <button
                        onClick={() => setMessagingTeacher(teacher)}
                        className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        title="Gửi chỉ đạo chuyên môn trực tiếp"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="hidden sm:inline">Nhắn Tin</span>
                      </button>

                      <button
                        onClick={() => setTeacherToDelete(teacher)}
                        className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-500 font-bold text-xs transition-colors cursor-pointer"
                        title="Xóa hoặc ngừng công tác"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="font-black text-slate-800 text-base">Không tìm thấy giáo viên phù hợp</h4>
              <p className="text-xs text-slate-500">
                Thử thay đổi từ khóa tìm kiếm hoặc bấm để đặt lại bộ lọc
              </p>
              <button
                onClick={() => {
                  setSearchTeacher('');
                  setTeacherStatusFilter('all');
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer hover:bg-slate-800"
              >
                Đặt Lại Bộ Lọc
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DUYỆT ĐƠN ĐĂNG KÝ HỌC */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-1.5 border border-amber-200">
                <UserPlus className="w-3.5 h-3.5 text-amber-600" />
                <span>Tuyển Sinh & Phê Duyệt Hồ Sơ</span>
              </div>
              <h3 className="font-black text-slate-800 text-xl font-heading">
                Hồ Sơ Học Sinh Mới Đăng Ký ({pendingStudents.length} đơn chờ duyệt)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kiểm tra thông tin phụ huynh, nguyện vọng khối lớp và duyệt vào danh sách học sinh chính thức
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
              {[
                { id: 'pending', label: '⏳ Chờ Duyệt', count: pendingStudents.length },
                { id: 'approved', label: '✓ Đã Duyệt', count: approvedStudents.length },
                { id: 'all', label: 'Tất Cả', count: allStudents.length }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setApprovalFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    approvalFilter === f.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {f.label} ({f.count})
                </button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Tìm học sinh theo tên, tên tiếng Anh, tên phụ huynh, SĐT..."
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700"
              >
                <option value="all">Tất cả khối lớp</option>
                <option value="1">Khối 1 (Starters)</option>
                <option value="2">Khối 2 (Starters)</option>
                <option value="3">Khối 3 (Movers)</option>
                <option value="4">Khối 4 (Movers/Flyers)</option>
                <option value="5">Khối 5 (Flyers)</option>
              </select>
            </div>
          </div>

          {/* Student Approval List */}
          {filteredStudents.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-xs space-y-2">
              <div className="text-4xl">🎉</div>
              <h4 className="font-black text-slate-800 text-base">
                Không có hồ sơ nào cần xử lý
              </h4>
              <p className="text-xs text-slate-500">
                Tất cả đơn đăng ký tuyển sinh của học sinh đã được phê duyệt đầy đủ.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredStudents.map((stu) => {
                const assignedClass = classes.find((c) => c.id === stu.classId);
                const isPending = stu.status === 'pending';
                const isApproved = stu.status === 'approved';

                return (
                  <div
                    key={stu.id}
                    className={`bg-white rounded-3xl p-5 border-2 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isPending
                        ? 'border-amber-300 bg-amber-50/20'
                        : isApproved
                        ? 'border-slate-200'
                        : 'border-rose-200 bg-rose-50/20'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={stu.avatar}
                        alt={stu.name}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-slate-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-slate-800 text-base sm:text-lg">
                            {stu.englishName ? `${stu.englishName} (${stu.name})` : stu.name}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 text-indigo-900 font-black text-xs">
                            Khối {stu.grade || 3}
                          </span>
                          {isPending && (
                            <span className="px-2.5 py-0.5 rounded-lg bg-amber-200 text-amber-900 font-black text-xs animate-pulse">
                              ⏳ Chờ Duyệt Hồ Sơ
                            </span>
                          )}
                          {isApproved && (
                            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs">
                              ✓ Học Sinh Chính Thức
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-600 font-medium flex items-center gap-3 flex-wrap">
                          <span>Phụ huynh: <strong className="text-slate-800">{stu.parentName || 'Chưa cập nhật'}</strong></span>
                          <span>•</span>
                          <span>SĐT: <strong className="text-slate-800">{stu.parentPhone || stu.phone || '0988 123 456'}</strong></span>
                          <span>•</span>
                          <span>Ngày nộp đơn: {stu.registeredAt}</span>
                        </div>

                        <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-0.5">
                          <School className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Lớp học chỉ định: <strong>{assignedClass?.name || `Lớp Tiếng Anh Khối ${stu.grade}`}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      {isPending ? (
                        <>
                          <button
                            onClick={() => handleReject(stu)}
                            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-bold text-xs transition-colors cursor-pointer"
                          >
                            Từ Chối
                          </button>
                          <button
                            onClick={() => handleApprove(stu)}
                            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-98 cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Duyệt & Xếp Lớp (+20⭐)</span>
                          </button>
                        </>
                      ) : (
                        <div className="text-right">
                          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Đã duyệt nhập học
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: QUẢN LÝ CÁC LỚP HỌC */}
      {activeTab === 'classes' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-slate-800 text-xl font-heading flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-indigo-600" />
                <span>Hệ Thống {classes.length} Lớp Học Tại StarKids</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tạo lớp học, phân công giáo viên giảng dạy và quản lý danh sách học sinh theo từng lớp
              </p>
            </div>

            <button
              onClick={() => {
                setEditingClass(null);
                setIsCreateClassModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-indigo-200 transition-all active:scale-98 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Mở Lớp Học Mới</span>
            </button>
          </div>

          {/* Class Grade Filters & Search */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-xs font-bold text-slate-400 mr-1 shrink-0">Lọc khối:</span>
              <button
                onClick={() => setClassGradeFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  classGradeFilter === 'all'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                Tất cả ({classes.length})
              </button>
              {[1, 2, 3, 4, 5].map((g) => (
                <button
                  key={g}
                  onClick={() => setClassGradeFilter(g)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    classGradeFilter === g
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  Khối {g}
                </button>
              ))}
              {/* Custom Grade tags if any */}
              {Array.from(new Set(classes.map((c) => c.gradeLabel).filter(Boolean)))
                .filter(
                  (lbl) =>
                    !['Khối Lớp 1', 'Khối Lớp 2', 'Khối Lớp 3', 'Khối Lớp 4', 'Khối Lớp 5'].includes(
                      lbl as string
                    )
                )
                .map((lbl) => (
                  <button
                    key={lbl as string}
                    onClick={() => setClassGradeFilter(lbl as string)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                      classGradeFilter === lbl
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200'
                    }`}
                  >
                    ✨ {lbl}
                  </button>
                ))}
            </div>

            <div className="relative min-w-[200px] sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={classSearch}
                onChange={(e) => setClassSearch(e.target.value)}
                placeholder="Tìm lớp học, giáo viên, phòng..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {classes
              .filter((cls) => {
                if (classGradeFilter !== 'all') {
                  const matchNum = cls.grade === classGradeFilter;
                  const matchLabel = cls.gradeLabel === classGradeFilter;
                  if (!matchNum && !matchLabel) return false;
                }
                if (classSearch.trim()) {
                  const q = classSearch.toLowerCase();
                  return (
                    cls.name.toLowerCase().includes(q) ||
                    cls.teacherName.toLowerCase().includes(q) ||
                    cls.roomNumber.toLowerCase().includes(q) ||
                    cls.scheduleDescription.toLowerCase().includes(q) ||
                    (cls.gradeLabel || '').toLowerCase().includes(q)
                  );
                }
                return true;
              })
              .map((cls) => {
              const classStudents = allStudents.filter((s) => s.classId === cls.id);
              const teacherObj = allTeachers.find(
                (t) => t.name.toLowerCase().includes(cls.teacherName.toLowerCase()) || cls.teacherName.toLowerCase().includes(t.name.toLowerCase())
              );

              return (
                <div
                  key={cls.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-100 font-black text-xs">
                        {cls.gradeLabel || (typeof cls.grade === 'number' ? `Khối Lớp ${cls.grade}` : cls.grade)}
                      </span>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {cls.roomNumber}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-black text-slate-900 text-lg leading-snug">{cls.name}</h4>
                      <div className="flex items-center gap-2.5 mt-2.5 p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                        <img
                          src={teacherObj?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cls.teacherName)}`}
                          alt={cls.teacherName}
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] text-slate-400 font-semibold">Giáo viên phụ trách</p>
                          <p className="font-black text-slate-800 text-xs truncate">{cls.teacherName}</p>
                        </div>
                      </div>

                      <div className="space-y-1 mt-2.5 text-xs text-slate-600">
                        <p className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span>Lịch học: <strong className="text-indigo-800">{cls.scheduleDescription}</strong></span>
                        </p>
                        <p className="flex items-center gap-1.5 text-slate-500">
                          <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Giáo trình: <strong>{cls.currentUnit}</strong></span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Sĩ số lớp:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-indigo-900 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-lg">
                          {classStudents.length} / 15 học sinh
                        </span>
                      </div>
                    </div>

                    {/* Mini student avatars stack */}
                    {classStudents.length > 0 ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center -space-x-2 overflow-hidden py-1">
                          {classStudents.slice(0, 5).map((stu) => (
                            <img
                              key={stu.id}
                              src={stu.avatar}
                              alt={stu.name}
                              title={`${stu.name} (${stu.englishName || ''})`}
                              className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover shadow-xs"
                              referrerPolicy="no-referrer"
                            />
                          ))}
                          {classStudents.length > 5 && (
                            <span className="inline-flex items-center justify-center h-7 w-7 rounded-full ring-2 ring-white bg-slate-200 text-slate-700 text-[10px] font-black">
                              +{classStudents.length - 5}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-bold">
                          {Math.round((classStudents.length / 15) * 100)}% đầy lớp
                        </span>
                      </div>
                    ) : (
                      <p className="text-[11px] text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                        Lớp chưa có học sinh. Bấm xếp học sinh để thêm vào lớp!
                      </p>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => setSelectedClassForRoster(cls)}
                        className="flex-1 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Xem Danh Sách & Xếp Học Sinh</span>
                      </button>

                      <button
                        onClick={() => setEditingClass(cls)}
                        title="Chỉnh sửa thông tin lớp"
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setClassToDelete(cls)}
                        title="Xóa lớp học"
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Quick Add Class Card */}
            <button
              onClick={() => {
                setEditingClass(null);
                setIsCreateClassModalOpen(true);
              }}
              className="bg-slate-50/80 hover:bg-indigo-50/40 rounded-3xl p-6 border-2 border-dashed border-slate-300 hover:border-indigo-400 transition-all flex flex-col items-center justify-center gap-3 text-center cursor-pointer min-h-[260px] group"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all flex items-center justify-center font-black shadow-xs">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-slate-800 group-hover:text-indigo-700 text-base transition-colors">
                  + Mở Thêm Lớp Học Mới
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-[220px]">
                  Thiết lập phòng học, phân công giáo viên và xếp học sinh vào lớp ngay
                </p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: DANH SÁCH & HỒ SƠ THÔNG TIN HỌC SINH */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          {/* Top Banner & Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-slate-800 text-xl font-heading flex items-center gap-2">
                <Users className="w-6 h-6 text-indigo-600" />
                <span>Hồ Sơ & Danh Sách Học Sinh Toàn Trường</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kiểm tra thông tin chi tiết, liên hệ phụ huynh, quá trình điểm danh, sao thưởng và phân lớp học cho từng học sinh
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  setEditingClass(null);
                  setIsCreateClassModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Mở Lớp Học Mới</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span>Tổng Học Sinh</span>
                <Users className="w-4 h-4 text-indigo-500" />
              </div>
              <p className="text-2xl font-black text-slate-900 mt-1.5">{allStudents.length}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Toàn bộ hồ sơ trên hệ thống</p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span>Đã Phân Lớp</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-black text-emerald-600 mt-1.5">
                {allStudents.filter((s) => s.classId).length}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Học sinh đang có lớp cố định</p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span>Chưa Phân Lớp</span>
                <AlertCircle className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-black text-amber-600 mt-1.5">
                {allStudents.filter((s) => !s.classId).length}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Cần xếp lớp sớm</p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span>Tổng Sao Vàng</span>
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              </div>
              <p className="text-2xl font-black text-amber-700 mt-1.5">
                {allStudents.reduce((sum, s) => sum + (s.stars || 0), 0)} ⭐
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Khen thưởng tích lũy</p>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={studentDirectorySearch}
                  onChange={(e) => setStudentDirectorySearch(e.target.value)}
                  placeholder="Tìm học sinh theo tên, tên tiếng Anh, mã số, phụ huynh, SĐT, email..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Grade filter */}
                <select
                  value={studentGradeFilter}
                  onChange={(e) =>
                    setStudentGradeFilter(
                      e.target.value === 'all'
                        ? 'all'
                        : isNaN(Number(e.target.value))
                        ? e.target.value
                        : Number(e.target.value)
                    )
                  }
                  className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="all">Tất cả các khối</option>
                  {[1, 2, 3, 4, 5].map((g) => (
                    <option key={g} value={g}>
                      Khối Lớp {g}
                    </option>
                  ))}
                  {Array.from(new Set(classes.map((c) => c.gradeLabel).filter(Boolean)))
                    .filter(
                      (lbl) =>
                        !['Khối Lớp 1', 'Khối Lớp 2', 'Khối Lớp 3', 'Khối Lớp 4', 'Khối Lớp 5'].includes(
                          lbl as string
                        )
                    )
                    .map((lbl) => (
                      <option key={lbl as string} value={lbl as string}>
                        ✨ {lbl}
                      </option>
                    ))}
                </select>

                {/* Class filter */}
                <select
                  value={studentClassFilter}
                  onChange={(e) => setStudentClassFilter(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="all">Tất cả lớp học</option>
                  <option value="unassigned">⚠️ Chưa phân lớp</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.roomNumber})</option>
                  ))}
                </select>

                {/* Status filter */}
                <select
                  value={studentStatusFilter}
                  onChange={(e) => setStudentStatusFilter(e.target.value as any)}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="approved">Đang theo học</option>
                  <option value="pending">Chờ phê duyệt</option>
                </select>

                {/* Sort by */}
                <select
                  value={studentSortBy}
                  onChange={(e) => setStudentSortBy(e.target.value as any)}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="stars">⭐ Sao thưởng cao nhất</option>
                  <option value="name">Tên học sinh (A-Z)</option>
                  <option value="grade">Khối lớp (1-5)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Student Directory Grid */}
          {(() => {
            const filteredStudents = allStudents.filter((stu) => {
              if (studentGradeFilter !== 'all') {
                const stuClass = classes.find((c) => c.id === stu.classId);
                const matchesNum = stu.grade === studentGradeFilter;
                const matchesLabel =
                  stu.gradeLabel === studentGradeFilter ||
                  (stuClass && (stuClass.gradeLabel === studentGradeFilter || stuClass.grade === studentGradeFilter));
                if (!matchesNum && !matchesLabel) return false;
              }
              if (studentStatusFilter !== 'all' && (stu.status || 'approved') !== studentStatusFilter) return false;
              if (studentClassFilter === 'unassigned' && stu.classId) return false;
              if (studentClassFilter !== 'all' && studentClassFilter !== 'unassigned' && stu.classId !== studentClassFilter) return false;

              if (studentDirectorySearch.trim()) {
                const q = studentDirectorySearch.toLowerCase();
                const matchName = stu.name.toLowerCase().includes(q);
                const matchEng = (stu.englishName || '').toLowerCase().includes(q);
                const matchParent = (stu.parentName || '').toLowerCase().includes(q);
                const matchPhone = (stu.parentPhone || '').includes(q);
                const matchEmail = (stu.email || '').toLowerCase().includes(q);
                const matchId = (stu.id || '').toLowerCase().includes(q);
                if (!matchName && !matchEng && !matchParent && !matchPhone && !matchEmail && !matchId) {
                  return false;
                }
              }
              return true;
            });

            // Sorting
            filteredStudents.sort((a, b) => {
              if (studentSortBy === 'stars') {
                return (b.stars || 0) - (a.stars || 0);
              } else if (studentSortBy === 'name') {
                return a.name.localeCompare(b.name, 'vi');
              } else if (studentSortBy === 'grade') {
                const gradeA = typeof a.grade === 'number' ? a.grade : parseInt(String(a.grade), 10) || 0;
                const gradeB = typeof b.grade === 'number' ? b.grade : parseInt(String(b.grade), 10) || 0;
                return gradeA - gradeB;
              }
              return 0;
            });

            if (filteredStudents.length === 0) {
              return (
                <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-slate-800 text-base">Không tìm thấy học sinh phù hợp</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Thử thay đổi từ khóa tìm kiếm hoặc bỏ các bộ lọc khối lớp, lớp học để xem đầy đủ danh sách học sinh.
                  </p>
                  <button
                    onClick={() => {
                      setStudentDirectorySearch('');
                      setStudentGradeFilter('all');
                      setStudentClassFilter('all');
                      setStudentStatusFilter('all');
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs hover:bg-indigo-100 cursor-pointer"
                  >
                    Xóa Tất Cả Bộ Lọc
                  </button>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStudents.map((student) => {
                  const studentClass = classes.find((c) => c.id === student.classId);
                  const stuRecords = attendanceRecords.filter((r) => r.studentId === student.id);
                  const presentCount = stuRecords.filter((r) => r.status === 'present' || r.status === 'late').length;
                  const attRate = stuRecords.length > 0 ? Math.round((presentCount / stuRecords.length) * 100) : 96;

                  return (
                    <div
                      key={student.id}
                      className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                    >
                      {/* Top profile banner */}
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              <img
                                src={student.avatar}
                                alt={student.name}
                                className="w-13 h-13 rounded-2xl object-cover ring-2 ring-slate-100 shadow-xs"
                                referrerPolicy="no-referrer"
                              />
                              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-indigo-600 text-white font-black text-[10px]">
                                {studentClass?.gradeLabel || (typeof student.grade === 'number' ? `Lớp ${student.grade}` : student.grade || 'Lớp 1')}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className="font-black text-slate-900 text-base leading-tight">
                                  {student.name}
                                </h4>
                                {student.englishName && (
                                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-extrabold text-[11px]">
                                    {student.englishName}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                                #{student.id.toUpperCase()}
                              </p>
                            </div>
                          </div>

                          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black shrink-0 ${
                            student.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {student.status === 'pending' ? 'Chờ duyệt' : 'Đang học'}
                          </span>
                        </div>

                        {/* Assigned Class info */}
                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400 font-semibold">Lớp học hiện tại:</span>
                            {studentClass ? (
                              <span className="font-black text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-lg">
                                {studentClass.name}
                              </span>
                            ) : (
                              <span className="font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Chưa xếp lớp
                              </span>
                            )}
                          </div>

                          {studentClass && (
                            <p className="text-[11px] text-slate-500 truncate">
                              Giáo viên: <strong>{studentClass.teacherName}</strong> • Phòng <strong>{studentClass.roomNumber}</strong>
                            </p>
                          )}
                        </div>

                        {/* Parent & Contact info */}
                        <div className="space-y-1 text-xs text-slate-600">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Phụ huynh:</span>
                            <strong className="text-slate-800">{student.parentName || 'Chưa cập nhật'}</strong>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Số điện thoại:</span>
                            <a
                              href={`tel:${student.parentPhone || student.phone}`}
                              className="font-bold text-indigo-600 hover:underline flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{student.parentPhone || student.phone || '090-xxx-xxxx'}</span>
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Performance Bar & Actions */}
                      <div className="pt-3 border-t border-slate-100 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="text-amber-500 font-black flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              <span>{student.stars || 0} Sao</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-xl">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Chuyên cần: {attRate}%</span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedStudentForDetail(student)}
                            className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all active:scale-98"
                          >
                            <GraduationCap className="w-4 h-4" />
                            <span>Xem Chi Tiết Hồ Sơ</span>
                          </button>

                          {studentClass ? (
                            <button
                              onClick={() => setSelectedClassForRoster(studentClass)}
                              title="Xem danh sách lớp của học sinh này"
                              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all cursor-pointer"
                            >
                              <Users className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingClass(null);
                                setIsCreateClassModalOpen(true);
                              }}
                              title="Xếp học sinh này vào lớp mới"
                              className="px-2.5 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-black text-xs transition-all cursor-pointer whitespace-nowrap"
                            >
                              + Xếp lớp
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* MODAL: Thêm Giáo Viên Mới */}
      {isAddTeacherOpen && (
        <TeacherModal
          isOpen={isAddTeacherOpen}
          onClose={() => setIsAddTeacherOpen(false)}
          onSave={handleSaveNewTeacher}
          classes={classes}
        />
      )}

      {/* MODAL: Chỉnh Sửa & Phân Công Lớp Cho Giáo Viên */}
      {editingTeacher && (
        <TeacherModal
          isOpen={!!editingTeacher}
          onClose={() => setEditingTeacher(null)}
          onSave={handleSaveEditTeacher}
          classes={classes}
          initialTeacher={editingTeacher}
        />
      )}

      {/* MODAL: Gửi Lời Nhắn Trực Tiếp Tới Giáo Viên */}
      {messagingTeacher && (
        <DirectMessageTeacherModal
          isOpen={!!messagingTeacher}
          onClose={() => setMessagingTeacher(null)}
          teacher={messagingTeacher}
          onSend={handleSendTeacherMessage}
        />
      )}

      {/* MODAL: Xác Nhận Xóa Giáo Viên */}
      {teacherToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-base font-heading">
                  Xác nhận ngừng công tác
                </h4>
                <p className="text-xs text-slate-500">
                  Xóa giáo viên khỏi hệ thống giảng dạy
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <img
                src={teacherToDelete.avatar}
                alt={teacherToDelete.name}
                className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0 flex-1">
                <p className="font-black text-slate-800 text-sm truncate">{teacherToDelete.name}</p>
                <p className="text-xs text-indigo-600 font-semibold truncate">{teacherToDelete.levelTitle}</p>
                <p className="text-[11px] text-slate-400 truncate">{teacherToDelete.email}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-1">
              <p className="font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                Lưu ý quan trọng:
              </p>
              <p className="text-[11px] leading-relaxed text-amber-700">
                Các lớp học đang do giáo viên này phụ trách sẽ được chuyển về trạng thái <strong>"Đang xếp giáo viên"</strong> để Ban Giám Hiệu phân công thầy cô thay thế.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setTeacherToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteTeacher}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md shadow-rose-200 cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xác Nhận Xóa</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Mở Lớp Mới / Chỉnh Sửa Lớp Học */}
      {(isCreateClassModalOpen || editingClass) && (
        <CreateClassModal
          isOpen={isCreateClassModalOpen || !!editingClass}
          onClose={() => {
            setIsCreateClassModalOpen(false);
            setEditingClass(null);
          }}
          onCreateClass={(newClassData, enrolledStudentIds) => {
            if (editingClass) {
              onUpdateClass?.({ ...editingClass, ...newClassData }, enrolledStudentIds);
              showToast(`✅ Đã cập nhật thành công thông tin lớp ${newClassData.name}!`);
            } else {
              onCreateClass(newClassData, enrolledStudentIds);
              showToast(
                `🎉 Đã mở thành công lớp học mới ${newClassData.name} với ${enrolledStudentIds?.length || 0} học sinh được xếp vào lớp!`
              );
            }
            setIsCreateClassModalOpen(false);
            setEditingClass(null);
          }}
          teachers={allTeachers}
          allStudents={allStudents}
          initialClass={editingClass || undefined}
        />
      )}

      {/* MODAL: Quản Lý Sĩ Số & Xếp Học Sinh Vào Lớp */}
      {selectedClassForRoster && (
        <ClassRosterModal
          isOpen={!!selectedClassForRoster}
          onClose={() => setSelectedClassForRoster(null)}
          classroom={selectedClassForRoster}
          allStudents={allStudents}
          allTeachers={allTeachers}
          allClasses={classes}
          attendanceRecords={attendanceRecords}
          onEnrollStudents={(classId: string, studentIds: string[]) => {
            onEnrollStudents?.(classId, studentIds);
            showToast(`✅ Đã xếp thành công ${studentIds.length} học sinh vào lớp!`);
          }}
          onRemoveStudentFromClass={(studentId) => {
            onRemoveStudentFromClass?.(studentId);
            showToast(`🗑️ Đã rút học sinh khỏi danh sách lớp.`);
          }}
          onTransferStudent={(studentId, newClassId) => {
            onTransferStudentClass?.(studentId, newClassId);
            showToast(`🔄 Đã điều chuyển học sinh sang lớp mới!`);
          }}
          onChangeTeacher={(classId, newTeacherName) => {
            onChangeClassTeacher?.(classId, newTeacherName);
            showToast(`👩‍🏫 Đã đổi giáo viên phụ trách sang ${newTeacherName}!`);
          }}
          onViewStudentDetail={(student) => {
            setSelectedStudentForDetail(student);
          }}
        />
      )}

      {/* MODAL: Chi Tiết Hồ Sơ & Học Vụ Học Sinh */}
      {selectedStudentForDetail && (
        <StudentDetailModal
          isOpen={!!selectedStudentForDetail}
          onClose={() => setSelectedStudentForDetail(null)}
          student={selectedStudentForDetail}
          classes={classes}
          attendanceRecords={attendanceRecords}
          submissions={submissions}
          onAwardStars={(studentId, stars, reason) => {
            onAwardStars?.(studentId, stars, reason);
            showToast(`⭐ Đã thưởng +${stars} sao cho học sinh!`);
            setSelectedStudentForDetail((prev) =>
              prev && prev.id === studentId ? { ...prev, stars: (prev.stars || 0) + stars } : prev
            );
          }}
          onTransferClass={(studentId, newClassId) => {
            onTransferStudentClass?.(studentId, newClassId);
            showToast(`🔄 Đã chuyển lớp học cho học sinh thành công!`);
            setSelectedStudentForDetail((prev) =>
              prev && prev.id === studentId ? { ...prev, classId: newClassId } : prev
            );
          }}
        />
      )}

      {/* MODAL: Xác Nhận Xóa Lớp Học */}
      {classToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-base font-heading">
                  Xác nhận đóng lớp học
                </h4>
                <p className="text-xs text-slate-500">
                  Xóa lớp {classToDelete.name} khỏi hệ thống
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <p className="font-black text-slate-800 text-sm">{classToDelete.name}</p>
              <p className="text-xs text-indigo-600 font-semibold">Phụ trách: {classToDelete.teacherName} • {classToDelete.roomNumber}</p>
              <p className="text-[11px] text-slate-400">{classToDelete.scheduleDescription}</p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-1">
              <p className="font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                Lưu ý:
              </p>
              <p className="text-[11px] leading-relaxed text-amber-700">
                Các học sinh thuộc lớp này sẽ được chuyển về trạng thái <strong>"Chưa xếp lớp"</strong> để Ban Giám Hiệu điều chuyển vào các lớp phù hợp khác.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setClassToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  if (classToDelete) {
                    onDeleteClass?.(classToDelete.id);
                    showToast(`🗑️ Đã xóa lớp học ${classToDelete.name}.`);
                    setClassToDelete(null);
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md shadow-rose-200 cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xác Nhận Xóa</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
