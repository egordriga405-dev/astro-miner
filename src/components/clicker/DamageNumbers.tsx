import { formatNumber } from '../../utils/format';

interface DamageNumbersProps {
  x: number;
  y: number;
  value: number;
}

export const DamageNumbers = ({ x, y, value }: DamageNumbersProps) => {
  return (
    <span
      className="float-up"
      style={{
        position: 'absolute',
        left: x,
        top: y,
        fontSize: '18px',
        fontWeight: 700,
        color: '#ffd700',
        textShadow: '0 0 10px rgba(255,215,0,0.8)',
        pointerEvents: 'none',
        zIndex: 10,
        whiteSpace: 'nowrap',
      }}
    >
      +{formatNumber(value)}
    </span>
  );
};
