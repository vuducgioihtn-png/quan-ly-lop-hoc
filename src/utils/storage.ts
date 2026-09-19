import {
  User,
  ClassRoom,
  AttendanceRecord,
  Homework,
  HomeworkSubmission,
  StudyMaterial,
  AppNotification
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_CLASSES,
  INITIAL_ATTENDANCE,
  INITIAL_HOMEWORK,
  INITIAL_SUBMISSIONS,
  INITIAL_MATERIALS,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';

const STORAGE_KEYS = {
  USERS: 'starkids_users_v1',
  CURRENT_USER_ID: 'starkids_current_user_id_v1',
  IS_LOGGED_IN: 'starkids_is_logged_in_v1',
  CLASSES: 'starkids_classes_v1',
  ATTENDANCE: 'starkids_attendance_v1',
  HOMEWORK: 'starkids_homework_v1',
  SUBMISSIONS: 'starkids_submissions_v1',
  MATERIALS: 'starkids_materials_v1',
  NOTIFICATIONS: 'starkids_notifications_v1'
};

function getStoredItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Failed to read from localStorage key ${key}`, e);
    return fallback;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to save to localStorage key ${key}`, e);
  }
}

export function loadUsers(): User[] {
  const users = getStoredItem(STORAGE_KEYS.USERS, INITIAL_USERS);
  
  // Ensure all initial teachers are present
  const initialTeachers = INITIAL_USERS.filter((u) => u.role === 'teacher');
  for (const t of initialTeachers) {
    if (!users.some((u) => u.id === t.id || u.email === t.email)) {
      users.push(t);
    }
  }

  const hasAdmin = users.some((u) => u.role === 'admin');
  if (!hasAdmin) {
    const admin = INITIAL_USERS.find((u) => u.role === 'admin');
    if (admin) {
      users.unshift(admin);
    }
  }
  return users;
}

export function saveUsers(users: User[]): void {
  setStoredItem(STORAGE_KEYS.USERS, users);
}

export function loadCurrentUserId(): string {
  return getStoredItem(STORAGE_KEYS.CURRENT_USER_ID, 'teacher-1');
}

export function saveCurrentUserId(id: string): void {
  setStoredItem(STORAGE_KEYS.CURRENT_USER_ID, id);
}

export function loadIsLoggedIn(): boolean {
  return getStoredItem(STORAGE_KEYS.IS_LOGGED_IN, true);
}

export function saveIsLoggedIn(isLoggedIn: boolean): void {
  setStoredItem(STORAGE_KEYS.IS_LOGGED_IN, isLoggedIn);
}

export function loadClasses(): ClassRoom[] {
  return getStoredItem(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
}

export function saveClasses(classes: ClassRoom[]): void {
  setStoredItem(STORAGE_KEYS.CLASSES, classes);
}

export function loadAttendance(): AttendanceRecord[] {
  return getStoredItem(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
}

export function saveAttendance(records: AttendanceRecord[]): void {
  setStoredItem(STORAGE_KEYS.ATTENDANCE, records);
}

export function loadHomework(): Homework[] {
  return getStoredItem(STORAGE_KEYS.HOMEWORK, INITIAL_HOMEWORK);
}

export function saveHomework(homeworks: Homework[]): void {
  setStoredItem(STORAGE_KEYS.HOMEWORK, homeworks);
}

export function loadSubmissions(): HomeworkSubmission[] {
  return getStoredItem(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
}

export function saveSubmissions(submissions: HomeworkSubmission[]): void {
  setStoredItem(STORAGE_KEYS.SUBMISSIONS, submissions);
}

export function loadMaterials(): StudyMaterial[] {
  return getStoredItem(STORAGE_KEYS.MATERIALS, INITIAL_MATERIALS);
}

export function saveMaterials(materials: StudyMaterial[]): void {
  setStoredItem(STORAGE_KEYS.MATERIALS, materials);
}

export function loadNotifications(): AppNotification[] {
  return getStoredItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
}

export function saveNotifications(notifications: AppNotification[]): void {
  setStoredItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
}

/**
 * Text-to-speech helper for English pronunciation
 */
export function playEnglishPronunciation(text: string): void {
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.85; // Slightly slower for primary school kids
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis error:', e);
  }
}
