/**
 * Абстракция над localStorage + Telegram CloudStorage
 * 
 * Приоритет: localStorage (быстро, всегда доступно)
 * CloudStorage используется как бэкап и синхронизация между устройствами
 */

const STORAGE_KEY = 'astro-miner-save';

export const saveToLocal = (data: unknown): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Ошибка сохранения в localStorage:', e);
  }
};

export const loadFromLocal = <T>(): T | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Ошибка загрузки из localStorage:', e);
    return null;
  }
};

/**
 * Сохранить в CloudStorage Telegram (если доступен)
 */
export const saveToCloud = async (data: unknown): Promise<void> => {
  const tg = window.Telegram?.WebApp;
  if (!tg?.CloudStorage) return;

  try {
    await tg.CloudStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Ошибка сохранения в CloudStorage:', e);
  }
};

/**
 * Загрузить из CloudStorage Telegram
 */
export const loadFromCloud = async <T>(): Promise<T | null> => {
  const tg = window.Telegram?.WebApp;
  if (!tg?.CloudStorage) return null;

  try {
    const raw = await tg.CloudStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Ошибка загрузки из CloudStorage:', e);
    return null;
  }
};
