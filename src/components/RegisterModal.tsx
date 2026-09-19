import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  User,
  Phone,
  Mail,
  BookOpen,
  Heart,
  ArrowRight,
  ShieldAlert,
  Printer,
  FileText,
  Home,
  Calendar,
  School,
  CheckSquare,
  Square,
  Info,
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User as UserType, ClassRoom, GradeLevel } from '../types';
import { CommitmentDocumentModal } from './CommitmentDocumentModal';
import { SecureSensitiveInput } from './SecureSensitiveInput';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: ClassRoom[];
  onRegisterSubmit: (newUser: UserType) => void;
  onSwitchToTeacher: () => void;
}

const AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
];

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  classes,
  onRegisterSubmit,
  onSwitchToTeacher
}) => {
  // Navigation / step state
  const [activeTab, setActiveTab] = useState<'info' | 'terms' | 'commit' | 'full'>('info');

  // Today date format according to Decree 30/2020/ND-CP
  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const year = today.getFullYear();

  // Form State - Section I: Info
  const [fullName, setFullName] = useState('');
  const [englishName, setEnglishName] = useState('');
  const [birthDate, setBirthDate] = useState('2017-06-15');
  const [grade, setGrade] = useState<GradeLevel>(3);
  const [schoolName, setSchoolName] = useState('Tiểu học Thôn 16');
  const [classId, setClassId] = useState(classes[2]?.id || classes[0]?.id || '');
  const [parentName, setParentName] = useState('');
  const [parentRelationship, setParentRelationship] = useState<'Ba' | 'Mẹ' | 'Người giám hộ'>('Mẹ');
  const [parentPhone, setParentPhone] = useState('');
  const [parentCitizenId, setParentCitizenId] = useState('');
  const [studentCitizenId, setStudentCitizenId] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [address, setAddress] = useState('Thôn 16, địa phương');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  // Section: Academic & course preferences (theo mẫu Đơn Đăng Ký Khóa Học / Ôn Tập Bổ Trợ)
  const [academicAbility, setAcademicAbility] = useState<'basic' | 'advanced' | 'gifted'>('basic');
  const [subjectName, setSubjectName] = useState('Tiếng Anh tiểu học & Giao tiếp');
  const [learningGoal, setLearningGoal] = useState('Củng cố nền tảng phát âm, tự tin giao tiếp và đạt điểm tốt');
  const [preferredSchedule, setPreferredSchedule] = useState('Ca học chiều tối các ngày trong tuần (17h30 - 19h00)');

  // Section: Policy category & Operating Fund (Theo mẫu Đơn & Cam kết hoàn chỉnh Nhà văn hóa)
  const [policyCategory, setPolicyCategory] = useState<'policy_revolution' | 'poor_household' | 'standard'>('standard');
  const [operatingFundAmount, setOperatingFundAmount] = useState('50.000');
  const [sessionsCount, setSessionsCount] = useState('16');

  // Section III: Commitments
  const [parentAccepted, setParentAccepted] = useState(false);
  const [studentAccepted, setStudentAccepted] = useState(false);
  const [isReadAndCommitted, setIsReadAndCommitted] = useState(false);
  const [parentSignedName, setParentSignedName] = useState('');
  const [studentSignedName, setStudentSignedName] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Success state & preview modal
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdStudent, setCreatedStudent] = useState<UserType | null>(null);
  const [showDocModal, setShowDocModal] = useState(false);

  if (!isOpen) return null;

  const chosenClass = classes.find((c) => c.id === classId);

  const handleNextToTerms = () => {
    if (!fullName.trim()) {
      setValidationError('Vui lòng điền họ và tên học sinh.');
      return;
    }
    if (!parentName.trim()) {
      setValidationError('Vui lòng điền họ và tên phụ huynh.');
      return;
    }
    if (!parentPhone.trim()) {
      setValidationError('Vui lòng nhập số điện thoại / Zalo để nhận thông báo.');
      return;
    }
    setValidationError(null);
    if (!parentSignedName) setParentSignedName(parentName);
    if (!studentSignedName) setStudentSignedName(fullName);
    setActiveTab('terms');
  };

  const handleNextToCommit = () => {
    setActiveTab('commit');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !parentPhone.trim()) {
      setValidationError('Vui lòng điền đầy đủ họ tên học sinh và số điện thoại phụ huynh.');
      setActiveTab('info');
      return;
    }

    if (!parentAccepted || !studentAccepted) {
      setValidationError('Phụ huynh và học sinh cần tích xác nhận cam kết trước khi hoàn tất đăng ký.');
      setActiveTab('commit');
      return;
    }

    if (!isReadAndCommitted) {
      setValidationError('Vui lòng tích chọn ô "Đã đọc và cam kết" để hoàn tất đăng ký hợp lệ.');
      setActiveTab('commit');
      return;
    }

    const newStudent: UserType = {
      id: `stu-${Date.now()}`,
      name: fullName.trim(),
      englishName: englishName.trim() || 'Star Kid',
      avatar: selectedAvatar,
      role: 'student',
      email: parentEmail.trim() || `${(englishName || fullName).toLowerCase().replace(/\s+/g, '')}${Date.now().toString().slice(-3)}@gmail.com`,
      grade: chosenClass ? chosenClass.grade : grade,
      gradeLabel: chosenClass?.gradeLabel,
      classId,
      status: 'pending',
      registeredAt: new Date().toISOString().split('T')[0],
      citizenId: studentCitizenId.trim() || undefined,
      parentName: parentName.trim() || 'Phụ huynh',
      parentPhone: parentPhone.trim(),
      parentCitizenId: parentCitizenId.trim() || undefined,
      parentRelationship,
      birthDate,
      schoolName: schoolName.trim() || 'Tiểu học Thôn 16',
      address: address.trim() || 'Thôn 16',
      commitmentAccepted: true,
      commitmentDate: new Date().toISOString().split('T')[0],
      studentSignedName: studentSignedName.trim() || fullName.trim(),
      parentSignedName: parentSignedName.trim() || parentName.trim(),
      locationName: 'Nhà văn hóa Thôn 16',
      policyCategory,
      operatingFundAmount,
      sessionsCount,
      academicAbility,
      subjectName,
      courseProgram: chosenClass ? `Khóa học: ${chosenClass.name}` : `Khóa học Bổ trợ & Ôn tập kiến thức Tiếng Anh Lớp ${grade}`,
      learningGoal: learningGoal.trim() || 'Củng cố nền tảng phát âm, tự tin giao tiếp và đạt kết quả tốt',
      preferredSchedule: preferredSchedule.trim() || (chosenClass?.scheduleDescription || 'Ca học chiều tối (17h30 - 19h00)'),
      departmentHead: 'Tiếng Anh (CLB StarKids - Nhà văn hóa Thôn 16)',
      stars: 20, // Initial welcome bonus stars
      levelTitle: 'Bé Khởi Động'
    };

    onRegisterSubmit(newStudent);
    setCreatedStudent(newStudent);
    setIsSuccess(true);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setFullName('');
    setEnglishName('');
    setParentName('');
    setParentPhone('');
    setParentEmail('');
    setAddress('Thôn 16, địa phương');
    setParentAccepted(false);
    setStudentAccepted(false);
    setIsReadAndCommitted(false);
    setActiveTab('info');
    setValidationError(null);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
        <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[96vh] flex flex-col">
          {/* Modal Top Control Bar */}
          <div className="bg-white px-5 sm:px-6 py-3.5 border-b border-slate-200 text-slate-800 shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm sm:text-base text-slate-900">
                      Đơn Đăng Ký & Bản Cam Kết Hành Chính
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] font-mono font-bold border border-amber-300">
                      Nghị định 30/2020/NĐ-CP
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mẫu văn bản quy chuẩn A4 • Lớp Tiếng Anh miễn phí tại Nhà văn hóa Thôn 16
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowDocModal(true)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                  title="Mở chế độ xem trước bản in khổ A4 chuẩn"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-600" />
                  <span>In / Lưu PDF (A4)</span>
                </button>
                <button
                  onClick={handleResetAndClose}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shrink-0"
                  aria-label="Đóng cửa sổ"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Stepper Navigation Tabs */}
            {!isSuccess && (
              <div className="flex items-center gap-1.5 sm:gap-2 mt-3 pt-3 border-t border-slate-200 text-xs font-bold overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setActiveTab('info')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'info'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <span>1. Phần I: Thông tin HS & Gia đình</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('terms')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'terms'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <span>2. Phần II: Quỹ vận hành & Miễn 100% chính sách</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('commit')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'commit'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <span>3. Phần III: Tài sản NVH & Ký cam kết</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('full')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ml-auto ${
                    activeTab === 'full'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                      : 'text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-300'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-amber-700" />
                  <span>Toàn văn mẫu đơn (A4)</span>
                </button>
              </div>
            )}
          </div>

          {/* Modal Body: Document Sheet */}
          <div className="p-3 sm:p-6 overflow-y-auto flex-1 bg-slate-100/90">
            {validationError && (
              <div className="fixed top-20 z-60 max-w-md w-full px-4">
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold flex items-center gap-2 shadow-xl animate-in fade-in">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                  <span className="flex-1">{validationError}</span>
                  <button onClick={() => setValidationError(null)} className="text-rose-500 hover:text-rose-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {isSuccess ? (
              /* Success Screen */
              <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 text-center space-y-4 my-auto shadow-2xl">
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl shadow-inner animate-bounce">
                  🎉
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 font-heading">
                    Đã Tiếp Nhận Đơn & Bản Cam Kết!
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                    Đơn đăng ký và Bản cam kết tham gia lớp học tại <strong>Nhà văn hóa Thôn 16</strong> của em{' '}
                    <span className="font-bold text-amber-600">{fullName} ({englishName || 'Bé'})</span> đã được lưu vào hệ thống.
                  </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-left space-y-2 max-w-lg mx-auto font-sans">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Đã xác nhận ký cam kết Nhà văn hóa:
                  </div>
                  <ul className="text-xs text-slate-700 space-y-1 pl-6 list-disc">
                    <li>Đã đồng ý bảo quản cơ sở vật chất, tài sản công tại Nhà văn hóa Thôn 16</li>
                    <li>Phụ huynh cam kết đưa đón con đúng giờ và báo phép kịp thời</li>
                    <li>Tài khoản được cộng sẵn <strong>20 Sao Vàng khởi động ⭐</strong> khi được duyệt</li>
                  </ul>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto font-sans">
                  <button
                    type="button"
                    onClick={() => setShowDocModal(true)}
                    className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Xem & In Bản Cam Kết (A4)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleResetAndClose();
                      onSwitchToTeacher();
                    }}
                    className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <span>Vào duyệt học sinh ngay</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* A4 Administrative Paper Canvas (Decree 30/2020/ND-CP) */
              <div
                className="w-full max-w-[210mm] mx-auto block bg-white text-black font-times p-6 sm:p-10 shadow-2xl rounded-2xl text-[13pt] leading-[1.5] text-justify select-text border border-slate-300"
                style={{ fontFamily: "'Times New Roman', Times, 'Liberation Serif', serif", color: '#000000' }}
              >
                {/* PHẦN 1: PHẦN MỞ ĐẦU (Quốc hiệu, Tiêu ngữ, Tên đơn, Kính gửi) */}
                <header className="mb-6">
                  {/* Quốc hiệu và Tiêu ngữ - CĂN GIỮA */}
                  <div className="flex justify-center mb-4 sm:mb-6">
                    <div className="text-center w-full max-w-[360px]">
                      <p className="font-bold uppercase text-[12.5pt] sm:text-[13pt] leading-tight tracking-tight text-black">
                        CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                      </p>
                      <p className="font-bold text-[13pt] sm:text-[13.5pt] leading-tight text-black mt-1">
                        Độc lập – Tự do – Hạnh phúc
                      </p>
                      <div className="w-[170px] sm:w-[190px] h-[1.5px] bg-black mx-auto mt-1.5"></div>
                    </div>
                  </div>

                  {/* Tên loại văn bản và trích yếu nội dung - VIẾT HOA ĐẬM CĂN GIỮA */}
                  <div className="text-center my-4 sm:my-6 space-y-1">
                    <h1 className="font-bold uppercase text-[16pt] sm:text-[17pt] leading-tight text-black">
                      ĐƠN ĐĂNG KÝ VÀ BẢN CAM KẾT
                    </h1>
                    <h2 className="font-bold uppercase text-[14pt] sm:text-[15pt] leading-tight text-black">
                      THAM GIA LỚP TIẾNG ANH MIỄN PHÍ
                    </h2>
                    <p className="italic text-[12pt] sm:text-[12.5pt] text-black pt-0.5">
                      (Địa điểm học tập: Nhà văn hóa Thôn 16 | Dành cho học sinh Lớp 1 – Lớp 5)
                    </p>
                  </div>

                  {/* Kính gửi */}
                  <div className="mb-5 text-[13pt] text-black">
                    <p className="indent-[1cm]">
                      <strong className="text-[13.5pt]">Kính gửi:</strong>
                    </p>
                    <div className="pl-[2.2cm] space-y-0.5 text-[13pt]">
                      <p>- Ban Quản lý Nhà văn hóa Thôn 16;</p>
                      <p>- Ban Chủ nhiệm / Giáo viên phụ trách Lớp Tiếng Anh cộng đồng Thôn 16.</p>
                    </div>
                  </div>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* PHẦN 2: PHẦN NỘI DUNG CHÍNH (GỒM 3 MỤC RÕ RÀNG) */}

                  {/* MỤC I: THÔNG TIN HỌC SINH VÀ PHỤ HUYNH */}
                  {(activeTab === 'info' || activeTab === 'full') && (
                    <section className="space-y-4 animate-in fade-in">
                      <div className="border-b border-black/30 pb-1">
                        <h3 className="font-bold text-[13.5pt] uppercase text-black">
                          I. THÔNG TIN HỌC SINH VÀ PHỤ HUYNH
                        </h3>
                      </div>
                      <p className="indent-[1cm] text-[13pt] text-black leading-relaxed">
                        Tôi tên là phụ huynh/người giám hộ đại diện cho học sinh, xin kê khai đầy đủ các thông tin chính xác dưới đây để làm thủ tục đăng ký tham gia lớp học:
                      </p>

                      {/* Avatar Selector for Kid */}
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 font-sans">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider text-center">
                          Chọn ảnh đại diện cho bé trên hệ thống
                        </label>
                        <div className="flex items-center gap-3 justify-center py-1">
                          {AVATARS.map((img, idx) => (
                            <button
                              type="button"
                              key={idx}
                              onClick={() => setSelectedAvatar(img)}
                              className={`relative rounded-full p-0.5 transition-all cursor-pointer ${
                                selectedAvatar === img
                                  ? 'ring-4 ring-amber-500 scale-110 shadow-md'
                                  : 'opacity-70 hover:opacity-100 hover:scale-105'
                              }`}
                            >
                              <img
                                src={img}
                                alt="Avatar option"
                                className="w-10 h-10 rounded-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Interactive Student Information Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 font-sans">
                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">
                            1. Họ và tên học sinh *
                          </label>
                          <div className="relative">
                            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                            <input
                              type="text"
                              required
                              placeholder="VD: Nguyễn Văn An"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-amber-500 font-times"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">
                            2. Tên tiếng Anh (Tên thân mật nếu có)
                          </label>
                          <input
                            type="text"
                            placeholder="VD: Peter, Daisy, Leo..."
                            value={englishName}
                            onChange={(e) => setEnglishName(e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-amber-500 font-times"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 font-sans">
                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">
                            3. Ngày tháng năm sinh *
                          </label>
                          <div className="relative">
                            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                            <input
                              type="date"
                              value={birthDate}
                              onChange={(e) => setBirthDate(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-amber-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">
                            4. Khối lớp hiện tại *
                          </label>
                          <select
                            value={grade}
                            onChange={(e) => setGrade(Number(e.target.value) as GradeLevel)}
                            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-amber-500"
                          >
                            <option value={1}>Lớp 1 (6 tuổi - Starters)</option>
                            <option value={2}>Lớp 2 (7 tuổi - Starters)</option>
                            <option value={3}>Lớp 3 (8 tuổi - Movers)</option>
                            <option value={4}>Lớp 4 (9 tuổi - Movers)</option>
                            <option value={5}>Lớp 5 (10 tuổi - Flyers)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">
                            5. Trường học *
                          </label>
                          <div className="relative">
                            <School className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                            <input
                              type="text"
                              value={schoolName}
                              onChange={(e) => setSchoolName(e.target.value)}
                              placeholder="Tiểu học Thôn 16"
                              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-amber-500 font-times"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Class Selection at Cultural House */}
                      <div className="font-sans">
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          6. Lớp đăng ký học tại Nhà văn hóa Thôn 16 *
                        </label>
                        <div className="relative">
                          <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <select
                            value={classId}
                            onChange={(e) => {
                              const newCid = e.target.value;
                              setClassId(newCid);
                              const matched = classes.find((c) => c.id === newCid);
                              if (matched) setGrade(matched.grade);
                            }}
                            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 bg-white font-medium truncate focus:ring-2 focus:ring-amber-500 font-times"
                          >
                            {classes.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name} ({c.gradeLabel || `Khối ${c.grade}`}) • {c.scheduleDescription} • GV: {c.teacherName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Academic Ability & Learning Goal (Mẫu Đơn Đăng Ký Khóa Học / Ôn Tập Bổ Trợ) */}
                      <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3 font-sans">
                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1.5">
                            7. Học lực hiện tại đối với môn đăng ký (Tiếng Anh) *
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {[
                              { id: 'basic', label: 'Cần củng cố căn bản' },
                              { id: 'advanced', label: 'Khá / Nâng cao' },
                              { id: 'gifted', label: 'Luyện thi HSG / Chuyển cấp' }
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => setAcademicAbility(opt.id as any)}
                                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left flex items-center gap-2 cursor-pointer ${
                                  academicAbility === opt.id
                                    ? 'bg-white border-amber-500 text-amber-950 shadow-xs ring-2 ring-amber-400/40'
                                    : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-white'
                                }`}
                              >
                                <span className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] font-black ${
                                  academicAbility === opt.id ? 'border-amber-600 bg-amber-500 text-white' : 'border-slate-300 bg-white'
                                }`}>
                                  {academicAbility === opt.id ? '✓' : ''}
                                </span>
                                <span>{opt.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">
                              Mục tiêu học tập của học sinh
                            </label>
                            <input
                              type="text"
                              value={learningGoal}
                              onChange={(e) => setLearningGoal(e.target.value)}
                              placeholder="VD: Nắm chắc ngữ pháp cơ bản, tự tin giao tiếp"
                              className="w-full px-3 py-1.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-amber-500 font-times"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">
                              Khung thời gian / Ca học mong muốn
                            </label>
                            <input
                              type="text"
                              value={preferredSchedule}
                              onChange={(e) => setPreferredSchedule(e.target.value)}
                              placeholder="VD: Ca chiều tối Thứ 2, 4 (17h30 - 19h00)"
                              className="w-full px-3 py-1.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-amber-500 font-times"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Parent Info */}
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 font-sans">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Heart className="w-3.5 h-3.5 text-rose-500" />
                          Thông tin Người đại diện / Phụ huynh liên hệ
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Họ và tên phụ huynh *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="VD: Nguyễn Thị Mai"
                              value={parentName}
                              onChange={(e) => setParentName(e.target.value)}
                              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-amber-500 font-times"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Quan hệ với học sinh
                            </label>
                            <select
                              value={parentRelationship}
                              onChange={(e) => setParentRelationship(e.target.value as any)}
                              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-amber-500 font-times"
                            >
                              <option value="Mẹ">Mẹ</option>
                              <option value="Ba">Ba</option>
                              <option value="Người giám hộ">Người giám hộ</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <SecureSensitiveInput
                            label="Số điện thoại liên hệ (Zalo nhận thông báo)"
                            value={parentPhone}
                            onChange={setParentPhone}
                            icon="phone"
                            placeholder="09xx xxx xxx"
                            required
                            badgeLabel="Bảo mật SĐT"
                          />

                          <SecureSensitiveInput
                            label="Căn cước công dân (CCCD Phụ huynh - nếu có)"
                            value={parentCitizenId}
                            onChange={setParentCitizenId}
                            icon="idCard"
                            placeholder="001201xxxxxx"
                            badgeLabel="Định danh 12 số"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Địa chỉ thường trú / cư trú *
                          </label>
                          <div className="relative">
                            <Home className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                            <input
                              type="text"
                              required
                              placeholder="Thôn 16, địa phương"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-amber-500 font-times"
                            />
                          </div>
                        </div>
                      </div>

                      {activeTab === 'info' && (
                        <div className="pt-2 flex justify-end font-sans">
                          <button
                            type="button"
                            onClick={handleNextToTerms}
                            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm flex items-center gap-2 shadow-md cursor-pointer transition-all"
                          >
                            <span>Tiếp tục sang Phần II: Điều khoản Nhà văn hóa</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </section>
                  )}

                  {/* MỤC II: MỤC ĐÍCH & QUỸ VẬN HÀNH (CHÍNH SÁCH MIỄN 100%) */}
                  {(activeTab === 'terms' || activeTab === 'full') && (
                    <section className="space-y-4 animate-in fade-in">
                      <div className="border-b border-black/30 pb-1 flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="font-bold text-[13.5pt] uppercase text-black">
                          II. MỤC ĐÍCH & QUỸ VẬN HÀNH (CHÍNH SÁCH MIỄN ĐÓNG GÓP 100%)
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[11px] font-bold">
                          Học phí 0đ • Tri ân chính sách
                        </span>
                      </div>

                      {/* II. Mục đích và nội dung lớp học */}
                      <div className="p-3.5 bg-amber-50/70 border border-amber-300/80 rounded-xl space-y-2 text-[13pt] text-black">
                        <p className="font-bold text-[13pt] text-amber-950">
                          1. Mục đích và nội dung lớp học:
                        </p>
                        <div className="pl-4 space-y-1.5 text-justify">
                          <p>
                            • Lớp học được tổ chức hoàn toàn <strong>MIỄN PHÍ VỀ MẶT GIẢNG DẠY</strong> (0 đồng học phí) nhằm tạo môi trường rèn luyện tiếng Anh, phát triển sự tự tin và xây dựng nền tảng học tập cho các bạn nhỏ tại địa phương.
                          </p>
                          <p>
                            • Lớp học được triển khai tại Nhà văn hóa Thôn 16 theo từng giai đoạn ngắn hạn (Giai đoạn khởi động dự kiến gồm: <strong>{sessionsCount} buổi</strong>).
                          </p>
                        </div>
                      </div>

                      {/* III. Quy định về quỹ vận hành & chính sách miễn đóng góp */}
                      <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl space-y-3 text-[13pt] text-black">
                        <div>
                          <p className="font-bold text-[13pt] text-slate-900">
                            2. Quỹ vận hành và sinh hoạt lớp:
                          </p>
                          <p className="indent-[0.8cm] text-justify text-slate-700 text-xs sm:text-sm mt-1">
                            Để lớp học diễn ra nề nếp, đảm bảo điều kiện cơ sở vật chất và duy trì lâu dài tại Nhà văn hóa, phụ huynh và học sinh đồng thuận mức đóng góp tự nguyện: <strong>{operatingFundAmount} VNĐ / học sinh</strong> (cho toàn bộ giai đoạn học).
                          </p>
                          <div className="pl-4 text-xs sm:text-sm text-slate-700 space-y-0.5 mt-1.5">
                            <p>• Chi trả tiền điện chiếu sáng, quạt/điều hòa, nước uống phát sinh thực tế tại Nhà văn hóa.</p>
                            <p>• In ấn phiếu bài tập, giáo trình/tài liệu học tập cho các con.</p>
                            <p>• Mua sắm đồ dùng chung, quà tặng sticker và phần thưởng động viên các bạn nhỏ cuối khóa.</p>
                            <p className="italic text-slate-500">• Quỹ được đại diện phụ huynh theo dõi, quản lý thu - chi và công khai minh bạch.</p>
                          </div>
                        </div>

                        {/* Chính sách miễn đóng góp 100% */}
                        <div className="pt-2 border-t border-slate-200">
                          <div className="flex items-center gap-2 mb-1">
                            <HeartHandshake className="w-4 h-4 text-rose-600 shrink-0" />
                            <p className="font-bold text-xs sm:text-sm text-rose-950 uppercase">
                              Chính sách miễn đóng góp 100% (Ưu tiên cộng đồng & Tri ân)
                            </p>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify mb-2.5">
                            Với tinh thần tương thân tương ái và truyền thống “Uống nước nhớ nguồn”, lớp học <strong>miễn hoàn toàn 100% khoản Quỹ vận hành và sinh hoạt</strong> đối với con em gia đình người có công với cách mạng, gia đình chính sách (thương binh, bệnh binh, thân nhân liệt sĩ), học sinh thuộc hộ nghèo, cận nghèo hoặc có hoàn cảnh đặc biệt khó khăn.
                          </p>

                          <div className="space-y-2 font-sans">
                            <label className="block text-xs font-bold text-slate-800">
                              Vui lòng chọn diện đăng ký của gia đình (được giữ kín & tế nhị):
                            </label>

                            {[
                              {
                                id: 'policy_revolution',
                                label: 'Gia đình thuộc diện có công với cách mạng / gia đình chính sách',
                                tag: 'Miễn 100% Quỹ vận hành',
                                desc: 'Thương binh, bệnh binh, thân nhân liệt sĩ, người có công cách mạng'
                              },
                              {
                                id: 'poor_household',
                                label: 'Gia đình thuộc diện hộ nghèo / cận nghèo / hoàn cảnh khó khăn',
                                tag: 'Miễn 100% Quỹ vận hành',
                                desc: 'Hộ nghèo, cận nghèo hoặc các em có hoàn cảnh gia đình đặc biệt khó khăn'
                              },
                              {
                                id: 'standard',
                                label: 'Gia đình tham gia đóng góp quỹ vận hành theo quy định chung',
                                tag: 'Đóng góp 50.000đ / khóa',
                                desc: 'Chung tay duy trì điện nước, tài liệu in ấn và phần thưởng cuối khóa'
                              }
                            ].map((opt) => (
                              <div
                                key={opt.id}
                                onClick={() => setPolicyCategory(opt.id as any)}
                                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                                  policyCategory === opt.id
                                    ? 'bg-amber-500/15 border-amber-500 shadow-xs ring-2 ring-amber-400/40 text-amber-950'
                                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/80'
                                }`}
                              >
                                <span className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center text-[10px] font-black shrink-0 ${
                                  policyCategory === opt.id ? 'border-amber-600 bg-amber-500 text-white' : 'border-slate-400 bg-white'
                                }`}>
                                  {policyCategory === opt.id ? '✓' : ''}
                                </span>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-bold text-slate-900">{opt.label}</span>
                                    <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                                      opt.id !== 'standard'
                                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    }`}>
                                      {opt.tag}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {activeTab === 'terms' && (
                        <div className="pt-2 flex items-center justify-between font-sans">
                          <button
                            type="button"
                            onClick={() => setActiveTab('info')}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
                          >
                            Quay lại Phần I
                          </button>
                          <button
                            type="button"
                            onClick={handleNextToCommit}
                            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm flex items-center gap-2 shadow-md cursor-pointer transition-all"
                          >
                            <span>Tiếp tục: Phần III - Tài sản NVH & Cam kết</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </section>
                  )}

                  {/* MỤC III: BẢO QUẢN TÀI SẢN NHÀ VĂN HÓA VÀ NỘI QUY LỚP HỌC */}
                  {(activeTab === 'commit' || activeTab === 'full') && (
                    <section className="space-y-4 animate-in fade-in">
                      <div className="border-b border-black/30 pb-1">
                        <h3 className="font-bold text-[13.5pt] uppercase text-black">
                          III. BẢO QUẢN TÀI SẢN NHÀ VĂN HÓA VÀ NỘI QUY LỚP HỌC
                        </h3>
                      </div>

                      <div className="space-y-3 text-[13pt] text-black leading-relaxed text-justify">
                        <div className="p-3.5 bg-amber-50/70 border border-amber-300/80 rounded-xl space-y-1">
                          <p>
                            <strong>1. Bảo vệ tài sản công:</strong> Tuyệt đối không vẽ bậy, cào xước lên bàn ghế, tường, rèm sân khấu. Không tự ý bật/tắt hay nghịch ngợm hệ thống âm thanh, loa đài, bảng điện và các trang thiết bị của Nhà văn hóa. Nếu học sinh cố ý làm hư hỏng, gia đình có trách nhiệm bồi hoàn, sửa chữa theo quy định.
                          </p>
                        </div>

                        <div className="p-3.5 bg-emerald-50/70 border border-emerald-300/80 rounded-xl space-y-1">
                          <p>
                            <strong>2. Giữ gìn vệ sinh chung:</strong> Bỏ rác đúng nơi quy định trước khi ra về. Không mang đồ ăn vặt, kẹo cao su, nước ngọt có ga vào khuôn viên phòng học.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-sans">
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                            <strong className="text-slate-900 block font-bold text-xs">3. Giờ giấc & An toàn:</strong>
                            <p className="text-slate-700 leading-normal">
                              Phụ huynh chủ động đưa đón con đúng giờ quy định tại cổng/sảnh Nhà văn hóa nhằm đảm bảo an toàn cho học sinh.
                            </p>
                          </div>
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                            <strong className="text-slate-900 block font-bold text-xs">4. Chuyên cần:</strong>
                            <p className="text-slate-700 leading-normal">
                              Đi học đầy đủ. Nếu nghỉ học vì lý do bất khả kháng, phụ huynh vui lòng nhắn tin thông báo trước cho giáo viên.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Cam kết của phụ huynh */}
                      <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl space-y-2 text-[13pt] text-black">
                        <p className="font-bold text-[13pt] uppercase text-black">
                          Cam kết của phụ huynh:
                        </p>
                        <p className="indent-[1cm] text-justify leading-relaxed">
                          Tôi đã đọc, hiểu rõ toàn bộ mục đích, điều khoản sử dụng tài sản Nhà văn hóa cũng như quy chế đóng góp Quỹ vận hành của lớp học. Tôi hoàn toàn tự nguyện đăng ký cho con tham gia và cam kết phối hợp chặt chẽ cùng giáo viên và ban quản lý lớp trong suốt quá trình học.
                        </p>
                      </div>

                      {/* Checkboxes for Parent and Student */}
                      <div className="space-y-2.5 font-sans">
                        <div
                          onClick={() => setParentAccepted(!parentAccepted)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                            parentAccepted
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs'
                              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="mt-0.5 shrink-0 text-emerald-600">
                            {parentAccepted ? (
                              <CheckSquare className="w-5 h-5" />
                            ) : (
                              <Square className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          <div className="text-xs leading-relaxed">
                            <strong>Xác nhận của Phụ huynh:</strong> Tôi là phụ huynh của bé{' '}
                            <span className="font-bold text-amber-800">{fullName || '(chưa nhập tên)'}</span>, cam kết nhắc nhở con bảo quản tài sản công, tuyệt đối không vẽ bậy, phá hỏng thiết bị Nhà văn hóa Thôn 16 và đưa đón con đúng giờ quy định.
                          </div>
                        </div>

                        <div
                          onClick={() => setStudentAccepted(!studentAccepted)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                            studentAccepted
                              ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-xs'
                              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="mt-0.5 shrink-0 text-indigo-600">
                            {studentAccepted ? (
                              <CheckSquare className="w-5 h-5" />
                            ) : (
                              <Square className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          <div className="text-xs leading-relaxed">
                            <strong>Xác nhận của Học sinh:</strong> Em xin hứa đi học chuyên cần, vâng lời thầy cô, gom rác sạch sẽ, không xô đẩy đùa giỡn và giữ gìn bàn ghế, đồ đạc của Nhà văn hóa.
                          </div>
                        </div>
                      </div>

                      {/* Electronic Signatures Input */}
                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 font-sans">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                          Nhập tên ký xác nhận điện tử (Lưu hồ sơ tuyển sinh)
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Học sinh ký tên (Ghi rõ họ tên)
                            </label>
                            <input
                              type="text"
                              value={studentSignedName}
                              onChange={(e) => setStudentSignedName(e.target.value)}
                              placeholder={fullName || 'Họ và tên học sinh'}
                              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white font-times font-bold text-indigo-950"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Phụ huynh ký tên (Ghi rõ họ tên)
                            </label>
                            <input
                              type="text"
                              value={parentSignedName}
                              onChange={(e) => setParentSignedName(e.target.value)}
                              placeholder={parentName || 'Họ và tên phụ huynh'}
                              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white font-times font-bold text-amber-950"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Checkbox bắt buộc: Đã đọc và cam kết (Tính pháp lý theo mẫu đơn Nghị định 30/2020/NĐ-CP) */}
                      <div
                        id="field-da-doc-va-cam-ket"
                        onClick={() => setIsReadAndCommitted(!isReadAndCommitted)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 select-none font-sans ${
                          isReadAndCommitted
                            ? 'bg-amber-500/10 border-amber-500 text-amber-950 shadow-xs ring-2 ring-amber-500/20'
                            : 'bg-white border-amber-300 hover:border-amber-400 hover:bg-amber-50/30 text-slate-800'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0 text-amber-600">
                          {isReadAndCommitted ? (
                            <CheckSquare className="w-5 h-5 text-amber-600" />
                          ) : (
                            <Square className="w-5 h-5 text-amber-400" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <label className="font-black text-sm text-slate-900 cursor-pointer flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4 text-amber-600" />
                              <span>Đã đọc và cam kết</span>
                            </label>
                            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black border border-rose-200">
                              Bắt buộc để gửi đơn
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              (Nghị định 30/2020/NĐ-CP)
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed font-times text-[12pt]">
                            Tôi xác nhận <strong>Đã đọc và cam kết</strong> tự nguyện chấp hành nghiêm túc mọi quy định nêu trong Đơn đăng ký và Bản cam kết tham gia lớp tiếng Anh miễn phí; cam kết bảo quản tài sản công tại Nhà văn hóa Thôn 16, đưa đón con đúng giờ và chịu hoàn toàn trách nhiệm pháp lý nếu để xảy ra hư hỏng, vi phạm.
                          </p>
                        </div>
                      </div>

                      {/* PHẦN 3: PHẦN KẾT THÚC (Địa danh ngày tháng năm & Chữ ký 2 bên) */}
                      <footer className="pt-6 mt-6 border-t border-black/20 text-black">
                        {/* Địa danh và thời gian ban hành - CĂN PHẢI */}
                        <div className="text-right italic mb-4 text-[13pt]">
                          Thôn 16, ngày {day} tháng {month} năm {year}
                        </div>

                        {/* Hai cột chữ ký: Học sinh & Phụ huynh */}
                        <div className="grid grid-cols-2 text-center gap-6 mt-4">
                          <div>
                            <p className="font-bold uppercase text-[12.5pt]">HỌC SINH ĐĂNG KÝ</p>
                            <p className="italic text-[11.5pt] text-slate-700">(Ký và ghi rõ họ tên)</p>
                            {/* Khoảng trống để trắng cho người ký in ra ký bằng tay */}
                            <div className="h-24 sm:h-28" />
                            <p className="font-bold text-[12.5pt] text-black border-t border-dashed border-slate-300 pt-1">
                              {fullName || 'Họ và tên học sinh'}
                            </p>
                          </div>

                          <div>
                            <p className="font-bold uppercase text-[12.5pt]">
                              NGƯỜI LÀM ĐƠN / ĐẠI DIỆN PHỤ HUYNH
                            </p>
                            <p className="italic text-[11.5pt] text-slate-700">(Ký và ghi rõ họ tên)</p>
                            {/* Khoảng trống để trắng cho người ký in ra ký bằng tay */}
                            <div className="h-24 sm:h-28" />
                            <p className="font-bold text-[12.5pt] text-black border-t border-dashed border-slate-300 pt-1">
                              {parentName || 'Họ và tên phụ huynh'}
                            </p>
                          </div>
                        </div>

                        {/* Nơi nhận (Theo thể thức văn bản hành chính Nghị định 30/2020/NĐ-CP) */}
                        <div className="mt-6 pt-2 text-left font-serif">
                          <p className="font-bold italic text-[11.5pt] text-black mb-0.5">
                            Nơi nhận:
                          </p>
                          <div className="text-[10.5pt] text-slate-800 space-y-0.5 leading-snug pl-1">
                            <p>- Chi bộ Thôn 16 (để báo cáo);</p>
                            <p>- Ban Quản lý Nhà văn hóa Thôn 16;</p>
                            <p>- Giáo viên phụ trách CLB;</p>
                            <p>- Lưu: Gia đình, Hồ sơ CLB StarKids.</p>
                          </div>
                        </div>
                      </footer>

                      {/* Action buttons */}
                      <div className="pt-4 space-y-2 font-sans">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                          {activeTab === 'commit' && (
                            <button
                              type="button"
                              onClick={() => setActiveTab('terms')}
                              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
                            >
                              Quay lại xem quy định
                            </button>
                          )}

                          <div className="w-full sm:w-auto flex items-center gap-2 ml-auto">
                            <button
                              type="button"
                              onClick={() => setShowDocModal(true)}
                              className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5 text-slate-600" />
                              <span>Xem mẫu đơn A4</span>
                            </button>

                            <button
                              id="submit-register-btn"
                              type="submit"
                              disabled={!isReadAndCommitted || !parentAccepted || !studentAccepted}
                              className={`flex-1 sm:flex-initial py-2.5 px-6 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                                isReadAndCommitted && parentAccepted && studentAccepted
                                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-orange-200 hover:brightness-105 active:scale-98 cursor-pointer'
                                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border border-slate-300'
                              }`}
                              title={
                                !isReadAndCommitted
                                  ? 'Vui lòng tích chọn ô "Đã đọc và cam kết" để gửi đơn'
                                  : undefined
                              }
                            >
                              <Sparkles className="w-4 h-4" />
                              <span>Gửi đơn đăng ký</span>
                            </button>
                          </div>
                        </div>

                        {!isReadAndCommitted && (
                          <p className="text-[11px] text-amber-700 font-medium flex items-center justify-end gap-1.5">
                            <Info className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                            <span>Vui lòng tích chọn ô <strong>&ldquo;Đã đọc và cam kết&rdquo;</strong> ở trên để kích hoạt nút gửi đơn.</span>
                          </p>
                        )}
                      </div>
                    </section>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Official A4 Document Modal */}
      <CommitmentDocumentModal
        isOpen={showDocModal}
        onClose={() => setShowDocModal(false)}
        studentData={{
          fullName: fullName || 'Nguyễn Minh Khôi',
          englishName: englishName || 'Tommy',
          birthDate: birthDate,
          grade: grade,
          gradeLabel: chosenClass?.gradeLabel || `Khối ${grade}`,
          schoolName: schoolName,
          parentName: parentName || 'Nguyễn Thu Hà',
          parentRelationship: parentRelationship,
          parentPhone: parentPhone || '0988 123 456',
          address: address,
          className: chosenClass ? `${chosenClass.name} - ${chosenClass.scheduleDescription}` : undefined,
          commitmentDate: new Date().toISOString().split('T')[0],
          studentSignedName: studentSignedName || fullName,
          parentSignedName: parentSignedName || parentName,
          locationName: 'Nhà văn hóa Thôn 16',
          policyCategory,
          operatingFundAmount,
          sessionsCount,
          academicAbility,
          subjectName,
          courseProgram: chosenClass ? `Khóa học: ${chosenClass.name}` : `Khóa học Bổ trợ & Ôn tập kiến thức Tiếng Anh Lớp ${grade}`,
          learningGoal: learningGoal.trim() || 'Củng cố nền tảng phát âm, tự tin giao tiếp và đạt kết quả tốt',
          preferredSchedule: preferredSchedule.trim() || (chosenClass?.scheduleDescription || 'Ca học chiều tối (17h30 - 19h00)'),
          departmentHead: 'Tiếng Anh (CLB StarKids - Nhà văn hóa Thôn 16)'
        }}
      />
    </>
  );
};
