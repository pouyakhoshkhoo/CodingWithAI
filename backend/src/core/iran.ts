export function isIranianMobile(phone: string): boolean {
  return phone.length === 11 && phone.startsWith('09') && [...phone].every((char) => char >= '0' && char <= '9');
}

export function isIranianNationalCode(code: string): boolean {
  if (code.length !== 10) return false;
  if (![...code].every((char) => char >= '0' && char <= '9')) return false;
  if ([...code].every((char) => char === code[0])) return false;
  const digits = [...code].map(Number);
  const sum = digits.slice(0, 9).reduce((acc, value, index) => acc + value * (10 - index), 0);
  const remainder = sum % 11;
  const check = digits[9];
  return remainder < 2 ? check === remainder : check === 11 - remainder;
}
