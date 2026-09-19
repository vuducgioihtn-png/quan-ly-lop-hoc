/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  loadUsers,
  saveUsers,
  loadCurrentUserId,
  saveCurrentUserId,
  loadIsLoggedIn,
  saveIsLoggedIn,
  loadClasses,
  saveClasses,
  loadAttendance,
  saveAttendance,
  loadHomework,
  saveHomework,
  loadSubmissions,
  saveSubmissions,
  loadMaterials,
  saveMaterials,
  loadNotifications,
  saveNotifications
} from './utils/storage';
import {
  User,
  ClassRoom,
  AttendanceRecord,
  Homework,
  HomeworkSubmission,
  StudyMaterial,
  AppNotification
} from './types';
import { Header } from './components/Header';
import { LoginPage } from './components/LoginPage';
import { StudentPortal } from './components/StudentPortal';
import { ParentPortal } from './components/ParentPortal';
import { TeacherAdminPortal } from './components/TeacherAdminPortal';
import { AdminPortal } from './components/AdminPortal';
import { RegisterModal } from './components/RegisterModal';
import { InteractiveHomeworkModal } from './components/InteractiveHomeworkModal';
import { MaterialViewerModal } from './components/MaterialViewerModal';
import { NotificationsModal } from './components/NotificationsModal';
import { Sparkles, Heart, HelpCircle, ShieldCheck } from 'lucide-react';

