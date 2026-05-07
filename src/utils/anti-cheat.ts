/**
 * Базовая защита от читеров (без сервера)
 * Не даёт 100% гарантии, но усложняет взлом localStorage
 */

const SECRET_KEY = 'am_2024_secret_hash'; // В продакшене обфусцировать

/**
 * Простая хеш-функция для подписи данных
 */
const simpleHash = (data: string, key: string): string => {
  let hash = 0;
  const combined = data + key;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
};

/**
 * Подписать сохранение
 */
export const signData = (data: unknown): string => {
  const json = JSON.stringify(data);
  return simpleHash(json, SECRET_KEY);
};

/**
 * Проверить подпись сохранения
 */
export const verifyData = (data: unknown, signature: string): boolean => {
  const expected = signData(data);
  return expected === signature;
};

/**
 * Проверить время (защита от манипуляций с временем)
 */
export const validateTimestamp = (savedTime: number): boolean => {
  const now = Date.now();
  const diff = now - savedTime;
  
  // Сохранение из будущего? Читер!
  if (diff < -60000) return false;
  
  // Слишком старое сохранение (больше 30 дней)?
  if (diff > 30 * 24 * 60 * 60 * 1000) return false;
  
  return true;
};

/**
 * Вычислить максимально возможный доход
 * Если игрок получил больше — значит читер
 */
export const maxPossibleIncome = (goldPerSecond: number, secondsAway: number): number => {
  const capped = Math.min(secondsAway, 28800); // макс 8 часов
  return Math.floor(goldPerSecond * capped * 1.5); // 150% — с запасом на бусты
};
