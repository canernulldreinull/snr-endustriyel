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

  // Kirli / Buğulu Cam Katmanı Çizimi
  function drawFrostedGlass() {
    ctx.globalCompositeOperation = 'source-over';
    
    // Koyu buğulu zemin
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Leke dokuları
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

  // Gerçek temizlik oranını ölçme (Performansı yormadan seyrek kontrol)
  function checkCleanPercentage() {
    const w = canvas.width;
    const h = canvas.height;
    // Performans için 1/16 çözünürlükte örnekleme yapıyoruz
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
    
    // Ekranın en az %60'ı silindiğinde açılışı tamamla
    if (cleanRatio >= 0.60) {
      finishWipe();
    }
  }

  // Bezle Silme Hareketi
  function wipe(x, y) {
    if (isFinished) return;

    rag.style.left = x + 'px';
    rag.style.top = y + 'px';
    rag.style.transform = 'translate(-50%, -50%) rotate(-10deg) scale(1.05)';

    if (!hasMoved) {
      hasMoved = true;
      if (hint) hint.style.opacity = '0';
    }

    // Ekranı sil (daha kontrollü yarıçap: mobilde 48px, masaüstünde 64px)
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    const radius = window.innerWidth < 640 ? 48 : 64;
    
    const radialGrad = ctx.createRadialGradient(x, y, radius * 0.3, x, y, radius);
    radialGrad.addColorStop(0, 'rgba(0,0,0,1)');
    radialGrad.addColorStop(0.7, 'rgba(0,0,0,0.85)');
    radialGrad.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.fillStyle = radialGrad;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Her 12 harekette bir oran kontrolü yap
    checkThrottle++;
    if (checkThrottle % 12 === 0) {
      checkCleanPercentage();
    }
  }

  function finishWipe() {
    if (isFinished) return;
    isFinished = true;

    try {
      sessionStorage.setItem('snrWipeIntroSeen', '1');
    } catch (e) {}

    rag.style.opacity = '0';
    container.style.transition = 'opacity 0.65s cubic-bezier(0.4, 0, 0.2, 1)';
    container.style.opacity = '0';

    setTimeout(() => {
      document.documentElement.style.overflow = '';
      container.remove();
    }, 650);
  }

  // Event Listener'lar
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