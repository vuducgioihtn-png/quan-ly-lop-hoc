import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bell,
  GraduationCap,
  Users,
  BookOpen,
  BarChart2,
  CheckCircle2,
  FileText,
  Send,
  Gift,
  Calendar,
  Trophy,
  TrendingUp,
  CreditCard,
  MessageSquare,
  Star,
  Plus,
  LogOut,
  UserCheck,
  ChevronDown,
  Check,
  Crown
} from 'lucide-react';
import { User, AppNotification } from '../types';

interface HeaderProps {
  currentUser: User;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onOpenRegister: () => void;
  onOpenNotifications: () => void;
  onLogout: () => void;
  notifications: AppNotification[];
  pendingCount: number;
  pendingSubmissionsCount?: number;
  pendingHwCount?: number;
  onToggleAdminView?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeTab,
  onSelectTab,
  onOpenRegister,
  onOpenNotifications,
  onLogout,
  notifications,
  pendingCount,
  pendingSubmissionsCount = 0,
  pendingHwCount = 0,
  onToggleAdminView
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNavDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Profile meta based on the real logged in role
  const getDisplayProfile = () => {
    switch (currentUser.role) {
      case 'admin':
        return {
          displayName: currentUser.name || 'Quản trị viên',
          subtitle: currentUser.levelTitle || 'Ban Giám Hiệu',
          roleTag: 'Ban Giám Hiệu',
          badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200'
        };
      case 'teacher':
        return {
          displayName: currentUser.name || 'Cô Emily',
          subtitle: currentUser.levelTitle || 'Giáo viên Tiếng Anh',
          roleTag: 'Giáo Viên',
          badgeColor: 'bg-teal-50 text-teal-800 border-teal-200'
        };
      case 'student':
        return {
          displayName: currentUser.englishName ? `${currentUser.name} (${currentUser.englishName})` : currentUser.name,
          subtitle: currentUser.isAdmin
            ? (currentUser.adminRoleTitle || 'Cán sự lớp kiêm Admin Học sinh')
            : `Học sinh Lớp ${currentUser.grade || 3}`,
          roleTag: currentUser.isAdmin ? '👑 Admin Học Sinh' : `Học Sinh Khối ${currentUser.grade || 3}`,
          badgeColor: currentUser.isAdmin
            ? 'bg-purple-50 text-purple-900 border-purple-300 font-black'
            : 'bg-amber-50 text-amber-900 border-amber-300'
        };
      case 'parent':
        return {
          displayName: currentUser.name || 'Mẹ Tommy',
          subtitle: 'Phụ huynh học sinh',
          roleTag: 'Phụ Huynh',
          badgeColor: 'bg-purple-50 text-purple-800 border-purple-200'
        };
      default:
        return {
          displayName: currentUser.name,
          subtitle: currentUser.role,
          roleTag: 'Hệ Thống',
          badgeColor: 'bg-slate-50 text-slate-700 border-slate-200'
        };
    }
  };

  const currentDisplay = getDisplayProfile();

