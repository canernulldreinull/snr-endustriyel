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
  let rag = document.getElementById('wipe-rag');
  const hint = document.getElementById('wipe-hint-text');
  const skipBtn = document.getElementById('wipe-skip-btn');

  if (!container || !canvas) return;

  // Gerçekçi 3D Rulo Peçete SVG Görselini Dinamik Olarak Yerleştir
  if (rag) {
    rag.innerHTML = `
      <div class="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.65)] select-none pointer-events-none">
        <svg viewBox="0 0 160 160" class="w-full h-full transform -rotate-12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Rulo Dış Gölge ve Gövde -->
          <ellipse cx="60" cy="50" rx="32" ry="42" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="2"/>
          <path d="M60 8 L125 38 C135 43 140 52 140 65 L140 105 C140 118 132 125 120 120 L58 92 Z" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
          
          <!-- Rulo Silindir Hacim Gölgelendirmesi -->
          <path d="M60 8 L125 38 L125 120 L60 92 Z" fill="url(#rollGradient)"/>
          
          <!-- Rulo Ön Yüzü (Kağıt Katmanları Dokusu) -->
          <ellipse cx="60" cy="50" rx="28" ry="38" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5"/>
          <ellipse cx="60" cy="50" rx="22" ry="30" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
          <ellipse cx="60" cy="50" rx="15" ry="20" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
          
          <!-- Masura / İç Karton Rulo Deliği -->
          <ellipse cx="60" cy="50" rx="9" ry="13" fill="#78350f" stroke="#451a03" stroke-width="2"/>
          <ellipse cx="60" cy="50" rx="6" ry="9" fill="#1e293b"/>
          
          <!-- Sarkıt Peçete Yaprağı (Koparma / Silme Ucu) -->
          <path d="M125 38 L142 48 C148 52 150 62 146 72 L132 118 C130 125 122 128 115 124 L60 92" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
          
          <!-- Peçete Perforasyon / Kabartma Noktaları -->
          <line x1="128" y1="50" x2="122" y2="110" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3 3"/>
          <line x1="100" y1="36" x2="94" y2="98" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="2 3"/>
          
          <!-- SNR Marka Baskı İmzası -->
          <text x="82" y="78" fill="#0284c7" font-size="9" font-family="'JetBrains Mono', monospace" font-weight="bold" letter-spacing="1" transform="rotate(18 82 78)">SNR</text>

          <defs>
            <linearGradient id="rollGradient" x1="60" y1="50" x2="125" y2="79" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#cbd5e1" stop-opacity="0.6"/>
              <stop offset="35%" stop-color="#ffffff" stop-opacity="0.9"/>
              <stop offset="70%" stop-color="#f1f5f9" stop-opacity="0.4"/>
              <stop offset="100%" stop-color="#64748b" stop-opacity="0.5"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
    `;
  }

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
    
    if (cleanRatio >= 0.40) {
      finishWipe();
    }
  }

  function wipe(x, y) {
    if (isFinished) return;

    if (rag) {
      rag.style.left = x + 'px';
      rag.style.top = y + 'px';
      rag.style.transform = 'translate(-50%, -50%) rotate(-8deg) scale(1.06)';
    }

    if (!hasMoved) {
      hasMoved = true;
      if (hint) {
        hint.style.transition = 'opacity 0.4s ease';
        hint.style.opacity = '0';
      }
    }

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    const radius = window.innerWidth < 640 ? 65 : 85;
    
    const radialGrad = ctx.createRadialGradient(x, y, radius * 0.35, x, y, radius);
    radialGrad.addColorStop(0, 'rgba(0,0,0,1)');
    radialGrad.addColorStop(0.75, 'rgba(0,0,0,0.85)');
    radialGrad.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.fillStyle = radialGrad;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    checkThrottle++;
    if (checkThrottle % 8 === 0) {
      checkCleanPercentage();
    }
  }

  function finishWipe() {
    if (isFinished) return;
    isFinished = true;

    try {
      sessionStorage.setItem('snrWipeIntroSeen', '1');
    } catch (e) {}

    if (rag) {
      rag.style.transition = 'opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
      rag.style.opacity = '0';
      rag.style.transform = 'translate(-50%, -50%) scale(0.75)';
    }

    container.style.transition = 'transform 1.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 1.2s ease, filter 1.2s ease';
    container.style.transform = 'translateY(-105%)';
    container.style.opacity = '0';
    container.style.filter = 'blur(8px)';

    setTimeout(() => {
      document.documentElement.style.overflow = '';
      container.remove();
    }, 1400);
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
    if (rag) {
      rag.style.transform = 'translate(-50%, -50%) rotate(0deg) scale(1)';
    }
    checkCleanPercentage();
  }

  container.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerup', onPointerUp);

  if (skipBtn) {
    skipBtn.addEventListener('click', finishWipe);
  }
})();