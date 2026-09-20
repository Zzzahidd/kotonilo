export function toBanglaNumber(num: number | string): string {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num
    .toString()
    .split('')
    .map((char) => {
      const parsed = parseInt(char, 10);
      return isNaN(parsed) ? char : banglaDigits[parsed];
    })
    .join('');
}

export function formatBanglaPrice(price: number): string {
  const formatted = price.toLocaleString('en-IN');
  return `৳${toBanglaNumber(formatted)}`;
}

export function getRelativeTimeBn(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'কিছুক্ষণ আগে';
  }
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) {
    return `${toBanglaNumber(minutes)} মিনিট আগে`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${toBanglaNumber(hours)} ঘণ্টা আগে`;
  }
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${toBanglaNumber(days)} দিন আগে`;
  }
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${toBanglaNumber(months)} মাস আগে`;
  }
  const years = Math.floor(days / 365);
  return `${toBanglaNumber(years)} বছর আগে`;
}
