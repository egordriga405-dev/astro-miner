interface BuyConfirmationProps {
  item: {
    icon: string;
    name: string;
    price: number;
  };
  onConfirm: () => void;
  onCancel: () => void;
}

export const BuyConfirmation = ({ item, onConfirm, onCancel }: BuyConfirmationProps) => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={onCancel}
    >
      <div
        className="card slide-in"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '320px',
          textAlign: 'center',
          padding: '24px',
          background: '#1a1a2e',
          border: '1px solid #3a2a5e',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>{item.icon}</div>
        <h3 style={{ marginBottom: '8px' }}>Купить {item.name}?</h3>
        <p style={{ fontSize: '14px', color: 'var(--tg-hint)', marginBottom: '16px' }}>
          С твоего баланса спишется ⭐ {item.price}
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button className="btn btn-outline" onClick={onCancel} style={{ flex: 1 }}>
            Отмена
          </button>
          <button className="btn btn-stars" onClick={onConfirm} style={{ flex: 1 }}>
            Купить!
          </button>
        </div>
      </div>
    </div>
  );
};
