export type UserRole = 'student' | 'teacher' | 'parent' | 'admin';

export type GradeLevel = 1 | 2 | 3 | 4 | 5 | number | string;

export type AccountStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  englishName?: string;
  avatar: string;
  role: UserRole;
  email: string;
  phone?: string;
  grade?: GradeLevel;
  gradeLabel?: string;
  classId?: string;
  status: AccountStatus;
  registeredAt: string;
  studentId?: string; // For parent account linked to student
  parentName?: string;
  parentPhone?: string;
  parentRelationship?: 'Ba' | 'Mẹ' | 'Người giám hộ' | string;
  birthDate?: string;
  schoolName?: string;
  address?: string;
  commitmentAccepted?: boolean;
  commitmentDate?: string;
  studentSignedName?: string;
  parentSignedName?: string;
  locationName?: string; // e.g., "Nhà văn hóa Thôn 16"
  stars?: number;
  levelTitle?: string;
}

export interface ClassRoom {
  id: string;
  name: string; // e.g., "Starters 1A (Lớp 1)", "Movers 3B (Lớp 3)", "Flyers 5A (Lớp 5)"
  grade: GradeLevel;
  gradeLabel?: string; // Tên hiển thị của khối lớp (VD: Khối Lớp 3, Khối Mầm Non, Khối Song Ngữ...)
  teacherName: string;
  roomNumber: string;
  scheduleDescription: string; // e.g., "Thứ 2, 4 (17:30 - 19:00)"
  daysOfWeek: number[]; // 1 = Monday, 3 = Wednesday, etc.
  timeSlot: string; // "17:30 - 19:00"
  color: string;
  currentUnit: string;
  studentCount: number;
}

export type AttendanceStatus = 'present' | 'late' | 'excused' | 'absent';

export interface AttendanceRecord {
  id: string;
  classId: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  studentName: string;
  englishName?: string;
  status: AttendanceStatus;
  note?: string;
  checkInTime?: string;
  recordedBy: string;
}

export interface HomeworkQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'fill-in' | 'vocab-match';
  options?: string[];
  correctAnswer: string;
  audioPrompt?: string;
  imageUrl?: string;
}

export interface Homework {
  id: string;
  classId: string;
  className: string;
  grade: GradeLevel;
  title: string;
  unit: string;
  description: string;
  dueDate: string;
  assignedDate: string;
  points: number; // Max score, e.g. 10
  questions: HomeworkQuestion[];
}

export interface HomeworkSubmission {
  id: string;
  homeworkId: string;
  classId?: string;
  className?: string;
  studentId: string;
  studentName: string;
  englishName?: string;
  submittedAt: string;
  answers: Record<string, string>; // questionId -> answer
  score?: number; // 0 to 10
  starsAwarded?: number;
  teacherFeedback?: string;
  feedbackSticker?: string; // 'super-star' | 'excellent' | 'good-effort' | 'champion'
  status: 'submitted' | 'graded';
  gradedAt?: string;
}

export type MaterialType = 'pdf' | 'audio' | 'flashcard' | 'video' | 'worksheet';

export interface StudyMaterial {
  id: string;
  title: string;
  unit: string;
  grade: GradeLevel;
  classId?: string;
  type: MaterialType;
  description: string;
  url?: string;
  fileSize?: string;
  downloadCount: number;
  uploadedAt: string;
  tags: string[];
  // For interactive flashcard or audio preview:
  audioUrl?: string;
  vocabItems?: { en: string; vi: string; phonetic: string; icon: string }[];
}

export interface AppNotification {
  id: string;
  targetRole: 'all' | 'student' | 'parent' | 'teacher';
  targetUserId?: string; // or specific user
  classId?: string;
  title: string;
  message: string;
  type: 'schedule' | 'homework' | 'attendance' | 'announcement' | 'award';
  createdAt: string;
  read: boolean;
  actionUrl?: string;
}

export interface StudentBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic';
}
