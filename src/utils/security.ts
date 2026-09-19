/**
 * StarKids Security & Privacy Utility
 * Masking sensitive data: Phone Numbers & Citizen Identification Numbers (CCCD/CMND)
 * Mask rule: Replaces the last 6 digits with 'xxxxxx' and supports toggle visibility (eye icon).
 */

/**
 * Masks the last 6 digits of a sensitive string (phone or citizen ID / CCCD)
 * Examples:
 * - '0903 111 222' -> '0903 xxxxxx'
 * - '0903111222'   -> '0903xxxxxx'
 * - '0988 123 456' -> '0988 xxxxxx'
 * - '001201012345' -> '001201xxxxxx'
 * - '001 201 012 345' -> '001 201 xxxxxx'
 */
export function maskLast6Digits(value: string | undefined | null): string {
  if (!value) return '';
  const str = String(value).trim();
  if (!str) return '';

  // Extract all digit characters with their index positions
  const digitIndices: number[] = [];
  for (let i = 0; i < str.length; i++) {
    if (/\d/.test(str[i])) {
      digitIndices.push(i);
    }
  }

  // If there are 4 or fewer digits, return as-is (e.g. short extension, not a full phone/ID)
  if (digitIndices.length <= 4) {
    return str;
  }

  // We want to mask exactly the last 6 digits with 'xxxxxx'
  const maskCount = Math.min(6, digitIndices.length - 2);
  const targetIndices = new Set(digitIndices.slice(-maskCount));

  // Determine if original string had space before the masked segment
  const firstMaskIndex = digitIndices[digitIndices.length - maskCount];
  const prefix = str.slice(0, firstMaskIndex).trimEnd();
  
  // Return formatted with space if prefix was spaced or standard phone
  if (str.includes(' ')) {
    return `${prefix} xxxxxx`;
  }

  return `${prefix}xxxxxx`;
}

/**
 * Formats a phone number cleanly: '0903 111 222'
 */
export function formatPhoneNumber(val: string | undefined | null): string {
  if (!val) return '';
  const digits = val.replace(/\D/g, '');
  if (digits.length === 10) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  if (digits.length === 11) {
    return `${digits.slice(0, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  return val;
}

/**
 * Formats a CCCD (12 digits) cleanly: '001 201 012 345' or '001201012345'
 */
export function formatCitizenId(val: string | undefined | null): string {
  if (!val) return '';
  const digits = val.replace(/\D/g, '');
  if (digits.length === 12) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
  }
  return val;
}
