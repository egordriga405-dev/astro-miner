import { useEffect } from 'react';
import { useGameState } from '../game/state';

export const useTelegram = () => {
  const initTelegram = () => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;
    
    // Показываем кнопку "Назад" в шапке Telegram
    tg.BackButton?.hide();
    
    // Устанавливаем цвет главной кнопки
    tg.MainButton?.setParams({
      text: '⚡ БУСТ',
      color: '#ff6b35',
      text_color: '#ffffff',
      is_visible: false,
    });
  };
  
  return { initTelegram };
};
