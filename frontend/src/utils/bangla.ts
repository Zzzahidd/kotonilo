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

export function formatPrice(price: number, lang: 'bn' | 'en' = 'bn'): string {
  const formatted = price.toLocaleString(lang === 'bn' ? 'en-IN' : 'en-US');
  if (lang === 'en') {
    return `৳${formatted}`;
  }
  return `৳${toBanglaNumber(formatted)}`;
}

export function formatBanglaPrice(price: number): string {
  return formatPrice(price, 'bn');
}

export function getRelativeTime(date: Date | string, lang: 'bn' | 'en' = 'bn'): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return lang === 'bn' ? 'কিছুক্ষণ আগে' : 'Just now';
  }
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) {
    return lang === 'bn' ? `${toBanglaNumber(minutes)} মিনিট আগে` : `${minutes}m ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return lang === 'bn' ? `${toBanglaNumber(hours)} ঘণ্টা আগে` : `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return lang === 'bn' ? `${toBanglaNumber(days)} দিন আগে` : `${days}d ago`;
  }
  const months = Math.floor(days / 30);
  if (months < 12) {
    return lang === 'bn' ? `${toBanglaNumber(months)} মাস আগে` : `${months}mo ago`;
  }
  const years = Math.floor(days / 365);
  return lang === 'bn' ? `${toBanglaNumber(years)} বছর আগে` : `${years}y ago`;
}

export function getRelativeTimeBn(date: Date | string): string {
  return getRelativeTime(date, 'bn');
}
