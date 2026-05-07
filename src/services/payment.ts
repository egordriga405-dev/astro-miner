/**
 * Сервис для обработки платежей через Telegram Stars
 * 
 * Для реальных платежей нужен бэкенд (см. backend/worker.ts),
 * который создаёт ссылку через Bot API (createInvoiceLink).
 * 
 * Пока что это заглушка для демо-режима.
 */

interface PaymentItem {
  id: string;
  title: string;
  description: string;
  price: number;      // в Telegram Stars
  payload: string;
}

/**
 * Отправить платёж через Telegram Stars
 * В демо-режиме просто спишет звёзды с внутреннего баланса
 */
export const requestStarsPayment = async (item: PaymentItem): Promise<boolean> => {
  const tg = window.Telegram?.WebApp;
  
  if (!tg) {
    console.warn('Telegram WebApp не доступен');
    return false;
  }

  // Пробуем открыть настоящий инвойс (требует бэкенд)
  // Для GitHub Pages используем демо-режим
  const useRealPayment = false; // Переключить на true когда будет бэкенд

  if (useRealPayment) {
    return new Promise((resolve) => {
      tg.openInvoice(`astro_miner_${item.payload}`, (status) => {
        if (status === 'paid') {
          tg.showPopup({
            title: '✅ Успешно!',
            message: `Покупка "${item.title}" совершена!`,
            buttons: [{ type: 'ok', text: 'OK' }],
          });
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  // Демо-режим: имитация платежа
  return new Promise((resolve) => {
    tg.showPopup({
      title: `🛒 ${item.title}`,
      message: `Купить за ⭐ ${item.price}?\n\n(Демо-режим: звёзды спишутся с тестового баланса)`,
      buttons: [
        { id: 'cancel', type: 'cancel', text: 'Отмена' },
        { id: 'buy', type: 'ok', text: `Купить за ⭐${item.price}` },
      ],
    }, (buttonId) => {
      if (buttonId === 'buy') {
        tg.HapticFeedback?.notificationOccurred?.('success');
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

/**
 * Проверить, куплен ли предмет (по localStorage)
 */
export const hasPurchased = (itemId: string): boolean => {
  return localStorage.getItem(`purchased_${itemId}`) === 'true';
};

/**
 * Отметить предмет как купленный
 */
export const markPurchased = (itemId: string): void => {
  localStorage.setItem(`purchased_${itemId}`, 'true');
};
