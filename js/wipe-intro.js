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

  const ctx = canvas.getContext('2d');
  let isDrawing = false;
  let hasMoved = false;
  let clearedPixels = 0;
  let totalPixels = 0;
  let isFinished = false;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    totalPixels = canvas.width * canvas.height;
    drawFrostedGlass();
  }

  // Kirli / Buğulu Cam Katmanı Çizimi
  function drawFrostedGlass() {
    ctx.globalCompositeOperation = 'source-over';
    
    // Koyu lacivert buğulu zemin
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Üzerine hafif kir / leke dokusu
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 120 + 40,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }

  resize();
  window.addEventListener('resize', resize);

  // Bezle Silme Hareketi (Destination-Out ile Şeffaflaştırma)
  function wipe(x, y) {
    if (isFinished) return;

    // Bezi farenin/parmağın ucuna yapıştır
    rag.style.left = x + 'px';
    rag.style.top = y + 'px';
    rag.style.transform = 'translate(-50%, -50%) rotate(-12deg) scale(1.08)';

    if (!hasMoved) {
      hasMoved = true;
      if (hint) hint.style.opacity = '0';
    }

    // Ekranı sil
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    // Silme çapı mobilde 70px, masaüstünde 95px
    const radius = window.innerWidth < 640 ? 70 : 95;
    
    const radialGrad = ctx.createRadialGradient(x, y, radius * 0.4, x, y, radius);
    radialGrad.addColorStop(0, 'rgba(0,0,0,1)');
    radialGrad.addColorStop(0.7, 'rgba(0,0,0,0.8)');
    radialGrad.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.fillStyle = radialGrad;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    clearedPixels += radius * radius * 0.8;

    // Yeterince silindiğinde (yaklaşık %35-40 temizlendiğinde) otomatik aç
    if (clearedPixels > totalPixels * 0.35) {
      finishWipe();
    }
  }

  function finishWipe() {
    if (isFinished) return;
    isFinished = true;

    try {
      sessionStorage.setItem('snrWipeIntroSeen', '1');
    } catch (e) {}

    rag.style.opacity = '0';
    container.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    container.style.opacity = '0';

    setTimeout(() => {
      document.documentElement.style.overflow = '';
      container.remove();
    }, 600);
  }

  // Pointer & Touch Olayları
  function onPointerDown(e) {
    isDrawing = true;
    wipe(e.clientX, e.clientY);
  }

  function onPointerMove(e) {
    if (!isDrawing && e.pointerType === 'touch') return;
    // Masaüstünde gezinirken de hafif silsin veya tıklayınca silsin
    if (isDrawing || e.pointerType === 'mouse') {
      wipe(e.clientX, e.clientY);
    }
  }

  function onPointerUp() {
    isDrawing = false;
    rag.style.transform = 'translate(-50%, -50%) rotate(0deg) scale(1)';
  }

  container.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerup', onPointerUp);

  if (skipBtn) {
    skipBtn.addEventListener('click', finishWipe);
  }
})();