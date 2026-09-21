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
 * Server Synchronization API
 */
export interface FullDatabasePayload {
  users?: User[];
  classes?: ClassRoom[];
  attendance?: AttendanceRecord[];
  homework?: Homework[];
  submissions?: HomeworkSubmission[];
  materials?: StudyMaterial[];
  notifications?: AppNotification[];
  lastUpdated?: string;
}

export async function fetchServerData(): Promise<FullDatabasePayload | null> {
  try {
    const res = await fetch('/api/data');
    if (!res.ok) return null;
    const json = await res.json();
    if (json && json.success && json.data) {
      const data: FullDatabasePayload = json.data;
      if (Array.isArray(data.users) && data.users.length > 0) {
        saveUsers(data.users);
      }
      if (Array.isArray(data.classes)) {
        saveClasses(data.classes);
      }
      if (Array.isArray(data.attendance)) {
        saveAttendance(data.attendance);
      }
      if (Array.isArray(data.homework)) {
        saveHomework(data.homework);
      }
      if (Array.isArray(data.submissions)) {
        saveSubmissions(data.submissions);
      }
      if (Array.isArray(data.materials)) {
        saveMaterials(data.materials);
      }
      if (Array.isArray(data.notifications)) {
        saveNotifications(data.notifications);
      }
      return data;
    }
  } catch (err) {
    console.info('Server sync offline or static mode, using local storage fallback:', err);
  }
  return null;
}

let syncTimeout: any = null;
export function syncDataToServer(payload: FullDatabasePayload): void {
  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }
  syncTimeout = setTimeout(async () => {
    try {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('Failed to sync data to server:', err);
    }
  }, 400);
}

export async function restoreDatabaseToServer(fullData: FullDatabasePayload): Promise<boolean> {
  try {
    const res = await fetch('/api/restore-db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullData)
    });
    if (res.ok) {
      if (fullData.users) saveUsers(fullData.users);
      if (fullData.classes) saveClasses(fullData.classes);
      if (fullData.attendance) saveAttendance(fullData.attendance);
      if (fullData.homework) saveHomework(fullData.homework);
      if (fullData.submissions) saveSubmissions(fullData.submissions);
      if (fullData.materials) saveMaterials(fullData.materials);
      if (fullData.notifications) saveNotifications(fullData.notifications);
      return true;
    }
  } catch (err) {
    console.error('Failed to restore database to server:', err);
  }
  return false;
}

export function downloadDatabaseJson(data: FullDatabasePayload): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `starkids_database_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
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
