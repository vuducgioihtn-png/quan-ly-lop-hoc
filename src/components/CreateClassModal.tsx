import React, { useState } from 'react';
import { X, School, Calendar, Clock, MapPin, Sparkles, BookOpen, User, Check, Plus, Users, Search } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ClassRoom, GradeLevel, User as UserType } from '../types';

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTeacherName?: string;
  teachers?: UserType[];
  allStudents?: UserType[];
  onCreateClass: (newClass: Omit<ClassRoom, 'id'>, enrolledStudentIds?: string[]) => void;
  initialClass?: ClassRoom;
}

const COLOR_OPTIONS = [
  { id: 'from-amber-400 to-orange-500', name: 'Vàng Cam (Ấm áp)', preview: 'bg-gradient-to-r from-amber-400 to-orange-500' },
  { id: 'from-emerald-400 to-teal-500', name: 'Xanh Lá (Tươi mới)', preview: 'bg-gradient-to-r from-emerald-400 to-teal-500' },
  { id: 'from-blue-500 to-indigo-600', name: 'Xanh Dương (Thông thái)', preview: 'bg-gradient-to-r from-blue-500 to-indigo-600' },
  { id: 'from-purple-500 to-pink-500', name: 'Tím Hồng (Sáng tạo)', preview: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { id: 'from-cyan-500 to-blue-600', name: 'Xanh Biển (Năng động)', preview: 'bg-gradient-to-r from-cyan-500 to-blue-600' },
  { id: 'from-rose-500 to-red-500', name: 'Đỏ Hồng (Nhiệt huyết)', preview: 'bg-gradient-to-r from-rose-500 to-red-500' }
];

const SCHEDULE_PRESETS = [
  { label: 'Thứ 2 & Thứ 4 (17:00 - 18:30)', days: [1, 3], time: '17:00 - 18:30', desc: 'Thứ 2 & Thứ 4 (17:00 - 18:30)' },
  { label: 'Thứ 2 & Thứ 4 (18:30 - 20:00)', days: [1, 3], time: '18:30 - 20:00', desc: 'Thứ 2 & Thứ 4 (18:30 - 20:00)' },
  { label: 'Thứ 3 & Thứ 5 (17:30 - 19:00)', days: [2, 4], time: '17:30 - 19:00', desc: 'Thứ 3 & Thứ 5 (17:30 - 19:00)' },
  { label: 'Thứ 3 & Thứ 5 (19:00 - 20:30)', days: [2, 4], time: '19:00 - 20:30', desc: 'Thứ 3 & Thứ 5 (19:00 - 20:30)' },
  { label: 'Thứ 7 & Chủ Nhật (08:30 - 10:00)', days: [6, 0], time: '08:30 - 10:00', desc: 'Thứ 7 & Chủ Nhật (08:30 - 10:00)' },
  { label: 'Thứ 7 & Chủ Nhật (14:30 - 16:00)', days: [6, 0], time: '14:30 - 16:00', desc: 'Thứ 7 & Chủ Nhật (14:30 - 16:00)' }
];

const ROOM_PRESETS = ['Phòng 101 - Tầng 1', 'Phòng 102 - Tầng 1', 'Phòng 104 - Tầng 1', 'Phòng 201 - Tầng 2', 'Phòng 202 - Tầng 2', 'SmartLab 301 - Tầng 3'];

export const CreateClassModal: React.FC<CreateClassModalProps> = ({
  isOpen,
  onClose,
  defaultTeacherName,
  teachers = [],
  allStudents = [],
  onCreateClass,
  initialClass
}) => {
  const [grade, setGrade] = useState<GradeLevel>(initialClass?.grade || 3);
  const [isCustomGrade, setIsCustomGrade] = useState<boolean>(
    Boolean(
      initialClass?.gradeLabel &&
      !['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5', 'Khối Lớp 1', 'Khối Lớp 2', 'Khối Lớp 3', 'Khối Lớp 4', 'Khối Lớp 5'].includes(initialClass.gradeLabel)
    )
  );
  const [customGradeName, setCustomGradeName] = useState<string>(
    initialClass?.gradeLabel || (typeof initialClass?.grade === 'string' ? initialClass.grade : '')
  );
  const [gradeLabel, setGradeLabel] = useState<string>(
    initialClass?.gradeLabel || (initialClass?.grade ? `Khối Lớp ${initialClass.grade}` : 'Khối Lớp 3')
  );
  const [name, setName] = useState(initialClass?.name || 'Movers 3B (Khối Lớp 3)');
  const [teacherName, setTeacherName] = useState(initialClass?.teacherName || defaultTeacherName || (teachers[0]?.name ?? 'Cô Emily (Thu Hương)'));
  const [roomNumber, setRoomNumber] = useState(initialClass?.roomNumber || 'Phòng 202 - Tầng 2');
  const [timeSlot, setTimeSlot] = useState(initialClass?.timeSlot || '18:30 - 20:00');
  const [selectedDays, setSelectedDays] = useState<number[]>(initialClass?.daysOfWeek || [1, 3]);
  const [scheduleDescription, setScheduleDescription] = useState(initialClass?.scheduleDescription || 'Thứ 2 & Thứ 4 (18:30 - 20:00)');
  const [color, setColor] = useState(initialClass?.color || COLOR_OPTIONS[2].id);
  const [currentUnit, setCurrentUnit] = useState(initialClass?.currentUnit || 'Unit 1: Welcome & Getting Started');
  const [maxCapacity, setMaxCapacity] = useState<number>(15);

  // Student Enrollment State
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(
    initialClass ? allStudents.filter((s) => s.classId === initialClass.id).map((s) => s.id) : []
  );
  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilter, setStudentFilter] = useState<string>('current');
  const [customGradeFilterText, setCustomGradeFilterText] = useState<string>('');

  if (!isOpen) return null;

  // Update suggested class name when standard grade button clicked
  const handleGradeChange = (newGrade: GradeLevel, label?: string) => {
    setIsCustomGrade(false);
    setGrade(newGrade);
    const lbl = label || `Khối Lớp ${newGrade}`;
    setGradeLabel(lbl);
    const prefix =
      newGrade === 1 ? 'Starters 1' : newGrade === 2 ? 'Starters 2' : newGrade === 3 ? 'Movers 3' : newGrade === 4 ? 'Movers 4' : 'Flyers 5';
    setName(`${prefix}B (${lbl})`);
  };

  // Custom grade name selection or typing
  const handleCustomGradeChange = (customName: string, prefixSuggestion?: string) => {
    setIsCustomGrade(true);
    setCustomGradeName(customName);
    setGradeLabel(customName);
    if (customName.trim()) {
      const prefix = prefixSuggestion || customName.replace(/^Khối\s+/i, '');
      setName(`${prefix} 1A (${customName.trim()})`);
    }
  };

  const handleApplyPreset = (preset: typeof SCHEDULE_PRESETS[0]) => {
    setSelectedDays(preset.days);
    setTimeSlot(preset.time);
    setScheduleDescription(preset.desc);
  };

  const toggleDay = (day: number) => {
    let updated: number[];
    if (selectedDays.includes(day)) {
      updated = selectedDays.filter((d) => d !== day);
    } else {
      updated = [...selectedDays, day].sort();
    }
    setSelectedDays(updated);

    const dayLabels: Record<number, string> = {
      1: 'Thứ 2',
      2: 'Thứ 3',
      3: 'Thứ 4',
      4: 'Thứ 5',
      5: 'Thứ 6',
      6: 'Thứ 7',
      0: 'Chủ Nhật'
    };
    const daysText = updated.map((d) => dayLabels[d]).join(' & ') || 'Chưa chọn ngày';
    setScheduleDescription(`${daysText} (${timeSlot})`);
  };

  const toggleStudentEnroll = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter students eligible for selection
  const eligibleStudents = allStudents.filter((s) => {
    if (s.role !== 'student') return false;

    // Filter by grade tab
    if (studentFilter === 'current') {
      if (isCustomGrade) {
        const target = customGradeName.trim().toLowerCase();
        if (target) {
          const sLabel = (s.gradeLabel || '').toLowerCase();
          const sGradeStr = String(s.grade || '').toLowerCase();
          if (!sLabel.includes(target) && !sGradeStr.includes(target)) return false;
        }
      } else {
        const sGradeNum = typeof s.grade === 'number' ? s.grade : parseInt(String(s.grade), 10);
        if (sGradeNum !== grade) return false;
      }
    } else if (['1', '2', '3', '4', '5'].includes(studentFilter)) {
      const targetNum = Number(studentFilter);
      const sGradeNum = typeof s.grade === 'number' ? s.grade : parseInt(String(s.grade), 10);
      if (sGradeNum !== targetNum) return false;
    } else if (studentFilter === 'unassigned') {
      if (s.classId) return false;
    } else if (studentFilter === 'custom') {
      if (customGradeFilterText.trim()) {
        const qG = customGradeFilterText.trim().toLowerCase();
        const sLabel = (s.gradeLabel || '').toLowerCase();
        const sGradeStr = String(s.grade || '').toLowerCase();
        if (!sLabel.includes(qG) && !sGradeStr.includes(qG)) return false;
      }
    }
    // 'all' passes through all students

    if (studentSearch.trim()) {
      const q = studentSearch.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        (s.englishName || '').toLowerCase().includes(q) ||
        (s.parentName || '').toLowerCase().includes(q) ||
        (s.phone || '').toLowerCase().includes(q) ||
        (s.gradeLabel || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalGradeLabel = (isCustomGrade ? customGradeName.trim() : gradeLabel.trim()) || (typeof grade === 'number' ? `Khối Lớp ${grade}` : String(grade));

    onCreateClass(
      {
        name: name.trim(),
        grade: isCustomGrade ? (customGradeName.trim() || 'Tùy chỉnh') : grade,
        gradeLabel: finalGradeLabel,
        teacherName: teacherName.trim(),
        roomNumber: roomNumber.trim(),
        scheduleDescription: scheduleDescription.trim() || `Lịch học: ${timeSlot}`,
        daysOfWeek: selectedDays.length > 0 ? selectedDays : [1, 3],
        timeSlot: timeSlot.trim(),
        color,
        currentUnit: currentUnit.trim() || 'Unit 1: Welcome',
        studentCount: selectedStudentIds.length
      },
      selectedStudentIds
    );

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-xs">
              <School className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-800 font-heading">
                {initialClass ? 'Chỉnh Sửa Thông Tin Lớp Học' : 'Mở Thêm Lớp Học Tiếng Anh Mới'}
              </h3>
              <p className="text-xs text-slate-500">
                Phân công giáo viên giảng dạy & xếp học sinh tham gia lớp học
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Grade and Custom Grade selection */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                1. Khối Lớp & Tự Đặt Tên Khối *
              </label>
              <button
                type="button"
                onClick={() => {
                  if (isCustomGrade) {
                    handleGradeChange(3, 'Khối Lớp 3');
                  } else {
                    handleCustomGradeChange(customGradeName || 'Khối Mầm Non (Kindy)', 'Kindy');
                  }
                }}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{isCustomGrade ? '← Chọn khối lớp 1-5' : '+ Tự đặt tên khối khác'}</span>
              </button>
            </div>

            {/* Quick preset buttons: Lớp 1 to 5 PLUS "Tự Đặt Khối" */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { g: 1, name: 'Lớp 1', sub: 'Starters' },
                { g: 2, name: 'Lớp 2', sub: 'Starters' },
                { g: 3, name: 'Lớp 3', sub: 'Movers' },
                { g: 4, name: 'Lớp 4', sub: 'Movers' },
                { g: 5, name: 'Lớp 5', sub: 'Flyers' }
              ].map((item) => (
                <button
                  type="button"
                  key={item.g}
                  onClick={() => handleGradeChange(item.g as GradeLevel, `Khối Lớp ${item.g}`)}
                  className={`py-2 px-1 rounded-xl text-center border transition-all cursor-pointer ${
                    !isCustomGrade && grade === item.g
                      ? 'bg-indigo-600 text-white border-indigo-600 font-black shadow-xs scale-102 ring-2 ring-indigo-200'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className="text-xs font-bold">{item.name}</div>
                  <div className={`text-[10px] ${!isCustomGrade && grade === item.g ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {item.sub}
                  </div>
                </button>
              ))}

              {/* 6th Button: Tự Đặt Tên Khối */}
              <button
                type="button"
                onClick={() => handleCustomGradeChange(customGradeName || 'Khối Mầm Non (Kindy)', 'Kindy')}
                className={`py-2 px-1 rounded-xl text-center border transition-all cursor-pointer ${
                  isCustomGrade
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-600 font-black shadow-xs scale-102 ring-2 ring-purple-200'
                    : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 font-bold'
                }`}
              >
                <div className="text-xs font-black flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Tự Đặt Khối</span>
                </div>
                <div className={`text-[10px] ${isCustomGrade ? 'text-purple-100' : 'text-purple-500'}`}>
                  Tùy chỉnh
                </div>
              </button>
            </div>

            {/* Custom Grade Name Input Field & Quick Suggestions */}
            <div className={`p-3 sm:p-3.5 rounded-2xl border transition-all ${
              isCustomGrade
                ? 'bg-purple-50/70 border-purple-200 shadow-2xs'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span>Tên khối lớp học:</span>
                  {isCustomGrade ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-black">
                      ✨ Khối tự đặt theo ý bạn
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-bold">
                      Khối chuẩn (có thể tự sửa tên)
                    </span>
                  )}
                </label>
                <span className="text-[11px] text-slate-400">
                  {isCustomGrade ? 'Nhập tên bất kỳ cho khối' : 'Gõ vào đây để đổi tên khối hiển thị'}
                </span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  required
                  value={isCustomGrade ? customGradeName : gradeLabel}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (isCustomGrade) {
                      handleCustomGradeChange(val);
                    } else {
                      setGradeLabel(val);
                    }
                  }}
                  placeholder="VD: Khối Mầm Non (Kindy), Khối Song Ngữ 3, Khối Lớp 6, Cambridge KET..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 bg-white font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Fast suggestions tags */}
              <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-slate-500 font-bold">Gợi ý nhanh:</span>
                {[
                  { label: 'Khối Mầm Non (Kindy)', prefix: 'Kindy' },
                  { label: 'Khối Song Ngữ Quốc Tế', prefix: 'Song Ngữ' },
                  { label: 'Khối Tiền Tiểu Học', prefix: 'Pre-Starters' },
                  { label: 'Khối Cambridge KET', prefix: 'Cambridge KET' },
                  { label: 'Khối Lớp 6 (Junior)', prefix: 'Junior 6' },
                  { label: 'Khối Luyện Thi HSG', prefix: 'Advanced' }
                ].map((sug) => (
                  <button
                    key={sug.label}
                    type="button"
                    onClick={() => handleCustomGradeChange(sug.label, sug.prefix)}
                    className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 text-slate-600 transition-all cursor-pointer shadow-2xs"
                  >
                    + {sug.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Class Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              2. Tên Lớp Học *
            </label>
            <input
              type="text"
              required
              placeholder="VD: Movers 3B (Khối Lớp 3)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400 flex-wrap">
              <span>Gợi ý tên lớp:</span>
              <button
                type="button"
                onClick={() => {
                  const numGrade = typeof grade === 'number' ? grade : parseInt(String(grade), 10) || 1;
                  const prefix = isCustomGrade
                    ? (customGradeName || 'Lớp')
                    : numGrade <= 2
                    ? `Starters ${numGrade}`
                    : numGrade <= 4
                    ? `Movers ${numGrade}`
                    : 'Flyers 5';
                  setName(`${prefix} 1A (${isCustomGrade ? customGradeName : `Khối Lớp ${grade}`})`);
                }}
                className="underline hover:text-indigo-600 font-medium cursor-pointer"
              >
                {(() => {
                  const numGrade = typeof grade === 'number' ? grade : parseInt(String(grade), 10) || 1;
                  return isCustomGrade ? `${customGradeName || 'Lớp'} 1A` : numGrade <= 2 ? `Starters ${numGrade}A` : numGrade <= 4 ? `Movers ${numGrade}A` : `Flyers 5A`;
                })()}
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  const numGrade = typeof grade === 'number' ? grade : parseInt(String(grade), 10) || 1;
                  const prefix = isCustomGrade
                    ? (customGradeName || 'Lớp')
                    : numGrade <= 2
                    ? `Starters ${numGrade}`
                    : numGrade <= 4
                    ? `Movers ${numGrade}`
                    : 'Flyers 5';
                  setName(`${prefix} 1B (${isCustomGrade ? customGradeName : `Khối Lớp ${grade}`})`);
                }}
                className="underline hover:text-indigo-600 font-medium cursor-pointer"
              >
                Lớp {isCustomGrade ? '1B' : `${grade}B`}
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  const prefix = isCustomGrade ? (customGradeName || 'Lớp') : `Lớp ${grade}`;
                  setName(`${prefix} (Cuối tuần)`);
                }}
                className="underline hover:text-indigo-600 font-medium cursor-pointer"
              >
                Cuối tuần
              </button>
            </div>
          </div>

          {/* Schedule Presets & Days */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>3. Lịch Học Trong Tuần & Khung Giờ *</span>
              <span className="text-[11px] font-normal text-slate-500">Bấm chọn nhanh hoặc tự chỉnh</span>
            </label>

            {/* Quick Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mb-2.5">
              {SCHEDULE_PRESETS.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleApplyPreset(p)}
                  className={`p-2 rounded-xl text-[11px] font-bold text-left border transition-all cursor-pointer truncate ${
                    scheduleDescription === p.desc
                      ? 'bg-indigo-50 border-indigo-400 text-indigo-900 font-black ring-1 ring-indigo-400'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Day Toggles */}
            <div className="flex items-center gap-1.5 flex-wrap mb-2">
              <span className="text-xs text-slate-500 font-semibold mr-1">Ngày học:</span>
              {[
                { day: 1, label: 'Thứ 2' },
                { day: 2, label: 'Thứ 3' },
                { day: 3, label: 'Thứ 4' },
                { day: 4, label: 'Thứ 5' },
                { day: 5, label: 'Thứ 6' },
                { day: 6, label: 'Thứ 7' },
                { day: 0, label: 'CN' }
              ].map((d) => (
                <button
                  type="button"
                  key={d.day}
                  onClick={() => toggleDay(d.day)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    selectedDays.includes(d.day)
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Time Slot input & Description summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Khung giờ học</label>
                <input
                  type="text"
                  value={timeSlot}
                  onChange={(e) => {
                    setTimeSlot(e.target.value);
                    setScheduleDescription(scheduleDescription.replace(/\(.*\)/, `(${e.target.value})`));
                  }}
                  placeholder="VD: 18:30 - 20:00"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Mô tả lịch học đầy đủ</label>
                <input
                  type="text"
                  value={scheduleDescription}
                  onChange={(e) => setScheduleDescription(e.target.value)}
                  placeholder="VD: Thứ 2 & Thứ 4 (18:30 - 20:00)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-medium text-indigo-800 font-bold bg-indigo-50/50"
                />
              </div>
            </div>
          </div>

          {/* Room and Teacher */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                4. Phòng Học Tại Trung Tâm *
              </label>
              <input
                type="text"
                required
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="VD: Phòng 201 - Tầng 2"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-medium"
              />
              <div className="flex items-center gap-1.5 mt-1 overflow-x-auto no-scrollbar">
                {ROOM_PRESETS.slice(0, 4).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRoomNumber(r)}
                    className="text-[10px] text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md whitespace-nowrap cursor-pointer"
                  >
                    {r.split(' - ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                5. Giáo Viên Giảng Dạy *
              </label>
              {teachers.length > 0 ? (
                <div className="space-y-1">
                  <select
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold text-slate-800 bg-white"
                  >
                    {teachers.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name} ({t.levelTitle || 'Giáo viên'})
                      </option>
                    ))}
                    <option value="Đang xếp giáo viên">Đang xếp giáo viên</option>
                  </select>
                </div>
              ) : (
                <input
                  type="text"
                  required
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="VD: Cô Emily (Thu Hương)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-medium"
                />
              )}
            </div>
          </div>

          {/* Current Unit and Max Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                6. Chủ Đề / Unit Khởi Điểm
              </label>
              <input
                type="text"
                value={currentUnit}
                onChange={(e) => setCurrentUnit(e.target.value)}
                placeholder="VD: Unit 1: Welcome & Family"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                7. Sĩ Số Tối Đa (Học sinh)
              </label>
              <input
                type="number"
                min={5}
                max={30}
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-medium"
              />
            </div>
          </div>

          {/* Student Selection for Class (Học sinh tham gia lớp) */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                  8. Xếp Học Sinh Tham Gia Lớp Ngay
                </label>
                <p className="text-[11px] text-slate-500">
                  Chọn học sinh để thêm trực tiếp vào lớp khi tạo ({selectedStudentIds.length} em đã chọn)
                </p>
              </div>

              {/* Quick Batch Actions */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {eligibleStudents.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const eligibleIds = eligibleStudents.map((s) => s.id);
                      const allSelected = eligibleIds.every((id) => selectedStudentIds.includes(id));
                      if (allSelected) {
                        setSelectedStudentIds((prev) => prev.filter((id) => !eligibleIds.includes(id)));
                      } else {
                        setSelectedStudentIds((prev) => Array.from(new Set([...prev, ...eligibleIds])));
                      }
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-800 transition-colors cursor-pointer"
                  >
                    {eligibleStudents.every((s) => selectedStudentIds.includes(s.id))
                      ? 'Bỏ chọn trang này'
                      : `+ Chọn tất cả (${eligibleStudents.length} em)`}
                  </button>
                )}
                {selectedStudentIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedStudentIds([])}
                    className="px-2 py-1 text-[11px] font-bold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                  >
                    Bỏ chọn ({selectedStudentIds.length})
                  </button>
                )}
              </div>
            </div>

            {/* Filter by Grades Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[11px] font-bold text-slate-500 shrink-0">Lọc khối:</span>

              {/* Lớp này / Khối đang tạo */}
              <button
                type="button"
                onClick={() => setStudentFilter('current')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  studentFilter === 'current'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Khối lớp này ({isCustomGrade ? customGradeName || 'Tùy chỉnh' : `Khối ${grade}`})
              </button>

              {/* Standard Grades 1 to 5 */}
              {[1, 2, 3, 4, 5].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setStudentFilter(String(g))}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                    studentFilter === String(g)
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  Khối {g}
                </button>
              ))}

              {/* Toàn trường */}
              <button
                type="button"
                onClick={() => setStudentFilter('all')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  studentFilter === 'all'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Toàn trường ({allStudents.filter((s) => s.role === 'student').length})
              </button>

              {/* Chưa có lớp */}
              <button
                type="button"
                onClick={() => setStudentFilter('unassigned')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  studentFilter === 'unassigned'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                Chưa có lớp ({allStudents.filter((s) => s.role === 'student' && !s.classId).length})
              </button>

              {/* Tùy chọn khối */}
              <button
                type="button"
                onClick={() => setStudentFilter('custom')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                  studentFilter === 'custom'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs'
                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Tùy chọn khối</span>
              </button>
            </div>

            {/* Custom Grade Filter Panel when 'custom' is active */}
            {studentFilter === 'custom' && (
              <div className="p-3 rounded-xl bg-purple-50/90 border border-purple-200 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-[11px] font-bold text-purple-900 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>Tùy chọn lọc theo khối lớp tùy chỉnh:</span>
                  </label>
                  {customGradeFilterText && (
                    <button
                      type="button"
                      onClick={() => setCustomGradeFilterText('')}
                      className="text-[10px] text-purple-700 hover:underline font-bold cursor-pointer"
                    >
                      Xóa bộ lọc
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  value={customGradeFilterText}
                  onChange={(e) => setCustomGradeFilterText(e.target.value)}
                  placeholder="Nhập tên khối cần lọc (VD: Mầm Non, Song Ngữ, Tiền Tiểu Học, Lớp 6, v.v.)..."
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-purple-200 bg-white font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-400"
                />

                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  <span className="text-[10px] text-purple-700 font-bold">Gợi ý chọn nhanh:</span>
                  {['Khối Mầm Non (Kindy)', 'Khối Song Ngữ', 'Khối Tiền Tiểu Học', 'Cambridge KET', 'Khối Lớp 6'].map(
                    (preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setCustomGradeFilterText(preset)}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-md border transition-all cursor-pointer ${
                          customGradeFilterText === preset
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white hover:bg-purple-100 text-purple-800 border-purple-200'
                        }`}
                      >
                        {preset}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Search within students and student count */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Tìm học sinh theo tên, tên tiếng Anh, SĐT..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-8 pr-24 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium"
              />
              <span className="absolute right-2.5 top-2 text-[10px] font-bold text-slate-400">
                {eligibleStudents.length} học sinh
              </span>
            </div>

            {/* Eligible students list */}
            <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
              {eligibleStudents.length > 0 ? (
                eligibleStudents.map((stu) => {
                  const isChecked = selectedStudentIds.includes(stu.id);
                  return (
                    <div
                      key={stu.id}
                      onClick={() => toggleStudentEnroll(stu.id)}
                      className={`p-2 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-indigo-100/90 border-indigo-400 shadow-xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <img
                          src={stu.avatar}
                          alt={stu.name}
                          className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 text-xs truncate flex items-center gap-1.5">
                            <span>{stu.name}</span>
                            {stu.englishName && <span className="text-indigo-600 font-bold">({stu.englishName})</span>}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                            <span className="px-1.5 py-0.2 rounded-sm bg-slate-100 text-slate-700 font-bold border border-slate-200">
                              {stu.gradeLabel || (typeof stu.grade === 'number' ? `Khối ${stu.grade}` : stu.grade || 'Chưa phân khối')}
                            </span>
                            <span>•</span>
                            <span>PH: {stu.parentName || 'Chưa cập nhật'}</span>
                            {stu.phone && <span>• {stu.phone}</span>}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                          stu.classId
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {stu.classId ? 'Đang có lớp' : 'Chưa có lớp'}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 italic text-center p-3 bg-white rounded-xl border border-dashed border-slate-200">
                  Không có học sinh nào phù hợp bộ lọc hiện tại.
                </p>
              )}
            </div>
          </div>

          {/* Color theme for class card */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              9. Màu Sắc Nhận Diện Thẻ Lớp
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_OPTIONS.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setColor(c.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    color === c.id
                      ? 'border-slate-800 ring-2 ring-slate-800 scale-105'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full ${c.preview}`} />
                  <span className="text-[11px] text-slate-700">{c.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-98 flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{initialClass ? 'Lưu Thông Tin Lớp' : 'Xác Nhận Mở Lớp Ngay'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
