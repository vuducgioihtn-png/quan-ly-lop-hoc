import React, { useRef, useState } from 'react';
import { X, Printer, FileText, CheckCircle2, ShieldCheck, Info, RotateCcw, HeartHandshake, Eye, EyeOff } from 'lucide-react';
import { maskLast6Digits } from '../utils/security';

export interface StudentDocumentData {
  fullName: string;
  englishName?: string;
  birthDate?: string;
  grade?: string | number;
  gradeLabel?: string;
  schoolName?: string;
  parentName: string;
  parentRelationship?: string;
  parentPhone: string;
  address?: string;
  className?: string;
  commitmentDate?: string;
  studentSignedName?: string;
  parentSignedName?: string;
  locationName?: string;
  // Các trường bổ sung theo quy chuẩn
  policyCategory?: 'policy_revolution' | 'poor_household' | 'standard' | string;
  operatingFundAmount?: string;
  sessionsCount?: string | number;
  academicAbility?: 'basic' | 'advanced' | 'gifted' | string;
  subjectName?: string;
  courseProgram?: string;
  learningGoal?: string;
  preferredSchedule?: string;
  departmentHead?: string;
}

interface CommitmentDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentData: StudentDocumentData;
  initialTemplate?: 'community_complete' | 'course_supplementary' | 'community_nvh';
  status?: 'pending' | 'approved' | 'rejected';
  onApprove?: () => void;
  onReject?: () => void;
  onRevertToPending?: () => void;
  actions?: React.ReactNode;
}

