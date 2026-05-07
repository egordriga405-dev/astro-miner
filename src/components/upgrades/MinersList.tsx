import { useGameState } from '../../game/state';
import { formatNumber } from '../../utils/format';
import { MinerCard } from './MinerCard';

export const MinersList = () => {
  const miners = useGameState(s => s.miners);
  const goldPerSecond = useGameState(s => s.goldPerSecond);
  const gold = useGameState(s => s.gold);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Статистика */}
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '12px', color: 'var(--tg-hint)' }}>Авто-доход</div>
        <div style={{ fontSize: '24px', fontWeight: 700, color: '#ffd700' }}>
          ⚡ {formatNumber(goldPerSecond)}/сек
        </div>
        <div style={{ fontSize: '11px', color: 'var(--tg-hint)', marginTop: '4px' }}>
          Баланс: 🪙 {formatNumber(gold)}
        </div>
      </div>

      {/* Список шахтёров */}
      <h3 style={{ fontSize: '16px' }}>🤖 Твои шахтёры</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {miners.map(miner => (
          <MinerCard key={miner.id} miner={miner} />
        ))}
      </div>

      {/* Пустое состояние */}
      {miners.every(m => m.count === 0) && (
        <div style={{ textAlign: 'center', padding: '30px', color: 'var(--tg-hint)' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🤖</div>
          <p>Тут пока пусто</p>
          <p style={{ fontSize: '12px' }}>Купи первого шахтёра, чтобы золото копилось само!</p>
        </div>
      )}
    </div>
  );
};
