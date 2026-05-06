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

  // --- iPad Stack ---
  var ipadStack = document.getElementById('ipadStack');
  var ipadCards = document.querySelectorAll('.ipad-card');
  if (ipadStack && ipadCards.length > 0) {
    var total = ipadCards.length;

    // Initial state: Card 1 flat on top, Cards 2-7 tilted and behind
    for (var i = 0; i < total; i++) {
      var card = ipadCards[i];
      var depth = i; // 0=card1(top), 1=card2, ..., 6=card7(bottom)
      if (i === 0) {
        gsap.set(card, { zIndex: total, rotationX: 0, y: 0, scale: 1, filter: 'brightness(1)', transformOrigin: 'center top' });
      } else {
        gsap.set(card, {
          zIndex: total - i,
          rotationX: -8 * depth,
          y: depth * 8,
          scale: 1 - depth * 0.02,
          filter: 'brightness(' + (1 - depth * 0.06) + ')',
          transformOrigin: 'center top',
        });
      }
    }

    // Scroll scrub: fold current → reveal next, sequentially
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ipadStack,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.6,
      }
    });

    for (var j = 0; j < total - 1; j++) {
      var current = ipadCards[j];   // Card 1, 2, ..., 6
      var next = ipadCards[j + 1];  // Card 2, 3, ..., 7
      var t = j * 1.3;

      // Current card folds up and away
      tl.to(current, {
        rotationX: 85,
        y: -350,
        scale: 0.75,
        opacity: 0,
        filter: 'brightness(0.2) blur(5px)',
        duration: 0.8,
        ease: 'power2.in',
      }, t);

      // Next card flattens into view (if not the last)
      tl.to(next, {
        rotationX: 0,
        y: 0,
        scale: 1,
        filter: 'brightness(1)',
        duration: 0.7,
        ease: 'power2.out',
      }, t + 0.3);
    }
  }

})();