export const CommitmentDocumentModal: React.FC<CommitmentDocumentModalProps> = ({
  isOpen,
  onClose,
  studentData,
  initialTemplate = 'community_complete',
  status,
  onApprove,
  onReject,
  onRevertToPending,
  actions
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<'community_complete' | 'course_supplementary' | 'community_nvh'>(initialTemplate);
  const [maskSensitiveData, setMaskSensitiveData] = useState<boolean>(true);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const getDisplayPhone = (phone?: string) => {
    if (!phone) return '..............................................................';
    return maskSensitiveData ? maskLast6Digits(phone) : phone;
  };

  const today = studentData.commitmentDate
    ? new Date(studentData.commitmentDate)
    : new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const year = today.getFullYear();

  // Academic ability parsing
  const academicAbility = studentData.academicAbility || 'basic';
  const policyCategory = studentData.policyCategory || 'standard';
  const operatingFund = studentData.operatingFundAmount || '50.000';
  const sessionsCount = studentData.sessionsCount || '16';

  // Format birthDate (YYYY-MM-DD -> DD/MM/YYYY)
  const formatBirthDate = (raw?: string) => {
    if (!raw) return '..... / ..... / .........';
    if (raw.includes('-')) {
      const parts = raw.split('-');
      if (parts.length === 3) {
        return `${parts[2]} / ${parts[1]} / ${parts[0]}`;
      }
    }
    return raw;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 max-h-[96vh] flex flex-col overflow-hidden">
        {/* Modal Header Toolbar (Hidden when printed) */}
        <div className="no-print px-5 py-3.5 bg-slate-50 text-slate-800 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  {selectedTemplate === 'community_complete' && 'Đơn Đăng Ký & Cam Kết Lớp Tiếng Anh Cộng Đồng (Mẫu Hoàn Chỉnh)'}
                  {selectedTemplate === 'course_supplementary' && 'Đơn Đăng Ký Tham Gia Khóa Học / Ôn Tập Bổ Trợ'}
                  {selectedTemplate === 'community_nvh' && 'Đơn Đăng Ký & Bản Cam Kết Chi Tiết CSVC Nhà Văn Hóa'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 text-[10px] font-bold">
                  Nghị Định 30/2020/NĐ-CP • Khổ A4
                </span>
                {status === 'pending' && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-bold animate-pulse">
                    ⏳ Chờ Duyệt
                  </span>
                )}
                {status === 'approved' && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-bold">
                    ✓ Đã Duyệt Nhập Học
                  </span>
                )}
                {status === 'rejected' && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 border border-rose-300 text-rose-800 text-[10px] font-bold">
                    ✕ Đã Từ Chối
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Khổ A4 (210×297mm) • Times New Roman • Căn lề: Trái 30mm, Phải 15mm, Trên 20mm, Dưới 20mm
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {actions}

            {onRevertToPending && (status === 'approved' || status === 'rejected') && (
              <button
                type="button"
                onClick={onRevertToPending}
                className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                title="Chuyển hồ sơ này trở lại danh sách Chờ Duyệt"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                <span>Chuyển Về Chờ Duyệt</span>
              </button>
            )}

            {onApprove && status !== 'approved' && (
              <button
                type="button"
                onClick={onApprove}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Duyệt Nhập Học (+20⭐)</span>
              </button>
            )}

            {onReject && status === 'pending' && (
              <button
                type="button"
                onClick={onReject}
                className="px-3 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs transition-colors cursor-pointer"
              >
                Từ Chối
              </button>
            )}

            <button
              type="button"
              onClick={() => setMaskSensitiveData(!maskSensitiveData)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
                maskSensitiveData
                  ? 'bg-purple-100 text-purple-900 border border-purple-300'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
              title="Ẩn / Hiện mã hóa 6 số cuối SĐT (xxxxxx)"
            >
              {maskSensitiveData ? <EyeOff className="w-4 h-4 text-purple-700" /> : <Eye className="w-4 h-4 text-slate-600" />}
              <span>{maskSensitiveData ? 'Bảo mật SĐT: xxxxxx' : 'Hiển thị đầy đủ SĐT'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>In Văn Bản / Lưu PDF (A4)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
              title="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Template Switcher Bar */}
        <div className="no-print flex items-center justify-between gap-3 px-5 py-2.5 bg-slate-100/95 border-b border-slate-200 text-xs font-bold overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-slate-500">Chọn mẫu văn bản A4:</span>
            <button
              type="button"
              onClick={() => setSelectedTemplate('community_complete')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedTemplate === 'community_complete'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5 text-amber-900" />
              <span>1. Đơn & Cam Kết Hoàn Chỉnh (Miễn Học Phí + Quỹ Vận Hành + Miễn 100% Chính Sách)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedTemplate('course_supplementary')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedTemplate === 'course_supplementary'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>2. Đơn Đăng Ký Khóa Học / Ôn Tập Bổ Trợ (4 Phần)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedTemplate('community_nvh')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedTemplate === 'community_nvh'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>3. Cam Kết Cơ Sở Vật Chất (5 Điều Khoản NVH Thôn 16)</span>
            </button>
          </div>
          <div className="text-[11px] text-slate-500 italic shrink-0 hidden sm:block">
            * Bấm "In Văn Bản / Lưu PDF" để xuất đúng tỷ lệ trang in A4 chính thức
          </div>
        </div>

        {/* Outer scrolling canvas for previewing the A4 page */}
        <div className="p-3 sm:p-6 md:p-8 overflow-y-auto flex-1 bg-slate-200/80 print:bg-white print:p-0">
          {/* 
            A4 Document Container
            Strictly styled to Decree 30/2020/ND-CP guidelines:
            - A4 size: 210mm wide x 297mm minimum height
            - Margins: Top 20mm, Bottom 20mm, Left 30mm, Right 15mm
            - Font: Times New Roman, text-black, Unicode
            - Line height: 1.4 - 1.5
          */}
          <div
            ref={printRef}
            className="print-document-container mx-auto block font-times bg-white text-black shadow-2xl print:shadow-none w-full max-w-[210mm] min-h-[297mm] h-auto p-[20mm_15mm_20mm_30mm] sm:p-[20mm_15mm_20mm_30mm] text-[13pt] leading-[1.45] text-justify box-border select-text border border-slate-300 print:border-none rounded-xs"
            style={{
              fontFamily: "'Times New Roman', Times, 'Liberation Serif', serif",
              color: '#000000',
              backgroundColor: '#ffffff',
              minHeight: '297mm',
              height: 'auto'
            }}
          >
            {/* =========================================================================
                MẪU 1 (MỚI NHẤT & TOÀN DIỆN): ĐƠN ĐĂNG KÝ VÀ BẢN CAM KẾT
                THAM GIA LỚP TIẾNG ANH CỘNG ĐỒNG MIỄN PHÍ TẠI NHÀ VĂN HÓA
                (Bảo vệ tài sản NVH + Quỹ vận hành + Miễn 100% gia đình chính sách)
               ========================================================================= */}
            {selectedTemplate === 'community_complete' && (
              <div>
                {/* 1. Quốc hiệu và Tiêu ngữ: Căn giữa theo Nghị định 30/2020/NĐ-CP */}
                <div className="flex justify-center mb-5">
                  <div className="text-center w-full max-w-[420px]">
                    <p className="font-bold uppercase text-[12.5pt] leading-tight tracking-tight text-black">
                      CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                    </p>
                    <p className="font-bold text-[13pt] leading-tight text-black mt-1">
                      Độc lập – Tự do – Hạnh phúc
                    </p>
                    {/* Đường kẻ ngang nét liền dài bằng độ dài dòng chữ */}
                    <div className="w-[180px] h-[1.5px] bg-black mx-auto mt-1.5"></div>
                  </div>
                </div>

                {/* 2. Tiêu đề đơn: Căn giữa, viết bằng CHỮ IN HOA, IN ĐẬM */}
                <div className="text-center my-5 space-y-1">
                  <h1 className="font-bold uppercase text-[15.5pt] sm:text-[16pt] leading-tight text-black">
                    ĐƠN ĐĂNG KÝ VÀ BẢN CAM KẾT
                  </h1>
                  <h2 className="font-bold uppercase text-[14pt] sm:text-[14.5pt] leading-tight text-black">
                    THAM GIA LỚP TIẾNG ANH CỘNG ĐỒNG MIỄN PHÍ TẠI NHÀ VĂN HÓA
                  </h2>
                  <p className="italic text-[12pt] text-black pt-0.5">
                    (Dành cho học sinh Tiểu học từ Lớp 1 đến Lớp 5 – Giai đoạn khởi động)
                  </p>
                </div>

                {/* 3. Phần I: THÔNG TIN HỌC SINH VÀ GIA ĐÌNH */}
                <div className="mb-4 space-y-1.5 text-[13pt] text-black">
                  <p className="font-bold uppercase text-[13pt]">
                    I. THÔNG TIN HỌC SINH VÀ GIA ĐÌNH
                  </p>
                  <div className="pl-[0.3cm] space-y-1.5">
                    <p>
                      <strong>1. Họ và tên học sinh:</strong>{' '}
                      <span className="font-bold">
                        {studentData.fullName || '...................................................................................................'}
                      </span>{' '}
                      {studentData.englishName && (
                        <span className="italic">(Tên gọi thân mật: {studentData.englishName})</span>
                      )}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
                      <p>
                        <strong>2. Ngày tháng năm sinh:</strong>{' '}
                        <span>{formatBirthDate(studentData.birthDate)}</span>
                      </p>
                      <p>
                        <strong>Hiện là học sinh lớp:</strong>{' '}
                        <span className="font-bold">
                          {studentData.gradeLabel || `Lớp ${studentData.grade || '.......'}`}
                        </span>
                      </p>
                    </div>

                    <p>
                      <strong>3. Trường tiểu học:</strong>{' '}
                      <span>
                        {studentData.schoolName || '.......................................................................................................'}
                      </span>
                    </p>

                    <p>
                      <strong>4. Họ và tên phụ huynh ({studentData.parentRelationship || 'Ba/Mẹ/Người giám hộ'}):</strong>{' '}
                      <span className="font-bold">
                        {studentData.parentName || '..............................................................'}
                      </span>
                    </p>

                    <p>
                      <strong>5. Số điện thoại liên hệ (Zalo nhận thông báo):</strong>{' '}
                      <span className="font-bold">
                        {getDisplayPhone(studentData.parentPhone)}
                      </span>
                    </p>

                    <p>
                      <strong>6. Địa chỉ cư trú:</strong>{' '}
                      <span>
                        {studentData.address || 'Thôn 16, địa phương'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* 4. Phần II: MỤC ĐÍCH VÀ NỘI DUNG LỚP HỌC */}
                <div className="mb-4 space-y-1.5 text-[13pt] text-black">
                  <p className="font-bold uppercase text-[13pt]">
                    II. MỤC ĐÍCH VÀ NỘI DUNG LỚP HỌC
                  </p>
                  <div className="pl-[0.3cm] space-y-1.5 text-justify">
                    <p>
                      • Lớp học được tổ chức hoàn toàn <strong>MIỄN PHÍ VỀ MẶT GIẢNG DẠY</strong> (0 đồng học phí) nhằm tạo môi trường rèn luyện tiếng Anh, phát triển sự tự tin và xây dựng nền tảng học tập cho các bạn nhỏ tại địa phương.
                    </p>
                    <p>
                      • Lớp học được triển khai tại {studentData.locationName || 'Nhà văn hóa Thôn 16'} theo từng giai đoạn ngắn hạn (Giai đoạn khởi động dự kiến gồm: <strong className="underline decoration-dotted">{sessionsCount}</strong> buổi).
                    </p>
                  </div>
                </div>

                {/* 5. Phần III: QUY ĐỊNH VỀ QUỸ VẬN HÀNH & CHÍNH SÁCH MIỄN ĐÓNG GÓP */}
                <div className="mb-4 space-y-2 text-[13pt] text-black">
                  <p className="font-bold uppercase text-[13pt]">
                    III. QUY ĐỊNH VỀ QUỸ VẬN HÀNH & CHÍNH SÁCH MIỄN ĐÓNG GÓP
                  </p>

                  <p className="indent-[1cm] text-justify">
                    Để lớp học diễn ra nề nếp, đảm bảo điều kiện cơ sở vật chất và duy trì lâu dài tại {studentData.locationName || 'Nhà văn hóa'}, phụ huynh và học sinh đồng thuận với các khoản chi phí thực tế như sau:
                  </p>

                  {/* Mục 1: Quỹ vận hành và sinh hoạt lớp */}
                  <div className="space-y-1">
                    <p className="font-bold text-[13pt]">
                      1. Quỹ vận hành và sinh hoạt lớp
                    </p>
                    <div className="pl-[0.4cm] space-y-1 text-justify">
                      <p>
                        • Mức đóng góp tự nguyện: <strong>{operatingFund} VNĐ / học sinh</strong> (cho toàn bộ giai đoạn học).
                      </p>
                      <p>• <strong>Mục đích sử dụng:</strong></p>
                      <div className="pl-[0.6cm] space-y-0.5">
                        <p>- Chi trả tiền điện chiếu sáng, quạt/điều hòa, nước uống phát sinh thực tế tại Nhà văn hóa.</p>
                        <p>- In ấn phiếu bài tập, giáo trình/tài liệu học tập cho các con.</p>
                        <p>- Mua sắm đồ dùng chung, quà tặng sticker và phần thưởng động viên các bạn nhỏ cuối khóa.</p>
                      </div>
                      <p>
                        • Quỹ được đại diện phụ huynh theo dõi, quản lý thu - chi và công khai minh bạch.
                      </p>
                    </div>
                  </div>

                  {/* Mục 2: Chính sách miễn đóng góp 100% */}
                  <div className="space-y-1.5 pt-1">
                    <p className="font-bold text-[13pt]">
                      2. Chính sách miễn đóng góp 100% (Ưu tiên cộng đồng & Tri ân)
                    </p>
                    <div className="pl-[0.4cm] space-y-1.5 text-justify">
                      <p>
                        Với tinh thần tương thân tương ái và truyền thống “Uống nước nhớ nguồn”, lớp học <strong>miễn hoàn toàn 100% khoản Quỹ vận hành và sinh hoạt</strong> đối với:
                      </p>
                      <p className="pl-[0.6cm]">
                        • <strong>Con em thuộc gia đình người có công với cách mạng, gia đình chính sách (thương binh, bệnh binh, thân nhân liệt sĩ).</strong>
                      </p>
                      <p className="pl-[0.6cm]">
                        • <strong>Học sinh thuộc hộ nghèo, cận nghèo hoặc các em có hoàn cảnh gia đình đặc biệt khó khăn.</strong>
                      </p>
                      <p className="italic text-[12pt]">
                        (Gia đình thuộc diện trên vui lòng tích chọn vào ô bên dưới hoặc trao đổi riêng, kín đáo với giáo viên. Danh sách được giữ bảo mật, không công khai để đảm bảo sự tế nhị cho các con).
                      </p>

                      {/* 3 ô Checkbox tích chọn */}
                      <div className="space-y-1.5 pt-1 pl-[0.2cm]">
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-[18px] h-[18px] border border-black text-center leading-[16px] text-xs font-bold shrink-0">
                            {policyCategory === 'policy_revolution' ? '✓' : ' '}
                          </span>
                          <span className="italic">
                            Gia đình thuộc diện có công với cách mạng / gia đình chính sách
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-[18px] h-[18px] border border-black text-center leading-[16px] text-xs font-bold shrink-0">
                            {policyCategory === 'poor_household' ? '✓' : ' '}
                          </span>
                          <span className="italic">
                            Gia đình thuộc diện hộ nghèo / cận nghèo / hoàn cảnh khó khăn
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-[18px] h-[18px] border border-black text-center leading-[16px] text-xs font-bold shrink-0">
                            {policyCategory === 'standard' ? '✓' : ' '}
                          </span>
                          <span className="italic">
                            Gia đình tham gia đóng góp quỹ vận hành theo quy định chung
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6. Phần IV: BẢO QUẢN TÀI SẢN NHÀ VĂN HÓA VÀ NỘI QUY LỚP HỌC */}
                <div className="mb-4 space-y-1.5 text-[13pt] text-black">
                  <p className="font-bold uppercase text-[13pt]">
                    IV. BẢO QUẢN TÀI SẢN NHÀ VĂN HÓA VÀ NỘI QUY LỚP HỌC
                  </p>
                  <div className="pl-[0.3cm] space-y-1.5 text-justify">
                    <p>
                      <strong>1. Bảo vệ tài sản công:</strong> Tuyệt đối không vẽ bậy, cào xước lên bàn ghế, tường, rèm sân khấu. Không tự ý bật/tắt hay nghịch ngợm hệ thống âm thanh, loa đài, bảng điện và các trang thiết bị của Nhà văn hóa. Nếu học sinh cố ý làm hư hỏng, gia đình có trách nhiệm bồi hoàn, sửa chữa theo quy định.
                    </p>
                    <p>
                      <strong>2. Giữ gìn vệ sinh chung:</strong> Bỏ rác đúng nơi quy định trước khi ra về. Không mang đồ ăn vặt, kẹo cao su, nước ngọt có ga vào khuôn viên phòng học.
                    </p>
                    <p>
                      <strong>3. Giờ giấc & An toàn:</strong> Phụ huynh chủ động đưa đón con đúng giờ quy định tại cổng/sảnh Nhà văn hóa nhằm đảm bảo an toàn cho học sinh.
                    </p>
                    <p>
                      <strong>4. Chuyên cần:</strong> Đi học đầy đủ. Nếu nghỉ học vì lý do bất khả kháng, phụ huynh vui lòng nhắn tin thông báo trước cho giáo viên.
                    </p>
                  </div>
                </div>

                {/* 7. Phần V: CAM KẾT CỦA PHỤ HUYNH */}
                <div className="mb-5 space-y-2 text-[13pt] text-black">
                  <p className="font-bold uppercase text-[13pt]">
                    V. CAM KẾT CỦA PHỤ HUYNH
                  </p>
                  <p className="indent-[1cm] text-justify">
                    Tôi đã đọc, hiểu rõ toàn bộ mục đích, điều khoản sử dụng tài sản Nhà văn hóa cũng như quy chế đóng góp Quỹ vận hành của lớp học. Tôi hoàn toàn tự nguyện đăng ký cho con tham gia và cam kết phối hợp chặt chẽ cùng giáo viên và ban quản lý lớp trong suốt quá trình học.
                  </p>
                </div>

                {/* 8. Địa danh, ngày tháng và Chữ ký 2 bên */}
                <div className="mt-6">
                  <div className="text-right italic text-[13pt] text-black mb-3 pr-2">
                    {studentData.locationName || 'Thôn 16'}, ngày {day} tháng {month} năm {year}
                  </div>

                  <div className="grid grid-cols-2 gap-6 text-center text-black pt-1">
                    <div className="space-y-1">
                      <p className="font-bold uppercase text-[12.5pt] leading-tight">
                        HỌC SINH ĐĂNG KÝ
                      </p>
                      <p className="italic text-[11.5pt] text-black">
                        (Ký và ghi rõ họ tên)
                      </p>
                      <div className="h-24 sm:h-28" />
                      <p className="font-bold text-[13pt] text-black">
                        {studentData.fullName || studentData.studentSignedName || ''}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="font-bold uppercase text-[12.5pt] leading-tight">
                        PHỤ HUYNH XÁC NHẬN & CAM KẾT
                      </p>
                      <p className="italic text-[11.5pt] text-black">
                        (Ký và ghi rõ họ tên)
                      </p>
                      <div className="h-24 sm:h-28" />
                      <p className="font-bold text-[13pt] text-black">
                        {studentData.parentName || studentData.parentSignedName || ''}
                      </p>
                    </div>
                  </div>

                  {/* Nơi nhận theo Nghị định 30/2020/NĐ-CP */}
                  <div className="mt-8 pt-2">
                    <div className="text-left">
                      <p className="font-bold italic text-[12pt] text-black mb-1">
                        Nơi nhận:
                      </p>
                      <div className="text-[11pt] text-black space-y-0.5 leading-snug pl-1">
                        <p>- Ban Quản lý Nhà văn hóa Thôn 16;</p>
                        <p>- Giáo viên phụ trách lớp tiếng Anh cộng đồng;</p>
                        <p>- Đại diện Hội Phụ huynh học sinh (quản lý Quỹ);</p>
                        <p>- Lưu: Hồ sơ lớp học, Gia đình.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                MẪU 2: ĐƠN ĐĂNG KÝ THAM GIA KHÓA HỌC / ÔN TẬP BỔ TRỢ KIẾN THỨC
               ========================================================================= */}
            {selectedTemplate === 'course_supplementary' && (
              <div>
                <div className="flex justify-center mb-6">
                  <div className="text-center w-full max-w-[420px]">
                    <p className="font-bold uppercase text-[12.5pt] leading-tight tracking-tight text-black">
                      CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                    </p>
                    <p className="font-bold text-[13pt] leading-tight text-black mt-1">
                      Độc lập – Tự do – Hạnh phúc
                    </p>
                    <div className="w-[180px] h-[1.5px] bg-black mx-auto mt-1.5"></div>
                  </div>
                </div>

                <div className="text-center my-6 space-y-1">
                  <h1 className="font-bold uppercase text-[15pt] sm:text-[16pt] leading-tight text-black">
                    ĐƠN ĐĂNG KÝ THAM GIA KHÓA HỌC / ÔN TẬP BỔ TRỢ KIẾN THỨC
                  </h1>
                </div>

                <div className="mb-6 text-[13pt] text-black">
                  <p className="indent-[1cm]">
                    <strong>Kính gửi:</strong> Ban Quản lý / Giáo viên phụ trách bộ môn:{' '}
                    <span className="font-bold">
                      {studentData.departmentHead || 'Tiếng Anh (CLB StarKids - Nhà văn hóa Thôn 16)'}
                    </span>
                  </p>
                </div>

                <div className="space-y-4 text-[13pt] text-black">
                  <div className="space-y-1.5">
                    <p className="font-bold text-[13pt]">
                      1. Thông tin phụ huynh (người đại diện):
                    </p>
                    <div className="pl-[0.5cm] space-y-1.5">
                      <p>
                        Họ và tên phụ huynh:{' '}
                        <span className="font-bold">
                          {studentData.parentName || '................................................................................................'}
                        </span>
                      </p>
                      <p>
                        Số điện thoại liên hệ:{' '}
                        <span className="font-bold">
                          {getDisplayPhone(studentData.parentPhone)}
                        </span>
                      </p>
                      <p>
                        Địa chỉ thường trú:{' '}
                        <span>
                          {studentData.address || '...................................................................................................'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <p className="font-bold text-[13pt]">
                      2. Thông tin học sinh:
                    </p>
                    <div className="pl-[0.5cm] space-y-1.5">
                      <p>
                        Họ và tên học sinh:{' '}
                        <span className="font-bold">
                          {studentData.fullName || '..................................................................................................'}
                        </span>{' '}
                        {studentData.englishName && (
                          <span className="italic">(Tên gọi: {studentData.englishName})</span>
                        )}
                      </p>
                      <p>
                        Ngày tháng năm sinh:{' '}
                        <span>{formatBirthDate(studentData.birthDate)}</span>
                      </p>
                      <p>
                        Hiện là học sinh lớp:{' '}
                        <span className="font-bold">
                          {studentData.gradeLabel || `Lớp ${studentData.grade || '.......'}`}
                        </span>
                        {'  '}Trường:{' '}
                        <span>
                          {studentData.schoolName || '................................................................'}
                        </span>
                      </p>
                      <div>
                        <p>Học lực hiện tại đối với môn đăng ký:</p>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 pt-1 pl-[0.2cm]">
                          <span className="inline-flex items-center gap-1.5">
                            <span className="inline-block w-[18px] h-[18px] border border-black text-center leading-[16px] text-xs font-bold">
                              {academicAbility === 'basic' ? '✓' : ' '}
                            </span>{' '}
                            Cần củng cố căn bản
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <span className="inline-block w-[18px] h-[18px] border border-black text-center leading-[16px] text-xs font-bold">
                              {academicAbility === 'advanced' ? '✓' : ' '}
                            </span>{' '}
                            Khá / Nâng cao
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <span className="inline-block w-[18px] h-[18px] border border-black text-center leading-[16px] text-xs font-bold">
                              {academicAbility === 'gifted' ? '✓' : ' '}
                            </span>{' '}
                            Luyện thi học sinh giỏi / Thi chuyển cấp
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <p className="font-bold text-[13pt]">
                      3. Nội dung đăng ký:
                    </p>
                    <div className="pl-[0.5cm] space-y-1.5">
                      <p>
                        Môn học đăng ký:{' '}
                        <span className="font-bold">
                          {studentData.subjectName || 'Tiếng Anh tiểu học & Kỹ năng giao tiếp'}
                        </span>
                      </p>
                      <p>
                        Khóa học / Chương trình ôn tập cụ thể:{' '}
                        <span className="font-bold">
                          {studentData.courseProgram ||
                            (studentData.className ? `Lớp ${studentData.className}` : `Khóa học Bổ trợ & Ôn tập kiến thức ${studentData.gradeLabel || 'Tiếng Anh'}`)}
                        </span>
                      </p>
                      <p>
                        Mục tiêu học tập của học sinh:{' '}
                        <span>
                          {studentData.learningGoal ||
                            'Củng cố nền tảng phát âm, nắm chắc ngữ pháp cơ bản, tự tin giao tiếp và đạt kết quả tốt.'}
                        </span>
                      </p>
                      <p>
                        Khung thời gian / Ca học mong muốn:{' '}
                        <span>
                          {studentData.preferredSchedule ||
                            'Ca học các ngày trong tuần (Thứ 2 - Thứ 4 hoặc Thứ 3 - Thứ 5: 17h30 - 19h00)'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <p className="font-bold text-[13pt]">
                      4. Cam kết của phụ huynh và học sinh:
                    </p>
                    <div className="pl-[0.5cm] space-y-1.5 text-justify">
                      <p>
                        - Học sinh tham gia các buổi học đầy đủ, đúng giờ và hoàn thành bài tập theo hướng dẫn của giáo viên.
                      </p>
                      <p>
                        - Gia đình phối hợp chặt chẽ với giáo viên trong quá trình theo dõi kết quả học tập của học sinh.
                      </p>
                      <p>
                        - Chấp hành đầy đủ nội quy của lớp học và hoàn thành các nghĩa vụ học phí theo quy định.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="indent-[1cm] text-[13pt]">
                      Tôi xin chân thành cảm ơn!
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="text-right italic text-[13pt] text-black mb-3 pr-2">
                    {studentData.locationName || 'Thôn 16'}, ngày {day} tháng {month} năm {year}
                  </div>

                  <div className="grid grid-cols-2 gap-6 text-center text-black pt-1">
                    <div className="space-y-1">
                      <p className="font-bold uppercase text-[12.5pt] leading-tight">
                        HỌC SINH ĐĂNG KÝ
                      </p>
                      <p className="italic text-[11.5pt] text-black">
                        (Ký và ghi rõ họ tên)
                      </p>
                      <div className="h-24 sm:h-28" />
                      <p className="font-bold text-[13pt] text-black">
                        {studentData.fullName || studentData.studentSignedName || ''}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="font-bold uppercase text-[12.5pt] leading-tight">
                        NGƯỜI LÀM ĐƠN / ĐẠI DIỆN PHỤ HUYNH
                      </p>
                      <p className="italic text-[11.5pt] text-black">
                        (Ký và ghi rõ họ tên)
                      </p>
                      <div className="h-24 sm:h-28" />
                      <p className="font-bold text-[13pt] text-black">
                        {studentData.parentName || studentData.parentSignedName || ''}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-2">
                    <div className="text-left">
                      <p className="font-bold italic text-[12pt] text-black mb-1">
                        Nơi nhận:
                      </p>
                      <div className="text-[11pt] text-black space-y-0.5 leading-snug pl-1">
                        <p>- Ban Quản lý / Giáo viên phụ trách bộ môn;</p>
                        <p>- Gia đình học sinh (để phối hợp);</p>
                        <p>- Lưu: Hồ sơ lớp học, CLB StarKids.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                MẪU 3: ĐƠN ĐĂNG KÝ VÀ BẢN CAM KẾT CSVC CHI TIẾT NHÀ VĂN HÓA THÔN 16
               ========================================================================= */}
            {selectedTemplate === 'community_nvh' && (
              <div>
                <div className="flex justify-center mb-6">
                  <div className="text-center w-full max-w-[360px]">
                    <p className="font-bold uppercase text-[12.5pt] leading-tight tracking-tight text-black">
                      CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                    </p>
                    <p className="font-bold text-[13pt] leading-tight text-black mt-1">
                      Độc lập – Tự do – Hạnh phúc
                    </p>
                    <div className="w-[170px] h-[1.5px] bg-black mx-auto mt-1.5"></div>
                  </div>
                </div>

                <div className="text-center my-6 space-y-1">
                  <h1 className="font-bold uppercase text-[16pt] leading-tight text-black">
                    ĐƠN ĐĂNG KÝ VÀ BẢN CAM KẾT
                  </h1>
                  <h2 className="font-bold uppercase text-[15pt] leading-tight text-black">
                    THAM GIA LỚP TIẾNG ANH MIỄN PHÍ
                  </h2>
                  <p className="italic text-[12.5pt] text-black pt-0.5">
                    (Địa điểm học tập: {studentData.locationName || 'Nhà văn hóa Thôn 16'} | Dành cho học sinh Lớp 1 – Lớp 5)
                  </p>
                </div>

                <div className="mb-5 text-[13pt] text-black">
                  <p className="indent-[1cm]">
                    <strong className="text-[13.5pt]">Kính gửi:</strong>
                  </p>
                  <div className="pl-[2.2cm] space-y-0.5">
                    <p>- Ban Quản lý Nhà văn hóa Thôn 16;</p>
                    <p>- Ban Chủ nhiệm / Giáo viên phụ trách Lớp Tiếng Anh cộng đồng Thôn 16.</p>
                  </div>
                </div>

                <div className="mb-5 space-y-1.5">
                  <p className="font-bold uppercase text-[13pt] text-black">
                    I. THÔNG TIN HỌC SINH VÀ PHỤ HUYNH
                  </p>
                  
                  <div className="space-y-1 pl-[0.5cm] text-[13pt]">
                    <p>
                      <strong>• Họ và tên học sinh:</strong>{' '}
                      <span className="font-bold">{studentData.fullName || '................................................................................'}</span>{' '}
                      {studentData.englishName && (
                        <span className="italic">(Tên gọi thân mật: {studentData.englishName})</span>
                      )}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-x-4">
                      <p>
                        <strong>• Ngày, tháng, năm sinh:</strong>{' '}
                        <span>{formatBirthDate(studentData.birthDate)}</span>
                      </p>
                      <p>
                        <strong>• Hiện là học sinh lớp:</strong>{' '}
                        <span className="font-bold">{studentData.gradeLabel || `Lớp ${studentData.grade || '.......'}`}</span>
                      </p>
                    </div>

                    <p>
                      <strong>• Trường tiểu học:</strong>{' '}
                      <span>{studentData.schoolName || '................................................................................'}</span>
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-x-4">
                      <p>
                        <strong>• Họ và tên phụ huynh ({studentData.parentRelationship || 'Ba/Mẹ/Người giám hộ'}):</strong>{' '}
                        <span className="font-bold">{studentData.parentName || '................................................................................'}</span>
                      </p>
                    </div>

                    <p>
                      <strong>• Số điện thoại liên hệ (Zalo):</strong>{' '}
                      <span className="font-bold">{getDisplayPhone(studentData.parentPhone)}</span>
                    </p>

                    <p>
                      <strong>• Địa chỉ thường trú/cư trú:</strong>{' '}
                      <span>{studentData.address || 'Thôn 16, địa phương'}</span>
                    </p>
                  </div>
                </div>

                <div className="mb-5 space-y-2">
                  <p className="font-bold uppercase text-[13pt] text-black">
                    II. NỘI DUNG VÀ CÁC ĐIỀU KHOẢN CAM KẾT THAM GIA
                  </p>

                  <p className="indent-[1cm] text-justify text-[13pt]">
                    Lớp học được tổ chức hoàn toàn <strong>MIỄN PHÍ</strong> nhằm nâng cao kiến thức và kỹ năng tiếng Anh cho các cháu thiếu nhi trên địa bàn, nhờ sự tạo điều kiện của chính quyền địa phương cho mượn không gian tại {studentData.locationName || 'Nhà văn hóa Thôn 16'}. Để giữ gìn nề nếp, bảo đảm an ninh trật tự và bảo quản tốt tài sản công cộng của Nhà văn hóa, tôi cùng học sinh xin cam kết thực hiện nghiêm túc các điều khoản sau:
                  </p>

                  <div className="space-y-1 text-justify">
                    <p className="indent-[0.8cm] font-bold text-[13pt]">
                      1. Bảo quản cơ sở vật chất và tài sản công tại {studentData.locationName || 'Nhà văn hóa'} (Đặc biệt quan trọng):
                    </p>
                    <div className="pl-[1.2cm] space-y-1 text-[13pt]">
                      <p>
                        - <strong>Ý thức giữ gìn bàn ghế, trang thiết bị:</strong> Tuyệt đối không viết, vẽ bậy, cào xước, khắc chữ lên bàn ghế, tường, rèm cửa, phông bạt sân khấu hoặc bục phát biểu. Không tự ý chạm vào, bật/tắt hoặc xê dịch hệ thống âm thanh, loa đài, máy chiếu, bảng điều khiển ánh sáng, quạt điện và điều hòa của Nhà văn hóa khi chưa có sự hướng dẫn của phụ trách.
                      </p>
                      <p>
                        - <strong>Không di chuyển, sử dụng tài sản bừa bãi:</strong> Học sinh chỉ ngồi đúng vị trí sắp xếp; không tự ý kéo xê dịch bàn ghế, giẫm đạp lên ghế hoặc mang trang thiết bị ra khỏi khuôn viên phòng học.
                      </p>
                      <p>
                        - <strong>Trách nhiệm đền bù hư hại:</strong> Trường hợp học sinh cố ý đùa nghịch làm hư hỏng, sứt mẻ, gãy vỡ tài sản của Nhà văn hóa, gia đình xin phối hợp với giáo viên và Ban quản lý Nhà văn hóa để sửa chữa hoặc bồi thường thiệt hại theo đúng giá trị thực tế.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 text-justify">
                    <p className="indent-[0.8cm] font-bold text-[13pt]">
                      2. Về giữ gìn vệ sinh môi trường và trật tự công cộng:
                    </p>
                    <div className="pl-[1.2cm] space-y-1 text-[13pt]">
                      <p>
                        - <strong>Vệ sinh lớp học:</strong> Học sinh tự giác gom rác, gọt vỏ bút chì, giấy nháp bỏ vào thùng rác trước khi tan học. Tuyệt đối không mang đồ ăn vặt, kẹo cao su, nước ngọt có ga vào khu vực phòng học của Nhà văn hóa.
                      </p>
                      <p>
                        - <strong>Giữ gìn trật tự và an toàn:</strong> Không chạy nhảy, nô đùa, xô đẩy trên khu vực sân khấu, cầu thang hoặc hành lang để tránh nguy hiểm và không gây ảnh hưởng đến không gian sinh hoạt chung của khu dân cư.
                      </p>
                      <p>
                        - <strong>Sử dụng công trình phụ trợ:</strong> Giữ gìn vệ sinh chung tại khu vực nhà vệ sinh, xả nước sạch sẽ, tắt điện và khóa vòi nước cẩn thận sau khi sử dụng.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 text-justify">
                    <p className="indent-[0.8cm] font-bold text-[13pt]">
                      3. Về giờ giấc và trách nhiệm đưa đón của phụ huynh:
                    </p>
                    <div className="pl-[1.2cm] space-y-1 text-[13pt]">
                      <p>
                        - Phụ huynh có mặt đưa đón con <strong>đúng giờ quy định</strong> tại khu vực sảnh/cổng Nhà văn hóa. Giáo viên chỉ chịu trách nhiệm quản lý học sinh trong phạm vi lớp học và khung giờ học chính thức; phụ huynh chủ động đón con ngay sau khi kết thúc buổi học để bảo đảm an toàn tuyệt đối.
                      </p>
                      <p>
                        - Học sinh có mặt trước giờ học từ <strong>5 – 10 phút</strong> để ổn định vị trí ngồi và ôn tập bài cũ.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 text-justify">
                    <p className="indent-[0.8cm] font-bold text-[13pt]">
                      4. Về ý thức chuyên cần và tinh thần học tập:
                    </p>
                    <div className="pl-[1.2cm] space-y-1 text-[13pt]">
                      <p>
                        - Học sinh đi học chuyên cần, chuẩn bị đầy đủ sách vở, bút mực và tích cực hoàn thành bài tập về nhà.
                      </p>
                      <p>
                        - Nếu nghỉ học, phụ huynh có trách nhiệm thông báo xin phép giáo viên trước giờ vào lớp. Trường hợp học sinh nghỉ học không phép từ <strong>02 buổi</strong> hoặc nghỉ học có phép quá <strong>03 buổi liên tiếp</strong> sẽ dừng học để nhường vị trí cho học sinh khác có nhu cầu.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 text-justify">
                    <p className="indent-[0.8cm] font-bold text-[13pt]">
                      5. Về hình ảnh và tư liệu học tập:
                    </p>
                    <p className="pl-[1.2cm] text-[13pt]">
                      Gia đình đồng thuận để giáo viên chụp ảnh, ghi hình các hoạt động học tập tích cực của học sinh nhằm cập nhật tình hình với phụ huynh và phục vụ công tác báo cáo hoạt động phong trào phi lợi nhuận của địa phương.
                    </p>
                  </div>
                </div>

                <div className="mb-6 space-y-2">
                  <p className="font-bold uppercase text-[13pt] text-black">
                    III. LỜI CAM ĐOAN VÀ TRÁCH NHIỆM CỦA GIA ĐÌNH
                  </p>

                  <p className="indent-[1cm] text-justify text-[13pt]">
                    Gia đình chúng tôi xin cam đoan những thông tin đã kê khai trong đơn là hoàn toàn đúng sự thật. Chúng tôi và học sinh đã đọc kỹ, hiểu rõ và tự nguyện cam kết chấp hành nghiêm túc mọi quy định nêu trên. Nếu vi phạm nội quy lớp học hoặc để xảy ra hư hỏng, thiệt hại về tài sản công tại Nhà văn hóa Thôn 16, gia đình xin chịu hoàn toàn trách nhiệm và bồi thường theo đúng quy định.
                  </p>
                  <p className="indent-[1cm] text-justify text-[13pt]">
                    Kính mong Ban Quản lý Nhà văn hóa Thôn 16 và Ban Chủ nhiệm lớp học xem xét, tiếp nhận đơn đăng ký.
                  </p>
                  <p className="indent-[1cm] text-justify text-[13pt]">
                    Gia đình chúng tôi xin chân thành cảm ơn!
                  </p>
                </div>

                <div className="mt-8">
                  <div className="text-right italic text-[13pt] text-black mb-3 pr-2">
                    Thôn 16, ngày {day} tháng {month} năm {year}
                  </div>

                  <div className="grid grid-cols-2 gap-6 text-center text-black pt-1">
                    <div className="space-y-1">
                      <p className="font-bold uppercase text-[12.5pt] leading-tight">
                        HỌC SINH ĐĂNG KÝ
                      </p>
                      <p className="italic text-[11.5pt] text-black">
                        (Ký và ghi rõ họ tên)
                      </p>
                      <div className="h-24 sm:h-28" />
                      <p className="font-bold text-[13pt] text-black">
                        {studentData.fullName || studentData.studentSignedName || ''}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="font-bold uppercase text-[12.5pt] leading-tight">
                        NGƯỜI LÀM ĐƠN / ĐẠI DIỆN PHỤ HUYNH
                      </p>
                      <p className="italic text-[11.5pt] text-black">
                        (Ký và ghi rõ họ tên)
                      </p>
                      <div className="h-24 sm:h-28" />
                      <p className="font-bold text-[13pt] text-black">
                        {studentData.parentName || studentData.parentSignedName || ''}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-2">
                    <div className="text-left">
                      <p className="font-bold italic text-[12pt] text-black mb-1">
                        Nơi nhận:
                      </p>
                      <div className="text-[11pt] text-black space-y-0.5 leading-snug pl-1">
                        <p>- Chi bộ Thôn 16 (để báo cáo);</p>
                        <p>- Ban Quản lý Nhà văn hóa Thôn 16;</p>
                        <p>- Giáo viên phụ trách CLB;</p>
                        <p>- Lưu: Gia đình, Hồ sơ CLB StarKids.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dấu chứng thực ký điện tử và lưu trữ số của hệ thống (Ẩn khi in ấn) */}
            <div className="no-print mt-8 pt-4 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-sans shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700 shadow-2xs">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-xs sm:text-sm text-emerald-950 flex items-center gap-1.5">
                      Văn bản đã được số hóa và lưu trữ trên hệ thống StarKids
                    </p>
                    <p className="text-[11px] text-emerald-700 leading-tight mt-0.5">
                      Đã xác thực chữ ký điện tử học sinh và phụ huynh • Sẵn sàng in chuẩn A4
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto text-[11px] text-emerald-800 bg-white/90 px-3 py-1.5 rounded-xl border border-emerald-200/80 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Đã xác thực trực tuyến</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
