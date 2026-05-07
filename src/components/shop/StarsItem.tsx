interface StarsItemProps {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  onBuy: () => void;
  affordable: boolean;
}

export const StarsItem = ({ name, description, price, icon, onBuy, affordable }: StarsItemProps) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 16px',
        background: affordable 
          ? 'linear-gradient(135deg, #1a1a2e, #2a1a3e)' 
          : 'rgba(26, 26, 46, 0.5)',
        borderRadius: '16px',
        border: '1px solid #3a2a5e',
        opacity: affordable ? 1 : 0.6,
        transition: 'all 0.2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '28px' }}>{icon}</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: '14px' }}>{name}</div>
          <div style={{ fontSize: '11px', color: 'var(--tg-hint)' }}>{description}</div>
        </div>
      </div>
      <button
        onClick={onBuy}
        className="btn btn-stars"
        style={{ padding: '8px 14px', fontSize: '13px', whiteSpace: 'nowrap' }}
      >
        ⭐ {price}
      </button>
    </div>
  );
};
