import { useGameState } from './state';

let animationFrame: number | null = null;
let lastTick = Date.now();

export const startGameLoop = () => {
  const tick = () => {
    const now = Date.now();
    const delta = (now - lastTick) / 1000;
    lastTick = now;
    
    const state = useGameState.getState();
    const income = state.goldPerSecond * delta;
    
    if (income > 0) {
      useGameState.setState({
        gold: state.gold + income,
        totalGoldEarned: state.totalGoldEarned + income,
      });
    }
    
    animationFrame = requestAnimationFrame(tick);
  };
  
  lastTick = Date.now();
  animationFrame = requestAnimationFrame(tick);
};
