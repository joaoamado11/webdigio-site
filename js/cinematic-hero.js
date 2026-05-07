/* ============================================================
   Webdigio — Cinematic Hero Section (ported from React)
   Full-screen scroll-driven experience with GSAP + ScrollTrigger
   ============================================================ */

(function () {
  'use strict';

  var section = document.getElementById('expertise');
  if (!section) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var card = document.getElementById('cinematicCard');
  var mockup = document.getElementById('iphoneMockup');
  var isMobile = window.innerWidth < 768;

  // ---- Mouse 3D tilt on iPhone mockup ----
  var rafId = 0;
  var scrollYAtStart = 0;

  function onMouseMove(e) {
    if (window.scrollY > window.innerHeight * 2) return;
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(function () {
      if (!mockup) return;
      var xVal = (e.clientX / window.innerWidth - 0.5) * 2;
      var yVal = (e.clientY / window.innerHeight - 0.5) * 2;
      gsap.to(mockup, {
        rotationY: xVal * 12,
        rotationX: -yVal * 12,
        ease: 'power3.out',
        duration: 1.2,
      });
    });
  }

  window.addEventListener('mousemove', onMouseMove);

  // ---- Counter helper ----
  function animateCounter(el, target, duration, easeFn) {
    if (!el) return;
    var data = { val: 0 };
    gsap.to(data, {
      val: target,
      duration: duration || 2,
      ease: easeFn || 'expo.out',
      onUpdate: function () {
        el.textContent = Math.round(data.val);
      },
    });
  }

  // ---- ScrollTrigger timeline ----
  function createTimeline() {
    // Only run if not already set up
    if (section._cinematicActive) return;
    section._cinematicActive = true;

    // Set initial states
    gsap.set('.cinematic__text-track', { autoAlpha: 0, y: 60, scale: 0.85, filter: 'blur(20px)', rotationX: -20 });
    gsap.set('.cinematic__text-days', { autoAlpha: 1, clipPath: 'inset(0 100% 0 0)' });
    gsap.set('.cinematic__card', { y: window.innerHeight + 200, autoAlpha: 1 });
    gsap.set(['.cinematic__desc', '.cinematic__brand', '.cinematic__mockup-wrap', '.cinematic__badge', '.cinematic__widget'], { autoAlpha: 0 });
    gsap.set('.cinematic__cta', { autoAlpha: 0, scale: 0.8, filter: 'blur(30px)' });

    // Initial entrance
    var introTl = gsap.timeline({ delay: 0.3 });
    introTl
      .to('.cinematic__text-track', { duration: 1.8, autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', rotationX: 0, ease: 'expo.out' })
      .to('.cinematic__text-days', { duration: 1.4, clipPath: 'inset(0 0% 0 0)', ease: 'power4.inOut' }, '-=1.0');

    var endPx = isMobile ? 5000 : 7000;

    var scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=' + endPx,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    var cardRadius = isMobile ? '32px' : '40px';

    scrollTl
      // 0 — Fade hero text + grid
      .to(['.cinematic__hero-text', '.cinematic__grid-bg'], { scale: 1.15, filter: 'blur(20px)', opacity: 0.2, ease: 'power2.inOut', duration: 2 }, 0)
      // Slide card up
      .to('.cinematic__card', { y: 0, ease: 'power3.inOut', duration: 2 }, 0)
      // Expand card to full screen
      .to('.cinematic__card', { width: '100%', height: '100%', borderRadius: '0px', ease: 'power3.inOut', duration: 1.5 })
      // Animate in mockup
      .fromTo('.cinematic__mockup-wrap',
        { y: 300, z: -500, rotationX: 50, rotationY: -30, autoAlpha: 0, scale: 0.6 },
        { y: 0, z: 0, rotationX: 0, rotationY: 0, autoAlpha: 1, scale: 1, ease: 'expo.out', duration: 2.5 }, '-=0.8'
      )
      // Animate in widgets
      .fromTo('.cinematic__widget', { y: 40, autoAlpha: 0, scale: 0.95 }, { y: 0, autoAlpha: 1, scale: 1, stagger: 0.15, ease: 'back.out(1.2)', duration: 1.5 }, '-=1.5')
      // Progress ring
      .to('.cinematic__progress-ring', { strokeDashoffset: 60, duration: 2, ease: 'power3.inOut' }, '-=1.2')
      // Counter
      .call(function () {
        animateCounter(document.querySelector('.cinematic__counter-val'), 690, 2, 'expo.out');
      }, null, '-=2.0')
      // Badges
      .fromTo('.cinematic__badge', { y: 100, autoAlpha: 0, scale: 0.7, rotationZ: -10 }, { y: 0, autoAlpha: 1, scale: 1, rotationZ: 0, ease: 'back.out(1.5)', duration: 1.5, stagger: 0.2 }, '-=2.0')
      // Left text (description)
      .fromTo('.cinematic__desc', { x: -50, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: 'power4.out', duration: 1.5 }, '-=1.5')
      // Right text (brand name)
      .fromTo('.cinematic__brand', { x: 50, autoAlpha: 0, scale: 0.8 }, { x: 0, autoAlpha: 1, scale: 1, ease: 'expo.out', duration: 1.5 }, '<')
      // Pause
      .to({}, { duration: 2.5 })
      // Hide hero text, show CTA
      .set('.cinematic__hero-text', { autoAlpha: 0 })
      .set('.cinematic__cta', { autoAlpha: 1 })
      // Brief pause
      .to({}, { duration: 1.5 })
      // Fade out mockup, badges, text
      .to(['.cinematic__mockup-wrap', '.cinematic__badge', '.cinematic__desc', '.cinematic__brand'], {
        scale: 0.9, y: -40, z: -200, autoAlpha: 0, ease: 'power3.in', duration: 1.2, stagger: 0.05,
      })
      // Card pullback
      .to('.cinematic__card', {
        width: isMobile ? '92vw' : '85vw',
        height: isMobile ? '92vh' : '85vh',
        borderRadius: cardRadius,
        ease: 'expo.inOut',
        duration: 1.8,
      }, 'pullback')
      // Animate in CTA
      .to('.cinematic__cta', { scale: 1, filter: 'blur(0px)', ease: 'expo.inOut', duration: 1.8 }, 'pullback')
      // Slide card out
      .to('.cinematic__card', { y: -window.innerHeight - 300, ease: 'power3.in', duration: 1.5 });
  }

  // Wait for DOM ready and reveal
  function init() {
    // Short delay so all DOM elements are ready
    setTimeout(createTimeline, 100);
  }

  // If hero--reveal already happened, init; otherwise wait
  if (document.querySelector('.hero--reveal')) {
    init();
  } else {
    // Listen for the first reveal then start
    var checkReveal = setInterval(function () {
      if (document.querySelector('.hero--reveal')) {
        clearInterval(checkReveal);
        init();
      }
    }, 200);
  }
})();
