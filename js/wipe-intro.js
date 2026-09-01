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
  const rag = document.getElementById('wipe-rag');
  const hint = document.getElementById('wipe-hint-text');
  const skipBtn = document.getElementById('wipe-skip-btn');

  if (!container || !canvas || !rag) return;

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

    rag.style.left = x + 'px';
    rag.style.top = y + 'px';
    rag.style.transform = 'translate(-50%, -50%) rotate(-10deg) scale(1.05)';

    if (!hasMoved) {
      hasMoved = true;
      if (hint) hint.style.opacity = '0';
    }

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    const radius = window.innerWidth < 640 ? 60 : 78;
    
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

    rag.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    rag.style.opacity = '0';
    rag.style.transform = 'translate(-50%, -50%) scale(0.85)';

    container.style.transition = 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1)';
    container.style.transform = 'translateY(-100%)';
    container.style.opacity = '0';

    setTimeout(() => {
      document.documentElement.style.overflow = '';
      container.remove();
    }, 850);
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