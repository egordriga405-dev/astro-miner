import { useEffect, useState } from 'react';
import { useGameState } from './game/state';
import { startGameLoop } from './game/engine';

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const gold = useGameState(s => s.gold);
  const goldPerSecond = useGameState(s => s.goldPerSecond);
  const clickPower = useGameState(s => s.clickPower);
  const click = useGameState(s => s.click);
  const buyMiner = useGameState(s => s.buyMiner);
  const miners = useGameState(s => s.miners);
  const currentTab = useGameState(s => s.currentTab);
  const setTab = useGameState(s => s.setTab);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      tg.disableVerticalSwipes?.();
    }
    startGameLoop();
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <div style={{
        width: '100%', height: '100%', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: '#0f0f1a', color: '#fff', fontSize: '24px'
      }}>
        🪐 Загрузка...
      </div>
    );
  }

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: '#0f0f1a', color: '#fff', overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px', background: '#1a1a2e',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid #2a2a4a'
      }}>
        <div>
          <span style={{ fontSize: '20px' }}>🪙</span>
          <span style={{ fontWeight: 700, fontSize: '18px', color: '#ffd700', marginLeft: '8px' }}>
            {Math.floor(gold).toLocaleString()}
          </span>
        </div>
        <div style={{ fontSize: '12px', color: '#aaa' }}>
          {goldPerSecond > 0 && `⚡ ${Math.floor(goldPerSecond)}/сек`}
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        {currentTab === 'mine' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            {/* Clicker button */}
            <button
              onClick={() => click()}
              style={{
                width: '180px', height: '180px', borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #6b5b3a, #3a2a1a)',
                border: '4px solid #8b7355',
                boxShadow: '0 0 30px rgba(255,215,0,0.3)',
                cursor: 'pointer', fontSize: '60px',
                transition: 'transform 0.1s',
              }}
              onTouchStart={(e) => { e.preventDefault(); click(); }}
            >
              💎
            </button>
            <div style={{
              padding: '10px 20px', background: '#1a1a2e',
              borderRadius: '12px', border: '1px solid #2a2a4a', textAlign: 'center'
            }}>
              <div style={{ fontSize: '12px', color: '#aaa' }}>Сила клика</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#ffd700' }}>
                ⚡ {clickPower}
              </div>
            </div>
          </div>
        )}

        {currentTab === 'miners' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {miners.map(miner => {
              const cost = Math.floor(10 * Math.pow(1.5, miner.count));
              return (
                <div key={miner.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px', background: '#1a1a2e', borderRadius: '12px',
                  border: '1px solid #2a2a4a'
                }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{miner.id}</div>
                    <div style={{ fontSize: '12px', color: '#aaa' }}>
                      {miner.count} шт. × {miner.baseProduction}/сек
                    </div>
                  </div>
                  <button
                    onClick={() => buyMiner(miner.id)}
                    disabled={gold < cost}
                    style={{
                      padding: '8px 16px', borderRadius: '8px',
                      background: gold >= cost ? '#ffd700' : '#333',
                      color: gold >= cost ? '#000' : '#666',
                      border: 'none', fontWeight: 600, cursor: gold >= cost ? 'pointer' : 'not-allowed'
                    }}
                  >
                    🪙 {cost}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {currentTab === 'shop' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{
              padding: '16px', background: '#1a1a2e', borderRadius: '12px',
              textAlign: 'center', border: '1px solid #2a2a4a'
            }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#ff6bcd' }}>⭐ Магазин</div>
              <div style={{ fontSize: '14px', color: '#aaa', marginTop: '8px' }}>
                Скоро: товары за Telegram Stars
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{
        display: 'flex', justifyContent: 'space-around',
        padding: '10px 0', background: '#1a1a2e', borderTop: '1px solid #2a2a4a'
      }}>
        {[
          { id: 'mine', icon: '⛏️', label: 'Копка' },
          { id: 'miners', icon: '🤖', label: 'Шахтёры' },
          { id: 'shop', icon: '⭐', label: 'Магазин' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id as 'mine' | 'miners' | 'shop')}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              background: 'none', border: 'none',
              color: currentTab === tab.id ? '#ffd700' : '#888',
              fontSize: '11px', padding: '6px 12px', cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '22px' }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
