import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  XCircle,
  FileCheck,
  UserCheck,
  UserX,
  Plus,
  BookOpen,
  Send,
  Sparkles,
  Award,
  Upload,
  Search,
  Filter,
  Users,
  Bell,
  Check,
  Star,
  School,
  Calendar,
  MapPin,
  Trash2,
  ArrowRight,
  User as UserIcon,
  GraduationCap,
  AlertCircle,
  Eye,
  HelpCircle,
  CheckSquare,
  Layers,
  MessageSquare,
  FileText,
  ShieldCheck,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CommitmentDocumentModal } from './CommitmentDocumentModal';
import { SecureSensitiveDisplay } from './SecureSensitiveDisplay';
import {
  User,
  ClassRoom,
  AttendanceRecord,
  AttendanceStatus,
  Homework,
  HomeworkSubmission,
  StudyMaterial,
  AppNotification,
  GradeLevel
} from '../types';
import { CreateClassModal } from './CreateClassModal';

interface TeacherAdminPortalProps {
  teacher: User;
  classes: ClassRoom[];
  allUsers: User[];
  attendanceRecords: AttendanceRecord[];
  homeworkList: Homework[];
  submissions: HomeworkSubmission[];
  materials: StudyMaterial[];
  onSaveAttendance: (records: AttendanceRecord[]) => void;
  onApproveStudent: (studentId: string, approved: boolean | 'approved' | 'rejected' | 'pending') => void;
  onGradeSubmission: (
    subId: string,
    score: number,
    stars: number,
    feedback: string,
    sticker: string
  ) => void;
  onCreateHomework: (newHw: Omit<Homework, 'id'>) => void;
  onCreateMaterial: (newMat: Omit<StudyMaterial, 'id'>) => void;
  onBroadcastNotification: (
    title: string,
    message: string,
    type: 'schedule' | 'homework' | 'attendance' | 'announcement'
  ) => void;
  onCreateClass: (newClass: Omit<ClassRoom, 'id'>) => void;
  onDeleteClass?: (classId: string) => void;
  activeTab?: 'attendance' | 'classes' | 'grading' | 'approvals' | 'materials' | 'broadcast';
  onTabChange?: (tab: 'attendance' | 'classes' | 'grading' | 'approvals' | 'materials' | 'broadcast') => void;
}

