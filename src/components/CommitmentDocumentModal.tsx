import React, { useRef } from 'react';
import { X, Printer, FileText, CheckCircle2, ShieldCheck, Info } from 'lucide-react';

interface CommitmentDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentData: {
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
  };
}

export const CommitmentDocumentModal: React.FC<CommitmentDocumentModalProps> = ({
  isOpen,
  onClose,
  studentData
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const today = studentData.commitmentDate
    ? new Date(studentData.commitmentDate)
    : new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const year = today.getFullYear();

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
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  Đơn Đăng Ký & Cam Kết Hành Chính (Nghị Định 30/2020/NĐ-CP)
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 text-[10px] font-bold">
                  Chuẩn Thể Thức A4
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Khổ A4 (210×297mm) • Font Times New Roman • Căn lề: Trái 30mm, Phải 15mm, Trên 20mm, Dưới 20mm
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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

        {/* Outer scrolling canvas for previewing the A4 page */}
        <div className="p-3 sm:p-6 md:p-8 overflow-y-auto flex-1 bg-slate-200/80 print:bg-white print:p-0">
          {/* 
            A4 Document Container
            Strictly styled to Decree 30/2020/ND-CP guidelines:
            - A4 size: 210mm wide x 297mm minimum height
            - Margins: Top 20mm, Bottom 20mm, Left 30mm, Right 15mm
            - Font: Times New Roman, text-black, Unicode
            - Line height: 1.4 - 1.5
            - Full white background that expands dynamically to contain all pages/content
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
            {/* ==================== PHẦN MỞ ĐẦU ==================== */}

            {/* 1. Quốc hiệu và Tiêu ngữ: Căn giữa */}
            <div className="flex justify-center mb-6">
              <div className="text-center w-full max-w-[360px]">
                <p className="font-bold uppercase text-[12.5pt] leading-tight tracking-tight text-black">
                  CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                </p>
                <p className="font-bold text-[13pt] leading-tight text-black mt-1">
                  Độc lập – Tự do – Hạnh phúc
                </p>
                {/* Đường kẻ ngang phụ bên dưới, nét liền có độ dài tương ứng dòng chữ tiêu ngữ */}
                <div className="w-[170px] h-[1.5px] bg-black mx-auto mt-1.5"></div>
              </div>
            </div>

            {/* 2. Tên đơn: Căn giữa, viết bằng CHỮ IN HOA, IN ĐẬM (Cỡ chữ 16 - 18) */}
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

            {/* 3. Kính gửi: Chữ in thường, in đậm ở chữ "Kính gửi:", cỡ 14 */}
            <div className="mb-5 text-[13pt] text-black">
              <p className="indent-[1cm]">
                <strong className="text-[13.5pt]">Kính gửi:</strong>
              </p>
              <div className="pl-[2.2cm] space-y-0.5">
                <p>- Ban Quản lý Nhà văn hóa Thôn 16;</p>
                <p>- Ban Chủ nhiệm / Giáo viên phụ trách Lớp Tiếng Anh cộng đồng Thôn 16.</p>
              </div>
            </div>

            {/* ==================== PHẦN NỘI DUNG CHÍNH ==================== */}

            {/* I. THÔNG TIN HỌC SINH VÀ PHỤ HUYNH */}
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
                    <span>{studentData.birthDate || '..... / ..... / .........'}</span>
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
                  <span className="font-bold">{studentData.parentPhone || '...................................................'}</span>
                </p>

                <p>
                  <strong>• Địa chỉ thường trú/cư trú:</strong>{' '}
                  <span>{studentData.address || 'Thôn 16, địa phương'}</span>
                </p>

                {studentData.className && (
                  <p>
                    <strong>• Đăng ký lớp học nguyện vọng:</strong>{' '}
                    <span className="font-bold">{studentData.className}</span>
                  </p>
                )}
              </div>
            </div>

            {/* II. NỘI DUNG VÀ CÁC ĐIỀU KHOẢN CAM KẾT */}
            <div className="mb-5 space-y-2">
              <p className="font-bold uppercase text-[13pt] text-black">
                II. NỘI DUNG VÀ CÁC ĐIỀU KHOẢN CAM KẾT THAM GIA
              </p>

              <p className="indent-[1cm] text-justify text-[13pt]">
                Lớp học được tổ chức hoàn toàn <strong>MIỄN PHÍ</strong> nhằm nâng cao kiến thức và kỹ năng tiếng Anh cho các cháu thiếu nhi trên địa bàn, nhờ sự tạo điều kiện của chính quyền địa phương cho mượn không gian tại {studentData.locationName || 'Nhà văn hóa Thôn 16'}. Để giữ gìn nề nếp, bảo đảm an ninh trật tự và bảo quản tốt tài sản công cộng của Nhà văn hóa, tôi cùng học sinh xin cam kết thực hiện nghiêm túc các điều khoản sau:
              </p>

              {/* Điều 1 */}
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

              {/* Điều 2 */}
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

              {/* Điều 3 */}
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

              {/* Điều 4 */}
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

              {/* Điều 5 */}
              <div className="space-y-1 text-justify">
                <p className="indent-[0.8cm] font-bold text-[13pt]">
                  5. Về hình ảnh và tư liệu học tập:
                </p>
                <p className="pl-[1.2cm] text-[13pt]">
                  Gia đình đồng thuận để giáo viên chụp ảnh, ghi hình các hoạt động học tập tích cực của học sinh nhằm cập nhật tình hình với phụ huynh và phục vụ công tác báo cáo hoạt động phong trào phi lợi nhuận của địa phương.
                </p>
              </div>
            </div>

            {/* III. LỜI CAM ĐOAN VÀ TRÁCH NHIỆM */}
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

            {/* ==================== PHẦN KẾT THÚC ==================== */}

            {/* 1. Địa danh và ngày tháng năm: Căn lề phải, dưới phần nội dung, kiểu chữ in nghiêng, cỡ 13 - 14 */}
            <div className="text-right italic text-[13pt] text-black mb-3 pr-2">
              Thôn 16, ngày {day} tháng {month} năm {year}
            </div>

            {/* 2. Chữ ký và họ tên: Chia cột hoặc căn về phía bên phải */}
            <div className="grid grid-cols-2 gap-6 text-center text-black pt-1">
              {/* Cột 1: Học sinh */}
              <div className="space-y-1">
                <p className="font-bold uppercase text-[12.5pt] leading-tight">
                  HỌC SINH ĐĂNG KÝ
                </p>
                <p className="italic text-[11.5pt] text-black">
                  (Ký và ghi rõ họ tên)
                </p>
                {/* Khoảng trống ký tên để trắng hoàn toàn cho học sinh in ra ký tay */}
                <div className="h-24 sm:h-28" />
                <p className="font-bold text-[13pt] text-black">
                  {studentData.fullName || studentData.studentSignedName || ''}
                </p>
              </div>

              {/* Cột 2: Phụ huynh / Người làm đơn */}
              <div className="space-y-1">
                <p className="font-bold uppercase text-[12.5pt] leading-tight">
                  NGƯỜI LÀM ĐƠN / ĐẠI DIỆN PHỤ HUYNH
                </p>
                <p className="italic text-[11.5pt] text-black">
                  (Ký và ghi rõ họ tên)
                </p>
                {/* Khoảng trống ký tên để trắng hoàn toàn cho phụ huynh in ra ký tay */}
                <div className="h-24 sm:h-28" />
                <p className="font-bold text-[13pt] text-black">
                  {studentData.parentName || studentData.parentSignedName || ''}
                </p>
              </div>
            </div>

            {/* 3. Nơi nhận (Theo thể thức văn bản hành chính Nghị định 30/2020/NĐ-CP) */}
            <div className="mt-8 pt-2">
              <div className="text-left font-serif">
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

            {/* 4. Dấu chứng thực ký điện tử và lưu trữ số của hệ thống (Ẩn khi in ấn) */}
            <div className="no-print mt-8 pt-4 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-sans shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700 shadow-xs">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-xs sm:text-sm text-emerald-950 flex items-center gap-1.5">
                      Văn bản đã được ký điện tử và lưu trữ số
                    </p>
                    <p className="text-[11px] text-emerald-700 leading-tight mt-0.5">
                      Hệ thống quản lý CLB Kỹ năng sống &amp; Tiếng Anh StarKids • Thôn 16
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
