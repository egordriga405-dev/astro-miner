import { useState } from 'react';
import { useGameState } from '../../game/state';
import { formatNumber } from '../../utils/format';
import { StarsItem } from './StarsItem';
import { BuyConfirmation } from './BuyConfirmation';

// Товары за золото
const goldItems = [
  { id: 'click_upgrade', name: '🔨 Усилитель клика', description: '+1 к силе клика', cost: 100, costScaling: 1.5 },
  { id: 'gold_bucket', name: '🪣 Золотое ведро', description: 'Мгновенно +500 золота', cost: 250, costScaling: 2, instantGold: 500 },
  { id: 'lucky_charm', name: '🍀 Амулет удачи', description: 'x2 к клику на 5 минут', cost: 300, costScaling: 1.8 },
];

// Товары за звёзды (реальная монетизация)
const starsItems = [
  { id: 'vip_pass', name: '💎 VIP-Пропуск', description: 'Навсегда: х2 доход, нет лимита бака', price: 500, icon: '💎' },
  { id: 'stars_pack_100', name: '✨ Пачка звёзд', description: '100 звёзд на баланс игры', price: 50, icon: '✨' },
  { id: 'premium_drone', name: '🛸 Премиум-дрон', description: 'Авто-шахтёр x10 мощности', price: 100, icon: '🛸' },
  { id: 'gold_rush', name: '💰 Золотая лихорадка', description: 'Мгновенно 100K золота', price: 75, icon: '💰' },
  { id: 'pet_robot', name: '🤖 Робо-пёс', description: 'Питомец собирает клики', price: 150, icon: '🤖' },
];

export const ShopPanel = () => {
  const [confirmItem, setConfirmItem] = useState<typeof starsItems[0] | null>(null);
  const gold = useGameState(s => s.gold);
  const stars = useGameState(s => s.stars);
  const clickPower = useGameState(s => s.clickPower);
  const spendStars = useGameState(s => s.spendStars);
  const addStars = useGameState(s => s.addStars);

  const handleBuyGold = (item: typeof goldItems[0]) => {
    const state = useGameState.getState();
    if (state.gold < item.cost) return;

    if (item.id === 'click_upgrade') {
      useGameState.setState({ 
        gold: state.gold - item.cost,
        clickPower: state.clickPower + 1,
      });
    } else if (item.id === 'gold_bucket' && item.instantGold) {
      useGameState.setState({
        gold: state.gold - item.cost + item.instantGold,
        totalGoldEarned: state.totalGoldEarned + item.instantGold,
      });
    }

    window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
  };

  const handleBuyStars = (item: typeof starsItems[0]) => {
    if (stars < item.price) {
      // Предложить купить звёзды
      window.Telegram?.WebApp?.showPopup({
        title: 'Недостаточно звёзд ⭐',
        message: `Нужно ${item.price} звёзд. У тебя ${stars}. Звёзды можно купить в Telegram.`,
        buttons: [
          { type: 'cancel', text: 'Отмена' },
          { type: 'ok', text: 'Купить звёзды' },
        ],
      });
      return;
    }
    
    setConfirmItem(item);
    
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
  };

  const confirmPurchase = () => {
    if (!confirmItem) return;
    
    const success = spendStars(confirmItem.price);
    if (!success) return;

    // Выдача товара
    switch (confirmItem.id) {
      case 'stars_pack_100':
        addStars(100);
        break;
      case 'gold_rush':
        useGameState.setState(s => ({ 
          gold: s.gold + 100000, 
          totalGoldEarned: s.totalGoldEarned + 100000 
        }));
        break;
      case 'premium_drone':
        // Добавляем мощного шахтёра
        const miners = useGameState.getState().miners;
        const drone = miners.find(m => m.id === 'drone');
        if (drone) {
          useGameState.setState({
            miners: miners.map(m => 
              m.id === 'drone' ? { ...m, count: m.count + 1, baseProduction: m.baseProduction * 10 } : m
            ),
          });
        }
        break;
      case 'vip_pass':
        useGameState.setState({ clickPower: useGameState.getState().clickPower * 2 });
        localStorage.setItem('vip_pass', 'true');
        break;
      case 'pet_robot':
        localStorage.setItem('pet_robot', 'true');
        break;
    }

    setConfirmItem(null);
    
    window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
    window.Telegram?.WebApp?.showPopup({
      title: '✅ Покупка успешна!',
      message: `${confirmItem.icon} ${confirmItem.name} активирован!`,
      buttons: [{ type: 'ok', text: 'Отлично!' }],
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '20px' }}>
      {/* Баланс звёзд */}
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '14px', color: 'var(--tg-hint)', marginBottom: '4px' }}>Твой баланс</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <span style={{ fontSize: '20px', fontWeight: 700, color: '#ffd700' }}>
            🪙 {formatNumber(gold)}
          </span>
          <span style={{ fontSize: '20px', fontWeight: 700, color: '#ff6bcd' }}>
            ⭐ {stars}
          </span>
        </div>
      </div>

      {/* Товары за золото */}
      <h3 style={{ fontSize: '16px', color: '#ffd700' }}>🪙 За золото</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {goldItems.map(item => (
          <div
            key={item.id}
            className="card"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              opacity: gold >= item.cost ? 1 : 0.5,
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>{item.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--tg-hint)' }}>{item.description}</div>
            </div>
            <button
              className="btn btn-gold"
              onClick={() => handleBuyGold(item)}
              disabled={gold < item.cost}
              style={{ padding: '8px 14px', fontSize: '13px' }}
            >
              🪙 {formatNumber(item.cost)}
            </button>
          </div>
        ))}
      </div>

      {/* Товары за звёзды */}
      <h3 style={{ fontSize: '16px', color: '#ff6bcd' }}>⭐ Premium товары</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {starsItems.map(item => (
          <div
            key={item.id}
            className="card"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #1a1a2e, #2a1a3e)',
              border: '1px solid #3a2a5e',
              opacity: stars >= item.price ? 1 : 0.6,
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>
                {item.icon} {item.name}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--tg-hint)' }}>{item.description}</div>
            </div>
            <button
              className="btn btn-stars"
              onClick={() => handleBuyStars(item)}
              style={{ padding: '8px 14px', fontSize: '13px' }}
            >
              ⭐ {item.price}
            </button>
          </div>
        ))}
      </div>

      {/* Как получить звёзды */}
      <div className="card" style={{ textAlign: 'center', fontSize: '12px', color: 'var(--tg-hint)' }}>
        💡 Звёзды можно купить в Telegram через настройки или получить в подарок
      </div>

      {/* Модалка подтверждения */}
      {confirmItem && (
        <BuyConfirmation
          item={confirmItem}
          onConfirm={confirmPurchase}
          onCancel={() => setConfirmItem(null)}
        />
      )}
    </div>
  );
};
