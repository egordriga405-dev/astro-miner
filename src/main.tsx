console.log('✅ SCRIPT LOADED');

const root = document.getElementById('root');
if (root) {
  root.innerHTML = `
    <div style="
      width: 100vw; height: 100vh;
      background: #0f0f1a; color: #fff;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      font-family: Arial, sans-serif; gap: 20px;
    ">
      <h1 style="color: #ffd700; font-size: 28px;">🪐 Astro Miner</h1>
      <div id="gold" style="font-size: 48px; font-weight: 700; color: #ffd700;">
        🪙 0
      </div>
      <button id="clicker" style="
        width: 150px; height: 150px; border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, #8b7355, #3a2a1a);
        border: 4px solid #ffd700;
        font-size: 60px; cursor: pointer;
      ">💎</button>
      <p style="color: #aaa;">Жми на астероид!</p>
    </div>
  `;

  let gold = 0;
  const goldEl = document.getElementById('gold');
  const btn = document.getElementById('clicker');
  
  btn?.addEventListener('click', () => {
    gold++;
    if (goldEl) goldEl.innerHTML = '🪙 ' + gold;
  });
  
  btn?.addEventListener('touchstart', (e) => {
    e.preventDefault();
    gold++;
    if (goldEl) goldEl.innerHTML = '🪙 ' + gold;
  });
}

console.log('✅ GAME INITIALIZED');