export default function App() {
  // Database States
  const [users, setUsers] = useState<User[]>(() => loadUsers());
  const [currentUserId, setCurrentUserId] = useState<string>(() => loadCurrentUserId());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => loadIsLoggedIn());
  const [classes, setClasses] = useState<ClassRoom[]>(() => loadClasses());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => loadAttendance());
  const [homework, setHomework] = useState<Homework[]>(() => loadHomework());
  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>(() => loadSubmissions());
  const [materials, setMaterials] = useState<StudyMaterial[]>(() => loadMaterials());
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadNotifications());

  // Modal States
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeHomeworkModal, setActiveHomeworkModal] = useState<Homework | null>(null);
  const [activeMaterialModal, setActiveMaterialModal] = useState<StudyMaterial | null>(null);

  // Active Tabs for the 4 RBAC Roles
  const [adminTab, setAdminTab] = useState<'overview' | 'teachers' | 'approvals' | 'classes' | 'students'>('overview');
  const [teacherTab, setTeacherTab] = useState<'attendance' | 'classes' | 'grading' | 'approvals' | 'materials' | 'broadcast'>('attendance');
  const [studentTab, setStudentTab] = useState<'homework' | 'rewards' | 'schedule' | 'materials' | 'attendance' | 'leaderboard'>('homework');
  const [parentTab, setParentTab] = useState<'analytics' | 'attendance' | 'homework' | 'tuition' | 'messages'>('analytics');

  // Sync to localStorage
  useEffect(() => {
    saveUsers(users);
  }, [users]);

  useEffect(() => {
    saveCurrentUserId(currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    saveIsLoggedIn(isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    saveClasses(classes);
  }, [classes]);

  useEffect(() => {
    saveAttendance(attendance);
  }, [attendance]);

  useEffect(() => {
    saveHomework(homework);
  }, [homework]);

  useEffect(() => {
    saveSubmissions(submissions);
  }, [submissions]);

  useEffect(() => {
    saveMaterials(materials);
  }, [materials]);

  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  // Current Active User
  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  // Pending student registrations count
  const pendingCount = users.filter((u) => u.role === 'student' && u.status === 'pending').length;

  // Pending submissions needing grading for teacher
  const pendingSubmissionsCount = submissions.filter((s) => s.score === undefined || s.score === null).length;

  // Pending homework for student
  const studentSubmissions = submissions.filter((s) => s.studentId === currentUser.id);
  const pendingHwCount = homework.filter(
    (h) => (!currentUser.grade || h.grade === currentUser.grade) && !studentSubmissions.some((s) => s.homeworkId === h.id)
  ).length;

  const getActiveTab = () => {
    switch (currentUser.role) {
      case 'admin':
        return adminTab;
      case 'teacher':
        return teacherTab;
      case 'student':
        return studentTab;
      case 'parent':
        return parentTab;
      default:
        return 'overview';
    }
  };

  const handleSelectTab = (tabId: string) => {
    if (currentUser.role === 'admin') setAdminTab(tabId as any);
    else if (currentUser.role === 'teacher') setTeacherTab(tabId as any);
    else if (currentUser.role === 'student') setStudentTab(tabId as any);
    else if (currentUser.role === 'parent') setParentTab(tabId as any);
  };

  // Handlers
  const handleLogin = (user: User) => {
    setCurrentUserId(user.id);
    setIsLoggedIn(true);
    // Reset active tab to the default tab of that role
    if (user.role === 'admin') setAdminTab('overview');
    else if (user.role === 'teacher') setTeacherTab('attendance');
    else if (user.role === 'student') setStudentTab('homework');
    else if (user.role === 'parent') setParentTab('analytics');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleSelectUser = (user: User) => {
    setCurrentUserId(user.id);
  };

  const handleRegisterSubmit = (newStudent: User) => {
    setUsers((prev) => [newStudent, ...prev]);

    // Dispatch notification to teacher
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      targetRole: 'teacher',
      title: '👤 Học sinh mới đăng ký cần duyệt!',
      message: `Bé ${newStudent.name} (${newStudent.englishName || 'Bé'} - Lớp ${newStudent.grade}) vừa nộp đơn đăng ký. Vui lòng kiểm tra và duyệt hồ sơ.`,
      type: 'announcement',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleApproveStudent = (studentId: string, approved: boolean) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === studentId) {
          return {
            ...u,
            status: approved ? 'approved' : 'rejected',
            stars: approved ? (u.stars || 0) + 20 : u.stars
          };
        }
        return u;
      })
    );

    const targetStudent = users.find((u) => u.id === studentId);

    // Notification
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      targetRole: 'student',
      targetUserId: studentId,
      title: approved ? '🎉 Chúc mừng! Tài khoản đã được phê duyệt' : 'Thông báo hồ sơ đăng ký',
      message: approved
        ? `Chào mừng bé ${targetStudent?.englishName || targetStudent?.name} gia nhập StarKids English Club! Con được tặng ngay 20 Sao Vàng ⭐.`
        : `Hồ sơ của bạn chưa đủ điều kiện xếp lớp. Vui lòng liên hệ hotline để được hỗ trợ.`,
      type: 'award',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleSaveAttendance = (newRecords: AttendanceRecord[]) => {
    setAttendance((prev) => {
      // Remove old records for matching date and studentId, then append
      const filtered = prev.filter(
        (old) => !newRecords.some((r) => r.studentId === old.studentId && r.date === old.date)
      );
      return [...filtered, ...newRecords];
    });

    // Create automated notifications for parents of students with new check-ins
    const newAlerts: AppNotification[] = newRecords.map((r) => ({
      id: `notif-att-${r.studentId}-${Date.now()}`,
      targetRole: 'parent',
      targetUserId: r.studentId,
      title: `✅ Thông báo điểm danh ngày ${r.date}`,
      message: `Bé ${r.englishName || r.studentName} đã được điểm danh: ${
        r.status === 'present'
          ? 'Có mặt đúng giờ'
          : r.status === 'late'
          ? 'Đến trễ'
          : r.status === 'excused'
          ? 'Nghỉ có phép'
          : 'Vắng'
      }. ${r.note ? `Ghi chú: "${r.note}"` : ''}`,
      type: 'attendance',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false
    }));

    setNotifications((prev) => [...newAlerts, ...prev]);
  };

  const handleSubmitHomework = (submission: Omit<HomeworkSubmission, 'id'>) => {
    const hw = homework.find((h) => h.id === submission.homeworkId);
    const stu = users.find((u) => u.id === submission.studentId);
    const resolvedClassId = submission.classId || hw?.classId || stu?.classId;
    const resolvedClassName = submission.className || hw?.className || classes.find((c) => c.id === resolvedClassId)?.name || 'Lớp Tiếng Anh';

    const newSub: HomeworkSubmission = {
      ...submission,
      classId: resolvedClassId,
      className: resolvedClassName,
      id: `sub-${Date.now()}`
    };
    setSubmissions((prev) => [newSub, ...prev]);

    // Award stars to student
    if (submission.starsAwarded) {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === submission.studentId) {
            return { ...u, stars: (u.stars || 0) + submission.starsAwarded! };
          }
          return u;
        })
      );
    }

    // Alert parent and teacher
    const notif: AppNotification = {
      id: `notif-hw-${Date.now()}`,
      targetRole: 'parent',
      targetUserId: submission.studentId,
      title: `📝 Bé ${submission.englishName || submission.studentName} đã nộp bài tập`,
      message: `Bài: "${hw?.title}". Lớp: ${resolvedClassName}. Điểm trắc nghiệm: ${submission.score}/10, nhận được +${submission.starsAwarded} ⭐! Đang chờ giáo viên chấm và nhận xét chi tiết.`,
      type: 'homework',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false
    };

    const teacherNotif: AppNotification = {
      id: `notif-teacher-hw-${Date.now()}`,
      targetRole: 'teacher',
      classId: resolvedClassId,
      title: `📥 Bài nộp mới từ lớp ${resolvedClassName}`,
      message: `Học sinh ${submission.englishName || submission.studentName} vừa nộp bài tập "${hw?.title}". Cô giáo hãy vào phần Chấm bài theo lớp để chấm điểm và khen thưởng nhé!`,
      type: 'homework',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false
    };

    setNotifications((prev) => [teacherNotif, notif, ...prev]);
  };

  const handleGradeSubmission = (
    subId: string,
    score: number,
    stars: number,
    feedback: string,
    sticker: string
  ) => {
    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id === subId) {
          return {
            ...s,
            score,
            starsAwarded: stars,
            teacherFeedback: feedback,
            feedbackSticker: sticker,
            status: 'graded',
            gradedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
          };
        }
        return s;
      })
    );

    const sub = submissions.find((s) => s.id === subId);
    if (sub) {
      // Award stars difference if upgraded
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === sub.studentId) {
            return { ...u, stars: (u.stars || 0) + stars };
          }
          return u;
        })
      );

      // Notification to student & parent
      const notif: AppNotification = {
        id: `notif-graded-${Date.now()}`,
        targetRole: 'parent',
        targetUserId: sub.studentId,
        title: `⭐ Cô Emily đã chấm bài tập cho bé`,
        message: `Kết quả: ${score}/10 Điểm. Lời nhận xét: "${feedback}"`,
        type: 'homework',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        read: false
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  const handleCreateHomework = (newHwData: Omit<Homework, 'id'>) => {
    const newHw: Homework = {
      ...newHwData,
      id: `hw-${Date.now()}`
    };
    setHomework((prev) => [newHw, ...prev]);

    // Dispatch broadcast notification to class
    const notif: AppNotification = {
      id: `notif-newhw-${Date.now()}`,
      targetRole: 'all',
      classId: newHw.classId,
      title: `📝 Bài tập mới: ${newHw.title}`,
      message: `Cô Emily vừa giao bài tập mới cho ${newHw.className}. Hạn nộp ngày: ${newHw.dueDate}. Các con vào làm để nhận sao nhé!`,
      type: 'homework',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleCreateMaterial = (newMatData: Omit<StudyMaterial, 'id'>) => {
    const newMat: StudyMaterial = {
      ...newMatData,
      id: `mat-${Date.now()}`
    };
    setMaterials((prev) => [newMat, ...prev]);
  };

  const handleBroadcastNotification = (
    title: string,
    message: string,
    type: 'schedule' | 'homework' | 'attendance' | 'announcement'
  ) => {
    const notif: AppNotification = {
      id: `notif-bc-${Date.now()}`,
      targetRole: 'all',
      title,
      message,
      type,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleParentSendMessage = (message: string) => {
    const notif: AppNotification = {
      id: `notif-parent-msg-${Date.now()}`,
      targetRole: 'teacher',
      title: `💬 Lời nhắn từ phụ huynh (${currentUser.name})`,
      message,
      type: 'announcement',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleCreateClass = (newClassData: Omit<ClassRoom, 'id'>, enrolledStudentIds?: string[]) => {
    const newClassId = `class-${Date.now()}`;
    const newClass: ClassRoom = {
      ...newClassData,
      id: newClassId
    };
    setClasses((prev) => [...prev, newClass]);

    // If students were assigned to this new class, update their classId & grade:
    if (enrolledStudentIds && enrolledStudentIds.length > 0) {
      setUsers((prev) =>
        prev.map((u) =>
          enrolledStudentIds.includes(u.id)
            ? { ...u, classId: newClassId, grade: newClass.grade, gradeLabel: newClass.gradeLabel }
            : u
        )
      );
    }

    // Dispatch broadcast notification so students & parents know a new class is open for registration
    const notif: AppNotification = {
      id: `notif-class-${Date.now()}`,
      targetRole: 'all',
      title: `🏫 Mở lớp tiếng Anh mới: ${newClass.name}!`,
      message: `StarKids vừa mở thêm lớp ${newClass.name} (${newClass.gradeLabel || `Khối ${newClass.grade}`} • ${newClass.scheduleDescription}) do ${newClass.teacherName} phụ trách tại ${newClass.roomNumber}. Học sinh & phụ huynh có thể đăng ký ngay!`,
      type: 'announcement',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleUpdateClass = (updatedClass: ClassRoom, enrolledStudentIds?: string[]) => {
    setClasses((prev) => prev.map((c) => (c.id === updatedClass.id ? updatedClass : c)));
    if (enrolledStudentIds) {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.role === 'student') {
            if (enrolledStudentIds.includes(u.id)) {
              return { ...u, classId: updatedClass.id, grade: updatedClass.grade, gradeLabel: updatedClass.gradeLabel };
            } else if (u.classId === updatedClass.id) {
              return { ...u, classId: undefined, gradeLabel: undefined };
            }
          }
          return u;
        })
      );
    }
  };

  const handleEnrollStudents = (classId: string, studentIdsToAdd: string[]) => {
    const targetClass = classes.find((c) => c.id === classId);
    setUsers((prev) =>
      prev.map((u) =>
        studentIdsToAdd.includes(u.id)
          ? { ...u, classId, grade: targetClass ? targetClass.grade : u.grade }
          : u
      )
    );
    const notif: AppNotification = {
      id: `notif-enroll-${Date.now()}`,
      targetRole: 'all',
      title: `🎉 Xếp lớp học: ${targetClass?.name || 'Lớp mới'}`,
      message: `Đã có thêm ${studentIdsToAdd.length} học sinh chính thức tham gia lớp ${targetClass?.name || ''}.`,
      type: 'announcement',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleRemoveStudentFromClass = (studentId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === studentId ? { ...u, classId: undefined } : u))
    );
  };

  const handleTransferStudentClass = (studentId: string, newClassId: string) => {
    const targetClass = classes.find((c) => c.id === newClassId);
    setUsers((prev) =>
      prev.map((u) =>
        u.id === studentId
          ? { ...u, classId: newClassId, grade: targetClass ? targetClass.grade : u.grade }
          : u
      )
    );
    const stu = users.find((u) => u.id === studentId);
    if (stu && targetClass) {
      const notif: AppNotification = {
        id: `notif-transfer-${Date.now()}`,
        targetRole: 'all',
        title: `🔄 Điều chuyển lớp: ${stu.name}`,
        message: `Học sinh ${stu.name} đã được chuyển sang lớp ${targetClass.name} (${targetClass.scheduleDescription}) do ${targetClass.teacherName} phụ trách.`,
        type: 'announcement',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        read: false
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  const handleChangeClassTeacher = (classId: string, newTeacherName: string) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === classId ? { ...c, teacherName: newTeacherName } : c))
    );
  };

  const handleAwardStars = (studentId: string, starsToAdd: number, reason: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === studentId ? { ...u, stars: (u.stars || 0) + starsToAdd } : u
      )
    );
    const stu = users.find((u) => u.id === studentId);
    if (stu) {
      const notif: AppNotification = {
        id: `notif-star-${Date.now()}`,
        targetRole: 'all',
        targetUserId: studentId,
        title: `⭐ Khen thưởng: +${starsToAdd} sao cho ${stu.name}!`,
        message: `${reason} - Chúc mừng bé ${stu.name} đã tích lũy thêm điểm thưởng sao danh dự!`,
        type: 'award',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        read: false
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  const handleDeleteClass = (classId: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== classId));
  };

  const handleAddTeacher = (newTeacher: User, assignedClassIds: string[]) => {
    setUsers((prev) => [newTeacher, ...prev]);
    if (assignedClassIds.length > 0) {
      setClasses((prev) =>
        prev.map((cls) =>
          assignedClassIds.includes(cls.id) ? { ...cls, teacherName: newTeacher.name } : cls
        )
      );
    }
    const notif: AppNotification = {
      id: `notif-teacher-${Date.now()}`,
      targetRole: 'all',
      title: `👩‍🏫 Chào mừng giáo viên mới: ${newTeacher.name}!`,
      message: `${newTeacher.name} (${newTeacher.levelTitle}) vừa chính thức gia nhập đội ngũ giảng dạy StarKids English!`,
      type: 'announcement',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleUpdateTeacher = (updatedTeacher: User, assignedClassIds: string[]) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedTeacher.id ? updatedTeacher : u)));
    setClasses((prev) =>
      prev.map((cls) => {
        if (assignedClassIds.includes(cls.id)) {
          return { ...cls, teacherName: updatedTeacher.name };
        } else if (
          cls.teacherName.includes(updatedTeacher.name) &&
          !assignedClassIds.includes(cls.id)
        ) {
          return { ...cls, teacherName: 'Đang xếp giáo viên' };
        }
        return cls;
      })
    );
  };

  const handleDeleteTeacher = (teacherId: string) => {
    const teacher = users.find((u) => u.id === teacherId);
    setUsers((prev) => prev.filter((u) => u.id !== teacherId));
    if (teacher) {
      setClasses((prev) =>
        prev.map((cls) =>
          cls.teacherName.includes(teacher.name) ? { ...cls, teacherName: 'Đang xếp giáo viên' } : cls
        )
      );
    }
  };

  const handleSendTestReminder = () => {
    const sampleReminders = [
      {
        title: '⏰ Nhắc nhở: Buổi học tiếng Anh bắt đầu sau 2 tiếng!',
        message: 'Lớp Movers 3A có buổi học lúc 18:30 tại Phòng 201. Nhớ mang theo tài liệu Unit 4 con nhé!',
        type: 'schedule' as const
      },
      {
        title: '⚠️ Nhắc nhở: Hạn nộp bài tập Unit 4 tối nay',
        message: 'Các bạn nhỏ chưa hoàn thành bài Animal Safari nhớ nộp trước 21h00 để được cô chấm điểm và thưởng sao nhé!',
        type: 'homework' as const
      }
    ];

    const pick = sampleReminders[Math.floor(Math.random() * sampleReminders.length)];
    const notif: AppNotification = {
      id: `notif-test-${Date.now()}`,
      targetRole: 'all',
      title: pick.title,
      message: pick.message,
      type: pick.type,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Find linked student for parent role
  const linkedStudent =
    users.find((u) => u.id === currentUser.studentId) ||
    users.find((u) => u.id === 'stu-1') ||
    users.find((u) => u.role === 'student' && u.status === 'approved') ||
    users[1];

  const currentStudentClass = classes.find(
    (c) => c.id === (currentUser.role === 'parent' ? linkedStudent.classId : currentUser.classId)
  );

  // If user is not logged in, show dedicated real-world LoginPage
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F8FAF9]">
        <LoginPage
          onLogin={handleLogin}
          onOpenRegister={() => setIsRegisterOpen(true)}
          allUsers={users}
        />
        {isRegisterOpen && (
          <RegisterModal
            isOpen={isRegisterOpen}
            onClose={() => setIsRegisterOpen(false)}
            classes={classes}
            onRegisterSubmit={handleRegisterSubmit}
            onSwitchToTeacher={() => {
              const teacher = users.find((u) => u.role === 'teacher') || users[0];
              handleLogin(teacher);
              setIsRegisterOpen(false);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-amber-200 selection:text-amber-900">
      {/* Header with strictly active-role navigation (demo role switcher removed) */}
      <Header
        currentUser={currentUser}
        activeTab={getActiveTab()}
        onSelectTab={handleSelectTab}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onLogout={handleLogout}
        notifications={notifications}
        pendingCount={pendingCount}
        pendingSubmissionsCount={pendingSubmissionsCount}
        pendingHwCount={pendingHwCount}
      />

      {/* Main App Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Role: ADMIN */}
        {currentUser.role === 'admin' && (
          <AdminPortal
            adminUser={currentUser}
            allUsers={users}
            classes={classes}
            attendanceRecords={attendance}
            submissions={submissions}
            activeTab={adminTab}
            onTabChange={setAdminTab}
            onApproveStudent={handleApproveStudent}
            onBroadcastNotification={handleBroadcastNotification}
            onCreateClass={handleCreateClass}
            onUpdateClass={handleUpdateClass}
            onDeleteClass={handleDeleteClass}
            onEnrollStudents={handleEnrollStudents}
            onRemoveStudentFromClass={handleRemoveStudentFromClass}
            onTransferStudentClass={handleTransferStudentClass}
            onChangeClassTeacher={handleChangeClassTeacher}
            onAwardStars={handleAwardStars}
            onAddTeacher={handleAddTeacher}
            onUpdateTeacher={handleUpdateTeacher}
            onDeleteTeacher={handleDeleteTeacher}
          />
        )}

        {/* Role: TEACHER */}
        {currentUser.role === 'teacher' && (
          <TeacherAdminPortal
            teacher={currentUser}
            classes={classes}
            allUsers={users}
            attendanceRecords={attendance}
            homeworkList={homework}
            submissions={submissions}
            materials={materials}
            activeTab={teacherTab}
            onTabChange={setTeacherTab}
            onSaveAttendance={handleSaveAttendance}
            onApproveStudent={handleApproveStudent}
            onGradeSubmission={handleGradeSubmission}
            onCreateHomework={handleCreateHomework}
            onCreateMaterial={handleCreateMaterial}
            onBroadcastNotification={handleBroadcastNotification}
            onCreateClass={handleCreateClass}
            onDeleteClass={handleDeleteClass}
          />
        )}

        {/* Role: STUDENT */}
        {currentUser.role === 'student' && (
          <StudentPortal
            student={currentUser}
            allStudents={users}
            classInfo={currentStudentClass}
            homeworkList={homework.filter((h) => !currentUser.grade || h.grade === currentUser.grade)}
            submissions={submissions}
            materials={materials.filter((m) => !currentUser.grade || m.grade === currentUser.grade)}
            attendanceRecords={attendance}
            activeTab={studentTab}
            onTabChange={setStudentTab}
            onOpenHomeworkModal={(hw) => setActiveHomeworkModal(hw)}
            onOpenMaterialModal={(mat) => setActiveMaterialModal(mat)}
          />
        )}

        {/* Role: PARENT */}
        {currentUser.role === 'parent' && (
          <ParentPortal
            parentUser={currentUser}
            linkedStudent={linkedStudent}
            classInfo={currentStudentClass}
            attendanceRecords={attendance}
            homeworkList={homework.filter((h) => !linkedStudent.grade || h.grade === linkedStudent.grade)}
            submissions={submissions}
            notifications={notifications}
            activeTab={parentTab}
            onTabChange={setParentTab}
            onSendMessageToTeacher={handleParentSendMessage}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-heading font-black text-slate-800 text-sm">
              StarKids English Club
            </span>
            <span className="text-slate-300">•</span>
            <span>Ứng Dụng Quản Lý Lớp Học & Tiến Độ Tiếng Anh Tiểu Học (Lớp 1 - 5)</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="text-amber-600 hover:text-amber-700 cursor-pointer"
            >
              + Đăng ký học sinh mới
            </button>
            <span className="text-slate-300">•</span>
            <span className="text-slate-400">Hotline: 024.7300.9999</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Student Registration Modal */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        classes={classes}
        onRegisterSubmit={handleRegisterSubmit}
        onSwitchToTeacher={() => {
          const teacher = users.find((u) => u.role === 'teacher');
          if (teacher) setCurrentUserId(teacher.id);
        }}
      />

      {/* 2. Kid-Friendly Interactive Homework Quiz Modal */}
      {activeHomeworkModal && (
        <InteractiveHomeworkModal
          homework={activeHomeworkModal}
          isOpen={!!activeHomeworkModal}
          onClose={() => setActiveHomeworkModal(null)}
          onSubmitHomework={handleSubmitHomework}
          studentId={currentUser.id}
          studentName={currentUser.name}
          englishName={currentUser.englishName}
          existingSubmission={submissions.find(
            (s) => s.homeworkId === activeHomeworkModal.id && s.studentId === currentUser.id
          )}
        />
      )}

      {/* 3. Interactive Material & Flashcard Viewer Modal */}
      {activeMaterialModal && (
        <MaterialViewerModal
          material={activeMaterialModal}
          isOpen={!!activeMaterialModal}
          onClose={() => setActiveMaterialModal(null)}
        />
      )}

      {/* 4. Automated Notifications & Reminders Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
        onSendTestReminder={handleSendTestReminder}
      />
    </div>
  );
}
