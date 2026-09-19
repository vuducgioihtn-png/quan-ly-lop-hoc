import React, { useState } from 'react';
import {
  X,
  School,
  Users,
  UserPlus,
  UserMinus,
  Star,
  Phone,
  Mail,
  Calendar,
  Search,
  CheckCircle2,
  ArrowRightLeft,
  Edit3,
  Trash2,
  Clock,
  MapPin,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ClassRoom, User, AttendanceRecord } from '../types';

interface ClassRosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  classroom: ClassRoom;
  allStudents: User[];
  allTeachers: User[];
  allClasses: ClassRoom[];
  attendanceRecords: AttendanceRecord[];
  onEnrollStudents: (classId: string, studentIdsToAdd: string[]) => void;
  onRemoveStudentFromClass: (studentId: string) => void;
  onTransferStudent: (studentId: string, newClassId: string) => void;
  onChangeTeacher: (classId: string, newTeacherName: string) => void;
  onOpenEditClass?: (cls: ClassRoom) => void;
  onDeleteClass?: (classId: string) => void;
  onViewStudentDetail?: (student: User) => void;
}

export const ClassRosterModal: React.FC<ClassRosterModalProps> = ({
  isOpen,
  onClose,
  classroom,
  allStudents,
  allTeachers,
  allClasses,
  attendanceRecords,
  onEnrollStudents,
  onRemoveStudentFromClass,
  onTransferStudent,
  onChangeTeacher,
  onOpenEditClass,
  onDeleteClass,
  onViewStudentDetail
}) => {
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [searchEnrolled, setSearchEnrolled] = useState('');
  const [searchAvailable, setSearchAvailable] = useState('');
  const [selectedStudentIdsToAdd, setSelectedStudentIdsToAdd] = useState<string[]>([]);
  const [isChangingTeacher, setIsChangingTeacher] = useState(false);
  const [selectedTeacherName, setSelectedTeacherName] = useState(classroom.teacherName);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Enrolled students in this class
  const enrolledStudents = allStudents.filter(
    (s) => s.role === 'student' && s.classId === classroom.id
  );

  // Available students who are NOT in this class (for adding)
  const availableStudents = allStudents.filter(
    (s) => s.role === 'student' && s.classId !== classroom.id
  );

  const filteredEnrolled = enrolledStudents.filter((s) => {
    if (!searchEnrolled.trim()) return true;
    const q = searchEnrolled.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      (s.englishName || '').toLowerCase().includes(q) ||
      (s.parentName || '').toLowerCase().includes(q) ||
      (s.phone || '').includes(q) ||
      (s.parentPhone || '').includes(q)
    );
  });

  const filteredAvailable = availableStudents.filter((s) => {
    if (!searchAvailable.trim()) return true;
    const q = searchAvailable.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      (s.englishName || '').toLowerCase().includes(q) ||
      (s.parentName || '').toLowerCase().includes(q)
    );
  });

  const handleToggleStudentSelection = (id: string) => {
    setSelectedStudentIdsToAdd((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleConfirmEnrollment = () => {
    if (selectedStudentIdsToAdd.length === 0) return;
    onEnrollStudents(classroom.id, selectedStudentIdsToAdd);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    showToast(`Đã thêm thành công ${selectedStudentIdsToAdd.length} học sinh vào lớp!`);
    setSelectedStudentIdsToAdd([]);
    setIsAddingStudent(false);
  };

  const handleSaveNewTeacher = () => {
    if (!selectedTeacherName || selectedTeacherName === classroom.teacherName) {
      setIsChangingTeacher(false);
      return;
    }
    onChangeTeacher(classroom.id, selectedTeacherName);
    showToast(`Đã phân công ${selectedTeacherName} phụ trách lớp!`);
    setIsChangingTeacher(false);
  };

  const assignedTeacherObj = allTeachers.find(
    (t) => t.name === classroom.teacherName || (t.name && classroom.teacherName.includes(t.name))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-3xl rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black">
              <School className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 text-indigo-900 font-black text-xs">
                  {classroom.gradeLabel || (typeof classroom.grade === 'number' ? `Khối Lớp ${classroom.grade}` : classroom.grade)}
                </span>
                <span className="text-xs font-bold text-slate-500">{classroom.roomNumber}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 font-heading">
                {classroom.name}
              </h3>
              <p className="text-xs text-slate-500">
                Lịch học: <strong className="text-indigo-700">{classroom.scheduleDescription}</strong> • Giáo trình: {classroom.currentUnit}
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

        {/* Class Info Overview Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Giáo Viên Phụ Trách
            </span>
            {isChangingTeacher ? (
              <div className="mt-1 space-y-1.5">
                <select
                  value={selectedTeacherName}
                  onChange={(e) => setSelectedTeacherName(e.target.value)}
                  className="w-full text-xs font-bold px-2 py-1 rounded-lg border border-indigo-300 bg-white"
                >
                  {allTeachers.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name} ({t.levelTitle || 'Giáo viên'})
                    </option>
                  ))}
                  <option value="Đang xếp giáo viên">Đang xếp giáo viên</option>
                </select>
                <div className="flex gap-1">
                  <button
                    onClick={handleSaveNewTeacher}
                    className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold cursor-pointer"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={() => setIsChangingTeacher(false)}
                    className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px] font-bold cursor-pointer"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {assignedTeacherObj && (
                    <img
                      src={assignedTeacherObj.avatar}
                      alt={assignedTeacherObj.name}
                      className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <span className="text-xs font-black text-slate-800 truncate">
                    {classroom.teacherName}
                  </span>
                </div>
                <button
                  onClick={() => setIsChangingTeacher(true)}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                >
                  Đổi
                </button>
              </div>
            )}
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Sĩ Số Hiện Tại
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-black text-indigo-700 font-heading">
                {enrolledStudents.length}
              </span>
              <span className="text-xs text-slate-500 font-semibold">/ 15 học sinh tối đa</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setIsAddingStudent(!isAddingStudent)}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Thêm Học Sinh</span>
            </button>
          </div>
        </div>

        {/* Modal/Section: Thêm học sinh vào lớp */}
        {isAddingStudent && (
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 border-2 border-emerald-300 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-black text-emerald-950 text-sm font-heading flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4 text-emerald-700" />
                  <span>Chọn Học Sinh Để Tham Gia Lớp {classroom.name}</span>
                </h4>
                <p className="text-[11px] text-emerald-800">
                  Các bé được chọn sẽ được phân vào lớp này và nhận thông báo học tập ngay lập tức
                </p>
              </div>
              <button
                onClick={() => setIsAddingStudent(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Đóng
              </button>
            </div>

            {/* Search available students */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm học sinh theo tên, tên tiếng Anh..."
                value={searchAvailable}
                onChange={(e) => setSearchAvailable(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Student selection cards */}
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {filteredAvailable.length > 0 ? (
                filteredAvailable.map((stu) => {
                  const isSelected = selectedStudentIdsToAdd.includes(stu.id);
                  const currentClass = allClasses.find((c) => c.id === stu.classId);
                  return (
                    <div
                      key={stu.id}
                      onClick={() => handleToggleStudentSelection(stu.id)}
                      className={`p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-100/90 border-emerald-500 shadow-xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <img
                          src={stu.avatar}
                          alt={stu.name}
                          className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <p className="font-black text-slate-800 text-xs truncate">
                            {stu.name} {stu.englishName && <span className="text-indigo-600 font-bold">({stu.englishName})</span>}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            Khối {stu.grade || 3} • PH: {stu.parentName || 'Chưa cập nhật'} (SĐT: {stu.parentPhone || stu.phone})
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold">
                          {currentClass ? `Hiện ở: ${currentClass.name}` : 'Chưa có lớp'}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-500 italic p-3 text-center bg-white rounded-xl">
                  Không tìm thấy học sinh phù hợp.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-emerald-900 font-bold">
                Đã chọn: <strong>{selectedStudentIdsToAdd.length}</strong> học sinh
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddingStudent(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-600 text-xs font-bold"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirmEnrollment}
                  disabled={selectedStudentIdsToAdd.length === 0}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Xác Nhận Thêm Vào Lớp</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Section: Danh sách học sinh đang học */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h4 className="font-black text-slate-800 text-sm font-heading flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Danh Sách Học Sinh Trong Lớp ({enrolledStudents.length} học sinh)</span>
            </h4>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Tìm trong lớp..."
                value={searchEnrolled}
                onChange={(e) => setSearchEnrolled(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium"
              />
            </div>
          </div>

          {filteredEnrolled.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredEnrolled.map((stu) => {
                const studentAtt = attendanceRecords.filter((a) => a.studentId === stu.id);
                const presents = studentAtt.filter((a) => a.status === 'present').length;
                const attRate =
                  studentAtt.length > 0 ? Math.round((presents / studentAtt.length) * 100) : 100;

                return (
                  <div
                    key={stu.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs transition-all space-y-2.5 flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={stu.avatar}
                        alt={stu.name}
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h5 className="font-black text-slate-900 text-xs sm:text-sm truncate">
                            {stu.name}
                          </h5>
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                            <Star className="w-2.5 h-2.5 fill-amber-500" />
                            {stu.stars ?? 120}
                          </span>
                        </div>
                        {stu.englishName && (
                          <p className="text-[11px] font-bold text-indigo-600 truncate">
                            {stu.englishName}
                          </p>
                        )}
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">
                          PH: <strong>{stu.parentName || 'Chưa cập nhật'}</strong> • SĐT: {stu.parentPhone || stu.phone}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">
                        Chuyên cần: <strong className="text-emerald-700">{attRate}%</strong>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onViewStudentDetail?.(stu)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] cursor-pointer transition-colors"
                        >
                          Xem Hồ Sơ
                        </button>
                        <button
                          onClick={() => onRemoveStudentFromClass(stu.id)}
                          className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px] cursor-pointer transition-colors"
                          title="Rút bé khỏi lớp này"
                        >
                          Rút Khỏi Lớp
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <Users className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-600">Lớp hiện chưa có học sinh nào tham gia</p>
              <p className="text-[11px] text-slate-400">
                Bấm "+ Thêm Học Sinh" ở trên để xếp học sinh vào lớp học này ngay.
              </p>
              <button
                onClick={() => setIsAddingStudent(true)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                + Thêm Học Sinh Ngay
              </button>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm(`Bạn có chắc muốn xóa lớp ${classroom.name}?`)) {
                onDeleteClass?.(classroom.id);
                onClose();
              }
            }}
            className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa Lớp Này</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Đóng Lớp Học
          </button>
        </div>
      </div>
    </div>
  );
};
