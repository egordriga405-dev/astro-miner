import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Типы
export interface Miner {
  id: string;
  count: number;
  baseProduction: number;
}

export interface Planet {
  id: string;
  name: string;
  unlockCost: number;
  unlocked: boolean;
  multiplier: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  reward: number;
}

export interface GameState {
  // Ресурсы
  gold: number;
  totalGoldEarned: number;
  stars: number;          // Telegram Stars (бесплатные для демо)
  
  // Кликер
  clickPower: number;
  clicksTotal: number;
  
  // Авто-добыча
  miners: Miner[];
  goldPerSecond: number;
  
  // Планеты
  currentPlanet: string;
  planets: Planet[];
  
  // Престиж
  darkMatter: number;
  prestigeCount: number;
  showPrestige: boolean;
  
  // Достижения
  achievements: Achievement[];
  
  // UI
  currentTab: 'mine' | 'miners' | 'shop' | 'pets';
  
  // Время последнего выхода (для оффлайн-расчёта)
  lastSaveTime: number;
  
  // Действия
  click: () => void;
  buyMiner: (id: string) => void;
  buyPlanet: (id: string) => void;
  doPrestige: () => void;
  setTab: (tab: 'mine' | 'miners' | 'shop' | 'pets') => void;
  addStars: (amount: number) => void;
  spendStars: (amount: number) => boolean;
  processOfflineProgress: (secondsAway: number) => void;
  checkAchievements: () => void;
}

const initialMiners: Miner[] = [
  { id: 'drone', count: 0, baseProduction: 1 },
  { id: 'laser', count: 0, baseProduction: 5 },
  { id: 'crusher', count: 0, baseProduction: 25 },
  { id: 'quantum', count: 0, baseProduction: 100 },
  { id: 'wormhole', count: 0, baseProduction: 500 },
];

const initialPlanets: Planet[] = [
  { id: 'earth', name: '🌍 Земля', unlockCost: 0, unlocked: true, multiplier: 1 },
  { id: 'mars', name: '🔴 Марс', unlockCost: 1000, unlocked: false, multiplier: 2 },
  { id: 'jupiter', name: '🟤 Юпитер', unlockCost: 100000, unlocked: false, multiplier: 5 },
  { id: 'saturn', name: '🪐 Сатурн', unlockCost: 10000000, unlocked: false, multiplier: 10 },
];

const initialAchievements: Achievement[] = [
  { id: 'first_click', name: 'Первый шаг', description: 'Сделать первый клик', unlocked: false, reward: 10 },
  { id: 'click_100', name: 'Кликоман', description: '100 кликов', unlocked: false, reward: 100 },
  { id: 'gold_1000', name: 'Шахтёр', description: 'Накопить 1000 золота', unlocked: false, reward: 500 },
  { id: 'first_miner', name: 'Автоматизация', description: 'Купить первого шахтёра', unlocked: false, reward: 200 },
  { id: 'first_prestige', name: 'Перерождение', description: 'Сделать первый престиж', unlocked: false, reward: 1000 },
];

