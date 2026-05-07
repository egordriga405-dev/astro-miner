import { useGameState } from '../../game/state';

const tabs = [
  { id: 'mine' as const, icon: '⛏️', label: 'Копка' },
  { id: 'miners' as const, icon: '🤖', label: 'Шахтёры' },
  { id: 'shop' as const, icon: '⭐', label: 'Магазин' },
  { id: 'pets' as const, icon: '🐾', label: 'Питомцы' },
];

export const BottomNav = () => {
  const currentTab = useGameState(s => s.currentTab);
  const setTab = useGameState(s => s.setTab);

  return (
    <nav style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingBottom: 'var(--safe-bottom)',
      background: 'rgba(15, 15, 26, 0.98)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid var(--card-border)',
      display: 'flex',
      justifyContent: 'space-around',
      zIndex: 100,
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setTab(tab.id)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            padding: '10px 0',
            background: 'none',
            border: 'none',
            color: currentTab === tab.id ? '#ffd700' : 'var(--tg-hint, #888)',
            fontSize: '11px',
            fontWeight: currentTab === tab.id ? 600 : 400,
            transition: 'all 0.2s',
            flex: 1,
          }}
        >
          <span style={{ fontSize: '22px' }}>{tab.icon}</span>
          <span>{tab.label}</span>
          {currentTab === tab.id && (
            <div style={{
              width: '20px',
              height: '3px',
              background: '#ffd700',
              borderRadius: '2px',
              marginTop: '2px',
            }} />
          )}
        </button>
      ))}
    </nav>
  );
};
