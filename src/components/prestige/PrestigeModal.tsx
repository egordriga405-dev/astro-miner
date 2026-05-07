import { useGameState } from '../../game/state';
import { formatNumber } from '../../utils/format';

export const PrestigeModal = () => {
  const doPrestige = useGameState(s => s.doPrestige);
  const totalGoldEarned = useGameState(s => s.totalGoldEarned);
  const prestigeCount = useGameState(s => s.prestigeCount);
  const darkMatter = useGameState(s => s.darkMatter);
  const showPrestige = useGameState(s => s.showPrestige);

  const earnedDM = Math.floor(Math.log10(totalGoldEarned)) - 5;

  if (!showPrestige) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
    >
      <div
        className="card slide-in"
        style={{
          width: '100%',
          maxWidth: '350px',
          textAlign: 'center',
          padding: '28px 24px',
          background: 'linear-gradient(135deg, #0a0a1a, #1a0a2e, #0a0a1a)',
          border: '2px solid #c44dff',
          boxShadow: '0 0 40px rgba(196, 77, 255, 0.3)',
        }}
      >
        <div style={{ fontSize: '64px', marginBottom: '12px' }}>🌀</div>
        <h2 style={{ color: '#c44dff', marginBottom: '8px' }}>Перерождение</h2>
        <p style={{ fontSize: '13px', color: 'var(--tg-hint)', marginBottom: '16px' }}>
          Сбрось весь прогресс и получи Тёмную материю для постоянных улучшений
        </p>

        {/* Информация о награде */}
        <div style={{
          background: 'rgba(196, 77, 255, 0.1)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
        }}>
          <div style={{ fontSize: '14px', marginBottom: '8px' }}>
            Всего добыто: <span style={{ color: '#ffd700' }}>{formatNumber(totalGoldEarned)}</span>
          </div>
          <div style={{ fontSize: '14px', marginBottom: '8px' }}>
            Престижей: <span style={{ color: '#c44dff' }}>{prestigeCount}</span>
          </div>
          <div style={{ fontSize: '14px' }}>
            Тёмной материи: <span style={{ color: '#c44dff', fontWeight: 700 }}>{darkMatter}</span>
          </div>
          <div style={{ 
            fontSize: '18px', 
            fontWeight: 700, 
            color: '#c44dff',
            marginTop: '12px',
            padding: '8px',
            background: 'rgba(196, 77, 255, 0.2)',
            borderRadius: '8px',
          }}>
            +{earnedDM} 🌀 после престижа
          </div>
        </div>

        {/* Предупреждение */}
        <div style={{
          background: 'rgba(248, 81, 73, 0.1)',
          borderRadius: '8px',
          padding: '10px',
          fontSize: '12px',
          color: '#f85149',
          marginBottom: '16px',
        }}>
          ⚠️ Весь прогресс, золото, шахтёры и планеты будут сброшены!
        </div>

        {/* Кнопки */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn btn-outline"
            onClick={() => useGameState.setState({ showPrestige: false })}
            style={{ flex: 1 }}
          >
            Позже
          </button>
          <button
            className="btn btn-stars"
            onClick={doPrestige}
            style={{ 
              flex: 1,
              background: 'linear-gradient(135deg, #c44dff, #6b21a8)',
            }}
          >
            🌀 Престиж!
          </button>
        </div>
      </div>
    </div>
  );
};
