/* ============================================================
   Tracing Beams — Scroll-driven SVG light beam animation
   Multiple beams with different paths, sizes, and gradients
   that reveal as the user scrolls down the page.
   ============================================================ */

(function () {
  'use strict';

  // ── Beam definitions ──────────────────────────────────────
  // Circuit-board style traces: angular paths (orthogonal + 45°),
  // branching routes, terminating around y=52–60 (middle of page).
  // scrollEnd ~0.50–0.58 means beams finish revealing near mid-page.
  var BEAMS = [
    {
      // Main trunk — starts center-left, runs down then branches right
      path: 'M 12 0 L 12 18 L 28 18 L 28 36 L 18 36 L 18 54 L 22 54 L 22 58',
      width: 1.6,
      colors: ['#A855F7', '#6366F1'],
      opacity: 0.35,
      scrollStart: 0.0,
      scrollEnd: 0.55,
      nodes: [[12,18],[28,18],[28,36],[18,36],[18,54],[22,54]],
      end: [22,58]
    },
    {
      // Branch off trunk at (28,18) — runs parallel then crosses right
      path: 'M 28 18 L 38 18 L 38 32 L 52 32 L 52 50',
      width: 1.0,
      colors: ['#06B6D4', '#22D3EE'],
      opacity: 0.28,
      scrollStart: 0.03,
      scrollEnd: 0.52,
      nodes: [[38,18],[38,32],[52,32]],
      end: [52,50]
    },
    {
      // Center trace — zigzag through the middle
      path: 'M 48 0 L 48 12 L 36 12 L 36 28 L 56 28 L 56 44 L 44 44 L 44 56',
      width: 1.4,
      colors: ['#3B82F6', '#60A5FA'],
      opacity: 0.30,
      scrollStart: 0.02,
      scrollEnd: 0.57,
      nodes: [[48,12],[36,12],[36,28],[56,28],[56,44],[44,44]],
      end: [44,56]
    },
    {
      // Right-of-center — diagonal-routing trace (45°-style via stair-step)
      path: 'M 64 0 L 64 22 L 78 22 L 78 38 L 62 38 L 62 52',
      width: 1.0,
      colors: ['#818CF8', '#A5B4FC'],
      opacity: 0.25,
      scrollStart: 0.04,
      scrollEnd: 0.50,
      nodes: [[64,22],[78,22],[78,38],[62,38]],
      end: [62,52]
    },
    {
      // Right side — dense zigzag, many turns
      path: 'M 82 0 L 82 10 L 90 10 L 90 26 L 76 26 L 76 42 L 86 42 L 86 54',
      width: 1.2,
      colors: ['#8B5CF6', '#C084FC'],
      opacity: 0.28,
      scrollStart: 0.01,
      scrollEnd: 0.54,
      nodes: [[82,10],[90,10],[90,26],[76,26],[76,42],[86,42]],
      end: [86,54]
    },
    {
      // Far right — crosses over to center then ends
      path: 'M 94 0 L 94 14 L 84 14 L 84 34 L 94 34 L 94 50',
      width: 1.8,
      colors: ['#EC4899', '#A855F7'],
      opacity: 0.32,
      scrollStart: 0.05,
      scrollEnd: 0.53,
      nodes: [[94,14],[84,14],[84,34],[94,34]],
      end: [94,50]
    }
  ];

  // ── State ──────────────────────────────────────────────────
  var svg = null;
  var paths = [];
  var dots = [];
  var endpoints = [];  // glowing circles at beam termination points
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

      // Glowing dot at leading edge (hidden initially)
      var dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('r', String(beam.width * 2.5));
      dot.setAttribute('fill', beam.colors[0]);
      dot.setAttribute('opacity', '0');
      dot.setAttribute('filter', 'url(#tracing-beam-glow)');
      dot.setAttribute('class', 'tracing-beam__dot');
      dots.push(dot);
      svg.appendChild(dot);

      // Endpoint pad — circuit-board style termination circle
      var ep = document.createElementNS(NS, 'circle');
      ep.setAttribute('cx', String(beam.end[0]));
      ep.setAttribute('cy', String(beam.end[1]));
      ep.setAttribute('r', String(beam.width * 2));
      ep.setAttribute('fill', 'none');
      ep.setAttribute('stroke', beam.colors[beam.colors.length - 1]);
      ep.setAttribute('stroke-width', String(beam.width * 0.8));
      ep.setAttribute('opacity', '0');
      ep.setAttribute('class', 'tracing-beam__endpoint');
      endpoints.push(ep);
      svg.appendChild(ep);
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

      // Endpoint pad — glow when beam completes (eased > 0.85)
      if (endpoints[i]) {
        var epOpacity = eased > 0.85 ? (eased - 0.85) / 0.15 : 0;
        endpoints[i].setAttribute('opacity', String(epOpacity));
        if (eased > 0.95) {
          endpoints[i].classList.add('tracing-beam__endpoint--lit');
        } else {
          endpoints[i].classList.remove('tracing-beam__endpoint--lit');
        }
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