export const TeacherAdminPortal: React.FC<TeacherAdminPortalProps> = ({
  teacher,
  classes,
  allUsers,
  attendanceRecords,
  homeworkList,
  submissions,
  materials,
  onSaveAttendance,
  onApproveStudent,
  onGradeSubmission,
  onCreateHomework,
  onCreateMaterial,
  onBroadcastNotification,
  onCreateClass,
  onDeleteClass,
  activeTab: controlledTab,
  onTabChange
}) => {
  const [internalTab, setInternalTab] = useState<'attendance' | 'classes' | 'grading' | 'approvals' | 'materials' | 'broadcast'>('attendance');
  const activeTab = controlledTab ?? internalTab;
  const setActiveTab = (tab: 'attendance' | 'classes' | 'grading' | 'approvals' | 'materials' | 'broadcast') => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };

  // Class Management State
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [classCreatedToast, setClassCreatedToast] = useState<string | null>(null);
  const [classFilterGrade, setClassFilterGrade] = useState<'all' | GradeLevel>('all');
  const [classSearch, setClassSearch] = useState('');

  // Attendance state
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[2]?.id || classes[0]?.id || '');
  const [attendanceDate, setAttendanceDate] = useState<string>('2026-09-17');
  const [sessionNotes, setSessionNotes] = useState<Record<string, string>>({});
  const [sessionStatuses, setSessionStatuses] = useState<Record<string, AttendanceStatus>>({});
  const [attendanceSavedToast, setAttendanceSavedToast] = useState(false);

  // Homework creation state
  const [showCreateHwModal, setShowCreateHwModal] = useState(false);
  const [newHwTitle, setNewHwTitle] = useState('');
  const [newHwUnit, setNewHwUnit] = useState('Unit 5: Wild Animals');
  const [newHwGrade, setNewHwGrade] = useState<GradeLevel>(3);
  const [newHwClassId, setNewHwClassId] = useState(classes[2]?.id || classes[0]?.id);
  const [newHwDueDate, setNewHwDueDate] = useState('2026-09-20');
  const [newHwDesc, setNewHwDesc] = useState('Bài tập ôn luyện từ vựng và cấu trúc ngữ pháp.');

  // Grading tab filter and modal state
  const [gradingClassId, setGradingClassId] = useState<string>('all');
  const [gradingHwFilter, setGradingHwFilter] = useState<string>('all');
  const [gradingStatusFilter, setGradingStatusFilter] = useState<'all' | 'submitted' | 'graded'>('all');
  const [gradingSearch, setGradingSearch] = useState<string>('');
  const [gradingReminderToast, setGradingReminderToast] = useState<string | null>(null);

  const [gradingSub, setGradingSub] = useState<HomeworkSubmission | null>(null);
  const [gradingScore, setGradingScore] = useState<number>(10);
  const [gradingStars, setGradingStars] = useState<number>(5);
  const [gradingFeedback, setGradingFeedback] = useState<string>('Làm bài rất tốt, cô khen ngợi nỗ lực của con!');
  const [gradingSticker, setGradingSticker] = useState<string>('super-star');

  // Material creation state
  const [showCreateMatModal, setShowCreateMatModal] = useState(false);
  const [matTitle, setMatTitle] = useState('');
  const [matUnit, setMatUnit] = useState('Unit 4');
  const [matGrade, setMatGrade] = useState<GradeLevel>(3);
  const [matType, setMatType] = useState<'pdf' | 'audio' | 'flashcard' | 'video'>('flashcard');
  const [matDesc, setMatDesc] = useState('');

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastType, setBroadcastType] = useState<'schedule' | 'homework' | 'attendance' | 'announcement'>('schedule');
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [selectedCommitmentStudent, setSelectedCommitmentStudent] = useState<User | null>(null);

  // Students belonging to selected class
  const classStudents = allUsers.filter(
    (u) => u.role === 'student' && u.classId === selectedClassId && u.status === 'approved'
  );

  // Pending students waiting for approval
  const pendingStudents = allUsers.filter((u) => u.role === 'student' && u.status === 'pending');

  // Initialize attendance statuses for students if not set
  const getStudentStatus = (studentId: string): AttendanceStatus => {
    if (sessionStatuses[studentId]) return sessionStatuses[studentId];
    // Check if recorded for this date
    const existing = attendanceRecords.find(
      (r) => r.studentId === studentId && r.date === attendanceDate
    );
    return existing ? existing.status : 'present';
  };

  const getStudentNote = (studentId: string): string => {
    if (sessionNotes[studentId] !== undefined) return sessionNotes[studentId];
    const existing = attendanceRecords.find(
      (r) => r.studentId === studentId && r.date === attendanceDate
    );
    return existing?.note || '';
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setSessionStatuses((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setSessionNotes((prev) => ({ ...prev, [studentId]: note }));
  };

  const handleSaveAttendance = () => {
    const updatedRecords: AttendanceRecord[] = classStudents.map((stu) => {
      const status = getStudentStatus(stu.id);
      const note = getStudentNote(stu.id);
      return {
        id: `att-${stu.id}-${attendanceDate}`,
        classId: selectedClassId,
        date: attendanceDate,
        studentId: stu.id,
        studentName: stu.name,
        englishName: stu.englishName,
        status,
        note,
        checkInTime: status === 'present' ? '18:25' : status === 'late' ? '18:40' : '-',
        recordedBy: teacher.name
      };
    });

    onSaveAttendance(updatedRecords);
    setAttendanceSavedToast(true);
    confetti({ particleCount: 50, spread: 60 });
    setTimeout(() => setAttendanceSavedToast(false), 4000);
  };

  const handleCreateHomeworkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHwTitle.trim()) return;

    const targetClass = classes.find((c) => c.id === newHwClassId);

    onCreateHomework({
      classId: newHwClassId,
      className: targetClass?.name || 'Movers 3A',
      grade: newHwGrade,
      title: newHwTitle.trim(),
      unit: newHwUnit.trim(),
      description: newHwDesc.trim(),
      assignedDate: attendanceDate,
      dueDate: newHwDueDate,
      points: 10,
      questions: [
        {
          id: `q-${Date.now()}-1`,
          question: `What animal has stripes and looks like a horse?`,
          type: 'multiple-choice',
          options: ['Zebra 🦓', 'Lion 🦁', 'Bear 🐻', 'Hippo 🦛'],
          correctAnswer: 'Zebra 🦓'
        },
        {
          id: `q-${Date.now()}-2`,
          question: `Elephants are very _______ and have long trunks.`,
          type: 'multiple-choice',
          options: ['big 🐘', 'tiny 🐜', 'fast 🐆', 'colorful 🦜'],
          correctAnswer: 'big 🐘'
        }
      ]
    });

    setShowCreateHwModal(false);
    setNewHwTitle('');
    confetti({ particleCount: 60, spread: 60 });
  };

  const handleCreateMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matTitle.trim()) return;

    onCreateMaterial({
      title: matTitle.trim(),
      unit: matUnit.trim(),
      grade: matGrade,
      type: matType,
      description: matDesc.trim() || 'Tài liệu học tập bổ trợ cho bé.',
      downloadCount: 1,
      uploadedAt: new Date().toISOString().split('T')[0],
      tags: [matType.toUpperCase(), `Grade ${matGrade}`, matUnit],
      vocabItems:
        matType === 'flashcard'
          ? [
              { en: 'Sunny', vi: 'Trời nắng', phonetic: '/ˈsʌn.i/', icon: '☀️' },
              { en: 'Rainy', vi: 'Trời mưa', phonetic: '/ˈreɪ.ni/', icon: '🌧️' },
              { en: 'Windy', vi: 'Nhiều gió', phonetic: '/ˈwɪn.di/', icon: '💨' }
            ]
          : undefined
    });

    setShowCreateMatModal(false);
    setMatTitle('');
    setMatDesc('');
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSub) return;

    onGradeSubmission(
      gradingSub.id,
      gradingScore,
      gradingStars,
      gradingFeedback,
      gradingSticker
    );

    setGradingSub(null);
    confetti({ particleCount: 70, spread: 70 });
  };

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;

    onBroadcastNotification(broadcastTitle, broadcastMessage, broadcastType);
    setBroadcastSent(true);
    setBroadcastTitle('');
    setBroadcastMessage('');
    setTimeout(() => setBroadcastSent(false), 4000);
  };

  const handleCreateClassSubmit = (newClass: Omit<ClassRoom, 'id'>) => {
    onCreateClass(newClass);
    setClassCreatedToast(`Đã mở thành công lớp ${newClass.name}! Học sinh và phụ huynh có thể chọn lớp này khi đăng ký.`);
    setTimeout(() => setClassCreatedToast(null), 6000);
  };

  // Helper to resolve effective class for any submission
  const getSubClassInfo = (sub: HomeworkSubmission) => {
    const hw = homeworkList.find((h) => h.id === sub.homeworkId);
    const stu = allUsers.find((u) => u.id === sub.studentId);
    const effectiveClassId = sub.classId || hw?.classId || stu?.classId;
    const effectiveClass = classes.find((c) => c.id === effectiveClassId);
    return {
      classId: effectiveClassId || 'class-unknown',
      className: sub.className || effectiveClass?.name || hw?.className || 'Lớp Tiếng Anh',
      classObj: effectiveClass,
      homeworkObj: hw,
      studentObj: stu
    };
  };

  const classSubmissionStats = classes.map((c) => {
    const classSubs = submissions.filter((sub) => {
      const info = getSubClassInfo(sub);
      return info.classId === c.id;
    });
    const pending = classSubs.filter((s) => s.status === 'submitted').length;
    return {
      classId: c.id,
      className: c.name,
      totalSubs: classSubs.length,
      pendingSubs: pending
    };
  });

  const totalPendingGrading = submissions.filter((s) => s.status === 'submitted').length;

  const activeGradingClassObj = classes.find((c) => c.id === gradingClassId);
  const activeClassStudents = allUsers.filter(
    (u) => u.role === 'student' && u.classId === gradingClassId && u.status === 'approved'
  );
  const activeClassHomeworks = homeworkList.filter(
    (h) => gradingClassId === 'all' || h.classId === gradingClassId || (!h.classId && h.grade === activeGradingClassObj?.grade)
  );

  // Submissions filtered by Class, Homework, Status, and Search
  const filteredGradingSubmissions = submissions.filter((sub) => {
    const info = getSubClassInfo(sub);

    // Filter by Class
    if (gradingClassId !== 'all' && info.classId !== gradingClassId) {
      return false;
    }

    // Filter by Homework
    if (gradingHwFilter !== 'all' && sub.homeworkId !== gradingHwFilter) {
      return false;
    }

    // Filter by Status
    if (gradingStatusFilter !== 'all' && sub.status !== gradingStatusFilter) {
      return false;
    }

    // Search filter
    if (gradingSearch.trim()) {
      const q = gradingSearch.toLowerCase();
      const matchName = (sub.studentName || '').toLowerCase().includes(q);
      const matchEng = (sub.englishName || '').toLowerCase().includes(q);
      const matchHw = (info.homeworkObj?.title || '').toLowerCase().includes(q);
      const matchClass = (info.className || '').toLowerCase().includes(q);
      if (!matchName && !matchEng && !matchHw && !matchClass) return false;
    }

    return true;
  });

  // Calculate students in the selected class who haven't submitted
  const unsubmittedStudents = gradingClassId !== 'all'
    ? activeClassStudents.filter((stu) => {
        const hasSubmitted = submissions.some((sub) => {
          if (sub.studentId !== stu.id) return false;
          if (gradingHwFilter !== 'all') {
            return sub.homeworkId === gradingHwFilter;
          }
          return true;
        });
        return !hasSubmitted;
      })
    : [];

  const handleSendClassHomeworkReminder = (targetClass: ClassRoom, hwTitle?: string) => {
    const title = `🔔 Nhắc nhở nộp bài tập: ${hwTitle || 'Bài tập tiếng Anh về nhà'}`;
    const msg = `Cô Emily gửi lời nhắc các con học sinh lớp ${targetClass.name} hoàn thành bài tập về nhà trước hạn chót nhé. Các con vào làm bài tập để nhận thật nhiều sao vàng ⭐!`;
    onBroadcastNotification(title, msg, 'homework');
    setGradingReminderToast(`Đã gửi thông báo nhắc nhở nộp bài tập đến toàn thể học sinh lớp ${targetClass.name}!`);
    setTimeout(() => setGradingReminderToast(null), 5000);
  };

  const handleSendIndividualReminder = (student: User, hwTitle?: string) => {
    const title = `🔔 Nhắc bé ${student.englishName || student.name} hoàn thành bài tập`;
    const msg = `Cô Emily nhắc bé ${student.englishName || student.name} hoàn thành bài tập "${hwTitle || 'bài tập tuần này'}" nhé. Chúc con làm bài thật tốt!`;
    onBroadcastNotification(title, msg, 'homework');
    setGradingReminderToast(`Đã gửi thông báo nhắc nhở riêng cho bé ${student.englishName || student.name} và phụ huynh!`);
    setTimeout(() => setGradingReminderToast(null), 5000);
  };

  const QUICK_FEEDBACK_TEMPLATES = [
    '🌟 Tuyệt vời! Con phát âm và làm bài đúng 100%, cô rất tự hào!',
    '👏 Rất khen ngợi tinh thần tự giác nộp bài sớm của con!',
    '🎉 Làm bài rất tốt, từ vựng và ngữ pháp tiến bộ vượt bậc!',
    '💪 Con làm tốt lắm, lưu ý ôn lại các câu chưa đúng nhé con!',
    '👑 Ngôi sao tiếng Anh của lớp, phát huy ở buổi học tới nhé!'
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Teacher Top Info */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-7 text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <img
              src={teacher.avatar}
              alt={teacher.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-4 border-white/80 shadow-md"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-white/20 text-white uppercase tracking-wider">
                Bàn Làm Việc Giáo Viên & Quản Trị
              </span>
              <h1 className="text-xl sm:text-2xl font-black font-heading mt-1">
                {teacher.name}
              </h1>
              <p className="text-xs text-white/90 mt-0.5">
                Quản lý {classes.length} lớp học • {allUsers.filter((u) => u.role === 'student' && u.status === 'approved').length} học viên chính thức
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowCreateClassModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Mở Thêm Lớp Mới</span>
            </button>
            {pendingStudents.length > 0 && (
              <button
                onClick={() => setActiveTab('approvals')}
                className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md animate-pulse cursor-pointer border border-white/30"
              >
                <UserCheck className="w-4 h-4" />
                <span>{pendingStudents.length} Chờ duyệt!</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {classCreatedToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-3 animate-in fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{classCreatedToast}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'attendance', label: '📋 Điểm Danh & Sổ Lớp' },
          { id: 'classes', label: '🏫 Quản Lý & Mở Lớp Học', count: classes.length },
          { id: 'grading', label: '✍️ Chấm Bài Tập Trực Tuyến', count: totalPendingGrading > 0 ? totalPendingGrading : submissions.length },
          { id: 'approvals', label: '👤 Duyệt Tài Khoản Đăng Ký', count: pendingStudents.length },
          { id: 'materials', label: '📚 Quản Lý Kho Tài Liệu', count: materials.length },
          { id: 'broadcast', label: '📢 Gửi Nhắc Nhở & Lịch Học' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-md scale-102'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === tab.id
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: Attendance Management */}
      {activeTab === 'attendance' && (
        <div className="space-y-5">
          {/* Controls Bar */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Chọn Lớp Học
                </label>
                <div className="flex items-center gap-1.5">
                  <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 font-bold text-slate-800 bg-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.scheduleDescription})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowCreateClassModal(true)}
                    className="px-2.5 py-2 text-xs rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold border border-emerald-200 flex items-center gap-1 cursor-pointer transition-colors"
                    title="Mở thêm lớp học mới"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Thêm lớp</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Ngày Điểm Danh
                </label>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 font-bold text-slate-800 bg-white"
                />
              </div>
            </div>

            <button
              onClick={handleSaveAttendance}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Lưu Điểm Danh & Báo Phụ Huynh</span>
            </button>
          </div>

          {attendanceSavedToast && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Đã lưu sổ điểm danh ngày {attendanceDate} và tự động gửi thông báo đến phụ huynh học viên!
            </div>
          )}

          {/* Student Roll Call List */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-800 text-base font-heading">
                  Danh Sách Điểm Danh Buổi Học ({classStudents.length} học viên)
                </h3>
                <p className="text-xs text-slate-500">
                  Bấm chọn trạng thái và ghi chú nhận xét trực tiếp cho từng bé
                </p>
              </div>
            </div>

            {classStudents.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl m-4 border border-dashed border-slate-200">
                <School className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="font-bold text-slate-700 text-sm">Lớp học này hiện chưa có học sinh chính thức</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Khi học sinh đăng ký chọn lớp này tại form tuyển sinh hoặc được giáo viên phê duyệt, danh sách điểm danh sẽ xuất hiện tại đây.
                </p>
                {pendingStudents.filter((p) => p.classId === selectedClassId).length > 0 && (
                  <button
                    onClick={() => setActiveTab('approvals')}
                    className="mt-3 px-4 py-2 rounded-xl bg-amber-400 text-amber-950 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Có {pendingStudents.filter((p) => p.classId === selectedClassId).length} học sinh đang chờ duyệt vào lớp này!</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {classStudents.map((stu) => {
                  const currentStatus = getStudentStatus(stu.id);
                  const currentNote = getStudentNote(stu.id);

                  return (
                    <div key={stu.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Student Info */}
                      <div className="flex items-center gap-3 sm:gap-4 min-w-[220px]">
                        <img
                          src={stu.avatar}
                          alt={stu.name}
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="font-black text-slate-800 text-sm sm:text-base">
                            {stu.englishName ? `${stu.englishName} (${stu.name})` : stu.name}
                          </h4>
                          <div className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
                            <span>Lớp {stu.grade} • PH: {stu.parentName || 'Chị Hà'}</span>
                            <span>•</span>
                            <SecureSensitiveDisplay value={stu.parentPhone || '0988 123 456'} type="phone" />
                          </div>
                        </div>
                      </div>

                      {/* Status Buttons */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(stu.id, 'present')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            currentStatus === 'present'
                              ? 'bg-emerald-500 text-white shadow-xs'
                              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          }`}
                        >
                          ✓ Có mặt
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(stu.id, 'late')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            currentStatus === 'late'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                          }`}
                        >
                          ⏰ Đi trễ
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(stu.id, 'excused')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            currentStatus === 'excused'
                              ? 'bg-indigo-500 text-white shadow-xs'
                              : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
                          }`}
                        >
                          ✉️ Có phép
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(stu.id, 'absent')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            currentStatus === 'absent'
                              ? 'bg-rose-500 text-white shadow-xs'
                              : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                          }`}
                        >
                          ✕ Vắng
                        </button>
                      </div>

                      {/* Note Input */}
                      <div className="flex-1 max-w-md">
                        <input
                          type="text"
                          placeholder="Ghi chú: Phát âm tốt, hăng hái giơ tay..."
                          value={currentNote}
                          onChange={(e) => handleNoteChange(stu.id, e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: Class Management (Quản Lý & Mở Lớp Học) */}
      {activeTab === 'classes' && (
        <div className="space-y-6">
          {/* Top Class Management Header Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                  <School className="w-5 h-5" />
                </span>
                <h3 className="font-black text-slate-800 text-lg sm:text-xl font-heading">
                  Quản Lý Danh Sách & Mở Lớp Cho Học Sinh Đăng Ký
                </h3>
              </div>
              <p className="text-xs text-slate-500 max-w-2xl">
                Giáo viên có quyền tạo thêm lớp học mới cho học sinh khối 1 đến 5 với lịch học, phòng học và giáo trình. Các lớp mới tạo sẽ lập tức hiển thị trên hệ thống để phụ huynh và học sinh lựa chọn đăng ký học ngay!
              </p>
            </div>

            <button
              onClick={() => setShowCreateClassModal(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 shrink-0"
            >
              <Plus className="w-5 h-5" />
              <span>+ Mở Thêm Lớp Mới Tuyển Sinh</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Tổng số lớp</span>
              <span className="text-2xl font-black text-slate-800 mt-0.5 block">{classes.length}</span>
              <span className="text-[11px] text-emerald-600 font-bold">Đang mở tuyển sinh</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Học sinh chính thức</span>
              <span className="text-2xl font-black text-slate-800 mt-0.5 block">
                {allUsers.filter((u) => u.role === 'student' && u.status === 'approved').length}
              </span>
              <span className="text-[11px] text-blue-600 font-bold">Đã phân vào các lớp</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Khối Starters (1-2)</span>
              <span className="text-2xl font-black text-amber-600 mt-0.5 block">
                {classes.filter((c) => (typeof c.grade === 'number' ? c.grade : parseInt(String(c.grade), 10) || 0) <= 2).length} lớp
              </span>
              <span className="text-[11px] text-slate-500">Dành cho bé 6-7 tuổi</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Movers & Flyers (3-5)</span>
              <span className="text-2xl font-black text-indigo-600 mt-0.5 block">
                {classes.filter((c) => (typeof c.grade === 'number' ? c.grade : parseInt(String(c.grade), 10) || 0) >= 3).length} lớp
              </span>
              <span className="text-[11px] text-slate-500">Dành cho bé 8-10 tuổi</span>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Grade Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-xs font-bold text-slate-400 mr-1 shrink-0">Lọc khối:</span>
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 1, label: 'Lớp 1' },
                { id: 2, label: 'Lớp 2' },
                { id: 3, label: 'Lớp 3' },
                { id: 4, label: 'Lớp 4' },
                { id: 5, label: 'Lớp 5' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setClassFilterGrade(item.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    classFilterGrade === item.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              {/* Custom Grade buttons */}
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
                    onClick={() => setClassFilterGrade(lbl as string)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                      classFilterGrade === lbl
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200'
                    }`}
                  >
                    ✨ {lbl}
                  </button>
                ))}
            </div>

            {/* Search input */}
            <div className="relative min-w-[200px] sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={classSearch}
                onChange={(e) => setClassSearch(e.target.value)}
                placeholder="Tìm tên lớp, lịch, phòng..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {classes
              .filter((c) => {
                if (classFilterGrade !== 'all') {
                  const matchNum = c.grade === classFilterGrade;
                  const matchLabel = c.gradeLabel === classFilterGrade;
                  if (!matchNum && !matchLabel) return false;
                }
                if (classSearch.trim()) {
                  const q = classSearch.toLowerCase();
                  return (
                    c.name.toLowerCase().includes(q) ||
                    c.scheduleDescription.toLowerCase().includes(q) ||
                    c.roomNumber.toLowerCase().includes(q) ||
                    c.teacherName.toLowerCase().includes(q) ||
                    (c.gradeLabel || '').toLowerCase().includes(q)
                  );
                }
                return true;
              })
              .map((cls) => {
                const enrolled = allUsers.filter(
                  (u) => u.role === 'student' && u.classId === cls.id && u.status === 'approved'
                );
                const pending = allUsers.filter(
                  (u) => u.role === 'student' && u.classId === cls.id && u.status === 'pending'
                );

                return (
                  <div
                    key={cls.id}
                    className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                  >
                    <div>
                      {/* Top Class Banner */}
                      <div className={`p-4 bg-gradient-to-r ${cls.color || 'from-emerald-500 to-teal-600'} text-white relative`}>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-white/20 backdrop-blur-xs text-white uppercase tracking-wider">
                            {cls.gradeLabel || (typeof cls.grade === 'number' ? `Khối Lớp ${cls.grade}` : cls.grade)}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-slate-800">
                            {cls.roomNumber}
                          </span>
                        </div>
                        <h4 className="text-base sm:text-lg font-black font-heading leading-tight drop-shadow-xs">
                          {cls.name}
                        </h4>
                      </div>

                      {/* Class Details */}
                      <div className="p-4 sm:p-5 space-y-3 text-xs">
                        <div className="space-y-2 text-slate-600">
                          <div className="flex items-center gap-2 text-slate-700 font-semibold">
                            <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                            <span>{cls.scheduleDescription}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <BookOpen className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>{cls.currentUnit}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <UserIcon className="w-4 h-4 text-blue-500 shrink-0" />
                            <span>Giáo viên: {cls.teacherName}</span>
                          </div>
                        </div>

                        {/* Enrolled Students preview */}
                        <div className="pt-2 border-t border-slate-100">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold text-slate-500 uppercase">
                              Học viên ({enrolled.length})
                            </span>
                            {pending.length > 0 && (
                              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                +{pending.length} đang chờ duyệt
                              </span>
                            )}
                          </div>

                          {enrolled.length === 0 ? (
                            <div className="py-2.5 px-3 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-[11px] text-slate-500">
                              Chưa có học viên xếp lớp • Sẵn sàng nhận học sinh đăng ký
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {enrolled.slice(0, 5).map((stu) => (
                                <div
                                  key={stu.id}
                                  className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg text-[11px] font-bold text-slate-700"
                                  title={`${stu.name} (${stu.englishName})`}
                                >
                                  <img
                                    src={stu.avatar}
                                    alt={stu.name}
                                    className="w-4 h-4 rounded-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                  <span>{stu.englishName || stu.name}</span>
                                </div>
                              ))}
                              {enrolled.length > 5 && (
                                <span className="text-[10px] font-bold text-slate-400 px-1.5 py-0.5 rounded-md bg-slate-50">
                                  +{enrolled.length - 5}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedClassId(cls.id);
                            setActiveTab('attendance');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Điểm danh</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewHwClassId(cls.id);
                            setNewHwGrade(cls.grade);
                            setShowCreateHwModal(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Giao bài</span>
                        </button>
                      </div>

                      {onDeleteClass && classes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Bạn có chắc muốn xóa lớp ${cls.name}?`)) {
                              onDeleteClass(cls.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Xóa lớp học này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 2: Homework & Grading By Class */}
      {activeTab === 'grading' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-1.5">
                <FileCheck className="w-3.5 h-3.5" />
                <span>Hệ Thống Thu Bài & Chấm Điểm Theo Lớp</span>
              </div>
              <h3 className="font-black text-slate-800 text-xl font-heading">
                Chấm Điểm & Quản Lý Bài Tập Theo Lớp Học
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Xem bài tập nộp của học sinh phân theo từng lớp, theo dõi tỉ lệ nộp bài, kiểm tra đáp án chi tiết và gửi lời phê khen thưởng.
              </p>
            </div>
            <button
              onClick={() => {
                if (gradingClassId !== 'all') {
                  setNewHwClassId(gradingClassId);
                  const selClass = classes.find((c) => c.id === gradingClassId);
                  if (selClass) setNewHwGrade(selClass.grade);
                }
                setShowCreateHwModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-98 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Giao Bài Tập Cho Lớp</span>
            </button>
          </div>

          {/* Toast Alert for Reminders */}
          {gradingReminderToast && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm font-bold flex items-center gap-3 animate-in fade-in shadow-xs">
              <Bell className="w-5 h-5 text-amber-600 shrink-0" />
              <span>{gradingReminderToast}</span>
            </div>
          )}

          {/* Class Selection Filter Bar */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <School className="w-4 h-4 text-indigo-600" />
                Chọn Lớp Học Để Nhận & Chấm Bài Tập:
              </span>
              <span className="text-xs text-slate-400">
                {classes.length} lớp học hiện có
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => {
                  setGradingClassId('all');
                  setGradingHwFilter('all');
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  gradingClassId === 'all'
                    ? 'bg-indigo-600 text-white shadow-md scale-102'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>🏫 Tất Cả Các Lớp</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  gradingClassId === 'all' ? 'bg-indigo-800 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {submissions.length} bài
                </span>
                {totalPendingGrading > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
                    {totalPendingGrading} chờ chấm
                  </span>
                )}
              </button>

              {classes.map((cls) => {
                const stat = classSubmissionStats.find((s) => s.classId === cls.id);
                const isSelected = gradingClassId === cls.id;
                return (
                  <button
                    key={cls.id}
                    onClick={() => {
                      setGradingClassId(cls.id);
                      setGradingHwFilter('all');
                    }}
                    className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-md scale-102 ring-2 ring-indigo-500/50'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>{cls.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isSelected ? 'bg-slate-800 text-amber-300' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {stat?.totalSubs || 0} bài
                    </span>
                    {(stat?.pendingSubs || 0) > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 font-bold">
                        ⏳ {stat?.pendingSubs} cần chấm
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Class Snapshot & Action Bar */}
          {activeGradingClassObj && (
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/30 text-indigo-200 text-xs font-black border border-indigo-400/30">
                      Khối Lớp {activeGradingClassObj.grade}
                    </span>
                    <span className="text-xs text-slate-300 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      {activeGradingClassObj.roomNumber}
                    </span>
                    <span className="text-xs text-slate-300 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-sky-400" />
                      {activeGradingClassObj.scheduleDescription}
                    </span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black font-heading text-amber-300">
                    {activeGradingClassObj.name}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Giáo viên phụ trách: <strong className="text-white">{activeGradingClassObj.teacherName}</strong> • Sĩ số: <strong className="text-white">{activeClassStudents.length} học sinh</strong>
                  </p>
                </div>

                {/* 4 Stats Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-white/10 rounded-2xl p-3 border border-white/15 text-center">
                    <div className="text-[11px] font-bold text-slate-300">Sĩ số lớp</div>
                    <div className="text-lg font-black text-white">{activeClassStudents.length} em</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-3 border border-white/15 text-center">
                    <div className="text-[11px] font-bold text-slate-300">Bài tập đã giao</div>
                    <div className="text-lg font-black text-sky-300">{activeClassHomeworks.length} bài</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-3 border border-white/15 text-center">
                    <div className="text-[11px] font-bold text-slate-300">Đã nộp bài</div>
                    <div className="text-lg font-black text-emerald-300">
                      {submissions.filter((s) => getSubClassInfo(s).classId === activeGradingClassObj.id).length} bài
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-3 border border-white/15 text-center">
                    <div className="text-[11px] font-bold text-slate-300">Cần chấm gấp</div>
                    <div className="text-lg font-black text-amber-300">
                      {classSubmissionStats.find((s) => s.classId === activeGradingClassObj.id)?.pendingSubs || 0} bài
                    </div>
                  </div>
                </div>

                {/* Quick actions for selected class */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => handleSendClassHomeworkReminder(activeGradingClassObj)}
                    className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Nhắc Nộp Bài Cả Lớp</span>
                  </button>
                  <button
                    onClick={() => {
                      setNewHwClassId(activeGradingClassObj.id);
                      setNewHwGrade(activeGradingClassObj.grade);
                      setShowCreateHwModal(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-black text-xs flex items-center gap-1.5 border border-white/30 shadow-sm transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Giao Thêm Bài Cho Lớp</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Filters Bar: Homework Select, Status Pills, Search Input */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Filter by Homework */}
              <div className="md:col-span-4">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  Lọc Theo Bài Tập Của Lớp:
                </label>
                <select
                  value={gradingHwFilter}
                  onChange={(e) => setGradingHwFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">📚 Tất cả các bài tập ({activeClassHomeworks.length} bài)</option>
                  {activeClassHomeworks.map((hw) => (
                    <option key={hw.id} value={hw.id}>
                      {hw.unit} - {hw.title} (Hạn: {hw.dueDate})
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter by Status */}
              <div className="md:col-span-4">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-indigo-600" />
                  Trạng Thái Chấm:
                </label>
                <div className="flex items-center gap-1.5">
                  {[
                    { id: 'all', label: 'Tất cả' },
                    { id: 'submitted', label: '⏳ Chờ chấm' },
                    { id: 'graded', label: '✅ Đã chấm' }
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setGradingStatusFilter(st.id as any)}
                      className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-black transition-all cursor-pointer text-center ${
                        gradingStatusFilter === st.id
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search by Student Name */}
              <div className="md:col-span-4">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Search className="w-3.5 h-3.5 text-indigo-600" />
                  Tìm Học Sinh:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={gradingSearch}
                    onChange={(e) => setGradingSearch(e.target.value)}
                    placeholder="Tìm theo tên học sinh, Tommy, Jenny..."
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  {gradingSearch && (
                    <button
                      onClick={() => setGradingSearch('')}
                      className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submissions Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="font-black text-slate-800 text-sm flex items-center gap-2">
                <span>Danh Sách Bài Nộp Học Sinh</span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black">
                  {filteredGradingSubmissions.length} bài
                </span>
                {gradingClassId !== 'all' && (
                  <span className="text-xs font-medium text-slate-500">
                    thuộc {activeGradingClassObj?.name}
                  </span>
                )}
              </span>

              {filteredGradingSubmissions.some((s) => s.status === 'submitted') && (
                <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {filteredGradingSubmissions.filter((s) => s.status === 'submitted').length} bài đang chờ giáo viên chấm điểm
                </span>
              )}
            </div>

            {filteredGradingSubmissions.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-xs space-y-3">
                <div className="text-4xl">📝</div>
                <h4 className="font-black text-slate-800 text-base">
                  {gradingClassId === 'all'
                    ? 'Không tìm thấy bài nộp nào phù hợp với bộ lọc'
                    : `Lớp ${activeGradingClassObj?.name} chưa có bài nộp nào cho tiêu chí này`}
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Các con học sinh có thể chưa hoàn thành bài tập hoặc bạn chưa giao bài cho lớp này. Hãy gửi lời nhắc hoặc giao bài mới cho lớp nhé!
                </p>
                <div className="pt-2 flex items-center justify-center gap-3">
                  {gradingClassId !== 'all' && activeGradingClassObj && (
                    <button
                      onClick={() => handleSendClassHomeworkReminder(activeGradingClassObj)}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Bell className="w-4 h-4" />
                      <span>Nhắc Cả Lớp Nộp Bài</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setGradingClassId('all');
                      setGradingHwFilter('all');
                      setGradingStatusFilter('all');
                      setGradingSearch('');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Xem Tất Cả Lớp Học
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredGradingSubmissions.map((sub) => {
                  const info = getSubClassInfo(sub);
                  const hw = info.homeworkObj;
                  const student = info.studentObj;
                  const isGraded = sub.status === 'graded';

                  // Calculate correct count
                  const totalQuestions = hw?.questions?.length || Object.keys(sub.answers).length || 1;
                  const correctCount = hw?.questions
                    ? hw.questions.filter((q) => sub.answers[q.id] === q.correctAnswer).length
                    : Math.round(((sub.score || 0) / 10) * totalQuestions);

                  return (
                    <div
                      key={sub.id}
                      className={`bg-white rounded-3xl p-5 sm:p-6 border-2 transition-all shadow-xs hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                        isGraded
                          ? 'border-slate-200/80 bg-white'
                          : 'border-amber-300 bg-amber-50/20'
                      }`}
                    >
                      {/* Left: Student info and submission meta */}
                      <div className="flex items-start gap-4">
                        <img
                          src={student?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                          alt={sub.studentName}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-white shadow-xs shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-black text-slate-800 text-base sm:text-lg">
                              {sub.englishName ? `${sub.englishName} (${sub.studentName})` : sub.studentName}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 text-indigo-900 font-black text-xs flex items-center gap-1">
                              <School className="w-3 h-3 text-indigo-700" />
                              {info.className}
                            </span>
                            {isGraded ? (
                              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Đã Chấm Điểm
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-lg bg-amber-200 text-amber-900 font-black text-xs flex items-center gap-1 animate-pulse">
                                <Clock className="w-3 h-3" />
                                ⏳ Chờ Cô Giáo Chấm
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-slate-600 font-bold flex items-center gap-2 flex-wrap">
                            <span className="text-indigo-700 font-extrabold">{hw?.title || 'Bài tập tiếng Anh'}</span>
                            <span>•</span>
                            <span className="text-slate-500 font-medium">Nộp lúc: {sub.submittedAt}</span>
                            <span>•</span>
                            <span className="text-slate-500 font-medium">
                              Làm đúng: <strong className="text-slate-800 font-bold">{correctCount}/{totalQuestions} câu</strong>
                            </span>
                          </div>

                          {/* Teacher's feedback display if graded */}
                          {sub.teacherFeedback && (
                            <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2">
                              <span className="text-base leading-none">💬</span>
                              <div>
                                <span className="font-bold">Lời phê của cô: </span>
                                <span className="italic font-medium">"{sub.teacherFeedback}"</span>
                                {sub.feedbackSticker && (
                                  <span className="ml-2 font-black text-amber-700">
                                    [Sticker: {sub.feedbackSticker === 'super-star' ? '🌟 Super Star' : sub.feedbackSticker === 'champion' ? '👑 Nhà Vô Địch' : '🎉 Xuất Sắc'}]
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Score badge & Action buttons */}
                      <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                        <div className="text-right">
                          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                            {isGraded ? 'Điểm Chính Thức' : 'Điểm Tạm Tính'}
                          </div>
                          <div className="flex items-center gap-1 justify-end">
                            <span className={`text-2xl font-black ${isGraded ? 'text-emerald-600' : 'text-amber-600'}`}>
                              {sub.score ?? Math.round((correctCount / totalQuestions) * 10)}
                            </span>
                            <span className="text-xs font-bold text-slate-400">/10</span>
                            <span className="ml-1 text-xs font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                              ⭐ +{sub.starsAwarded ?? (sub.score && sub.score >= 8 ? 5 : 3)}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setGradingSub(sub);
                            setGradingScore(sub.score ?? Math.round((correctCount / totalQuestions) * 10));
                            setGradingStars(sub.starsAwarded ?? (sub.score && sub.score >= 8 ? 5 : 3));
                            setGradingFeedback(
                              sub.teacherFeedback ||
                                (correctCount === totalQuestions
                                  ? '🌟 Tuyệt vời! Con làm đúng tất cả các câu, cô rất tự hào về con!'
                                  : '👏 Con làm bài rất tốt, hãy cố gắng phát huy ở các bài học tiếp theo nhé!')
                            );
                            setGradingSticker(sub.feedbackSticker || (correctCount === totalQuestions ? 'super-star' : 'excellent'));
                          }}
                          className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all active:scale-98 cursor-pointer ${
                            isGraded
                              ? 'bg-slate-900 hover:bg-slate-800 text-white'
                              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-200 shadow-md'
                          }`}
                        >
                          <Award className="w-4 h-4" />
                          <span>{isGraded ? 'Chấm Lại & Sửa Lời Phê' : '✍️ Chấm Điểm & Phê Bài'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Unsubmitted Students Section (for specific selected class) */}
          {gradingClassId !== 'all' && unsubmittedStudents.length > 0 && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm">
                    ⚠️
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm sm:text-base">
                      Học Sinh Trong Lớp Chưa Nộp Bài ({unsubmittedStudents.length} bạn)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Danh sách các bạn học sinh lớp {activeGradingClassObj?.name} chưa hoàn thành bài tập
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => activeGradingClassObj && handleSendClassHomeworkReminder(activeGradingClassObj)}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Gửi Nhắc Nhở Tất Cả</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {unsubmittedStudents.map((stu) => (
                  <div
                    key={stu.id}
                    className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={stu.avatar}
                        alt={stu.name}
                        className="w-10 h-10 rounded-xl object-cover border border-amber-300"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="font-black text-slate-800 text-xs sm:text-sm">
                          {stu.englishName ? `${stu.englishName} - ${stu.name}` : stu.name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 flex-wrap">
                          <span>Phụ huynh: {stu.parentName || 'Chưa cập nhật'}</span>
                          {stu.parentPhone && (
                            <>
                              <span>•</span>
                              <SecureSensitiveDisplay value={stu.parentPhone} type="phone" />
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSendIndividualReminder(stu)}
                      title="Gửi nhắc nhở làm bài tập riêng cho bé"
                      className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold cursor-pointer transition-colors shrink-0"
                    >
                      Nhắc bé 🔔
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Account Approvals */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-black text-slate-800 text-lg font-heading">
              Duyệt Tài Khoản Học Sinh Đăng Ký Mới
            </h3>
            <p className="text-xs text-slate-500">
              Kiểm tra hồ sơ học viên đăng ký qua ứng dụng và kích hoạt tài khoản
            </p>
          </div>

          {pendingStudents.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-xs">
              <div className="text-4xl mb-2">🎉</div>
              <h4 className="font-extrabold text-slate-800 text-base">
                Không có tài khoản nào đang chờ duyệt!
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Tất cả học viên đăng ký đã được xếp lớp và kích hoạt đầy đủ.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingStudents.map((stu) => (
                <div
                  key={stu.id}
                  className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-xs space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={stu.avatar}
                      alt={stu.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-400"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-slate-800 text-base">
                          {stu.englishName || stu.name}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                          Lớp {stu.grade}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">Họ tên: {stu.name}</p>
                      <p className="text-xs text-slate-500">Đăng ký ngày: {stu.registeredAt}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                    <p className="font-bold text-slate-700">Thông tin phụ huynh:</p>
                    <p>Họ tên: <span className="font-semibold text-slate-800">{stu.parentName || 'Chưa cập nhật'}</span></p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span>SĐT/Zalo:</span>
                      <SecureSensitiveDisplay value={stu.parentPhone || '0988 123 456'} type="phone" />
                    </div>
                    <p>Lớp đăng ký: <span className="font-bold text-amber-700">{classes.find((c) => c.id === stu.classId)?.name || 'Movers 3A'}</span></p>
                  </div>

                  {/* Commitment Status & Document View */}
                  <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-amber-900">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-bold text-[11px]">Đã ký cam kết Nhà VH Thôn 16</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedCommitmentStudent(stu)}
                      className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg text-[11px] font-bold text-amber-900 flex items-center gap-1 cursor-pointer transition-colors shrink-0 shadow-2xs"
                    >
                      <FileText className="w-3 h-3 text-amber-700" />
                      <span>Xem Đơn A4</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onApproveStudent(stu.id, true)}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-98 cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Duyệt & Kích Hoạt</span>
                    </button>
                    <button
                      onClick={() => onApproveStudent(stu.id, false)}
                      className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs transition-colors cursor-pointer"
                    >
                      <UserX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Study Materials */}
      {activeTab === 'materials' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-800 text-lg font-heading">
                Kho Tài Liệu Học Tập Cho Học Viên
              </h3>
              <p className="text-xs text-slate-500">
                Thêm bài nghe audio, flashcard 3D, bài tập in PDF cho các khối lớp 1 - 5
              </p>
            </div>
            <button
              onClick={() => setShowCreateMatModal(true)}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Đăng Tài Liệu Mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {materials.map((mat) => (
              <div
                key={mat.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 uppercase">
                      {mat.type} • Lớp {mat.grade}
                    </span>
                    <span className="text-xs text-slate-400">{mat.unit}</span>
                  </div>
                  <h4 className="font-black text-slate-800 text-sm">{mat.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {mat.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>{mat.downloadCount} lượt tương tác</span>
                  <span className="font-bold text-teal-600">Đang hoạt động</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Broadcast / Announcements */}
      {activeTab === 'broadcast' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div>
            <h3 className="font-black text-slate-800 text-lg font-heading">
              Gửi Thông Báo & Nhắc Nhở Tự Động Đến Phụ Huynh & Học Viên
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Thông báo sẽ hiện ngay trên điện thoại/máy tính của học sinh và tài khoản phụ huynh
            </p>
          </div>

          {broadcastSent && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Đã gửi thông báo thành công tới tất cả học viên và phụ huynh trong hệ thống!
            </div>
          )}

          <form onSubmit={handleBroadcastSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Loại Thông Báo
                </label>
                <select
                  value={broadcastType}
                  onChange={(e) => setBroadcastType(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white font-medium"
                >
                  <option value="schedule">⏰ Nhắc nhở lịch học sắp tới</option>
                  <option value="homework">📝 Nhắc nộp bài tập về nhà</option>
                  <option value="announcement">📢 Thông báo chung / Nghỉ lễ</option>
                  <option value="attendance">✅ Thông báo điểm danh</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tiêu Đề Thông Báo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Nhắc nhở buổi học chiều nay..."
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nội Dung Thông Báo Chi Tiết *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Nhập nội dung nhắc nhở các con và bố mẹ..."
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                className="w-full p-3.5 text-sm rounded-2xl border border-slate-300 font-medium resize-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-sm shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Phát Thông Báo Tức Thì</span>
            </button>
          </form>
        </div>
      )}

      {/* MODAL 1: Create Homework */}
      {showCreateHwModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black text-slate-800 font-heading">
              Tạo Bài Tập Về Nhà Mới
            </h3>

            <form onSubmit={handleCreateHomeworkSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tiêu Đề Bài Tập *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Unit 5: Safari Animals Challenge"
                  value={newHwTitle}
                  onChange={(e) => setNewHwTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unit</label>
                  <input
                    type="text"
                    value={newHwUnit}
                    onChange={(e) => setNewHwUnit(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Khối Lớp</label>
                  <select
                    value={newHwGrade}
                    onChange={(e) => setNewHwGrade(Number(e.target.value) as GradeLevel)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white"
                  >
                    <option value={1}>Lớp 1</option>
                    <option value={2}>Lớp 2</option>
                    <option value={3}>Lớp 3</option>
                    <option value={4}>Lớp 4</option>
                    <option value={5}>Lớp 5</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hạn Nộp</label>
                <input
                  type="date"
                  value={newHwDueDate}
                  onChange={(e) => setNewHwDueDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô Tả & Hướng Dẫn</label>
                <textarea
                  rows={3}
                  value={newHwDesc}
                  onChange={(e) => setNewHwDesc(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateHwModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs"
                >
                  Lưu & Giao Cho Lớp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Create Material */}
      {showCreateMatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black text-slate-800 font-heading">
              Đăng Tài Liệu Học Tập Mới
            </h3>

            <form onSubmit={handleCreateMaterialSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên Tài Liệu *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Flashcard 10 Từ Vựng Thời Tiết"
                  value={matTitle}
                  onChange={(e) => setMatTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Định Dạng</label>
                  <select
                    value={matType}
                    onChange={(e) => setMatType(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="flashcard">🗂️ Flashcard Tương Tác</option>
                    <option value="audio">🎧 Audio Luyện Nghe</option>
                    <option value="pdf">📄 Phiếu Bài Tập PDF</option>
                    <option value="video">🎬 Video Bài Giảng</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Khối Lớp</label>
                  <select
                    value={matGrade}
                    onChange={(e) => setMatGrade(Number(e.target.value) as GradeLevel)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white"
                  >
                    <option value={1}>Lớp 1</option>
                    <option value={2}>Lớp 2</option>
                    <option value={3}>Lớp 3</option>
                    <option value={4}>Lớp 4</option>
                    <option value={5}>Lớp 5</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô Tả Tài Liệu</label>
                <textarea
                  rows={3}
                  value={matDesc}
                  onChange={(e) => setMatDesc(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateMatModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs"
                >
                  Đăng Tải Lên Ứng Dụng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Grade Submission with Detailed Question Review */}
      {gradingSub && (() => {
        const subHw = homeworkList.find((h) => h.id === gradingSub.homeworkId);
        const subStudent = allUsers.find((u) => u.id === gradingSub.studentId);
        const subClass = classes.find((c) => c.id === (gradingSub.classId || subHw?.classId || subStudent?.classId));
        const questions = subHw?.questions || [];
        const totalQ = questions.length || Object.keys(gradingSub.answers).length || 1;
        const correctQ = questions.length > 0
          ? questions.filter((q) => gradingSub.answers[q.id] === q.correctAnswer).length
          : Math.round(((gradingSub.score || 10) / 10) * totalQ);
        const autoScore = Math.round((correctQ / totalQ) * 10);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
              {/* Modal Header */}
              <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3.5">
                  <img
                    src={subStudent?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                    alt={gradingSub.studentName}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-white/80 shadow-xs shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg sm:text-xl font-black font-heading text-white">
                        {gradingSub.englishName ? `${gradingSub.englishName} - ${gradingSub.studentName}` : gradingSub.studentName}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-lg bg-white/20 text-white font-bold text-xs">
                        {subClass?.name || gradingSub.className || 'Lớp Tiếng Anh'}
                      </span>
                    </div>
                    <p className="text-xs text-indigo-200 mt-0.5">
                      Bài nộp: <strong className="text-white">{subHw?.title || 'Bài tập tiếng Anh'}</strong> ({subHw?.unit}) • Nộp lúc: {gradingSub.submittedAt}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setGradingSub(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-black transition-colors cursor-pointer shrink-0"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
                {/* Part 1: Student's detailed answers review */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-indigo-600" />
                      Chi Tiết Bài Làm Của Học Sinh
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Đúng {correctQ}/{totalQ} câu hỏi ({autoScore}/10 điểm)
                    </span>
                  </div>

                  {questions.length > 0 ? (
                    <div className="space-y-3">
                      {questions.map((q, idx) => {
                        const studentAns = gradingSub.answers[q.id];
                        const isCorrect = studentAns === q.correctAnswer;
                        return (
                          <div
                            key={q.id}
                            className={`p-3.5 rounded-2xl border transition-all ${
                              isCorrect
                                ? 'bg-emerald-50/50 border-emerald-200'
                                : 'bg-rose-50/50 border-rose-200'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="flex items-center gap-2">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                                  isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                                }`}>
                                  {idx + 1}
                                </span>
                                <span className="text-xs sm:text-sm font-bold text-slate-800">
                                  {q.question}
                                </span>
                              </div>
                              <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                                isCorrect
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}>
                                {isCorrect ? '✓ Đúng' : '✕ Sai'}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                              <div className="p-2 rounded-xl bg-white border border-slate-200">
                                <span className="text-slate-500 block text-[11px]">Đáp án học sinh chọn:</span>
                                <span className={`font-black text-sm ${isCorrect ? 'text-emerald-700' : 'text-rose-600'}`}>
                                  {studentAns || '(Chưa trả lời)'}
                                </span>
                              </div>
                              {!isCorrect && (
                                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                                  <span className="text-emerald-700 block text-[11px]">Đáp án chính xác:</span>
                                  <span className="font-black text-sm text-emerald-800">
                                    {q.correctAnswer}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                      <p className="font-semibold">Học sinh đã nộp các câu trả lời:</p>
                      <ul className="mt-2 space-y-1">
                        {Object.entries(gradingSub.answers).map(([key, val]) => (
                          <li key={key} className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-700">{key}:</span>
                            <span className="font-bold text-indigo-700">{String(val)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Part 2: Grading Form */}
                <form onSubmit={handleGradeSubmit} className="space-y-4 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-500" />
                      Điểm Số & Lời Phê Của Cô Giáo
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setGradingScore(autoScore);
                        setGradingStars(autoScore >= 8 ? 5 : 3);
                      }}
                      className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer"
                    >
                      Dùng điểm tự động ({autoScore}/10)
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Điểm Số (Thang 10) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={gradingScore}
                        onChange={(e) => setGradingScore(Number(e.target.value))}
                        className="w-full px-3 py-2.5 text-lg font-black rounded-xl border-2 border-indigo-200 text-center text-indigo-900 focus:border-indigo-600 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Thưởng Sao Vàng ⭐ (1 - 10) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={gradingStars}
                        onChange={(e) => setGradingStars(Number(e.target.value))}
                        className="w-full px-3 py-2.5 text-lg font-black text-amber-600 rounded-xl border-2 border-amber-200 text-center focus:border-amber-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Sticker selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Chọn Sticker Khen Thưởng Cho Bé
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'super-star', label: '🌟 Super Star' },
                        { id: 'excellent', label: '🎉 Xuất Sắc' },
                        { id: 'good-effort', label: '👏 Rất Tiến Bộ' },
                        { id: 'champion', label: '👑 Nhà Vô Địch' }
                      ].map((stk) => (
                        <button
                          key={stk.id}
                          type="button"
                          onClick={() => setGradingSticker(stk.id)}
                          className={`p-2.5 rounded-xl text-xs font-black border transition-all cursor-pointer text-center ${
                            gradingSticker === stk.id
                              ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-xs ring-2 ring-amber-400/40'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {stk.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick comment suggestions */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Gợi Ý Lời Nhận Xét Nhanh:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_FEEDBACK_TEMPLATES.map((tmpl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setGradingFeedback(tmpl)}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 transition-colors cursor-pointer text-left"
                        >
                          {tmpl.slice(0, 36)}...
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Teacher Feedback textarea */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Lời Nhận Xét Của Cô Giáo (Gửi trực tiếp đến bé & phụ huynh) *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={gradingFeedback}
                      onChange={(e) => setGradingFeedback(e.target.value)}
                      placeholder="Viết nhận xét khen ngợi và động viên học sinh..."
                      className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 resize-none font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Footer actions */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setGradingSub(null)}
                      className="px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                    >
                      Đóng
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Lưu Điểm & Báo Học Viên</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modal: Create Class (Mở Thêm Lớp Mới) */}
      <CreateClassModal
        isOpen={showCreateClassModal}
        onClose={() => setShowCreateClassModal(false)}
        defaultTeacherName={teacher.name}
        onCreateClass={handleCreateClassSubmit}
      />

      {/* Official A4 Commitment Modal for Review */}
      {selectedCommitmentStudent && (
        <CommitmentDocumentModal
          isOpen={!!selectedCommitmentStudent}
          onClose={() => setSelectedCommitmentStudent(null)}
          status={selectedCommitmentStudent.status}
          onApprove={() => {
            onApproveStudent(selectedCommitmentStudent.id, true);
            setSelectedCommitmentStudent(null);
          }}
          onReject={() => {
            onApproveStudent(selectedCommitmentStudent.id, false);
            setSelectedCommitmentStudent(null);
          }}
          onRevertToPending={() => {
            onApproveStudent(selectedCommitmentStudent.id, 'pending');
            setSelectedCommitmentStudent(null);
          }}
          studentData={{
            fullName: selectedCommitmentStudent.name,
            englishName: selectedCommitmentStudent.englishName,
            birthDate: selectedCommitmentStudent.birthDate,
            grade: selectedCommitmentStudent.grade,
            gradeLabel: selectedCommitmentStudent.gradeLabel,
            schoolName: selectedCommitmentStudent.schoolName,
            parentName: selectedCommitmentStudent.parentName || 'Phụ huynh học sinh',
            parentRelationship: selectedCommitmentStudent.parentRelationship,
            parentPhone: selectedCommitmentStudent.parentPhone || selectedCommitmentStudent.phone || '',
            address: selectedCommitmentStudent.address || 'Thôn 16, địa phương',
            className: classes.find((c) => c.id === selectedCommitmentStudent.classId)?.name,
            commitmentDate: selectedCommitmentStudent.commitmentDate || selectedCommitmentStudent.registeredAt,
            studentSignedName: selectedCommitmentStudent.studentSignedName || selectedCommitmentStudent.name,
            parentSignedName: selectedCommitmentStudent.parentSignedName || selectedCommitmentStudent.parentName,
            locationName: selectedCommitmentStudent.locationName || 'Nhà văn hóa Thôn 16',
            policyCategory: selectedCommitmentStudent.policyCategory || 'standard',
            operatingFundAmount: selectedCommitmentStudent.operatingFundAmount || '50.000',
            sessionsCount: selectedCommitmentStudent.sessionsCount || '16',
            academicAbility: selectedCommitmentStudent.academicAbility || 'basic',
            subjectName: selectedCommitmentStudent.subjectName || 'Tiếng Anh tiểu học & Kỹ năng giao tiếp',
            courseProgram:
              selectedCommitmentStudent.courseProgram ||
              (classes.find((c) => c.id === selectedCommitmentStudent.classId)?.name
                ? `Lớp ${classes.find((c) => c.id === selectedCommitmentStudent.classId)?.name}`
                : `Chương trình Bổ trợ & Nâng cao Tiếng Anh Lớp ${selectedCommitmentStudent.grade || 3}`),
            learningGoal:
              selectedCommitmentStudent.learningGoal ||
              'Củng cố nền tảng phát âm, tự tin giao tiếp và đạt điểm tốt môn Tiếng Anh',
            preferredSchedule:
              selectedCommitmentStudent.preferredSchedule ||
              classes.find((c) => c.id === selectedCommitmentStudent.classId)?.scheduleDescription ||
              'Ca học các ngày trong tuần (17h30 - 19h00)',
            departmentHead: selectedCommitmentStudent.departmentHead || 'Tiếng Anh (CLB StarKids - Nhà văn hóa Thôn 16)'
          }}
        />
      )}
    </div>
  );
};
