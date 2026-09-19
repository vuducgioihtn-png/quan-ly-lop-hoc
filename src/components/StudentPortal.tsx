import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Calendar,
  CheckCircle2,
  Trophy,
  Volume2,
  Clock,
  ArrowRight,
  FileText,
  Star,
  Award,
  ChevronRight,
  Smile,
  Gift
} from 'lucide-react';
import { User, ClassRoom, Homework, HomeworkSubmission, StudyMaterial, AttendanceRecord } from '../types';
import { LeaderboardView } from './LeaderboardView';
import { STUDENT_BADGES } from '../data/mockData';
import { playEnglishPronunciation } from '../utils/storage';

interface StudentPortalProps {
  student: User;
  allStudents: User[];
  classInfo?: ClassRoom;
  homeworkList: Homework[];
  submissions: HomeworkSubmission[];
  materials: StudyMaterial[];
  attendanceRecords: AttendanceRecord[];
  onOpenHomeworkModal: (hw: Homework) => void;
  onOpenMaterialModal: (mat: StudyMaterial) => void;
  activeTab?: 'homework' | 'rewards' | 'schedule' | 'materials' | 'attendance' | 'leaderboard';
  onTabChange?: (tab: 'homework' | 'rewards' | 'schedule' | 'materials' | 'attendance' | 'leaderboard') => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  student,
  allStudents,
  classInfo,
  homeworkList,
  submissions,
  materials,
  attendanceRecords,
  onOpenHomeworkModal,
  onOpenMaterialModal,
  activeTab: controlledTab,
  onTabChange
}) => {
  const [internalTab, setInternalTab] = useState<'homework' | 'rewards' | 'schedule' | 'materials' | 'attendance' | 'leaderboard'>('homework');
  const activeTab = controlledTab ?? internalTab;
  const setActiveTab = (tab: 'homework' | 'rewards' | 'schedule' | 'materials' | 'attendance' | 'leaderboard') => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };
  const [stars, setStars] = useState(student.stars || 175);
  const [redeemedGifts, setRedeemedGifts] = useState<string[]>([]);
  const [rewardToast, setRewardToast] = useState<string | null>(null);

  const mySubmissions = submissions.filter((s) => s.studentId === student.id);
  const myAttendance = attendanceRecords.filter((a) => a.studentId === student.id);

  // Homework status
  const pendingHomework = homeworkList.filter((h) => {
    return !mySubmissions.some((s) => s.homeworkId === h.id);
  });

  const completedHomework = homeworkList.filter((h) => {
    return mySubmissions.some((s) => s.homeworkId === h.id);
  });

  // Attendance stats
  const totalAttended = myAttendance.filter((a) => a.status === 'present' || a.status === 'late').length;
  const attendanceRate = myAttendance.length > 0 ? Math.round((totalAttended / myAttendance.length) * 100) : 100;

  const giftCatalog = [
    {
      id: 'gift-1',
      name: 'Gấu Bông StarKids Panda 🐼',
      starsCost: 150,
      description: 'Gấu bông mascot chính hãng StarKids siêu êm ái, người bạn học tiếng Anh mỗi tối.',
      tag: 'HOT NHẤT',
      img: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'gift-2',
      name: 'Hộp Bút Khủng Long 3D 🦖',
      starsCost: 60,
      description: 'Hộp bút nổi 3D chống sốc, đựng vừa thước kẻ 20cm và 12 chiếc bút màu.',
      tag: 'Phổ biến',
      img: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'gift-3',
      name: 'Bộ Màu Nước Sáng Tạo 24 Cây 🎨',
      starsCost: 80,
      description: 'Bộ bút lông vẽ tranh 2 đầu nhập khẩu an toàn, thỏa sức sáng tạo mindmap từ vựng.',
      tag: 'Khuyên chọn',
      img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'gift-4',
      name: 'Bình Nước Bé Lock&Lock 500ml 💧',
      starsCost: 120,
      description: 'Bình nước giữ nhiệt inox 304 có quai đeo và ống hút tiện lợi cho bé đến lớp.',
      tag: 'Tiện ích',
      img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'gift-5',
      name: 'Truyện Song Ngữ Usborne Anh - Việt 📖',
      starsCost: 100,
      description: 'Bộ truyện cổ tích và thám hiểm vũ trụ với tranh vẽ minh họa sống động.',
      tag: 'Học tập',
      img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'gift-6',
      name: 'Tập Sticker Vàng Hologram Lấp Lánh ✨',
      starsCost: 30,
      description: '100 miếng dán sticker phản quang các loài thú cưng và danh hiệu danh dự.',
      tag: 'Dễ đổi',
      img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=200&auto=format&fit=crop&q=80'
    }
  ];

  const handleRedeem = (gift: typeof giftCatalog[0]) => {
    if (stars < gift.starsCost) {
      alert(`Bé còn thiếu ${gift.starsCost - stars} ⭐ để đổi món quà "${gift.name}". Hãy chăm chỉ làm bài tập để tích lũy thêm nhé!`);
      return;
    }
    setStars((prev) => prev - gift.starsCost);
    setRedeemedGifts((prev) => [...prev, gift.id]);
    setRewardToast(`🎉 Tuyệt vời! Bé Tommy đã đổi thành công "${gift.name}". Cô Emily đã nhận thông báo và sẽ trao quà cho bé vào buổi học tới!`);
    setTimeout(() => setRewardToast(null), 6000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Friendly Hero Banner for Elementary Kids */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-4 border-white/80 shadow-md ring-4 ring-amber-300/50"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-2 -right-2 text-2xl">
                🌟
              </span>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Học sinh {student.levelTitle || 'Ngôi Sao Sáng'}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-heading leading-tight">
                Hello, {student.englishName || student.name}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-white/95 mt-1 font-medium">
                {classInfo?.name || `Lớp Tiếng Anh Khối ${student.grade || 3}`} • {classInfo?.scheduleDescription || 'Thứ 2 & 4'}
              </p>
            </div>
          </div>

          {/* Stars & Level Progress Card with Gift Button */}
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/30 text-white min-w-[250px] shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-100">
                ⭐ Túi Sao Vàng
              </span>
              <span className="text-2xl font-black text-amber-200">
                {stars} <span className="text-base font-bold">Sao</span>
              </span>
            </div>
            {/* Progress to next badge */}
            <div className="space-y-1">
              <div className="w-full bg-black/20 h-3 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-amber-300 to-yellow-200 h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${Math.min(100, (stars % 100))}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-white/80 font-bold">
                <span>Cấp độ: {student.levelTitle || 'Star Hero'}</span>
                <span>Còn {100 - (stars % 100)} sao để lên cấp!</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('rewards')}
              className="mt-3 w-full py-1.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-98 cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Đổi Quà Thưởng Ngay ({stars} ⭐)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'homework', label: '✍️ Danh Sách Bài Tập Vui', count: pendingHomework.length },
          { id: 'rewards', label: '🎁 Bảng Đổi Sao Nhận Quà' },
          { id: 'schedule', label: '🗓️ Lịch Học Tiếp Theo' },
          { id: 'materials', label: '📚 Tài Liệu & Flashcard', count: materials.length },
          { id: 'attendance', label: '✅ Sổ Điểm Danh Của Bé' },
          { id: 'leaderboard', label: '🏆 Bảng Xếp Hạng Thi Đua' }
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

      {/* Tab 1: Homework */}
      {activeTab === 'homework' && (
        <div className="space-y-6">
          {/* Pending assignments */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-slate-800 font-heading flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
                Bài Tập Cần Làm ({pendingHomework.length})
              </h2>
              <span className="text-xs text-slate-500 font-semibold">
                Hoàn thành để nhận thêm +5 Sao Vàng ⭐
              </span>
            </div>

            {pendingHomework.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-xs">
                <div className="text-4xl mb-2">🎉</div>
                <h3 className="font-extrabold text-slate-800 text-base">
                  Bé đã làm hết bài tập về nhà rồi!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Hãy ghé góc Tài Liệu để nghe thêm bài hát hoặc xem Flashcard nhé.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingHomework.map((hw) => (
                  <div
                    key={hw.id}
                    className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-800 font-black text-xs">
                          {hw.unit}
                        </span>
                        <span className="text-xs font-bold text-rose-600 flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded-md">
                          <Clock className="w-3.5 h-3.5" />
                          Hạn: {hw.dueDate}
                        </span>
                      </div>
                      <h3 className="font-black text-slate-800 text-base mb-1">
                        {hw.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {hw.description}
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                        <span>📝 {hw.questions.length} câu hỏi trắc nghiệm vui</span>
                        <span>•</span>
                        <span className="font-bold text-amber-600">Thưởng: +5 ⭐</span>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => onOpenHomeworkModal(hw)}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-98 cursor-pointer"
                      >
                        <span>Làm Bài Tập Ngay ✍️</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Graded & Completed Homework */}
          <div>
            <h2 className="text-lg font-black text-slate-800 font-heading mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Bài Tập Đã Nộp & Nhận Xét Của Cô ({completedHomework.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedHomework.map((hw) => {
                const sub = mySubmissions.find((s) => s.homeworkId === hw.id);
                return (
                  <div
                    key={hw.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs">
                        {hw.unit}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs">
                          {sub?.score ? `${sub.score}/10 Điểm` : 'Đã nộp'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-black text-xs flex items-center gap-1">
                          +{sub?.starsAwarded || 5} ⭐
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm">{hw.title}</h4>
                      <p className="text-xs text-slate-400">Đã nộp lúc: {sub?.submittedAt}</p>
                    </div>

                    {sub?.teacherFeedback && (
                      <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-xs">
                        <div className="font-black text-amber-900 mb-1 flex items-center gap-1.5">
                          <span>👩‍🏫 Lời khen của cô giáo:</span>
                          {sub.feedbackSticker === 'super-star' && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200 text-amber-950">
                              🌟 Super Star
                            </span>
                          )}
                        </div>
                        <p className="text-slate-700 italic">"{sub.teacherFeedback}"</p>
                      </div>
                    )}

                    <button
                      onClick={() => onOpenHomeworkModal(hw)}
                      className="w-full py-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
                    >
                      Xem lại bài đã làm →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Bảng Đổi Sao Nhận Quà */}
      {activeTab === 'rewards' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {rewardToast && (
            <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-3xl font-black text-sm shadow-md flex items-center gap-3">
              <span className="text-2xl">🎁</span>
              <span>{rewardToast}</span>
            </div>
          )}

          {/* Gift Store Hero */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-amber-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl shadow-inner">
                🎁
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  StarKids Reward Store
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 font-heading mt-1">
                  Bảng Đổi Sao Nhận Quà Khích Lệ
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chăm chỉ hoàn thành bài tập và đi học đúng giờ để tích lũy sao nhận quà từ Cô Emily nhé!
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-200 text-center min-w-[200px]">
              <p className="text-xs font-black uppercase text-amber-800">Số Sao Của Bé Tommy</p>
              <p className="text-3xl font-black text-amber-600 font-heading mt-0.5">
                {stars} <span className="text-lg">⭐</span>
              </p>
              <p className="text-[11px] text-amber-700 font-semibold mt-1">
                {stars >= 150 ? '🎉 Bé đã đủ sao đổi mọi món quà!' : `Cố thêm ${150 - stars} ⭐ để đổi Gấu Bông Panda!`}
              </p>
            </div>
          </div>

          {/* Gift Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {giftCatalog.map((gift) => {
              const isRedeemed = redeemedGifts.includes(gift.id);
              const canAfford = stars >= gift.starsCost;

              return (
                <div
                  key={gift.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                      <img
                        src={gift.img}
                        alt={gift.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase bg-slate-900/80 text-white backdrop-blur-xs">
                        {gift.tag}
                      </span>
                      <span className="absolute top-3 right-3 px-3 py-1 rounded-xl text-xs font-black bg-amber-400 text-slate-950 shadow-xs flex items-center gap-1">
                        ⭐ {gift.starsCost} Sao
                      </span>
                    </div>

                    <div className="p-5">
                      <h3 className="text-base font-black text-slate-800 group-hover:text-amber-600 transition-colors">
                        {gift.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {gift.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <button
                      onClick={() => handleRedeem(gift)}
                      disabled={isRedeemed}
                      className={`w-full py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isRedeemed
                          ? 'bg-emerald-100 text-emerald-800 cursor-not-allowed'
                          : canAfford
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xs active:scale-98'
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      <Gift className="w-4 h-4" />
                      <span>
                        {isRedeemed
                          ? 'Đã Đổi Quà Này ✓'
                          : canAfford
                          ? `Đổi Quà Ngay (-${gift.starsCost} ⭐)`
                          : `Thiếu ${gift.starsCost - stars} Sao`}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Redemption Rules Notice */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center gap-3">
            <span className="text-xl">ℹ️</span>
            <p>
              <strong className="text-slate-800">Quy chế đổi quà StarKids:</strong> Sau khi bé bấm đổi quà trên ứng dụng, giáo viên chủ nhiệm sẽ trao tận tay bé trong giờ giải lao của buổi học tiếp theo.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Materials & Flashcards */}
      {activeTab === 'materials' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-800 font-heading">
              Góc Học Liệu & Luyện Nghe Chuẩn Bản Xứ
            </h2>
            <span className="text-xs text-slate-500 font-semibold">
              Bấm vào để nghe phát âm & lật flashcard
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {materials.map((mat) => (
              <div
                key={mat.id}
                onClick={() => onOpenMaterialModal(mat)}
                className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      {mat.type === 'flashcard' && '🗂️'}
                      {mat.type === 'audio' && '🎧'}
                      {mat.type === 'pdf' && '📄'}
                      {mat.type === 'video' && '🎬'}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {mat.unit}
                    </span>
                  </div>
                  <h3 className="font-black text-slate-800 text-sm group-hover:text-teal-700 transition-colors line-clamp-2">
                    {mat.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {mat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-600">
                  <span>
                    {mat.type === 'flashcard' ? 'Lật thẻ từ vựng' : 'Nghe & Khám phá'}
                  </span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Schedule */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h2 className="text-lg font-black text-slate-800 font-heading mb-2">
              Thời Khóa Biểu & Lịch Học Của Lớp {classInfo?.name || 'Movers 3A'}
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Địa điểm: {classInfo?.roomNumber || 'Phòng 201 - Tầng 2'} • Giáo viên phụ trách: {classInfo?.teacherName}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-blue-900 uppercase">Thứ Hai</span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-200 text-blue-900 text-[10px] font-black">
                    18:30 - 20:00
                  </span>
                </div>
                <h4 className="font-black text-slate-800 text-sm">
                  {classInfo?.currentUnit || 'Unit 4: Wild Animals & Safari'}
                </h4>
                <p className="text-xs text-slate-600">
                  Luyện nghe phát âm từ mới và cấu trúc câu so sánh hơn.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-indigo-900 uppercase">Thứ Tư</span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-200 text-indigo-900 text-[10px] font-black">
                    18:30 - 20:00
                  </span>
                </div>
                <h4 className="font-black text-slate-800 text-sm">
                  Unit 4: Speaking & Role-play Game
                </h4>
                <p className="text-xs text-slate-600">
                  Hoạt động nhóm đóng vai hướng dẫn viên sở thú, thưởng sao vinh danh.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-900 uppercase">Cuối Tuần</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900 text-[10px] font-black">
                    Tự Luyện Online
                  </span>
                </div>
                <h4 className="font-black text-slate-800 text-sm">
                  Góc Đọc Truyện & Nghe Podcast
                </h4>
                <p className="text-xs text-slate-600">
                  Nghe truyện tiếng Anh ngắn 5 phút để tích lũy thêm sao.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Attendance Records */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
              <p className="text-xs font-bold text-slate-500 uppercase">Tổng số buổi</p>
              <p className="text-2xl font-black text-slate-800 mt-1">{myAttendance.length}</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-center">
              <p className="text-xs font-bold text-emerald-800 uppercase">Đúng giờ</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">
                {myAttendance.filter((a) => a.status === 'present').length}
              </p>
            </div>
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-center">
              <p className="text-xs font-bold text-amber-800 uppercase">Đến trễ</p>
              <p className="text-2xl font-black text-amber-600 mt-1">
                {myAttendance.filter((a) => a.status === 'late').length}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 text-center">
              <p className="text-xs font-bold text-blue-800 uppercase">Tỷ lệ chuyên cần</p>
              <p className="text-2xl font-black text-blue-600 mt-1">{attendanceRate}%</p>
            </div>
          </div>

          {/* Detailed timeline */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-slate-800 text-base font-heading">
                Nhật Ký Từng Buổi Học & Lời Nhận Xét
              </h3>
              <span className="text-xs font-bold text-slate-400">
                Cập nhật tức thì sau mỗi buổi học
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {myAttendance.map((rec) => (
                <div key={rec.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-800 text-sm">
                        Ngày {rec.date}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        (Vào lớp: {rec.checkInTime || '-'})
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                          rec.status === 'present'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rec.status === 'late'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {rec.status === 'present' && 'Có mặt'}
                        {rec.status === 'late' && 'Đến trễ'}
                        {rec.status === 'excused' && 'Nghỉ có phép'}
                        {rec.status === 'absent' && 'Vắng'}
                      </span>
                    </div>
                    {rec.note && (
                      <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-xl border border-slate-100">
                        "{rec.note}"
                      </p>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400 font-medium">
                    Ghi chép bởi: {rec.recordedBy}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Leaderboard */}
      {activeTab === 'leaderboard' && (
        <LeaderboardView students={allStudents} currentStudentId={student.id} />
      )}
    </div>
  );
};
