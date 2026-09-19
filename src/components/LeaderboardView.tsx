import React, { useState } from 'react';
import { Trophy, Medal, Star, Sparkles, Filter, Award } from 'lucide-react';
import { User, GradeLevel } from '../types';

interface LeaderboardViewProps {
  students: User[];
  currentStudentId?: string;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  students,
  currentStudentId
}) => {
  const [gradeFilter, setGradeFilter] = useState<number | 'all'>('all');

  // Filter approved students and sort descending by stars
  const filteredStudents = students
    .filter((s) => s.role === 'student' && s.status === 'approved')
    .filter((s) => (gradeFilter === 'all' ? true : s.grade === gradeFilter))
    .sort((a, b) => (b.stars || 0) - (a.stars || 0));

  const top1 = filteredStudents[0];
  const top2 = filteredStudents[1];
  const top3 = filteredStudents[2];
  const restStudents = filteredStudents.slice(3);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider mb-2">
              <Trophy className="w-4 h-4 text-amber-200" />
              Bảng Vàng Thành Tích • Star Kids Hall of Fame
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading">
              Bảng Xếp Hạng Thi Đua Sao Vàng
            </h2>
            <p className="text-xs sm:text-sm text-white/90 mt-1 max-w-xl">
              Tích lũy Sao Vàng ⭐ từ điểm danh chăm chỉ, làm bài tập xuất sắc và phát biểu tiếng Anh trên lớp để vinh danh nhận huy chương!
            </p>
          </div>

          {/* Grade filter */}
          <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-xs p-1.5 rounded-2xl">
            <span className="text-xs font-bold px-2 text-white/90 hidden sm:inline">Khối:</span>
            {(['all', 1, 2, 3, 4, 5] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGradeFilter(g)}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  gradeFilter === g
                    ? 'bg-white text-amber-900 shadow-xs scale-105'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {g === 'all' ? 'Tất Cả' : `Lớp ${g}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      {filteredStudents.length >= 3 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <h3 className="text-center font-heading font-black text-lg text-slate-800 mb-6 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Vinh Danh Top 3 Ngôi Sao Sáng Nhất Tuần
          </h3>

          <div className="flex items-end justify-center gap-3 sm:gap-6 pt-4 pb-2">
            {/* Top 2 - Silver */}
            {top2 && (
              <div className="flex flex-col items-center w-28 sm:w-36 text-center">
                <div className="relative mb-2">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-slate-300 overflow-hidden shadow-md">
                    <img
                      src={top2.avatar}
                      alt={top2.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-300 text-slate-800 text-xs font-black flex items-center justify-center shadow-xs">
                    2
                  </span>
                </div>
                <p className="font-extrabold text-xs sm:text-sm text-slate-800 line-clamp-1">
                  {top2.englishName || top2.name}
                </p>
                <p className="text-[11px] text-slate-500 line-clamp-1">{top2.name}</p>
                <div className="mt-1 flex items-center gap-1 text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <span>{top2.stars}</span>
                  <span>⭐</span>
                </div>
                {/* Silver Step */}
                <div className="w-full h-24 bg-gradient-to-t from-slate-200 to-slate-100 rounded-t-2xl mt-3 flex items-center justify-center border-t-2 border-slate-300">
                  <Medal className="w-8 h-8 text-slate-400" />
                </div>
              </div>
            )}

            {/* Top 1 - Gold Champion */}
            {top1 && (
              <div className="flex flex-col items-center w-32 sm:w-40 text-center -mt-6">
                <div className="relative mb-2">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl animate-bounce">
                    👑
                  </span>
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-amber-400 overflow-hidden shadow-xl ring-4 ring-amber-200">
                    <img
                      src={top1.avatar}
                      alt={top1.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-amber-400 text-amber-950 text-xs font-black flex items-center justify-center shadow-md">
                    1
                  </span>
                </div>
                <p className="font-black text-sm sm:text-base text-slate-900 line-clamp-1">
                  {top1.englishName || top1.name}
                </p>
                <p className="text-xs text-slate-500 line-clamp-1">{top1.name}</p>
                <div className="mt-1 flex items-center gap-1 text-sm font-black text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 shadow-xs">
                  <span>{top1.stars}</span>
                  <span>⭐</span>
                </div>
                {/* Gold Step */}
                <div className="w-full h-32 bg-gradient-to-t from-amber-300 to-amber-200 rounded-t-2xl mt-3 flex flex-col items-center justify-center border-t-2 border-amber-400 shadow-inner">
                  <Trophy className="w-10 h-10 text-amber-600" />
                  <span className="text-[10px] font-black text-amber-900 uppercase">Quán Quân</span>
                </div>
              </div>
            )}

            {/* Top 3 - Bronze */}
            {top3 && (
              <div className="flex flex-col items-center w-28 sm:w-36 text-center">
                <div className="relative mb-2">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-amber-700/60 overflow-hidden shadow-md">
                    <img
                      src={top3.avatar}
                      alt={top3.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-amber-700 text-white text-xs font-black flex items-center justify-center shadow-xs">
                    3
                  </span>
                </div>
                <p className="font-extrabold text-xs sm:text-sm text-slate-800 line-clamp-1">
                  {top3.englishName || top3.name}
                </p>
                <p className="text-[11px] text-slate-500 line-clamp-1">{top3.name}</p>
                <div className="mt-1 flex items-center gap-1 text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <span>{top3.stars}</span>
                  <span>⭐</span>
                </div>
                {/* Bronze Step */}
                <div className="w-full h-20 bg-gradient-to-t from-amber-200/80 to-amber-100 rounded-t-2xl mt-3 flex items-center justify-center border-t-2 border-amber-600/60">
                  <Medal className="w-7 h-7 text-amber-800" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-slate-800 text-base font-heading">
            Danh Sách Xếp Hạng Chi Tiết
          </h3>
          <span className="text-xs font-bold text-slate-500">
            {filteredStudents.length} học viên tham gia
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredStudents.map((stu, index) => {
            const isMe = stu.id === currentStudentId;
            return (
              <div
                key={stu.id}
                className={`p-4 flex items-center justify-between transition-colors ${
                  isMe
                    ? 'bg-amber-50/80 border-l-4 border-amber-500'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Rank */}
                  <div className="w-7 text-center font-black text-sm text-slate-500">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </div>

                  {/* Avatar */}
                  <img
                    src={stu.avatar}
                    alt={stu.name}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover ring-2 ring-slate-100"
                    referrerPolicy="no-referrer"
                  />

                  {/* Name and Grade */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-800 text-sm sm:text-base">
                        {stu.englishName || stu.name}
                      </span>
                      {isMe && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-black uppercase">
                          Bé nè!
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      {stu.name} • <span className="font-semibold text-slate-700">Lớp {stu.grade}</span> • {stu.levelTitle || 'Học viên StarKids'}
                    </p>
                  </div>
                </div>

                {/* Stars and Badge */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-sm sm:text-base font-black text-amber-600">
                      <span>{stu.stars || 0}</span>
                      <span>⭐</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold hidden sm:inline">
                      Sao Vàng tích lũy
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
