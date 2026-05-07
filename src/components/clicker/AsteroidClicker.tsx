import { useState, useCallback, useRef } from 'react';
import { useGameState } from '../../game/state';
import { formatNumber } from '../../utils/format';
import { DamageNumbers } from './DamageNumbers';

export const AsteroidClicker = () => {
  const click = useGameState(s => s.click);
  const clickPower = useGameState(s => s.clickPower);
  const totalGoldEarned = useGameState(s => s.totalGoldEarned);
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number; value: number }[]>([]);
  const clickId = useRef(0);
  const asteroidRef = useRef<HTMLButtonElement>(null);

  const handleClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    click();
    
    // Получаем координаты клика относительно кнопки
    const rect = asteroidRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0]?.clientX || e.changedTouches[0]?.clientX;
      clientY = e.touches[0]?.clientY || e.changedTouches[0]?.clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const id = clickId.current++;
    setClicks(prev => [...prev.slice(-10), {
      id,
      x: clientX - rect.left,
      y: clientY - rect.top,
      value: clickPower,
    }]);
    
    setTimeout(() => {
      setClicks(prev => prev.filter(c => c.id !== id));
    }, 1000);
  }, [click, clickPower]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      padding: '10px 0',
    }}>
      {/* Прогресс до престижа */}
      <div style={{ width: '100%', textAlign: 'center' }}>
        <span style={{ fontSize: '12px', color: 'var(--tg-hint, #aaa)' }}>
          Всего добыто: {formatNumber(totalGoldEarned)} 🪙
        </span>
        {totalGoldEarned >= 500000 && (
          <div style={{
            marginTop: '8px',
            padding: '8px 12px',
            background: 'linear-gradient(135deg, #2a1a3e, #1a0a2e)',
            borderRadius: '8px',
            fontSize: '11px',
            color: '#c44dff',
          }}>
            🔮 Престиж доступен при 1M золота!
          </div>
        )}
      </div>

      {/* Кликабельный астероид */}
      <button
        ref={asteroidRef}
        onClick={handleClick}
        onTouchStart={handleClick}
        style={{
          position: 'relative',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #6b5b3a, #3a2a1a, #1a0a0a)',
          border: '4px solid #8b7355',
          boxShadow: '0 0 30px rgba(255, 215, 0, 0.2), inset 0 0 20px rgba(0,0,0,0.5)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '60px',
          transition: 'all 0.1s ease',
          overflow: 'hidden',
        }}
        className="glow-pulse"
      >
        💎
        {clicks.map(c => (
          <DamageNumbers key={c.id} x={c.x} y={c.y} value={c.value} />
        ))}
      </button>

      {/* Сила клика */}
      <div style={{
        textAlign: 'center',
        padding: '10px 20px',
        background: 'var(--card)',
        borderRadius: '12px',
        border: '1px solid var(--card-border)',
      }}>
        <span style={{ fontSize: '12px', color: 'var(--tg-hint)' }}>Сила клика</span>
        <br />
        <span style={{ fontSize: '20px', fontWeight: 700, color: '#ffd700' }}>
          ⚡ {formatNumber(clickPower)}
        </span>
      </div>

      {/* Быстрая подсказка */}
      <div style={{
        textAlign: 'center',
        fontSize: '11px',
        color: 'var(--tg-hint)',
        opacity: 0.7,
      }}>
        Жми на астероид, чтобы добывать золото
      </div>
    </div>
  );
};
