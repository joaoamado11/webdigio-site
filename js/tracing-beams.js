/* ============================================================
   Tracing Beams — PCB Circuit Animation
   Elegant geometric traces with traveling light dots,
   bidirectional scroll-reactive flow, neon glow,
   parallax depth layers, and staggered activation.
   ============================================================ */

(function () {
  'use strict';

  // ── PCB Trace definitions ──────────────────────────────────
  // Orthogonal routing (L commands only) with via circles at turns.
  // Foreground: 4 traces, sharper, faster scroll response.
  // Background: 4 traces, wider blur, slower (0.55×) for parallax.
  var FOREGROUND = [
    { d:'M 5 0 L 5 20 L 20 20 L 20 38 L 8 38 L 8 52 L 15 52 L 15 58',
      w:1.8, color:'#93C5FD', glow:'#3B82F6',
      vias:[[5,20],[20,20],[20,38],[8,38],[8,52],[15,52]], end:[15,58],
      sS:0.0, sE:0.55 },
    { d:'M 28 0 L 28 14 L 45 14 L 45 32 L 32 32 L 32 48 L 42 48 L 42 55',
      w:1.4, color:'#7EA8FF', glow:'#2563EB',
      vias:[[28,14],[45,14],[45,32],[32,32],[32,48],[42,48]], end:[42,55],
      sS:0.04, sE:0.58 },
    { d:'M 54 0 L 54 18 L 38 18 L 38 36 L 56 36 L 56 50 L 48 50 L 48 57',
      w:1.6, color:'#A5B4FC', glow:'#4F46E5',
      vias:[[54,18],[38,18],[38,36],[56,36],[56,50],[48,50]], end:[48,57],
      sS:0.02, sE:0.56 },
    { d:'M 78 0 L 78 16 L 62 16 L 62 34 L 75 34 L 75 48 L 68 48 L 68 54',
      w:1.3, color:'#67E8F9', glow:'#0891B2',
      vias:[[78,16],[62,16],[62,34],[75,34],[75,48],[68,48]], end:[68,54],
      sS:0.06, sE:0.54 }
  ];

  var BACKGROUND = [
    { d:'M 15 0 L 15 26 L 32 26 L 32 42 L 18 42 L 18 54',
      w:2.4, color:'#60A5FA', glow:'#1D4ED8', vias:[[15,26],[32,26],[32,42],[18,42]], end:[18,54],
      sS:0.01, sE:0.50 },
    { d:'M 42 0 L 42 16 L 58 16 L 58 34 L 44 34 L 44 50',
      w:2.0, color:'#818CF8', glow:'#3730A3', vias:[[42,16],[58,16],[58,34],[44,34]], end:[44,50],
      sS:0.05, sE:0.52 },
    { d:'M 65 0 L 65 22 L 48 22 L 48 40 L 62 40 L 62 53',
      w:2.2, color:'#38BDF8', glow:'#0369A1', vias:[[65,22],[48,22],[48,40],[62,40]], end:[62,53],
      sS:0.03, sE:0.51 },
    { d:'M 88 0 L 88 18 L 72 18 L 72 36 L 85 36 L 85 52',
      w:1.9, color:'#6366F1', glow:'#312E81', vias:[[88,18],[72,18],[72,36],[85,36]], end:[85,52],
      sS:0.07, sE:0.53 }
  ];

  // ── State ──────────────────────────────────────────────────
  var svg = null;
  var allTraces = [];   // { path, glow, vias:[], endDot, dots:[], speed, scrollStart, scrollEnd, layer }
  var pathLengths = [];
  var lastProgress = -1;
  var lastScrollY = 0;
  var ticking = false;
  var DOT_COUNT = 3;    // traveling dots per trace

  // ── Build SVG ──────────────────────────────────────────────
  function createOverlay() {
    var NS = 'http://www.w3.org/2000/svg';
    svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'tracing-beams');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');

    var defs = document.createElementNS(NS, 'defs');

    // Neon glow filter
    var glowF = document.createElementNS(NS, 'filter');
    glowF.setAttribute('id', 'neon-glow');
    glowF.setAttribute('x', '-50%'); glowF.setAttribute('y', '-50%');
    glowF.setAttribute('width', '200%'); glowF.setAttribute('height', '200%');
    glowF.innerHTML = '<feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b"/>' +
      '<feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>';
    defs.appendChild(glowF);

    // Wide blur for background traces
    var wideF = document.createElementNS(NS, 'filter');
    wideF.setAttribute('id', 'wide-glow');
    wideF.setAttribute('x', '-50%'); wideF.setAttribute('y', '-50%');
    wideF.setAttribute('width', '200%'); wideF.setAttribute('height', '200%');
    wideF.innerHTML = '<feGaussianBlur in="SourceGraphic" stdDeviation="5" />';
    defs.appendChild(wideF);

    svg.appendChild(defs);

    // Build traces: foreground first (on top), then background
    [FOREGROUND, BACKGROUND].forEach(function (layer, layerIdx) {
      layer.forEach(function (beam, i) {
        var trace = { speed: (0.9 + i * 0.06), scrollStart: beam.sS, scrollEnd: beam.sE, layer: layerIdx, dots: [] };
        var isBg = layerIdx === 1;

        // Glow path (behind)
        var gp = document.createElementNS(NS, 'path');
        gp.setAttribute('d', beam.d);
        gp.setAttribute('fill', 'none');
        gp.setAttribute('stroke', beam.glow);
        gp.setAttribute('stroke-width', String(beam.w * (isBg ? 8 : 5)));
        gp.setAttribute('stroke-linecap', 'round');
        gp.setAttribute('stroke-linejoin', 'round');
        gp.setAttribute('filter', isBg ? 'url(#wide-glow)' : 'url(#neon-glow)');
        gp.setAttribute('opacity', '0');
        gp.setAttribute('pathLength', '1');
        trace.glow = gp;
        svg.appendChild(gp);

        // Sharp main path
        var p = document.createElementNS(NS, 'path');
        p.setAttribute('d', beam.d);
        p.setAttribute('fill', 'none');
        p.setAttribute('stroke', beam.color);
        p.setAttribute('stroke-width', String(beam.w));
        p.setAttribute('stroke-linecap', 'round');
        p.setAttribute('stroke-linejoin', 'round');
        p.setAttribute('opacity', '0');
        trace.path = p;
        svg.appendChild(p);

        // Via circles at turn points
        trace.vias = [];
        beam.vias.forEach(function (v) {
          var c = document.createElementNS(NS, 'circle');
          c.setAttribute('cx', String(v[0]));
          c.setAttribute('cy', String(v[1]));
          c.setAttribute('r', String(beam.w * 1.2));
          c.setAttribute('fill', beam.color);
          c.setAttribute('opacity', '0');
          c.setAttribute('filter', 'url(#neon-glow)');
          trace.vias.push(c);
          svg.appendChild(c);
        });

        // Endpoint pad
        var ep = document.createElementNS(NS, 'circle');
        ep.setAttribute('cx', String(beam.end[0]));
        ep.setAttribute('cy', String(beam.end[1]));
        ep.setAttribute('r', String(beam.w * 2.5));
        ep.setAttribute('fill', 'none');
        ep.setAttribute('stroke', beam.color);
        ep.setAttribute('stroke-width', String(beam.w * 0.8));
        ep.setAttribute('opacity', '0');
        ep.setAttribute('filter', 'url(#neon-glow)');
        trace.endDot = ep;
        svg.appendChild(ep);

        // Traveling dots
        for (var d = 0; d < DOT_COUNT; d++) {
          var dot = document.createElementNS(NS, 'circle');
          dot.setAttribute('r', String(beam.w * 1.8));
          dot.setAttribute('fill', '#FFFFFF');
          dot.setAttribute('opacity', '0');
          dot.setAttribute('filter', 'url(#neon-glow)');
          trace.dots.push(dot);
          svg.appendChild(dot);
        }

        allTraces.push(trace);
      });
    });

    document.body.insertBefore(svg, document.body.firstChild);
  }

  // ── Measure ─────────────────────────────────────────────────
  function measurePaths() {
    for (var i = 0; i < allTraces.length; i++) {
      var len = allTraces[i].path.getTotalLength();
      pathLengths[i] = len;
      allTraces[i].path.setAttribute('stroke-dasharray', String(len));
      allTraces[i].path.setAttribute('stroke-dashoffset', String(len));
    }
  }

  // ── Update ──────────────────────────────────────────────────
  function update() {
    ticking = false;

    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? scrollTop / docHeight : 0;
    progress = progress < 0 ? 0 : progress > 1 ? 1 : progress;

    var scrollDelta = scrollTop - lastScrollY;
    var dir = scrollDelta > 0 ? 1 : scrollDelta < 0 ? -1 : 0;
    lastScrollY = scrollTop;

    if (Math.abs(progress - lastProgress) < 0.0003 && dir === 0) return;
    lastProgress = progress;

    for (var i = 0; i < allTraces.length; i++) {
      var t = allTraces[i];
      var isBg = t.layer === 1;

      // Parallax: background traces respond at 0.55× speed
      var effectiveProgress = isBg ? progress * 0.55 : progress;

      // Staggered activation: map effectiveProgress to [0,1] within trace's range
      var range = t.scrollEnd - t.scrollStart;
      var local = range > 0 ? (effectiveProgress - t.scrollStart) / range : 0;
      local = local < 0 ? 0 : local > 1 ? 1 : local;

      // Smoothstep
      var eased = local * local * (3 - 2 * local);

      // Dashoffset reveal
      var reveal = pathLengths[i] * eased;
      t.path.setAttribute('stroke-dashoffset', String(pathLengths[i] - reveal));

      // Opacity: fade in during activation, fade out after completion
      var fadeIn = local < 0.15 ? local / 0.15 : 1;
      var fadeOut = local > 0.85 ? (1 - local) / 0.15 : 1;
      var alpha = Math.min(fadeIn, fadeOut);
      var baseOpacity = isBg ? 0.3 : 0.55;
      t.path.setAttribute('opacity', String(alpha * 0.8));
      t.glow.setAttribute('opacity', String(alpha * baseOpacity));

      // Vias
      for (var v = 0; v < t.vias.length; v++) {
        t.vias[v].setAttribute('opacity', String(alpha * 0.7));
      }

      // Endpoint
      t.endDot.setAttribute('opacity', eased > 0.9 ? String((eased - 0.9) / 0.1) : '0');

      // Traveling dots — flow along path
      for (var d = 0; d < t.dots.length; d++) {
        var dotProgress = (eased * 1.1 + d / t.dots.length) % 1.0;
        if (eased < 0.02) { t.dots[d].setAttribute('opacity', '0'); continue; }
        var pt = t.path.getPointAtLength(dotProgress * pathLengths[i]);
        t.dots[d].setAttribute('cx', String(pt.x));
        t.dots[d].setAttribute('cy', String(pt.y));
        t.dots[d].setAttribute('opacity', String(alpha * 0.9));
      }
    }
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  function onResize() {
    measurePaths();
    update();
  }

  // ── Init ────────────────────────────────────────────────────
  function init() {
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
