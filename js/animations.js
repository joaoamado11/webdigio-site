/* ============================================================
   Webdigio — GSAP Scroll Animations
   ============================================================ */

(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  gsap.registerPlugin(ScrollTrigger);

  // Hide reveal elements so GSAP can animate them in
  var reveals = document.querySelectorAll('[data-reveal]');
  for (var r = 0; r < reveals.length; r++) {
    reveals[r].style.opacity = '0';
    reveals[r].style.transform = 'translateY(30px)';
  }

  // Failsafe: show everything after 8s (after loader should be done)
  setTimeout(function () {
    var all = document.querySelectorAll('[data-reveal]');
    for (var i = 0; i < all.length; i++) {
      if (all[i].style.opacity === '0') {
        all[i].style.opacity = '1';
        all[i].style.transform = 'translateY(0)';
      }
    }
  }, 8000);

  // --- Hero Entrance (paused until loader finishes) ---
  var heroTL = gsap.timeline({ defaults: { ease: 'power3.out' }, paused: true });
  heroTL
    .from('.hero__overline', { opacity: 0, y: 30, duration: 0.5 })
    .from('.hero__headline', { opacity: 0, y: 50, duration: 0.7 }, '-=0.2')
    .from('.hero__subhead', { opacity: 0, y: 25, duration: 0.5 }, '-=0.3')
    .from('.hero__actions .btn', { opacity: 0, y: 15, duration: 0.4, stagger: 0.08 }, '-=0.2')
    .from('.iphone', { opacity: 0, y: 60, scale: 0.85, duration: 0.7, stagger: 0.12, ease: 'back.out(1.2)' }, '-=0.3')
    .from('.hero__badge', { opacity: 0, y: 25, duration: 0.4, stagger: 0.08 }, '-=0.4')
    .from('.hero__scroll', { opacity: 0, y: 10, duration: 0.5 }, '-=0.2');

  // Expose for loader
  window.startHeroAnimations = function () {
    heroTL.play();
  };

  // --- Card section reveals ---
  function revealOnScroll(selector, staggerVal) {
    var els = document.querySelectorAll(selector);
    if (!els.length) return;
    gsap.fromTo(els,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.6,
        stagger: staggerVal || 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: els[0].parentElement,
          start: 'top 85%',
          once: true,
        },
      }
    );
  }

  revealOnScroll('.expertise__card', 0.1);
  revealOnScroll('.services__card', 0.1);
  revealOnScroll('.why__card', 0.08);
  revealOnScroll('.industries__card', 0.08);
  revealOnScroll('.approach__card', 0.1);
  revealOnScroll('.process__step', 0.12);
  revealOnScroll('.showcase__item', 0.06);

  // Showcase content
  gsap.fromTo('.showcase__content',
    { opacity: 0, x: -30 },
    {
      opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.showcase__grid', start: 'top 80%', once: true },
    }
  );
  gsap.fromTo('.showcase__visual',
    { opacity: 0, x: 30 },
    {
      opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.showcase__grid', start: 'top 80%', once: true },
    }
  );

  // Pricing
  gsap.fromTo('.pricing__box',
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
      scrollTrigger: { trigger: '.pricing', start: 'top 82%', once: true },
    }
  );

  // CTA
  gsap.fromTo('.cta__content',
    { opacity: 0, x: -30 },
    {
      opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.cta', start: 'top 78%', once: true },
    }
  );
  gsap.fromTo('.cta__form-wrapper',
    { opacity: 0, x: 30 },
    {
      opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.cta', start: 'top 78%', once: true },
    }
  );

  // --- Aurora parallax ---
  gsap.utils.toArray('.aurora-bg').forEach(function (bg, i) {
    gsap.to(bg, {
      scrollTrigger: {
        trigger: bg.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
      y: (i % 2 === 0) ? -30 : 30,
      ease: 'none',
    });
  });

})();
