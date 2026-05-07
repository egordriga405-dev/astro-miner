import { useGameState } from '../../game/state';
import { formatNumber } from '../../utils/format';

export const Header = () => {
  const gold = useGameState(s => s.gold);
  const stars = useGameState(s => s.stars);
  const goldPerSecond = useGameState(s => s.goldPerSecond);
  const currentPlanet = useGameState(s => s.currentPlanet);
  const planet = useGameState(s => s.planets.find(p => p.id === s.currentPlanet));
  const darkMatter = useGameState(s => s.darkMatter);

  return (
    <header style={{
      padding: '12px 16px',
      paddingTop: 'calc(var(--safe-top) + 8px)',
      background: 'rgba(15, 15, 26, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--card-border)',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      zIndex: 100,
    }}>
      {/* Верхняя строка: валюта */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>🪙</span>
          <span style={{ fontWeight: 700, fontSize: '18px', color: '#ffd700' }}>
            {formatNumber(gold)}
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '16px' }}>⭐</span>
          <span style={{ fontWeight: 600, fontSize: '14px', color: '#ff6bcd' }}>
            {stars}
          </span>
        </div>
      </div>

      {/* Нижняя строка: планета и доход */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '12px',
        color: 'var(--tg-hint, #aaa)',
      }}>
        <span>{planet?.name || '🌍 Земля'}</span>
        <div style={{ display: 'flex', gap: '12px' }}>
          {goldPerSecond > 0 && (
            <span>⚡ {formatNumber(goldPerSecond)}/сек</span>
          )}
          {darkMatter > 0 && (
            <span style={{ color: '#c44dff' }}>🌀 {darkMatter}</span>
          )}
        </div>
      </div>
    </header>
  );
};
