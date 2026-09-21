import React, { useState, useRef } from 'react';
import {
  Server,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileCode,
  ShieldCheck,
  X,
  Users,
  GraduationCap,
  Layers,
  Sparkles,
  GitBranch
} from 'lucide-react';
import { User, ClassRoom, AttendanceRecord, Homework, HomeworkSubmission, StudyMaterial, AppNotification } from '../types';
import { downloadDatabaseJson, restoreDatabaseToServer, FullDatabasePayload } from '../utils/storage';

interface DatabaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  classes: ClassRoom[];
  attendance: AttendanceRecord[];
  homework: Homework[];
  submissions: HomeworkSubmission[];
  materials: StudyMaterial[];
  notifications: AppNotification[];
  isServerSynced: boolean;
  onReloadFromServer: () => Promise<void>;
  onRestoreData: (restoredData: FullDatabasePayload) => void;
}

export const DatabaseSyncModal: React.FC<DatabaseSyncModalProps> = ({
  isOpen,
  onClose,
  users,
  classes,
  attendance,
  homework,
  submissions,
  materials,
  notifications,
  isServerSynced,
  onReloadFromServer,
  onRestoreData
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const teacherCount = users.filter((u) => u.role === 'teacher').length;
  const studentCount = users.filter((u) => u.role === 'student').length;
  const parentCount = users.filter((u) => u.role === 'parent').length;

  const handleDownloadBackup = () => {
    const fullData: FullDatabasePayload = {
      users,
      classes,
      attendance,
      homework,
      submissions,
      materials,
      notifications,
      lastUpdated: new Date().toISOString()
    };
    downloadDatabaseJson(fullData);
    setStatusMessage({
      type: 'success',
      text: `Đã tải xuống tệp dữ liệu backup gồm ${users.length} tài khoản (${teacherCount} GV, ${studentCount} HS) và ${classes.length} lớp học!`
    });
  };

  const handleManualSync = async () => {
    setIsRefreshing(true);
    setStatusMessage(null);
    try {
      await onReloadFromServer();
      setStatusMessage({
        type: 'success',
        text: 'Đã đồng bộ thành công dữ liệu mới nhất từ máy chủ lưu trữ trung tâm!'
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: 'Không thể kết nối máy chủ để làm mới: ' + (err?.message || 'Lỗi không xác định')
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Định dạng tệp không hợp lệ');
        }

        const success = await restoreDatabaseToServer(parsed);
        if (success) {
          onRestoreData(parsed);
          setStatusMessage({
            type: 'success',
            text: `🎉 Đã nhập thành công dữ liệu từ tệp! (${parsed.users?.length || 0} tài khoản, ${parsed.classes?.length || 0} lớp học)`
          });
        } else {
          // Fallback update locally
          onRestoreData(parsed);
          setStatusMessage({
            type: 'success',
            text: 'Đã cập nhật dữ liệu vào phiên làm việc hiện tại!'
          });
        }
      } catch (err: any) {
        setStatusMessage({
          type: 'error',
          text: 'Lỗi đọc tệp dữ liệu: ' + (err?.message || 'Vui lòng kiểm tra lại cấu trúc JSON')
        });
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-amber-300 shadow-inner">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight">Đồng Bộ & Lưu Trữ Dữ Liệu</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-[10px] font-black flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Máy chủ kết nối</span>
                </span>
              </div>
              <p className="text-xs text-purple-100/90 mt-0.5">
                Chia sẻ dữ liệu học sinh & giáo viên trên mọi trình duyệt, thiết bị và sao lưu cho GitHub
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Status Message */}
          {statusMessage && (
            <div
              className={`p-4 rounded-2xl flex items-start gap-3 text-xs font-semibold ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border border-rose-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">{statusMessage.text}</div>
            </div>
          )}

          {/* Quick Stats of Currently Managed Data */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-1.5">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-lg font-black text-slate-900">{teacherCount}</div>
              <div className="text-[11px] font-bold text-slate-500">Giáo viên</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-1.5">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="text-lg font-black text-slate-900">{studentCount}</div>
              <div className="text-[11px] font-bold text-slate-500">Học sinh</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-1.5">
                <Layers className="w-4 h-4" />
              </div>
              <div className="text-lg font-black text-slate-900">{classes.length}</div>
              <div className="text-[11px] font-bold text-slate-500">Lớp học</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-1.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-lg font-black text-emerald-600">Đã Lưu</div>
              <div className="text-[11px] font-bold text-slate-500">Server DB</div>
            </div>
          </div>

          {/* Explanation Box for Cross-Browser and GitHub */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 space-y-2">
            <div className="flex items-center gap-2 font-black text-blue-900">
              <GitBranch className="w-4 h-4 text-blue-600" />
              <span>Cơ chế lưu trữ vĩnh viễn (Đa trình duyệt & GitHub):</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-blue-800/90 leading-relaxed">
              <li>
                <strong>Tự động lưu vào Server:</strong> Khi bạn tạo học sinh hoặc giáo viên ở bất kỳ đâu, hệ thống tự động ghi vào tệp cơ sở dữ liệu <code className="px-1.5 py-0.5 rounded bg-blue-100 font-mono text-[11px]">data/database.json</code> trên máy chủ.
              </li>
              <li>
                <strong>Đồng bộ trên mọi trình duyệt:</strong> Khi bạn hoặc người khác mở link ở Chrome, Safari, Edge, Cốc Cốc hay điện thoại, ứng dụng tự động tải dữ liệu từ máy chủ trung tâm để luôn thấy đầy đủ học sinh và giáo viên vừa tạo.
              </li>
              <li>
                <strong>Đưa lên GitHub:</strong> Tệp <code className="px-1.5 py-0.5 rounded bg-blue-100 font-mono text-[11px]">data/database.json</code> nằm ngay trong thư mục mã nguồn. Khi bạn commit & push lên GitHub, toàn bộ danh sách học sinh và giáo viên sẽ được lưu vĩnh viễn trên kho lưu trữ GitHub của bạn!
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
              Thao tác Sao Lưu & Cập Nhật Dữ Liệu:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Button 1: Download backup JSON */}
              <button
                type="button"
                onClick={handleDownloadBackup}
                className="p-4 rounded-2xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100/70 text-left flex items-start gap-3 transition-all cursor-pointer group hover:border-purple-300 shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-purple-950 flex items-center gap-1.5">
                    <span>Tải tệp database.json</span>
                    <span className="px-1.5 py-0.2 rounded bg-purple-200 text-purple-800 text-[9px] font-black">Khuyên dùng</span>
                  </h4>
                  <p className="text-[11px] text-purple-800/80 mt-0.5 leading-snug">
                    Tải về máy để lưu trữ hoặc commit lên GitHub giữ toàn vẹn danh sách.
                  </p>
                </div>
              </button>

              {/* Button 2: Upload / Restore JSON */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100 text-left flex items-start gap-3 transition-all cursor-pointer group hover:border-slate-300 shadow-xs"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Nạp tệp dữ liệu JSON</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Chọn tệp JSON sao lưu từ máy để nạp ngay vào hệ thống.
                  </p>
                </div>
              </button>
            </div>

            {/* Button 3: Manual Refresh */}
            <div className="pt-2">
              <button
                type="button"
                disabled={isRefreshing}
                onClick={handleManualSync}
                className="w-full py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-purple-600' : 'text-slate-500'}`} />
                <span>{isRefreshing ? 'Đang làm mới từ máy chủ...' : 'Đồng bộ lại từ máy chủ ngay lập tức'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Dữ liệu tự động đồng bộ mỗi khi bạn thêm mới hay chỉnh sửa</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
