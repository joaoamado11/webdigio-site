/* ============================================================
   Tracing Beams — Scroll-driven SVG light beam animation
   Multiple beams with different paths, sizes, and gradients
   that reveal as the user scrolls down the page.
   ============================================================ */

(function () {
  'use strict';

  // ── Beam definitions ──────────────────────────────────────
  // Each beam: path string, stroke width, gradient colors (top→bottom),
  // opacity, and scroll range (0=top of page, 1=bottom)
  var BEAMS = [
    {
      // Wide dramatic S-curve, left side
      path: 'M -2 0 C 30 12, -10 35, 12 48 C 34 61, -5 82, 18 100',
      width: 1.8,
      colors: ['#A855F7', '#6366F1', '#3B82F6'],
      opacity: 0.35,
      scrollStart: 0.05,
      scrollEnd: 0.95
    },
    {
      // Tight oscillating wave, center-left
      path: 'M 18 0 C 5 8, 32 14, 18 22 C 4 30, 32 36, 18 44 C 4 52, 32 58, 18 66 C 4 74, 32 80, 18 88 C 4 96, 32 98, 18 100',
      width: 1.2,
      colors: ['#06B6D4', '#22D3EE', '#67E8F9'],
      opacity: 0.28,
      scrollStart: 0.0,
      scrollEnd: 0.85
    },
    {
      // Gentle wave, near center
      path: 'M 45 0 C 55 20, 32 28, 48 40 C 64 52, 35 62, 50 72 C 65 82, 38 92, 48 100',
      width: 1.5,
      colors: ['#3B82F6', '#60A5FA', '#93C5FD'],
      opacity: 0.25,
      scrollStart: 0.02,
      scrollEnd: 0.98
    },
    {
      // Diagonal sweep, left-to-right then back
      path: 'M 30 0 C 70 18, 10 38, 60 54 C 90 64, 25 76, 65 100',
      width: 1.0,
      colors: ['#818CF8', '#6366F1', '#A5B4FC'],
      opacity: 0.22,
      scrollStart: 0.08,
      scrollEnd: 0.92
    },
    {
      // Tight right-side wave
      path: 'M 82 0 C 68 12, 96 20, 82 32 C 68 44, 96 52, 82 64 C 68 76, 96 84, 82 92 C 68 98, 96 100, 82 100',
      width: 1.3,
      colors: ['#8B5CF6', '#7C3AED', '#C084FC'],
      opacity: 0.26,
      scrollStart: 0.03,
      scrollEnd: 0.9
    },
    {
      // Bold far-right sweep
      path: 'M 96 0 C 78 22, 108 32, 88 54 C 68 72, 102 82, 82 100',
      width: 2.0,
      colors: ['#EC4899', '#D946EF', '#A855F7'],
      opacity: 0.3,
      scrollStart: 0.06,
      scrollEnd: 0.96
    }
  ];

  // ── State ──────────────────────────────────────────────────
  var svg = null;
  var paths = [];
  var dots = [];
  var pathLengths = [];
  var lastProgress = -1;
  var ticking = false;

  // ── Build SVG overlay ──────────────────────────────────────
  function createOverlay() {
    var NS = 'http://www.w3.org/2000/svg';

    svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'tracing-beams');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');

    var defs = document.createElementNS(NS, 'defs');

    // Glow filter shared by all dots
    var filter = document.createElementNS(NS, 'filter');
    filter.setAttribute('id', 'tracing-beam-glow');
    filter.setAttribute('x', '-50%');
    filter.setAttribute('y', '-50%');
    filter.setAttribute('width', '200%');
    filter.setAttribute('height', '200%');
    filter.innerHTML =
      '<feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />' +
      '<feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>';
    defs.appendChild(filter);

    // Create gradient + path + dot for each beam
    BEAMS.forEach(function (beam, i) {
      // Linear gradient (top → bottom)
      var grad = document.createElementNS(NS, 'linearGradient');
      grad.setAttribute('id', 'tb-grad-' + i);
      grad.setAttribute('x1', '0');
      grad.setAttribute('y1', '0');
      grad.setAttribute('x2', '0');
      grad.setAttribute('y2', '1');
      grad.setAttribute('gradientUnits', 'objectBoundingBox');

      beam.colors.forEach(function (color, j) {
        var stop = document.createElementNS(NS, 'stop');
        stop.setAttribute('offset', String(j / (beam.colors.length - 1)));
        stop.setAttribute('stop-color', color);
        stop.setAttribute('stop-opacity', String(beam.opacity));
        grad.appendChild(stop);
      });
      defs.appendChild(grad);

      // Path
      var path = document.createElementNS(NS, 'path');
      path.setAttribute('d', beam.path);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'url(#tb-grad-' + i + ')');
      path.setAttribute('stroke-width', String(beam.width));
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      paths.push(path);
      svg.appendChild(path);

      // Glowing dot (hidden initially)
      var dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('r', String(beam.width * 2.5));
      dot.setAttribute('fill', beam.colors[0]);
      dot.setAttribute('opacity', '0');
      dot.setAttribute('filter', 'url(#tracing-beam-glow)');
      dot.setAttribute('class', 'tracing-beam__dot');
      dots.push(dot);
      svg.appendChild(dot);
    });

    svg.insertBefore(defs, svg.firstChild);
    document.body.insertBefore(svg, document.body.firstChild);
  }

  // ── Measure paths ──────────────────────────────────────────
  function measurePaths() {
    for (var i = 0; i < paths.length; i++) {
      pathLengths[i] = paths[i].getTotalLength();
      paths[i].setAttribute('stroke-dasharray', pathLengths[i]);
      paths[i].setAttribute('stroke-dashoffset', pathLengths[i]);
    }
  }

  // ── Update on scroll ───────────────────────────────────────
  function update() {
    ticking = false;

    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? scrollTop / docHeight : 0;

    // Clamp
    progress = progress < 0 ? 0 : progress > 1 ? 1 : progress;

    // Skip if no meaningful change
    if (Math.abs(progress - lastProgress) < 0.0003) return;
    lastProgress = progress;

    for (var i = 0; i < paths.length; i++) {
      var beam = BEAMS[i];
      // Map global progress to this beam's range
      var range = beam.scrollEnd - beam.scrollStart;
      var local = range > 0 ? (progress - beam.scrollStart) / range : 0;
      local = local < 0 ? 0 : local > 1 ? 1 : local;

      // Ease slightly for more organic feel
      var eased = local * local * (3 - 2 * local); // smoothstep

      var reveal = pathLengths[i] * eased;
      paths[i].setAttribute('stroke-dashoffset', String(pathLengths[i] - reveal));

      // Position dot at leading edge
      var dot = dots[i];
      if (eased > 0.001 && eased < 0.999) {
        var pt = paths[i].getPointAtLength(reveal);
        dot.setAttribute('cx', String(pt.x));
        dot.setAttribute('cy', String(pt.y));
        dot.setAttribute('opacity', '1');
        dot.classList.add('tracing-beam__dot--active');
      } else {
        dot.setAttribute('opacity', '0');
        dot.classList.remove('tracing-beam__dot--active');
      }
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  function onResize() {
    measurePaths();
    update();
  }

  // ── Init ────────────────────────────────────────────────────
  function init() {
    if (window.innerWidth < 480) return; // skip on small phones
    createOverlay();
    measurePaths();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