  // Navigation Menus strictly tailored for the active role
  const getRoleMenus = () => {
    switch (currentUser.role) {
      case 'admin':
        return [
          { id: 'overview', label: 'Thống Kê Sĩ Số', icon: <BarChart2 className="w-4 h-4" />, desc: 'Báo cáo tổng quan học vụ & chuyên cần' },
          { id: 'teachers', label: 'Quản Trị Giáo Viên', icon: <Users className="w-4 h-4" />, desc: 'Đội ngũ giảng dạy & chuyên môn' },
          {
            id: 'approvals',
            label: 'Duyệt Đơn Đăng Ký',
            icon: <UserCheck className="w-4 h-4" />,
            desc: 'Hồ sơ tuyển sinh học sinh mới',
            badge: pendingCount > 0 ? `${pendingCount}` : undefined,
            badgeClass: 'bg-rose-500 text-white'
          },
          { id: 'classes', label: 'Quản Lý Lớp Học', icon: <GraduationCap className="w-4 h-4" />, desc: 'Phòng học, giáo viên & xếp lớp' },
          { id: 'students', label: 'Danh Sách Học Sinh', icon: <Users className="w-4 h-4" />, desc: 'Hồ sơ, sao thưởng & liên hệ' }
        ];

      case 'teacher':
        return [
          { id: 'attendance', label: 'Điểm Danh Hôm Nay', icon: <CheckCircle2 className="w-4 h-4" />, desc: 'Sổ lớp & báo cáo chuyên cần' },
          {
            id: 'grading',
            label: 'Chấm Bài Tập Trực Tuyến',
            icon: <FileText className="w-4 h-4" />,
            desc: 'Chấm bài, ghi âm & gửi sticker sao',
            badge: pendingSubmissionsCount > 0 ? `${pendingSubmissionsCount}` : undefined,
            badgeClass: 'bg-amber-500 text-white'
          },
          { id: 'classes', label: 'Quản Lý Lớp Phụ Trách', icon: <GraduationCap className="w-4 h-4" />, desc: 'Sĩ số & học sinh theo lớp' },
          { id: 'materials', label: 'Kho Tài Liệu Bổ Trợ', icon: <BookOpen className="w-4 h-4" />, desc: 'Flashcard, bài nghe & giáo trình' },
          { id: 'broadcast', label: 'Gửi Nhắc Nhở & Lịch Học', icon: <Send className="w-4 h-4" />, desc: 'Thông báo tới phụ huynh & lớp' }
        ];

      case 'student':
        return [
          {
            id: 'homework',
            label: 'Bài Tập Vui Về Nhà',
            icon: <FileText className="w-4 h-4" />,
            desc: 'Thử thách tiếng Anh & tích sao',
            badge: pendingHwCount > 0 ? `${pendingHwCount}` : undefined,
            badgeClass: 'bg-rose-500 text-white'
          },
          {
            id: 'rewards',
            label: 'Đổi Quà Tặng Sao',
            icon: <Gift className="w-4 h-4" />,
            desc: 'Kho phần thưởng sticker, gấu bông',
            badge: `${currentUser.stars || 175} ⭐`,
            badgeClass: 'bg-amber-100 text-amber-900 border border-amber-300'
          },
          { id: 'schedule', label: 'Lịch Học Tuần Này', icon: <Calendar className="w-4 h-4" />, desc: 'Thời khóa biểu & phòng học' },
          { id: 'materials', label: 'Góc Flashcard & Học Liệu', icon: <BookOpen className="w-4 h-4" />, desc: 'Từ vựng & audio luyện nói' },
          { id: 'leaderboard', label: 'Bảng Xếp Hạng Thi Đua', icon: <Trophy className="w-4 h-4" />, desc: 'Top ngôi sao tiếng Anh tuần' }
        ];

      case 'parent':
        return [
          { id: 'analytics', label: 'Tiến Độ Tuần Qua', icon: <TrendingUp className="w-4 h-4" />, desc: 'Điểm số & đánh giá từ cô giáo' },
          { id: 'attendance', label: 'Báo Cáo Chuyên Cần', icon: <CheckCircle2 className="w-4 h-4" />, desc: 'Lịch sử đi học & đúng giờ' },
          {
            id: 'tuition',
            label: 'Thanh Toán Học Phí',
            icon: <CreditCard className="w-4 h-4" />,
            desc: 'Học kỳ 1 & hóa đơn trực tuyến',
            badge: 'Học kỳ 1',
            badgeClass: 'bg-purple-100 text-purple-800 border border-purple-300'
          },
          { id: 'homework', label: 'Bài Tập Của Con', icon: <FileText className="w-4 h-4" />, desc: 'Xem bài làm & lời phê giáo viên' },
          { id: 'messages', label: 'Dặn Dò Cô Giáo', icon: <MessageSquare className="w-4 h-4" />, desc: 'Nhắn tin trực tiếp với giáo viên' }
        ];

      default:
        return [];
    }
  };

