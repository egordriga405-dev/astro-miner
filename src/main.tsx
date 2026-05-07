import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  const [gold, setGold] = React.useState(0);
  const [clickPower, setClickPower] = React.useState(1);
  const [miners, setMiners] = React.useState([
    { id: 'drone', count: 0, baseProduction: 1, cost: 10 },
    { id: 'laser', count: 0, baseProduction: 5, cost: 50 },
  ]);
  const [tab, setTab] = React.useState('mine');

  // Авто-доход
  React.useEffect(() => {
    const totalPerSecond = miners.reduce((sum, m) => sum + m.count * m.baseProduction, 0);
    if (totalPerSecond === 0) return;
    
    const interval = setInterval(() => {
      setGold(g => g + totalPerSecond / 10);
    }, 100);
    
    return () => clearInterval(interval);
  }, [miners]);

  const handleClick = () => {
    setGold(g => g + clickPower);
    const tg = (window as any).Telegram?.WebApp;
    tg?.HapticFeedback?.impactOccurred?.('light');
  };

  const buyMiner = (id: string) => {
    setMiners(prev => prev.map(m => {
      if (m.id !== id) return m;
      if (gold < m.cost) return m;
      setGold(g => g - m.cost);
      return { ...m, count: m.count + 1, cost: Math.floor(m.cost * 1.5) };
    }));
  };

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: '#0f0f1a', color: '#fff',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'sans-serif', overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px', background: '#1a1a2e',
        display: 'flex', justifyContent: 'space-between',
        borderBottom: '1px solid #2a2a4a'
      }}>
        <span style={{ fontSize: '20px', fontWeight: 700, color: '#ffd700' }}>
          🪙 {Math.floor(gold).toLocaleString()}
        </span>
        <span style={{ color: '#aaa', fontSize: '14px' }}>
          ⚡ {clickPower}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
        {tab === 'mine' && (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '30px', paddingTop: '40px'
          }}>
            <button
              onClick={handleClick}
              onTouchStart={(e) => { e.preventDefault(); handleClick(); }}
              style={{
                width: '180px', height: '180px', borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 30%, #8b7355, #3a2a1a)',
                border: '4px solid #ffd700',
                boxShadow: '0 0 40px rgba(255,215,0,0.4)',
                cursor: 'pointer', fontSize: '70px',
              }}
            >
              💎
            </button>
            <p style={{ color: '#aaa', fontSize: '14px' }}>Жми на астероид!</p>
          </div>
        )}

        {tab === 'miners' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ color: '#ffd700', marginBottom: '8px' }}>🤖 Шахтёры</h3>
            {miners.map(m => (
              <div key={m.id} style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', padding: '16px',
                background: '#1a1a2e', borderRadius: '12px',
                border: '1px solid #2a2a4a'
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '16px' }}>{m.id}</div>
                  <div style={{ color: '#aaa', fontSize: '12px' }}>
                    {m.count} шт. × {m.baseProduction}/сек
                  </div>
                </div>
                <button
                  onClick={() => buyMiner(m.id)}
                  disabled={gold < m.cost}
                  style={{
                    padding: '10px 20px', borderRadius: '10px',
                    border: 'none', fontWeight: 700, fontSize: '14px',
                    background: gold >= m.cost ? '#ffd700' : '#333',
                    color: gold >= m.cost ? '#000' : '#666',
                    cursor: gold >= m.cost ? 'pointer' : 'not-allowed'
                  }}
                >
                  🪙 {m.cost}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{
        display: 'flex', justifyContent: 'space-around',
        padding: '12px', background: '#1a1a2e',
        borderTop: '1px solid #2a2a4a'
      }}>
        {['mine', 'miners'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: 'none', border: 'none',
              color: tab === t ? '#ffd700' : '#888',
              fontSize: '24px', padding: '8px 20px',
              cursor: 'pointer'
            }}
          >
            {t === 'mine' ? '⛏️' : '🤖'}
          </button>
        ))}
      </div>
    </div>
  );
}

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(<App />);
}
