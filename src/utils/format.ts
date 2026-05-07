/**
 * Форматирует число в читаемый вид
 * 1000 → 1K
 * 1500000 → 1.5M
 */
export const formatNumber = (n: number): string => {
  if (n < 0) return '0';
  if (n < 1000) return Math.floor(n).toLocaleString('ru-RU');
  
  const suffixes = [
    { value: 1e15, suffix: 'Q' },
    { value: 1e12, suffix: 'T' },
    { value: 1e9, suffix: 'B' },
    { value: 1e6, suffix: 'M' },
    { value: 1e3, suffix: 'K' },
  ];
  
  for (const { value, suffix } of suffixes) {
    if (n >= value) {
      const formatted = (n / value).toFixed(1);
      // Убираем .0 если целое
      return formatted.endsWith('.0') 
        ? formatted.slice(0, -2) + suffix 
        : formatted + suffix;
    }
  }
  
  return Math.floor(n).toString();
};

/**
 * Форматирует время из секунд
 */
export const formatTime = (seconds: number): string => {
  if (seconds < 60) return `${Math.floor(seconds)}с`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}м ${Math.floor(seconds % 60)}с`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}ч ${m}м`;
};
