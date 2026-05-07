import { useGameState } from '../game/state';

export const useOffline = () => {
  const processOffline = () => {
    const state = useGameState.getState();
    const now = Date.now();
    const secondsAway = Math.floor((now - state.lastSaveTime) / 1000);
    
    if (secondsAway > 30) {
      state.processOfflineProgress(secondsAway);
      
      // Показываем попап с оффлайн-доходом
      const earned = Math.floor(state.goldPerSecond * Math.min(secondsAway, 28800) * 0.5);
      if (earned > 0 && window.Telegram?.WebApp) {
        window.Telegram.WebApp.showPopup({
          title: '🚀 Ты вернулся!',
          message: `Пока тебя не было, шахтёры добыли ${formatNumber(earned)} золота!`,
          buttons: [{ type: 'ok', text: 'Забрать!' }],
        });
      }
    }
    
    useGameState.setState({ lastSaveTime: now });
  };
  
  return { processOffline };
};

// Быстрый форматтер (чтобы не импортировать utils)
const formatNumber = (n: number): string => {
  if (n < 1000) return Math.floor(n).toString();
  if (n < 1000000) return (n / 1000).toFixed(1) + 'K';
  if (n < 1000000000) return (n / 1000000).toFixed(1) + 'M';
  return (n / 1000000000).toFixed(1) + 'B';
};
