/* ============================================================
   Tracing Beams — Gemini-style animated circuit traces
   Smooth bezier paths with Gaussian blur glow, revealing
   like electric current as the user scrolls down.
   ============================================================ */

(function () {
  'use strict';

  // ── Path definitions ──────────────────────────────────────
  // 5 futuristic vertical circuit traces, warm→cool palette,
  // ending around y=55–60 (mid-page).
  // Each has: main path d, glow color, stroke color, width.
  var BEAMS = [
    {
      // Warm pink — wide flowing S-curve with angular tie-ins
      d: 'M 8 0 C 28 14, -2 28, 18 40 L 18 46 C 6 50, 22 54, 20 58',
      glow: '#FFB7C5',
      stroke: '#FF8FA8',
      width: 2.2,
      scrollStart: 0.0,
      scrollEnd: 0.56
    },
    {
      // Warm peach — angular segments with smooth transitions
      d: 'M 26 0 L 26 14 C 44 20, 24 32, 40 40 L 40 46 C 28 50, 42 54, 36 56',
      glow: '#FFDDB7',
      stroke: '#FFC078',
      width: 1.8,
      scrollStart: 0.02,
      scrollEnd: 0.54
    },
    {
      // Light blue — gentle sweeping wave
      d: 'M 46 0 C 58 18, 34 28, 52 42 C 62 50, 40 54, 50 57',
      glow: '#B1C5FF',
      stroke: '#7EA8FF',
      width: 2.0,
      scrollStart: 0.04,
      scrollEnd: 0.58
    },
    {
      // Cyan — tight zigzag with rounded corners
      d: 'M 64 0 L 64 16 C 78 22, 58 32, 74 42 L 74 50 C 62 53, 70 55, 66 56',
      glow: '#4FABFF',
      stroke: '#2D8FFF',
      width: 1.6,
      scrollStart: 0.01,
      scrollEnd: 0.52
    },
    {
      // Deep blue — dramatic sweep with long curves
      d: 'M 82 0 C 70 16, 92 26, 80 40 C 68 50, 86 54, 82 58',
      glow: '#076EFF',
      stroke: '#0056D6',
      width: 2.4,
      scrollStart: 0.03,
      scrollEnd: 0.55
    }
  ];

  // ── State ──────────────────────────────────────────────────
  var svg = null;
  var paths = [];       // main sharp paths
  var glows = [];       // blurred glow paths behind each sharp path
  var dots = [];        // leading-edge glowing dots
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

    // Wide blur for the glow path duplicates (Gemini-style)
    var blurFilter = document.createElementNS(NS, 'filter');
    blurFilter.setAttribute('id', 'beam-blur');
    blurFilter.setAttribute('x', '-30%');
    blurFilter.setAttribute('y', '-30%');
    blurFilter.setAttribute('width', '160%');
    blurFilter.setAttribute('height', '160%');
    blurFilter.innerHTML = '<feGaussianBlur in="SourceGraphic" stdDeviation="4" />';
    defs.appendChild(blurFilter);

    // Dot glow filter
    var dotFilter = document.createElementNS(NS, 'filter');
    dotFilter.setAttribute('id', 'beam-dot-glow');
    dotFilter.setAttribute('x', '-100%');
    dotFilter.setAttribute('y', '-100%');
    dotFilter.setAttribute('width', '300%');
    dotFilter.setAttribute('height', '300%');
    dotFilter.innerHTML =
      '<feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />' +
      '<feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>';
    defs.appendChild(dotFilter);

    // Create elements for each beam
    BEAMS.forEach(function (beam, i) {
      // Glow path (blurred, always visible, sits behind)
      var glow = document.createElementNS(NS, 'path');
      glow.setAttribute('d', beam.d);
      glow.setAttribute('fill', 'none');
      glow.setAttribute('stroke', beam.glow);
      glow.setAttribute('stroke-width', String(beam.width * 3));
      glow.setAttribute('stroke-linecap', 'round');
      glow.setAttribute('stroke-linejoin', 'round');
      glow.setAttribute('filter', 'url(#beam-blur)');
      glow.setAttribute('opacity', '0.5');
      glow.setAttribute('pathLength', '1');
      glows.push(glow);
      svg.appendChild(glow);

      // Main sharp path (animated)
      var path = document.createElementNS(NS, 'path');
      path.setAttribute('d', beam.d);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', beam.stroke);
      path.setAttribute('stroke-width', String(beam.width));
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      paths.push(path);
      svg.appendChild(path);

      // Leading dot (glowing)
      var dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('r', String(beam.width * 2));
      dot.setAttribute('fill', '#FFFFFF');
      dot.setAttribute('opacity', '0');
      dot.setAttribute('filter', 'url(#beam-dot-glow)');
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

    progress = progress < 0 ? 0 : progress > 1 ? 1 : progress;

    if (Math.abs(progress - lastProgress) < 0.0003) return;
    lastProgress = progress;

    for (var i = 0; i < paths.length; i++) {
      var beam = BEAMS[i];
      var range = beam.scrollEnd - beam.scrollStart;
      var local = range > 0 ? (progress - beam.scrollStart) / range : 0;
      local = local < 0 ? 0 : local > 1 ? 1 : local;

      // Smoothstep ease
      var eased = local * local * (3 - 2 * local);
      // Overshoot slightly at completion (Gemini-style, 0→1.15)
      var reveal = pathLengths[i] * eased * 1.15;
      if (reveal > pathLengths[i]) reveal = pathLengths[i];

      paths[i].setAttribute('stroke-dashoffset', String(pathLengths[i] - reveal));

      // Glow intensity: bright as the current passes, dim otherwise
      glows[i].setAttribute('opacity', String(0.2 + eased * 0.5));

      // Leading dot
      var dot = dots[i];
      if (eased > 0.003 && eased < 0.997) {
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
    if (window.innerWidth < 480) return;
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
