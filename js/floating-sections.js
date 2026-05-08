/* ============================================================
   Floating Sections — Subtle parallax on glass cards
   Each section wrapper gets a translateY offset driven by
   scroll position, creating independent floating depth.
   ============================================================ */

(function () {
  'use strict';

  var wrappers = [];
  var speeds = [];
  var ticking = false;

  function init() {
    if (window.innerWidth < 768) return;

    var els = document.querySelectorAll('.section--floating__inner');
    for (var i = 0; i < els.length; i++) {
      var speed = parseFloat(els[i].getAttribute('data-parallax-speed'));
      if (!isNaN(speed)) {
        wrappers.push(els[i]);
        speeds.push(speed);
      }
    }
    if (wrappers.length) {
      window.addEventListener('scroll', onScroll, { passive: true });
      update();
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  function update() {
    ticking = false;
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;

    for (var i = 0; i < wrappers.length; i++) {
      var offset = scrollY * (1 - speeds[i]);
      wrappers[i].style.transform = 'translateY(' + offset + 'px)';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
