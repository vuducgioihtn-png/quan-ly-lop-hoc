import React, { useState, useRef } from 'react';
import {
  X,
  RefreshCw,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  FileCheck2,
  Server
} from 'lucide-react';
import { AppDatabaseState, exportDatabaseBackup, importDatabaseBackup } from '../utils/storage';

interface DataSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentState: AppDatabaseState;
  syncStatus: 'synced' | 'syncing' | 'error';
  lastSyncedTime: string | null;
  onForceSync: () => Promise<void>;
  onRefreshFromServer: () => Promise<void>;
  onApplyImportedState: (imported: AppDatabaseState) => void;
  onResetToDefault: () => Promise<void>;
}

export const DataSyncModal: React.FC<DataSyncModalProps> = ({
  isOpen,
  onClose,
  currentState,
  syncStatus,
  lastSyncedTime,
  onForceSync,
  onRefreshFromServer,
  onApplyImportedState,
  onResetToDefault
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Security verification state to protect personal privacy
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPinInput === 'starkids2026' || adminPinInput === 'admin') {
      setIsUnlocked(true);
      setPinError(false);
      showToast('🔓 Đã xác thực quyền Quản trị viên thành công!');
    } else {
      setPinError(true);
    }
  };

  const handleManualSync = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      await onForceSync();
      showToast('✅ Đã đồng bộ an toàn dữ liệu lên máy chủ đám mây!');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Lỗi khi đồng bộ lên máy chủ');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFetchFromServer = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      await onRefreshFromServer();
      showToast('✅ Đã tải và cập nhật dữ liệu mới nhất từ máy chủ đám mây!');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Lỗi khi tải từ máy chủ');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = () => {
    exportDatabaseBackup(currentState);
    showToast('📥 Đã xuất file sao lưu bảo mật (thông tin mật khẩu được mã hóa an toàn)!');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const imported = importDatabaseBackup(text);
        if (imported) {
          onApplyImportedState(imported);
          showToast('🎉 Đã khôi phục dữ liệu từ file sao lưu thành công!');
          if (fileInputRef.current) fileInputRef.current.value = '';
        } else {
          setErrorMessage('File JSON không đúng cấu trúc dữ liệu trường học StarKids.');
        }
      } catch (err: any) {
        setErrorMessage('Không thể đọc file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleReset = async () => {
    if (window.confirm('CẢNH BÁO AN TOÀN: Bạn có chắc chắn muốn đặt lại dữ liệu mẫu gốc chuẩn? Thao tác này sẽ thiết lập lại danh sách lớp học và giáo viên ban đầu.')) {
      setIsProcessing(true);
      try {
        await onResetToDefault();
        showToast('♻️ Đã khôi phục dữ liệu mẫu gốc chuẩn thành công!');
      } catch (err: any) {
        setErrorMessage(err?.message || 'Lỗi khôi phục');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const teacherCount = currentState.users.filter((u) => u.role === 'teacher').length;
  const studentCount = currentState.users.filter((u) => u.role === 'student').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 text-base sm:text-lg font-heading">
                  Bảo Mật Dữ Liệu & Lưu Trữ Đám Mây
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                  Nội Bộ Quản Trị
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Cơ chế tự động lưu ngầm liên tục bảo vệ thông tin học sinh & giáo viên
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cloud Status Banner */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-3 h-3 rounded-full ${syncStatus === 'synced' ? 'bg-emerald-500 animate-pulse' : syncStatus === 'syncing' ? 'bg-amber-500 animate-spin' : 'bg-rose-500'}`} />
              <div>
                <div className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <span>{syncStatus === 'synced' ? 'Máy chủ đám mây đang kết nối ổn định' : syncStatus === 'syncing' ? 'Đang đồng bộ ngầm lên máy chủ...' : 'Đang tạm lưu cục bộ'}</span>
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">Tự động</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Lần lưu gần nhất: <span className="font-semibold text-slate-700">{lastSyncedTime || 'Vừa xong'}</span> (Tự động lưu mỗi khi có thay đổi)
                </div>
              </div>
            </div>
            <button
              onClick={handleManualSync}
              disabled={isProcessing}
              className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>Lưu lại</span>
            </button>
          </div>
        </div>

        {/* Database Entities Stats */}
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[11px] font-bold text-slate-500 block uppercase">Giáo viên</span>
            <span className="text-xl font-black text-indigo-700">{teacherCount}</span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Thầy Giới & GV bộ môn</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[11px] font-bold text-slate-500 block uppercase">Lớp học</span>
            <span className="text-xl font-black text-emerald-700">{currentState.classes.length}</span>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Khối 1 - 5</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[11px] font-bold text-slate-500 block uppercase">Học sinh</span>
            <span className="text-xl font-black text-amber-700">{studentCount}</span>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Đã lưu an toàn</span>
          </div>
        </div>

        {/* Privacy & Confidentiality Guarantee */}
        <div className="mt-4 p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 space-y-1.5">
          <div className="font-black flex items-center gap-1.5 text-indigo-900">
            <FileCheck2 className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Cam kết an toàn thông tin cá nhân:</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Hệ thống không đặt nút đồng bộ công khai để tránh nguy cơ rò rỉ hoặc bấm nhầm làm mất thông tin cá nhân của học sinh và giáo viên. Dữ liệu được lưu trữ tự động trên máy chủ, đảm bảo khi xuất bản hoặc chia sẻ liên kết, toàn bộ hồ sơ luôn được giữ nguyên vẹn.
          </p>
        </div>

        {/* Messages */}
        {toastMessage && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Admin PIN Verification to unlock sensitive export/import actions */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          {!isUnlocked ? (
            <form onSubmit={handleUnlock} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>Xác nhận quyền Quản Trị Viên để mở khóa xuất / nhập sao lưu:</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  placeholder="Nhập mật khẩu Admin (mặc định: starkids2026)"
                  value={adminPinInput}
                  onChange={(e) => {
                    setAdminPinInput(e.target.value);
                    setPinError(false);
                  }}
                  className={`flex-1 px-3 py-2 rounded-xl text-xs bg-white border ${pinError ? 'border-rose-400 ring-2 ring-rose-100' : 'border-slate-300'} text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500`}
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                >
                  Mở Khóa
                </button>
              </div>
              {pinError && (
                <p className="text-[11px] text-rose-600 font-semibold">Mật khẩu quản trị chưa chính xác. Vui lòng thử lại.</p>
              )}
            </form>
          ) : (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-1.5">
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Đã mở khóa thao tác dữ liệu nâng cao</span>
                </div>
                <button
                  onClick={() => setIsUnlocked(false)}
                  className="text-[11px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  Khóa lại
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={handleExport}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-600" />
                  <span>Xuất file sao lưu (JSON)</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-slate-600" />
                  <span>Nhập từ file sao lưu</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  onClick={handleReset}
                  disabled={isProcessing}
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Khôi phục dữ liệu mẫu gốc</span>
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-3">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
