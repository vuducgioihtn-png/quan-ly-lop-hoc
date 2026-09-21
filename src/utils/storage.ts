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
  try {
    const sessionVal = sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    if (sessionVal) return JSON.parse(sessionVal);
  } catch (e) {}
  return '';
}

export function saveCurrentUserId(id: string): void {
  try {
    if (id) {
      sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, JSON.stringify(id));
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
  } catch (e) {}
}

export function loadIsLoggedIn(): boolean {
  try {
    // Clear any previous persistent login state so visitors entering homepage link always see login first
    localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
    const sessionVal = sessionStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
    if (sessionVal !== null) {
      return JSON.parse(sessionVal) === true;
    }
  } catch (e) {}
  return false;
}

export function saveIsLoggedIn(isLoggedIn: boolean): void {
  try {
    if (isLoggedIn) {
      sessionStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, JSON.stringify(true));
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
      sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }
    localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
  } catch (e) {}
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

export interface AppDatabaseState {
  users: User[];
  classes: ClassRoom[];
  attendance: AttendanceRecord[];
  homework: Homework[];
  submissions: HomeworkSubmission[];
  materials: StudyMaterial[];
  notifications: AppNotification[];
  lastUpdated?: string;
}

/**
 * Fetch synchronized database state from server
 */
export async function fetchServerState(): Promise<AppDatabaseState | null> {
  try {
    const res = await fetch('/api/data');
    if (!res.ok) return null;
    const data: AppDatabaseState = await res.json();
    if (data && Array.isArray(data.users) && data.users.length > 0) {
      // Keep localStorage in sync as well
      saveUsers(data.users);
      if (Array.isArray(data.classes)) saveClasses(data.classes);
      if (Array.isArray(data.attendance)) saveAttendance(data.attendance);
      if (Array.isArray(data.homework)) saveHomework(data.homework);
      if (Array.isArray(data.submissions)) saveSubmissions(data.submissions);
      if (Array.isArray(data.materials)) saveMaterials(data.materials);
      if (Array.isArray(data.notifications)) saveNotifications(data.notifications);
      return data;
    }
    return null;
  } catch (err) {
    console.warn('Network sync error, continuing with local storage:', err);
    return null;
  }
}

/**
 * Push updated database state to server
 */
export async function syncServerState(state: Partial<AppDatabaseState>): Promise<boolean> {
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(state)
    });
    return res.ok;
  } catch (err) {
    console.warn('Failed to sync state to server:', err);
    return false;
  }
}

/**
 * Export backup as JSON file download (Sanitizes passwords to protect personal privacy)
 */
export function exportDatabaseBackup(state: AppDatabaseState): void {
  try {
    // Sanitize sensitive credentials to protect personal data privacy
    const sanitizedState = {
      ...state,
      users: state.users.map((u) => ({
        ...u,
        password: u.password ? '●●●●●●●●' : undefined
      })),
      exportedAt: new Date().toISOString(),
      securityNotice: 'Tài liệu quản trị trường học nội bộ - Tuân thủ bảo mật thông tin cá nhân học sinh & giáo viên'
    };

    const jsonStr = JSON.stringify(sanitizedState, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `StarKids_Security_Backup_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error('Failed to export backup', e);
  }
}

/**
 * Validate and parse uploaded JSON backup
 */
export function importDatabaseBackup(jsonString: string): AppDatabaseState | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || !Array.isArray(parsed.users)) {
      throw new Error('Dữ liệu không hợp lệ: Thiếu danh sách người dùng (users)');
    }
    return {
      users: parsed.users,
      classes: Array.isArray(parsed.classes) ? parsed.classes : [],
      attendance: Array.isArray(parsed.attendance) ? parsed.attendance : [],
      homework: Array.isArray(parsed.homework) ? parsed.homework : [],
      submissions: Array.isArray(parsed.submissions) ? parsed.submissions : [],
      materials: Array.isArray(parsed.materials) ? parsed.materials : [],
      notifications: Array.isArray(parsed.notifications) ? parsed.notifications : [],
      lastUpdated: new Date().toISOString()
    };
  } catch (e) {
    console.error('Invalid JSON backup file', e);
    return null;
  }
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
