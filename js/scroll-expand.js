/* ============================================================
   Webdigio — Scroll-Expand Hero
   Ported from shadcn ScrollExpandMedia component concept
   ============================================================ */

(function () {
  'use strict';

  var hero = document.getElementById('scrollHero');
  if (!hero) return;

  var bg = document.getElementById('heroBg');
  var card = document.getElementById('heroCard');
  var overlay = document.getElementById('heroOverlay');
  var titleL = document.getElementById('heroTitleL');
  var titleR = document.getElementById('heroTitleR');
  var tagline = document.getElementById('heroTagline');
  var hint = document.getElementById('heroHint');

  var progress = 0;
  var expanded = false;
  var rafId = null;
  var touchStartY = 0;
  var isMobile = window.innerWidth < 768;

  // Sizes
  var startW = isMobile ? 200 : 320;
  var startH = isMobile ? 140 : 220;
  var maxW = Math.min(window.innerWidth * 0.92, 1400);
  var maxH = Math.min(window.innerHeight * 0.75, 800);

  // Wait for hero reveal (after loader)
  function waitForReveal() {
    if (document.querySelector('.hero--reveal')) {
      bind();
    } else {
      setTimeout(waitForReveal, 150);
    }
  }

  function bind() {
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('resize', onResize);
  }

  function unbind() {
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onTouchEnd);
    window.removeEventListener('resize', onResize);
  }

  function onResize() {
    isMobile = window.innerWidth < 768;
    maxW = Math.min(window.innerWidth * 0.92, 1400);
    maxH = Math.min(window.innerHeight * 0.75, 800);
  }

  function onWheel(e) {
    if (expanded) return;
    e.preventDefault();
    var d = e.deltaY * 0.0012;
    progress = Math.min(Math.max(progress + d, 0), 1);
    scheduleRender();
  }

  function onTouchStart(e) {
    touchStartY = e.touches[0].clientY;
  }

  function onTouchMove(e) {
    if (expanded) return;
    e.preventDefault();
    var dy = touchStartY - e.touches[0].clientY;
    var factor = dy < 0 ? 0.008 : 0.005;
    progress = Math.min(Math.max(progress + dy * factor, 0), 1);
    scheduleRender();
    touchStartY = e.touches[0].clientY;
  }

  function onTouchEnd() {
    touchStartY = 0;
  }

  var pending = false;
  function scheduleRender() {
    if (pending) return;
    pending = true;
    rafId = requestAnimationFrame(function () {
      pending = false;
      render();
    });
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function render() {
    var p = easeOutCubic(progress);

    // Card expands
    var w = startW + p * (maxW - startW);
    var h = startH + p * (maxH - startH);
    card.style.width = w + 'px';
    card.style.height = h + 'px';

    // Border radius shrinks
    var br = Math.max(16 * (1 - p), 0);
    card.style.borderRadius = br + 'px';

    // Overlay fades
    overlay.style.opacity = Math.max(0, 1 - p * 1.2);

    // Title splits — move apart
    var tx = p * (isMobile ? 22 : 28);
    if (titleL) titleL.style.transform = 'translateX(-' + tx + 'vw)';
    if (titleR) titleR.style.transform = 'translateX(' + tx + 'vw)';

    // Tagline fades
    if (tagline) tagline.style.opacity = Math.max(0, 1 - p * 1.5);

    // Hint fades quickly
    if (hint) hint.style.opacity = Math.max(0, 1 - p * 3);

    // Background fades
    if (bg) bg.style.opacity = Math.max(0, 1 - p);

    if (progress >= 1 && !expanded) {
      expanded = true;
      onComplete();
    }
  }

  function onComplete() {
    unbind();
    if (rafId) cancelAnimationFrame(rafId);
    hero.classList.add('hero--expanded');

    // Smooth reveal of next sections
    var expertise = document.getElementById('expertise');
    if (expertise) {
      setTimeout(function () {
        expertise.scrollIntoView({ behavior: 'smooth' });
      }, 400);
    }
  }

  // Initial render
  render();
  waitForReveal();
})();
