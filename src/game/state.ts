import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Miner {
  id: string;
  count: number;
  baseProduction: number;
}

interface GameState {
  gold: number;
  totalGoldEarned: number;
  clickPower: number;
  miners: Miner[];
  goldPerSecond: number;
  currentTab: 'mine' | 'miners' | 'shop';
  lastSaveTime: number;
  
  click: () => void;
  buyMiner: (id: string) => void;
  setTab: (tab: 'mine' | 'miners' | 'shop') => void;
}

const initialMiners: Miner[] = [
  { id: '🚁 Дрон', count: 0, baseProduction: 1 },
  { id: '⚡ Лазер', count: 0, baseProduction: 5 },
  { id: '🏗️ Дробилка', count: 0, baseProduction: 25 },
  { id: '🌀 Квантовый', count: 0, baseProduction: 100 },
];

export const useGameState = create<GameState>()(
  persist(
    (set, get) => ({
      gold: 0,
      totalGoldEarned: 0,
      clickPower: 1,
      miners: initialMiners,
      goldPerSecond: 0,
      currentTab: 'mine',
      lastSaveTime: Date.now(),

      click: () => {
        const state = get();
        set({
          gold: state.gold + state.clickPower,
          totalGoldEarned: state.totalGoldEarned + state.clickPower,
        });
        window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
      },

      buyMiner: (id: string) => {
        const state = get();
        const miner = state.miners.find(m => m.id === id);
        if (!miner) return;
        
        const cost = Math.floor(10 * Math.pow(1.5, miner.count));
        if (state.gold < cost) return;
        
        const newMiners = state.miners.map(m =>
          m.id === id ? { ...m, count: m.count + 1 } : m
        );
        
        const gps = newMiners.reduce((sum, m) => sum + m.count * m.baseProduction, 0);
        
        set({
          gold: state.gold - cost,
          miners: newMiners,
          goldPerSecond: gps,
        });
        
        window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
      },

      setTab: (tab) => set({ currentTab: tab }),
    }),
    {
      name: 'astro-miner-save',
      version: 1,
    }
  )
);
