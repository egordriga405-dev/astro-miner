import { useGameState, type Miner } from '../../game/state';
import { formatNumber } from '../../utils/format';

const minerInfo: Record<string, { name: string; icon: string; description: string }> = {
  drone: { name: 'Дрон', icon: '🛸', description: 'Базовый сборщик' },
  laser: { name: 'Лазер', icon: '⚡', description: 'Режет астероиды' },
  crusher: { name: 'Дробилка', icon: '🏗️', description: 'Перемалывает породу' },
  quantum: { name: 'Квантовый бур', icon: '🌀', description: 'Работает в квантовом поле' },
  wormhole: { name: 'Кротовая нора', icon: '🕳️', description: 'Телепортирует ресурсы' },
};

interface MinerCardProps {
  miner: Miner;
}

export const MinerCard = ({ miner }: MinerCardProps) => {
  const buyMiner = useGameState(s => s.buyMiner);
  const gold = useGameState(s => s.gold);
  const info = minerInfo[miner.id] || { name: miner.id, icon: '🤖', description: '' };
  
  // Расчёт стоимости
  const cost = Math.floor(10 * Math.pow(1.5, miner.count));
  const canBuy = gold >= cost;

  // Расчёт производства
  const countBonus = Math.floor(miner.count / 10);
  const totalProduction = miner.count * miner.baseProduction * (1 + countBonus * 0.1);

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: canBuy ? 1 : 0.7,
        transition: 'all 0.2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '32px' }}>{info.icon}</span>
        <div>
          <div style={{ fontWeight: 600 }}>{info.name}</div>
          <div style={{ fontSize: '11px', color: 'var(--tg-hint)' }}>{info.description}</div>
          {miner.count > 0 && (
            <div style={{ fontSize: '12px', color: '#ffd700', marginTop: '4px' }}>
              {miner.count} шт. → {formatNumber(totalProduction)}/сек
            </div>
          )}
        </div>
      </div>
      
      <button
        className="btn btn-gold"
        onClick={() => buyMiner(miner.id)}
        disabled={!canBuy}
        style={{ padding: '10px 16px', fontSize: '13px', whiteSpace: 'nowrap' }}
      >
        🪙 {formatNumber(cost)}
      </button>
    </div>
  );
};
