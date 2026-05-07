import React, { useState, useEffect } from 'react';

export default function SimpleApp() {
  const [gold, setGold] = useState(100);
  const [count, setCount] = useState(0);

  const click = () => {
    setGold(g => g + 1);
    setCount(c => c + 1);
  };

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: '#0f0f1a', color: '#fff',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      gap: '20px'
    }}>
      <h1 style={{ color: '#ffd700', fontSize: '28px' }}>
        🪐 Astro Miner
      </h1>
      <div style={{
        fontSize: '48px', fontWeight: 700,
        color: '#ffd700', textShadow: '0 0 20px rgba(255,215,0,0.5)'
      }}>
        🪙 {gold}
      </div>
      <button
        onClick={click}
        onTouchStart={(e) => { e.preventDefault(); click(); }}
        style={{
          width: '150px', height: '150px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, #8b7355, #3a2a1a)',
          border: '4px solid #ffd700',
          boxShadow: '0 0 30px rgba(255,215,0,0.5)',
          cursor: 'pointer',
          fontSize: '60px',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        💎
      </button>
      <div style={{ fontSize: '18px', color: '#aaa' }}>
        Нажатий: {count}
      </div>
      <p style={{ color: '#666', fontSize: '14px' }}>
        Жми на астероид!
      </p>
    </div>
  );
}
