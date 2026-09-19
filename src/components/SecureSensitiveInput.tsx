import React, { useState } from 'react';
import { Eye, EyeOff, Phone, CreditCard, Shield, Lock, Unlock } from 'lucide-react';
import { maskLast6Digits } from '../utils/security';

interface SecureSensitiveInputProps {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'phone' | 'citizenId' | 'text';
  icon?: 'phone' | 'idCard' | 'shield';
  required?: boolean;
  className?: string;
  badgeLabel?: string;
}

export const SecureSensitiveInput: React.FC<SecureSensitiveInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = 'Nhập số...',
  type = 'phone',
  icon = 'phone',
  required = false,
  className = '',
  badgeLabel
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // When focused or revealed, show the raw value so user can edit naturally.
  // When blurred and not revealed, show the masked string with 'xxxxxx' for 6 last digits.
  const displayValue = (isRevealed || isFocused) ? value : maskLast6Digits(value);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // If somehow user types into masked view, don't keep literal 'xxxxxx'
    if (val.includes('xxxxxx') && !isRevealed && !isFocused) {
      return;
    }
    onChange(val);
  };

  const renderIcon = () => {
    switch (icon) {
      case 'idCard':
        return <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />;
      case 'shield':
        return <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-3" />;
      case 'phone':
      default:
        return <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />;
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1">
        <label htmlFor={id} className="block text-xs font-bold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsRevealed(!isRevealed)}
            className="text-[10.5px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer transition-colors"
            title={isRevealed ? 'Che 6 số cuối (xxxxxx)' : 'Hiện đầy đủ số'}
          >
            {isRevealed ? (
              <>
                <EyeOff className="w-3 h-3 text-indigo-500" />
                <span>Ẩn xxxxxx</span>
              </>
            ) : (
              <>
                <Eye className="w-3 h-3 text-indigo-500" />
                <span>Hiện đầy đủ</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="relative">
        {renderIcon()}
        <input
          id={id}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          required={required}
          className={`w-full pl-9 pr-10 py-2.5 rounded-xl border text-xs font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-hidden transition-all bg-white ${
            !isRevealed && !isFocused && value
              ? 'border-indigo-200 bg-indigo-50/20 font-mono text-indigo-950'
              : 'border-slate-200 text-slate-900'
          }`}
        />

        {/* Right Toggle Eye button inside the input */}
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setIsRevealed(!isRevealed)}
          className="absolute right-2.5 top-2.5 p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors cursor-pointer"
          title={isRevealed ? 'Nhấp để mã hóa 6 số cuối (xxxxxx)' : 'Nhấp để hiển thị toàn bộ số'}
        >
          {isRevealed ? (
            <EyeOff className="w-4 h-4 text-indigo-600" />
          ) : (
            <Eye className="w-4 h-4 text-slate-500" />
          )}
        </button>
      </div>

      {/* Security Status Hint */}
      <div className="mt-1 flex items-center justify-between text-[10px]">
        {!isRevealed ? (
          <span className="text-emerald-700 flex items-center gap-1">
            <Lock className="w-2.5 h-2.5" />
            <span>Mã hóa bảo mật 6 số cuối: <strong>xxxxxx</strong></span>
          </span>
        ) : (
          <span className="text-amber-700 flex items-center gap-1">
            <Unlock className="w-2.5 h-2.5" />
            <span>Đang hiển thị toàn bộ</span>
          </span>
        )}
        {badgeLabel && (
          <span className="text-slate-400 italic">{badgeLabel}</span>
        )}
      </div>
    </div>
  );
};
