(function () {
  'use strict';

  if (sessionStorage.getItem('snrWipeIntroSeen') === '1') {
    const el = document.getElementById('wipe-canvas-container');
    if (el) el.remove();
    return;
  }

  document.documentElement.style.overflow = 'hidden';

  const container = document.getElementById('wipe-canvas-container');
  const canvas = document.getElementById('wipe-canvas');
  const skipBtn = document.getElementById('wipe-skip-btn');

  if (!container || !canvas) return;

  const oldRag = document.getElementById('wipe-rag');
  if (oldRag) oldRag.remove();
  const oldHint = document.getElementById('wipe-hint-text');
  if (oldHint) oldHint.remove();

  // 1) Bez Katmanı
  const rag = document.createElement('div');
  rag.id = 'wipe-rag';
  rag.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999999;
    pointer-events: none;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.05s ease-out;
  `;

  rag.innerHTML = `
    <div style="
      width: 76px;
      height: 76px;
      border-radius: 20px;
      background: linear-gradient(135deg, #38bdf8 0%, #0284c7 50%, #0369a1 100%);
      box-shadow: 0 12px 30px rgba(2, 132, 199, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.4);
      border: 2px solid rgba(255, 255, 255, 0.9);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      transform: rotate(6deg);
    ">
      <svg style="width: 32px; height: 32px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
      <span style="font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px; font-family: sans-serif;">SNR BEZ</span>
    </div>
  `;
  container.appendChild(rag);

  // 2) İpucu Katmanı (Mobil alt barın üstünde kalması için 12vh + safe area)
  const hint = document.createElement('div');
  hint.id = 'wipe-hint-text';
  hint.style.cssText = `
    position: fixed;
    bottom: calc(12vh + env(safe-area-inset-bottom, 0px));
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999998;
    pointer-events: none;
    user-select: none;
    padding: 0 16px;
  `;
  hint.innerHTML = `
    <div style="
      background: rgba(15, 23, 42, 0.90);
      border: 1px solid rgba(255, 255, 255, 0.25);
      padding: 10px 22px;
      border-radius: 9999px;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
    ">
      <p style="
        color: #ffffff;
        font-size: 14px;
        font-weight: 600;
        margin: 0;
        font-family: sans-serif;
        display: flex;
        align-items: center;
        gap: 6px;
        letter-spacing: 0.02em;
      ">
        <span>Ekranı silerek temizleyin</span>
        <span>✨</span>
      </p>
    </div>
  `;
  container.appendChild(hint);

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  let isDrawing = false;
  let hasMoved = false;
  let isFinished = false;
  let checkThrottle = 0;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawFrostedGlass();
  }

  function drawFrostedGlass() {
    ctx.globalCompositeOperation = 'source-over';
    
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    for (let i = 0; i < 25; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 100 + 30,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }

  resize();
  window.addEventListener('resize', resize);

  function checkCleanPercentage() {
    const isMobile = window.innerWidth < 640;
    const w = canvas.width;
    const h = canvas.height;
    const sampleW = Math.floor(w / 16);
    const sampleH = Math.floor(h / 16);
    
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    let transparentPixels = 0;
    const totalSamples = sampleW * sampleH;

    for (let y = 0; y < h; y += 16) {
      for (let x = 0; x < w; x += 16) {
        const alphaIndex = (y * w + x) * 4 + 3;
        if (data[alphaIndex] < 64) {
          transparentPixels++;
        }
      }
    }

    const cleanRatio = transparentPixels / totalSamples;
    
    // Eşik: Mobilde %18, Masaüstünde %30
    const targetThreshold = isMobile ? 0.18 : 0.30;
    
    if (cleanRatio >= targetThreshold) {
      finishWipe();
    }
  }

  function wipe(x, y) {
    if (isFinished) return;

    rag.style.left = x + 'px';
    rag.style.top = y + 'px';
    rag.style.transform = 'translate(-50%, -50%) rotate(-10deg) scale(1.05)';

    if (!hasMoved) {
      hasMoved = true;
      hint.style.transition = 'opacity 0.4s ease';
      hint.style.opacity = '0';
    }

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    
    // Fırça: mobilde 55px (rahat silinsin), masaüstünde 75px
    const radius = window.innerWidth < 640 ? 55 : 75;
    
    const radialGrad = ctx.createRadialGradient(x, y, radius * 0.35, x, y, radius);
    radialGrad.addColorStop(0, 'rgba(0,0,0,1)');
    radialGrad.addColorStop(0.75, 'rgba(0,0,0,0.85)');
    radialGrad.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.fillStyle = radialGrad;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    checkThrottle++;
    if (checkThrottle % 4 === 0) {
      checkCleanPercentage();
    }
  }

  function finishWipe() {
    if (isFinished) return;
    isFinished = true;

    try {
      sessionStorage.setItem('snrWipeIntroSeen', '1');
    } catch (e) {}

    rag.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
    rag.style.opacity = '0';
    rag.style.transform = 'translate(-50%, -50%) scale(0.6)';

    container.style.transition = 'transform 1.3s cubic-bezier(0.25, 1, 0.5, 1), opacity 1.1s ease, filter 1.1s ease';
    container.style.transform = 'translateY(-105%)';
    container.style.opacity = '0';
    container.style.filter = 'blur(8px)';

    setTimeout(() => {
      document.documentElement.style.overflow = '';
      container.remove();
    }, 1300);
  }

  function onPointerDown(e) {
    isDrawing = true;
    wipe(e.clientX, e.clientY);
  }

  function onPointerMove(e) {
    if (!isDrawing && e.pointerType === 'touch') return;
    if (isDrawing || e.pointerType === 'mouse') {
      wipe(e.clientX, e.clientY);
    }
  }

  function onPointerUp() {
    isDrawing = false;
    rag.style.transform = 'translate(-50%, -50%) rotate(0deg) scale(1)';
    checkCleanPercentage();
  }

  container.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerup', onPointerUp);

  if (skipBtn) {
    skipBtn.addEventListener('click', finishWipe);
  }
})();