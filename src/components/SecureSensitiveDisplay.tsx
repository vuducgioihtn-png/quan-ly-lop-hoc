import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { maskLast6Digits } from '../utils/security';

interface SecureSensitiveDisplayProps {
  value: string | undefined | null;
  type?: 'phone' | 'citizenId' | 'general';
  className?: string;
  defaultRevealed?: boolean;
  prefixLabel?: string;
  showIcon?: boolean;
}

export const SecureSensitiveDisplay: React.FC<SecureSensitiveDisplayProps> = ({
  value,
  type = 'phone',
  className = '',
  defaultRevealed = false,
  prefixLabel,
  showIcon = true
}) => {
  const [isRevealed, setIsRevealed] = useState(defaultRevealed);

  if (!value) {
    return <span className="text-slate-400 italic">Chưa cập nhật</span>;
  }

  const masked = maskLast6Digits(value);
  const displayText = isRevealed ? value : masked;

  return (
    <span className={`inline-flex items-center gap-1.5 align-middle ${className}`}>
      {prefixLabel && <span className="text-slate-500">{prefixLabel}</span>}
      
      <span
        className={`font-mono text-xs font-semibold tracking-tight transition-colors ${
          !isRevealed
            ? 'text-indigo-950 bg-indigo-50/70 px-1.5 py-0.5 rounded border border-indigo-200/60'
            : 'text-slate-900 bg-slate-100/80 px-1.5 py-0.5 rounded border border-slate-200'
        }`}
        title={isRevealed ? 'Đang hiển thị đầy đủ' : 'Đã mã hóa 6 số cuối (xxxxxx)'}
      >
        {displayText}
      </span>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsRevealed(!isRevealed);
        }}
        className="p-1 rounded-md text-slate-400 hover:text-indigo-700 hover:bg-indigo-50 transition-colors cursor-pointer shrink-0"
        title={isRevealed ? 'Bấm để ẩn 6 số cuối (xxxxxx)' : 'Bấm để xem đầy đủ'}
        aria-label="Ẩn hiện dữ liệu bảo mật"
      >
        {isRevealed ? (
          <EyeOff className="w-3.5 h-3.5 text-indigo-600" />
        ) : (
          <Eye className="w-3.5 h-3.5 text-slate-500" />
        )}
      </button>
    </span>
  );
};
