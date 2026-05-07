import { useGameState } from './state';

let animationFrame: number | null = null;
let lastTick = Date.now();

export const startGameLoop = () => {
  const tick = () => {
    const now = Date.now();
    const delta = (now - lastTick) / 1000; // секунды с прошлого тика
    lastTick = now;
    
    const state = useGameState.getState();
    const income = state.goldPerSecond * delta;
    
    if (income > 0) {
      useGameState.setState({
        gold: state.gold + income,
        totalGoldEarned: state.totalGoldEarned + income,
      });
    }
    
    // Проверка на престиж (каждые 10 секунд)
    if (state.totalGoldEarned >= 1000000 && !state.showPrestige && state.prestigeCount < 10) {
      useGameState.setState({ showPrestige: true });
    }
    
    animationFrame = requestAnimationFrame(tick);
  };
  
  lastTick = Date.now();
  animationFrame = requestAnimationFrame(tick);
};

export const stopGameLoop = () => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
};