export const useGameState = create<GameState>()(
  persist(
    (set, get) => ({
      gold: 0,
      totalGoldEarned: 0,
      stars: 100,       // Стартовый бонус для теста
      clickPower: 1,
      clicksTotal: 0,
      miners: initialMiners,
      goldPerSecond: 0,
      currentPlanet: 'earth',
      planets: initialPlanets,
      darkMatter: 0,
      prestigeCount: 0,
      showPrestige: false,
      achievements: initialAchievements,
      currentTab: 'mine',
      lastSaveTime: Date.now(),

      click: () => {
        const state = get();
        const currentPlanet = state.planets.find(p => p.id === state.currentPlanet)!;
        const earned = state.clickPower * currentPlanet.multiplier;
        
        set({
          gold: state.gold + earned,
          totalGoldEarned: state.totalGoldEarned + earned,
          clicksTotal: state.clicksTotal + 1,
        });
        
        // Хаптик (если доступен)
        if (window.Telegram?.WebApp?.HapticFeedback) {
          window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
        
        state.checkAchievements();
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
        
        // Пересчёт дохода в секунду
        const gps = newMiners.reduce((sum, m) => {
          const countBonus = Math.floor(m.count / 10); // +10% за каждые 10 шахтёров
          return sum + (m.count * m.baseProduction * (1 + countBonus * 0.1));
        }, 0);
        
        set({
          gold: state.gold - cost,
          miners: newMiners,
          goldPerSecond: gps,
        });
        
        state.checkAchievements();
        
        // Хаптик успеха
        if (window.Telegram?.WebApp?.HapticFeedback) {
          window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        }
      },

      buyPlanet: (id: string) => {
        const state = get();
        const planet = state.planets.find(p => p.id === id);
        if (!planet || planet.unlocked || state.gold < planet.unlockCost) return;
        
        const newPlanets = state.planets.map(p =>
          p.id === id ? { ...p, unlocked: true } : p
        );
        
        set({
          gold: state.gold - planet.unlockCost,
          planets: newPlanets,
          currentPlanet: id,
        });
      },

      doPrestige: () => {
        const state = get();
        if (state.totalGoldEarned < 1000000) return;
        
        const earnedDM = Math.floor(Math.log10(state.totalGoldEarned)) - 5;
        
        set({
          gold: 0,
          totalGoldEarned: 0,
          clickPower: 1 + state.prestigeCount,
          miners: initialMiners,
          goldPerSecond: 0,
          planets: initialPlanets,
          currentPlanet: 'earth',
          darkMatter: state.darkMatter + earnedDM,
          prestigeCount: state.prestigeCount + 1,
          showPrestige: false,
          lastSaveTime: Date.now(),
        });
        
        state.checkAchievements();
      },

      setTab: (tab) => set({ currentTab: tab }),

      addStars: (amount) => set(s => ({ stars: s.stars + amount })),
      
      spendStars: (amount) => {
        const state = get();
        if (state.stars < amount) return false;
        set({ stars: state.stars - amount });
        return true;
      },

      processOfflineProgress: (secondsAway: number) => {
        const state = get();
        if (secondsAway <= 0 || state.goldPerSecond <= 0) return;
        
        // Максимум 8 часов оффлайн-прогресса
        const capped = Math.min(secondsAway, 28800);
        const earned = Math.floor(state.goldPerSecond * capped * 0.5); // 50% эффективности
        
        set({
          gold: state.gold + earned,
          totalGoldEarned: state.totalGoldEarned + earned,
        });
      },

      checkAchievements: () => {
        const state = get();
        const newAchievements = state.achievements.map(a => {
          if (a.unlocked) return a;
          
          let condition = false;
          switch (a.id) {
            case 'first_click': condition = state.clicksTotal >= 1; break;
            case 'click_100': condition = state.clicksTotal >= 100; break;
            case 'gold_1000': condition = state.totalGoldEarned >= 1000; break;
            case 'first_miner': condition = state.miners.some(m => m.count > 0); break;
            case 'first_prestige': condition = state.prestigeCount >= 1; break;
          }
          
          if (condition) {
            // Выдать награду
            set(s => ({ gold: s.gold + a.reward, totalGoldEarned: s.totalGoldEarned + a.reward }));
            return { ...a, unlocked: true };
          }
          return a;
        });
        
        set({ achievements: newAchievements });
      },
    }),
    {
      name: 'astro-miner-save',
      version: 1,
      partialize: (state) => ({
        gold: state.gold,
        totalGoldEarned: state.totalGoldEarned,
        stars: state.stars,
        clickPower: state.clickPower,
        clicksTotal: state.clicksTotal,
        miners: state.miners,
        goldPerSecond: state.goldPerSecond,
        currentPlanet: state.currentPlanet,
        planets: state.planets,
        darkMatter: state.darkMatter,
        prestigeCount: state.prestigeCount,
        achievements: state.achievements,
        lastSaveTime: Date.now(),
      }),
    }
  )
);
