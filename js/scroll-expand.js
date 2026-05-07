/* ============================================================
   Webdigio — Scroll-Expand Hero (bidirectional)
   Driven by GSAP ScrollTrigger with pin + scrub
   ============================================================ */

(function () {
  'use strict';

  var hero = document.getElementById('scrollHero');
  if (!hero) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var bg = document.getElementById('heroBg');
  var card = document.getElementById('heroCard');
  var overlay = document.getElementById('heroOverlay');
  var heroTitle = document.getElementById('heroTitle');
  var tagline = document.getElementById('heroTagline');
  var hint = document.getElementById('heroHint');
  var st = null;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function render(progress) {
    var p = easeOutCubic(progress);
    var isM = window.innerWidth < 768;
    var startW = isM ? 200 : 320;
    var startH = isM ? 140 : 220;
    var maxW = Math.min(window.innerWidth * 0.92, 1400);
    var maxH = Math.min(window.innerHeight * 0.75, 800);

    // Card expands / shrinks
    var w = startW + p * (maxW - startW);
    var h = startH + p * (maxH - startH);
    card.style.width = w + 'px';
    card.style.height = h + 'px';
    card.style.borderRadius = Math.max(16 * (1 - p), 0) + 'px';

    // Overlay fades
    overlay.style.opacity = Math.max(0, 1 - p * 1.2);

    // Title fades out
    if (heroTitle) heroTitle.style.opacity = Math.max(0, 1 - p * 1.3);

    // Tagline fades
    if (tagline) tagline.style.opacity = Math.max(0, 1 - p * 1.5);

    // Hint fades quickly
    if (hint) hint.style.opacity = Math.max(0, 1 - p * 3);

    // Background fades out (revealing particles underneath)
    if (bg) bg.style.opacity = Math.max(0, 1 - p);

    // Toggle expanded class for both directions
    hero.classList.toggle('hero--expanded', progress >= 0.99);
  }

  function createScrollTrigger() {
    st = ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: '+=' + window.innerHeight,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: function (self) {
        render(self.progress);
      }
    });

    // Ensure initial state
    render(0);
  }

  // Wait for hero reveal (after loader)
  function waitForReveal() {
    if (document.querySelector('.hero--reveal')) {
      createScrollTrigger();
    } else {
      setTimeout(waitForReveal, 150);
    }
  }

  waitForReveal();
})();