  const currentRoleMenus = getRoleMenus();
  const currentActiveItem = currentRoleMenus.find((m) => m.id === activeTab) || currentRoleMenus[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-17 gap-3 sm:gap-6">
          {/* Left: Brand & Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-400 flex items-center justify-center text-white shadow-md shadow-amber-200/50 shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 font-heading">
                  StarKids<span className="text-amber-500">English</span>
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-black rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Lớp 1 - 5
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden md:block">
                Tiếng Anh Tiểu Học • Quản Lý Lớp & Tiến Độ Toàn Diện
              </p>
            </div>
          </div>

          {/* Center: Sleek & Compact Section Navigator Dropdown (Replaces the crowded 5-button list) */}
          <div className="relative flex-1 max-w-xs sm:max-w-sm" ref={dropdownRef}>
            <button
              onClick={() => setIsNavDropdownOpen(!isNavDropdownOpen)}
              className="w-full flex items-center justify-between gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 font-extrabold text-xs sm:text-sm transition-all cursor-pointer shadow-2xs group"
              title="Nhấn để chuyển nhanh chức năng"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-indigo-600 shrink-0">
                  {currentActiveItem?.icon}
                </span>
                <span className="truncate">{currentActiveItem?.label}</span>
                {currentActiveItem?.badge && (
                  <span className={`px-1.5 py-0.2 text-[10px] font-black rounded-full shrink-0 ${currentActiveItem.badgeClass}`}>
                    {currentActiveItem.badge}
                  </span>
                )}
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-transform shrink-0 ${
                  isNavDropdownOpen ? 'rotate-180 text-indigo-600' : ''
                }`}
              />
            </button>

            {/* Dropdown Popover */}
            {isNavDropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 mb-1 flex items-center justify-between border-b border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    Danh Mục Chức Năng
                  </span>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {currentDisplay.roleTag}
                  </span>
                </div>

                <div className="space-y-1">
                  {currentRoleMenus.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectTab(item.id);
                          setIsNavDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                          isActive
                            ? 'bg-indigo-50/80 text-indigo-950 font-black ring-1 ring-indigo-200/80'
                            : 'hover:bg-slate-50 text-slate-700 font-semibold'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              isActive
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {item.icon}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold leading-tight truncate">
                              {item.label}
                            </p>
                            {item.desc && (
                              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                {item.desc}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          {item.badge !== undefined && (
                            <span className={`px-2 py-0.5 text-[10px] font-black rounded-full ${item.badgeClass}`}>
                              {item.badge}
                            </span>
                          )}
                          {isActive && (
                            <Check className="w-4 h-4 text-indigo-600" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Section: Action CTA, Notifications, Profile Card & Logout */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Contextual Action depending on role */}
            {currentUser.role === 'admin' && (
              <button
                onClick={() => onSelectTab('classes')}
                className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Mở Lớp Học</span>
              </button>
            )}

            {currentUser.role === 'teacher' && (
              <button
                onClick={() => onSelectTab('grading')}
                className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Chấm Bài ({pendingSubmissionsCount})</span>
              </button>
            )}

            {currentUser.role === 'student' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectTab('rewards')}
                  className="hidden md:flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 font-black text-xs px-3 py-1.5 rounded-xl shadow-2xs transition-all cursor-pointer whitespace-nowrap"
                >
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{currentUser.stars || 175} ⭐</span>
                </button>

                {currentUser.isAdmin && onToggleAdminView && (
                  <button
                    onClick={onToggleAdminView}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                    title="Chuyển sang Chế độ Quản Trị Viên (Admin)"
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-300" />
                    <span>Vào Quyền Admin</span>
                  </button>
                )}
              </div>
            )}

            {currentUser.role === 'admin' && (currentUser.grade || currentUser.studentId || currentUser.stars) && onToggleAdminView && (
              <button
                onClick={onToggleAdminView}
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                title="Chuyển về Giao diện Học sinh"
              >
                <GraduationCap className="w-3.5 h-3.5 text-white" />
                <span>Về Giao Diện Học Sinh</span>
              </button>
            )}

            {currentUser.role === 'parent' && (
              <button
                onClick={() => onSelectTab('tuition')}
                className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Học Phí</span>
              </button>
            )}

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              title="Thông báo hệ thống"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Current Real User Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-emerald-400/40 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="text-left hidden lg:block max-w-[160px]">
                <div className="text-xs font-black text-slate-800 leading-tight truncate">
                  {currentDisplay.displayName}
                </div>
                <div
                  className={`text-[10px] font-bold px-2 py-0.2 mt-0.5 inline-block rounded-md border truncate ${currentDisplay.badgeColor}`}
                >
                  {currentDisplay.subtitle}
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                title="Đăng xuất khỏi tài khoản"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
