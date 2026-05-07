import { useEffect } from 'react';
import { useGameState } from './game/state';
import { useTelegram } from './hooks/useTelegram';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { AsteroidClicker } from './components/clicker/AsteroidClicker';
import { MinersList } from './components/upgrades/MinersList';
import { ShopPanel } from './components/shop/ShopPanel';
import { PrestigeModal } from './components/prestige/PrestigeModal';
import { useOffline } from './hooks/useOffline';
import './styles/telegram.css';

export default function App() {
  const { initTelegram } = useTelegram();
  const currentTab = useGameState(s => s.currentTab);
  const showPrestige = useGameState(s => s.showPrestige);
  const { processOffline } = useOffline();

  useEffect(() => {
    initTelegram();
    processOffline();
  }, []);

  const renderTab = () => {
    switch (currentTab) {
      case 'mine': return <AsteroidClicker />;
      case 'miners': return <MinersList />;
      case 'shop': return <ShopPanel />;
      default: return <AsteroidClicker />;
    }
  };

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        {renderTab()}
      </main>
      <BottomNav />
      {showPrestige && <PrestigeModal />}
    </div>
  );
}
