/**
 * SNR Endüstriyel — "Swipe to Clean" Splash Screen
 * Bağımlılık yok. Pointer Events ile hem mouse hem touch/pen desteklenir.
 * sessionStorage anahtarı: "snrWipeIntroSeen"
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'snrWipeIntroSeen';
  var COMPLETE_THRESHOLD = 0.85; // bu oranın üzerinde bırakılırsa otomatik tamamlanır

  var overlay = document.getElementById('wipeIntroOverlay');
  if (!overlay) return; // sayfada splash yoksa hiçbir şey yapma

  var alreadySeen = false;
  try {
    alreadySeen = sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch (e) {
    alreadySeen = false;
  }

  // Zaten görülmüşse: overlay'i DOM'dan temizle, kilitleri kaldır, çık.
  if (alreadySeen) {
    unlockScroll();
    overlay.remove();
    return;
  }

  var track = document.getElementById('wipeTrack');
  var handle = document.getElementById('wipeHandle');
  var hint = document.getElementById('wipeHint');
  var skipBtn = document.getElementById('wipeSkipBtn');

  var trackWidth = 0;
  var handleWidth = 0;
  var maxDistance = 0;
  var currentX = 0;
  var dragging = false;
  var startPointerX = 0;
  var startHandleX = 0;
  var rafPending = false;
  var finished = false;

  function measure() {
    trackWidth = track.getBoundingClientRect().width;
    handleWidth = handle.getBoundingClientRect().width;
    maxDistance = Math.max(trackWidth - handleWidth - 8, 1); // 8px = handle iç boşluğu (top/left: 4px x2)
  }

  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  function applyFrame(x, animateSnap) {
    currentX = clamp(x, 0, maxDistance);
    var progress = currentX / maxDistance; // 0..1

    handle.classList.toggle('wipe-snapping', !!animateSnap);
    handle.style.transform = 'translateX(' + currentX + 'px)';
    handle.setAttribute('aria-valuenow', String(Math.round(progress * 100)));

    // Overlay'i soldan sağa "silerek" aç
    overlay.style.clipPath = 'inset(0 0 0 ' + (progress * 100) + '%)';

    // İpucu yazısını kaydırma başlar başlamaz soldur
    hint.style.opacity = String(clamp(1 - progress * 2.2, 0, 1));

    return progress;
  }

  function onFrameRequest(x) {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(function () {
      rafPending = false;
      applyFrame(x, false);
    });
  }

  function finishIntro() {
    if (finished) return;
    finished = true;

    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch (e) {
      /* sessizce geç */
    }

    applyFrame(maxDistance, true); // tam açık pozisyona kilitle
    overlay.classList.add('wipe-fade-out');

    var cleanup = function () {
      unlockScroll();
      overlay.remove();
      document.dispatchEvent(new CustomEvent('wipeIntroComplete'));
    };

    overlay.addEventListener('transitionend', cleanup, { once: true });
    // Güvenlik ağı: transitionend tetiklenmezse yine de temizle
    setTimeout(cleanup, 700);
  }

  function snapBack() {
    applyFrame(0, true);
  }

  function unlockScroll() {
    document.documentElement.classList.remove('wipe-intro-lock', 'wipe-intro-skip');
  }

  function getPointerX(evt) {
    return evt.clientX;
  }

  function onPointerDown(evt) {
    if (finished) return;
    dragging = true;
    measure();
    startPointerX = getPointerX(evt);
    startHandleX = currentX;
    handle.setPointerCapture && handle.setPointerCapture(evt.pointerId);
    handle.classList.remove('wipe-snapping');
  }

  function onPointerMove(evt) {
    if (!dragging || finished) return;
    var delta = getPointerX(evt) - startPointerX;
    onFrameRequest(startHandleX + delta);
  }

  function onPointerUp() {
    if (!dragging || finished) return;
    dragging = false;
    var progress = maxDistance > 0 ? currentX / maxDistance : 0;
    if (progress >= COMPLETE_THRESHOLD) {
      finishIntro();
    } else {
      snapBack();
    }
  }

  // Klavye erişilebilirliği: Ok tuşlarıyla kaydırma, Enter ile tamamlama
  function onKeyDown(evt) {
    if (finished) return;
    var step = Math.max(maxDistance * 0.08, 16);
    if (evt.key === 'ArrowRight') {
      evt.preventDefault();
      applyFrame(currentX + step, true);
    } else if (evt.key === 'ArrowLeft') {
      evt.preventDefault();
      applyFrame(currentX - step, true);
    } else if (evt.key === 'Enter' || evt.key === ' ') {
      evt.preventDefault();
      finishIntro();
    } else if (evt.key === 'Escape') {
      finishIntro();
    }
  }

  measure();
  applyFrame(0, false);

  handle.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerup', onPointerUp, { passive: true });
  window.addEventListener('pointercancel', onPointerUp, { passive: true });
  handle.addEventListener('keydown', onKeyDown);

  window.addEventListener('resize', function () {
    if (finished) return;
    var wasProgress = maxDistance > 0 ? currentX / maxDistance : 0;
    measure();
    applyFrame(wasProgress * maxDistance, false);
  });

  if (skipBtn) {
    skipBtn.addEventListener('click', finishIntro);
  }
})();
