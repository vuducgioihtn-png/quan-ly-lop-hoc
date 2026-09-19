import React, { useState } from 'react';
import {
  Heart,
  TrendingUp,
  Calendar,
  CheckCircle2,
  BookOpen,
  Award,
  Bell,
  Send,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Star,
  CreditCard,
  QrCode,
  Download,
  DollarSign,
  Printer,
  FileText
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { User, ClassRoom, Homework, HomeworkSubmission, AttendanceRecord, AppNotification } from '../types';
import { CommitmentDocumentModal } from './CommitmentDocumentModal';

interface ParentPortalProps {
  parentUser: User;
  linkedStudent: User;
  classInfo?: ClassRoom;
  attendanceRecords: AttendanceRecord[];
  homeworkList: Homework[];
  submissions: HomeworkSubmission[];
  notifications: AppNotification[];
  onSendMessageToTeacher: (message: string) => void;
  activeTab?: 'analytics' | 'attendance' | 'homework' | 'tuition' | 'messages';
  onTabChange?: (tab: 'analytics' | 'attendance' | 'homework' | 'tuition' | 'messages') => void;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({
  parentUser,
  linkedStudent,
  classInfo,
  attendanceRecords,
  homeworkList,
  submissions,
  notifications,
  onSendMessageToTeacher,
  activeTab: controlledTab,
  onTabChange
}) => {
  const [internalTab, setInternalTab] = useState<'analytics' | 'attendance' | 'homework' | 'tuition' | 'messages'>('analytics');
  const activeTab = controlledTab ?? internalTab;
  const setActiveTab = (tab: 'analytics' | 'attendance' | 'homework' | 'tuition' | 'messages') => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };
  const [parentMessage, setParentMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [isTuitionPaid, setIsTuitionPaid] = useState(false);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState(false);
  const [showCommitmentDoc, setShowCommitmentDoc] = useState(false);

  // Student specific data
  const studentAttendance = attendanceRecords.filter((a) => a.studentId === linkedStudent.id);
  const studentSubmissions = submissions.filter((s) => s.studentId === linkedStudent.id);

  // Attendance stats
  const presentCount = studentAttendance.filter((a) => a.status === 'present').length;
  const lateCount = studentAttendance.filter((a) => a.status === 'late').length;
  const excusedCount = studentAttendance.filter((a) => a.status === 'excused').length;
  const absentCount = studentAttendance.filter((a) => a.status === 'absent').length;
  const totalSessions = studentAttendance.length;
  const attendancePercentage = totalSessions > 0 ? Math.round(((presentCount + lateCount) / totalSessions) * 100) : 100;

  // Chart data 1: Score progress
  const scoreData = [
    { unit: 'Unit 1: Hello Friends', score: 9.5 },
    { unit: 'Unit 2: Family & Home', score: 9.0 },
    { unit: 'Unit 3: School Day', score: 10.0 },
    { unit: 'Unit 4: Safari Animals', score: 9.8 }
  ];

  // Chart data 2: Attendance pie
  const attendancePieData = [
    { name: 'Đúng giờ', value: presentCount || 4, color: '#10b981' },
    { name: 'Đến trễ', value: lateCount || 1, color: '#f59e0b' },
    { name: 'Có phép', value: excusedCount || 1, color: '#6366f1' },
    { name: 'Vắng', value: absentCount || 0, color: '#ef4444' }
  ].filter((item) => item.value > 0);

  // Chart data 3: Skills radar / bars
  const skillData = [
    { skill: 'Nghe (Listening)', score: 95, color: '#3b82f6' },
    { skill: 'Từ vựng (Vocab)', score: 92, color: '#10b981' },
    { skill: 'Phát âm (Phonics)', score: 90, color: '#f59e0b' },
    { skill: 'Nói (Speaking)', score: 88, color: '#8b5cf6' }
  ];

  const handleSendNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentMessage.trim()) return;
    onSendMessageToTeacher(parentMessage);
    setMessageSent(true);
    setParentMessage('');
    setTimeout(() => setMessageSent(false), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Parent Welcome & Linked Child Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative">
              <img
                src={linkedStudent.avatar}
                alt={linkedStudent.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-amber-300/60 shadow-sm"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1.5 -right-1.5 bg-amber-500 text-white rounded-full p-1 shadow-xs">
                <Star className="w-3.5 h-3.5 fill-white" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 uppercase tracking-wider">
                  Sổ Liên Lạc Điện Tử
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Phụ huynh: {parentUser.name}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-800 font-heading mt-1">
                Bé {linkedStudent.name} ({linkedStudent.englishName})
              </h1>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                {classInfo ? `${classInfo.name} (${classInfo.gradeLabel || `Khối ${classInfo.grade}`})` : 'Lớp Movers 3A'} • GV Phụ trách: {classInfo?.teacherName || 'Cô Emily'} • SĐT: 0912 345 678
              </p>
            </div>
          </div>

          {/* Quick Stats overview & Tuition Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-2.5 sm:p-3 text-center min-w-[80px]">
                <p className="text-[10px] font-bold text-amber-800 uppercase">Sao Thưởng</p>
                <p className="text-base sm:text-xl font-black text-amber-600 mt-0.5">
                  {linkedStudent.stars || 175} ⭐
                </p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-2.5 sm:p-3 text-center min-w-[80px]">
                <p className="text-[10px] font-bold text-emerald-800 uppercase">Chuyên Cần</p>
                <p className="text-base sm:text-xl font-black text-emerald-600 mt-0.5">
                  {attendancePercentage}%
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-2.5 sm:p-3 text-center min-w-[80px]">
                <p className="text-[10px] font-bold text-blue-800 uppercase">Điểm TB</p>
                <p className="text-base sm:text-xl font-black text-blue-600 mt-0.5">9.6 / 10</p>
              </div>
            </div>

            {/* Direct Tuition Button */}
            <button
              onClick={() => setActiveTab('tuition')}
              className={`px-4 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ${
                isTuitionPaid
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:brightness-105 active:scale-95'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>{isTuitionPaid ? 'Học Phí: Đã Nộp ✓' : 'Thanh Toán Học Phí'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Commitment Card Banner for Cultural House Thôn 16 */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-2xl p-4 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs sm:text-sm font-black text-slate-900">
                Cam Kết Bảo Quản Cơ Sở Vật Chất Nhà Văn Hóa Thôn 16
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Đã Ký Điện Tử
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Phụ huynh {parentUser.name} & Bé {linkedStudent.name} đã cam kết giữ gìn bàn ghế, thiết bị, vệ sinh chung và đưa đón con đúng giờ.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowCommitmentDoc(true)}
          className="px-3.5 py-2 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-300 text-amber-900 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
        >
          <FileText className="w-3.5 h-3.5 text-amber-700" />
          <span>Xem & In Bản Cam Kết (A4)</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'analytics', label: '📊 Tiến Độ Tuần Qua & Điểm Số' },
          { id: 'attendance', label: '✅ Báo Cáo Chuyên Cần Của Con', count: studentAttendance.length },
          { id: 'tuition', label: '💳 Nút Thanh Toán Học Phí', alert: !isTuitionPaid },
          { id: 'homework', label: '📝 Bài Tập & Lời Phê Của Cô', count: studentSubmissions.length },
          { id: 'messages', label: '💬 Dặn Dò & Nhắn Tin Cô Giáo' }
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
            {tab.count !== undefined && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === tab.id
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            )}
            {tab.alert && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
          </button>
        ))}
      </div>

      {/* Tab 1: Visual Charts & Progress Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Homework Scores */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-black text-slate-800 text-base font-heading">
                    Tiến Độ Điểm Số Theo Từng Bài Học
                  </h3>
                  <p className="text-xs text-slate-500">
                    Thang điểm 10 qua các Unit kiểm tra định kỳ
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs">
                  Xuất Sắc
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={scoreData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="unit" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis domain={[6, 10]} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip
                      formatter={(val: any) => [`${val} / 10 Điểm`, 'Điểm số']}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      dot={{ r: 6, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Attendance breakdown */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-black text-slate-800 text-base font-heading">
                      Tỷ Lệ Chuyên Cần & Đúng Giờ
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tổng số {totalSessions} buổi học đã diễn ra
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-black text-xs">
                    {attendancePercentage}% Có mặt
                  </span>
                </div>

                <div className="h-48 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={attendancePieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {attendancePieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: any, name: any) => [`${val} buổi`, name]}
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
                {attendancePieData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-slate-600 font-semibold">
                      {item.name}: {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chart 3: Skill Proficiency Bars */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h3 className="font-black text-slate-800 text-base font-heading mb-1">
              Đánh Giá Năng Lực 4 Kỹ Năng Tiếng Anh Của Bé
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Dựa trên quan sát giảng dạy trên lớp và bài tập tương tác
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {skillData.map((skill, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-black text-slate-800">
                    <span>{skill.skill}</span>
                    <span style={{ color: skill.color }}>{skill.score}% Hoàn thiện</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${skill.score}%`, backgroundColor: skill.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Attendance & Notes */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-800 text-base font-heading">
                Sổ Điểm Danh & Nhận Xét Chi Tiết Từng Buổi Học
              </h3>
              <p className="text-xs text-slate-500">
                Thông báo tự động gửi tới Zalo/Điện thoại phụ huynh ngay khi cô giáo điểm danh
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {studentAttendance.map((rec) => (
              <div key={rec.id} className="p-4 sm:p-5 hover:bg-slate-50/60 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-800 text-sm">
                      📅 Buổi học ngày {rec.date}
                    </span>
                    <span className="text-xs text-slate-500">
                      (Vào lớp: {rec.checkInTime || '-'})
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-md text-xs font-black uppercase w-fit ${
                      rec.status === 'present'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rec.status === 'late'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {rec.status === 'present' && '✓ Có mặt đúng giờ'}
                    {rec.status === 'late' && '⏰ Đến trễ'}
                    {rec.status === 'excused' && '✉️ Nghỉ có phép'}
                    {rec.status === 'absent' && '✕ Vắng không phép'}
                  </span>
                </div>

                {rec.note ? (
                  <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-slate-700">
                    <span className="font-bold text-amber-900 block mb-0.5">
                      👩‍🏫 Ghi chú của giáo viên phụ trách ({rec.recordedBy}):
                    </span>
                    <p className="italic">"{rec.note}"</p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    Buổi học diễn ra bình thường, bé học tập tốt.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Homework & Feedback */}
      {activeTab === 'homework' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-800 text-base font-heading">
              Kết Quả Bài Tập & Lời Phê Của Giáo Viên
            </h3>
            <span className="text-xs font-bold text-slate-500">
              {studentSubmissions.length} bài đã hoàn thành
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {homeworkList.map((hw) => {
              const sub = studentSubmissions.find((s) => s.homeworkId === hw.id);
              return (
                <div
                  key={hw.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-black text-xs">
                      {hw.unit}
                    </span>
                    {sub ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs">
                        Đã chấm: {sub.score}/10 Điểm
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-black text-xs">
                        Chưa nộp
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-black text-slate-800 text-base">{hw.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{hw.description}</p>
                  </div>

                  {sub ? (
                    <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                        <span>⭐ Tặng thưởng: +{sub.starsAwarded || 5} Sao</span>
                        <span className="text-[11px] text-slate-500">Nộp: {sub.submittedAt}</span>
                      </div>
                      {sub.teacherFeedback && (
                        <p className="text-xs text-slate-700 italic">
                          "👩‍🏫 Cô nhận xét: {sub.teacherFeedback}"
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-500">
                      Bé chưa hoàn thành bài tập này. Hạn nộp là ngày: <span className="font-bold text-rose-600">{hw.dueDate}</span>.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Messages / Notes to teacher */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div>
            <h3 className="font-black text-slate-800 text-base font-heading">
              Gửi Lời Nhắn & Dặn Dò Cho Cô Giáo
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Phụ huynh có thể báo trước việc xin nghỉ phép, dặn dò uống thuốc, hoặc trao đổi tình hình học tập với cô Emily.
            </p>
          </div>

          {messageSent && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Lời nhắn đã được gửi thành công tới Cô Emily! Cô giáo sẽ phản hồi sớm nhất.
            </div>
          )}

          <form onSubmit={handleSendNote} className="space-y-3">
            <textarea
              required
              rows={4}
              placeholder="Nhập nội dung dặn dò (VD: Hôm nay bé hơi mệt nên cô cho bé ngồi bàn đầu giúp gia đình nhé, hoặc xin phép cho bé nghỉ học ngày mai...)"
              value={parentMessage}
              onChange={(e) => setParentMessage(e.target.value)}
              className="w-full p-3.5 text-sm rounded-2xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-medium resize-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Gửi Lời Nhắn Cho Cô</span>
              </button>
            </div>
          </form>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <span className="font-bold text-slate-800 block">📞 Liên hệ trực tiếp văn phòng trung tâm:</span>
            <p>Hotline hỗ trợ học viên: 024.7300.9999 (8h00 - 21h00 các ngày trong tuần)</p>
            <p>Zalo hỗ trợ phụ huynh: 0912 345 678 (Cô Emily - Quản nhiệm lớp)</p>
          </div>
        </div>
      )}

      {/* Tab 5: Nút Thanh Toán Học Phí */}
      {activeTab === 'tuition' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {paymentSuccessMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm font-bold shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                Cảm ơn Quý phụ huynh! Hệ thống đã ghi nhận thông báo chuyển khoản học phí cho bé Tommy. Kế toán sẽ đối soát và gửi biên lai điện tử trong 15 phút.
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Tuition bill & summary */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase tracking-wider">
                      Thông Báo Học Phí • Kỳ Thu 09/2026
                    </span>
                    <h3 className="text-lg font-black text-slate-800 font-heading mt-1">
                      Khóa Tiếng Anh Toàn Diện Movers 3A (Q3/2026)
                    </h3>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 ${
                      isTuitionPaid
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800 animate-pulse'
                    }`}
                  >
                    {isTuitionPaid ? '✓ Đã Thanh Toán' : '⏳ Chờ Thanh Toán (Hạn: 25/09/2026)'}
                  </span>
                </div>

                {/* Bill Breakdown */}
                <div className="py-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Học viên:</span>
                    <span className="font-bold text-slate-800">
                      {linkedStudent.name} ({linkedStudent.englishName}) - Lớp {classInfo?.name || 'Movers 3A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Thời lượng khóa:</span>
                    <span className="font-bold text-slate-800">24 buổi (3 tháng, 2 buổi/tuần)</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Học phí gốc:</span>
                    <span className="font-medium text-slate-500 line-through">4.200.000 đ</span>
                  </div>
                  <div className="flex items-center justify-between text-emerald-600 font-medium">
                    <span>Ưu đãi học viên thân thiết (-15%):</span>
                    <span>- 600.000 đ</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Giáo trình Cambridge & Bộ Sticker sao:</span>
                    <span className="text-emerald-600 font-bold">Miễn phí (Tài trợ 100%)</span>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase">Tổng Số Tiền Cần Thanh Toán</p>
                      <p className="text-2xl font-black text-orange-600 font-heading">
                        3.600.000 <span className="text-sm font-bold text-slate-500">VNĐ</span>
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setIsTuitionPaid(!isTuitionPaid);
                        if (!isTuitionPaid) {
                          setPaymentSuccessMessage(true);
                          setTimeout(() => setPaymentSuccessMessage(false), 6000);
                        }
                      }}
                      className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer ${
                        isTuitionPaid
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isTuitionPaid ? 'Đặt lại: Chưa thanh toán' : 'Xác Nhận Đã Chuyển Khoản'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* History of Past Payments */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
                <h4 className="text-sm font-black text-slate-800 font-heading mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  Lịch Sử Đóng Học Phí Của Bé
                </h4>
                <div className="space-y-2">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">Khóa Starters Pre-A1 (Kỳ 05 - 08/2026)</p>
                      <p className="text-slate-500">Số HĐ: STK-2026-0591 • Đã thanh toán ngày 10/05/2026</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-800">3.600.000 đ</p>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Đã Xuất Biên Lai
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 1 Col: VietQR Quick Scan */}
            <div className="bg-gradient-to-br from-white to-orange-50/50 rounded-3xl p-6 border border-orange-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm font-heading">
                      Quét Mã VietQR Chuyển Khoản
                    </h4>
                    <p className="text-[11px] text-slate-500">Tự động điền số tiền và nội dung</p>
                  </div>
                </div>

                {/* Mock VietQR Image */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-xs my-3">
                  <div className="w-44 h-44 mx-auto bg-slate-100 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center p-3 relative overflow-hidden group">
                    <div className="grid grid-cols-6 gap-1 w-full h-full opacity-80">
                      {Array.from({ length: 36 }).map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-xs ${
                            i % 2 === 0 || i % 5 === 0 ? 'bg-slate-900' : 'bg-transparent'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-2xs">
                      <div className="text-center p-2">
                        <span className="text-2xl">📱</span>
                        <p className="text-[10px] font-black text-slate-900 mt-1">VietQR Chuẩn NAPAS</p>
                        <p className="text-[9px] font-bold text-orange-600">3.600.000 VNĐ</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 font-medium">
                    Mở App ngân hàng bất kỳ để quét mã QR
                  </p>
                </div>

                {/* Bank Details */}
                <div className="space-y-2 text-xs text-slate-700 bg-white/80 p-3.5 rounded-2xl border border-orange-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ngân hàng:</span>
                    <span className="font-black text-slate-900">MB Bank (Quân Đội)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Số tài khoản:</span>
                    <span className="font-mono font-black text-orange-600 select-all">8899 6688 01</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Chủ TK:</span>
                    <span className="font-bold text-slate-900">TRUNG TAM TIENG ANH STARKIDS</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-1.5">
                    <span className="text-slate-500">Cú pháp:</span>
                    <span className="font-mono font-black text-slate-900 bg-orange-100 px-1.5 py-0.5 rounded-md select-all">
                      STARKIDS TOMMY HP09
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-orange-200/60">
                <button
                  onClick={() => alert('Đang tạo tệp Biên lai điện tử PDF hợp lệ của StarKids English...')}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  Tải Mẫu Hóa Đơn & Biên Lai Thu Phí
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official A4 Commitment Modal */}
      <CommitmentDocumentModal
        isOpen={showCommitmentDoc}
        onClose={() => setShowCommitmentDoc(false)}
        status={linkedStudent.status}
        studentData={{
          fullName: linkedStudent.name,
          englishName: linkedStudent.englishName,
          birthDate: linkedStudent.birthDate,
          grade: linkedStudent.grade,
          gradeLabel: classInfo?.gradeLabel || linkedStudent.gradeLabel,
          schoolName: linkedStudent.schoolName,
          parentName: parentUser.name,
          parentRelationship: linkedStudent.parentRelationship || 'Phụ huynh',
          parentPhone: parentUser.phone || linkedStudent.parentPhone || '',
          address: linkedStudent.address || 'Thôn 16, địa phương',
          className: classInfo ? `${classInfo.name} (${classInfo.scheduleDescription})` : undefined,
          commitmentDate: linkedStudent.commitmentDate || linkedStudent.registeredAt,
          studentSignedName: linkedStudent.studentSignedName || linkedStudent.name,
          parentSignedName: linkedStudent.parentSignedName || parentUser.name,
          locationName: linkedStudent.locationName || 'Nhà văn hóa Thôn 16',
          policyCategory: linkedStudent.policyCategory || 'standard',
          operatingFundAmount: linkedStudent.operatingFundAmount || '50.000',
          sessionsCount: linkedStudent.sessionsCount || '16',
          academicAbility: linkedStudent.academicAbility || 'basic',
          subjectName: linkedStudent.subjectName || 'Tiếng Anh tiểu học & Kỹ năng giao tiếp',
          courseProgram:
            linkedStudent.courseProgram ||
            (classInfo ? `Lớp ${classInfo.name}` : `Chương trình Bổ trợ & Nâng cao Tiếng Anh Lớp ${linkedStudent.grade || 3}`),
          learningGoal: linkedStudent.learningGoal || 'Củng cố nền tảng phát âm, tự tin giao tiếp và đạt điểm tốt môn Tiếng Anh',
          preferredSchedule:
            linkedStudent.preferredSchedule || classInfo?.scheduleDescription || 'Ca học các ngày trong tuần (17h30 - 19h00)',
          departmentHead: linkedStudent.departmentHead || 'Tiếng Anh (CLB StarKids - Nhà văn hóa Thôn 16)'
        }}
      />
    </div>
  );
};
