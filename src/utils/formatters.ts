export function toPersianDigits(n: number | string): string {
  if (n === null || n === undefined) return '';
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return n
    .toString()
    .replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
}

export function formatToman(amount: number): string {
  if (amount >= 1000000) {
    const millions = (amount / 1000000).toFixed(1).replace(/\.0$/, '');
    return `${toPersianDigits(millions)} میلیون تومان`;
  }
  if (amount >= 1000) {
    const thousands = (amount / 1000).toFixed(0);
    return `${toPersianDigits(thousands)} هزار تومان`;
  }
  return `${toPersianDigits(amount)} تومان`;
}

export function formatPersianNumber(n: number): string {
  return toPersianDigits(new Intl.NumberFormat('fa-IR').format(n));
}
