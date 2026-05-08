/* ============================================================
   Tracing Beams — PCB Circuit Branches
   Fine geometric traces that branch/split like circuit boards,
   with subtle traveling light dots and neon glow.
   ============================================================ */

(function () {
  'use strict';

  // 14 traces in 4 branching groups + standalone routes.
  // Each trace: path d, stroke width, colors, vias, endpoint, scroll range, layer (0=fg, 1=bg).
  var TRACES = [
    // ── Group 1: branches from (10,18) ──
    { d:'M 10 0 L 10 18 L 10 32 L 4 32 L 4 44', w:1.1, color:'#A5B4FC', glow:'#6366F1',
      vias:[[10,18],[10,32],[4,32]], end:[4,44], sS:0.00, sE:0.52, bg:0 },
    { d:'M 10 0 L 10 18 L 22 18 L 22 34 L 16 34 L 16 52', w:0.9, color:'#93C5FD', glow:'#4F46E5',
      vias:[[10,18],[22,18],[22,34],[16,34]], end:[16,52], sS:0.01, sE:0.55, bg:0 },
    { d:'M 10 0 L 10 18 L 28 18 L 28 26 L 34 26 L 34 38', w:0.8, color:'#7EA8FF', glow:'#3730A3',
      vias:[[10,18],[28,18],[28,26],[34,26]], end:[34,38], sS:0.02, sE:0.48, bg:1 },

    // ── Group 2: branches from (38,14) ──
    { d:'M 38 0 L 38 14 L 38 30 L 32 30 L 32 42', w:1.0, color:'#A5B4FC', glow:'#6366F1',
      vias:[[38,14],[38,30],[32,30]], end:[32,42], sS:0.00, sE:0.50, bg:0 },
    { d:'M 38 0 L 38 14 L 52 14 L 52 32 L 44 32 L 44 50', w:0.9, color:'#93C5FD', glow:'#4F46E5',
      vias:[[38,14],[52,14],[52,32],[44,32]], end:[44,50], sS:0.03, sE:0.54, bg:0 },
    { d:'M 38 0 L 38 14 L 54 14 L 54 24 L 60 24 L 60 36', w:0.7, color:'#818CF8', glow:'#3730A3',
      vias:[[38,14],[54,14],[54,24],[60,24]], end:[60,36], sS:0.04, sE:0.46, bg:1 },

    // ── Group 3: branches from (62,10) ──
    { d:'M 62 0 L 62 10 L 62 26 L 56 26 L 56 40', w:1.0, color:'#A5B4FC', glow:'#6366F1',
      vias:[[62,10],[62,26],[56,26]], end:[56,40], sS:0.01, sE:0.51, bg:0 },
    { d:'M 62 0 L 62 10 L 74 10 L 74 28 L 68 28 L 68 46', w:0.8, color:'#93C5FD', glow:'#4F46E5',
      vias:[[62,10],[74,10],[74,28],[68,28]], end:[68,46], sS:0.02, sE:0.53, bg:0 },
    { d:'M 62 0 L 62 10 L 78 10 L 78 20 L 84 20 L 84 34', w:0.7, color:'#818CF8', glow:'#3730A3',
      vias:[[62,10],[78,10],[78,20],[84,20]], end:[84,34], sS:0.05, sE:0.47, bg:1 },

    // ── Group 4: branches from (86,8) ──
    { d:'M 86 0 L 86 8 L 86 22 L 80 22 L 80 36', w:1.1, color:'#A5B4FC', glow:'#6366F1',
      vias:[[86,8],[86,22],[80,22]], end:[80,36], sS:0.00, sE:0.49, bg:0 },
    { d:'M 86 0 L 86 8 L 94 8 L 94 24 L 88 24 L 88 42', w:0.9, color:'#93C5FD', glow:'#4F46E5',
      vias:[[86,8],[94,8],[94,24],[88,24]], end:[88,42], sS:0.03, sE:0.52, bg:0 },

    // ── Standalone traces ──
    { d:'M 22 0 L 22 10 L 28 10 L 28 24 L 22 24 L 22 34', w:0.8, color:'#7EA8FF', glow:'#3730A3',
      vias:[[22,10],[28,10],[28,24],[22,24]], end:[22,34], sS:0.04, sE:0.44, bg:1 },
    { d:'M 50 0 L 50 6 L 56 6 L 56 20 L 50 20 L 50 30', w:0.7, color:'#818CF8', glow:'#312E81',
      vias:[[50,6],[56,6],[56,20],[50,20]], end:[50,30], sS:0.06, sE:0.42, bg:1 },
    { d:'M 74 0 L 74 6 L 80 6 L 80 18 L 74 18 L 74 28', w:0.7, color:'#7EA8FF', glow:'#3730A3',
      vias:[[74,6],[80,6],[80,18],[74,18]], end:[74,28], sS:0.07, sE:0.40, bg:1 }
  ];

  // ── State ──────────────────────────────────────────────────
  var svg = null;
  var allTraces = [];
  var pathLengths = [];
  var lastProgress = -1;
  var ticking = false;
  var DOTS_PER_TRACE = 2;

  // ── Build SVG ──────────────────────────────────────────────
  function createOverlay() {
    var NS = 'http://www.w3.org/2000/svg';
    svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'tracing-beams');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');

    var defs = document.createElementNS(NS, 'defs');

    // Neon glow (foreground)
    var gf = document.createElementNS(NS, 'filter');
    gf.setAttribute('id', 'neon');
    gf.setAttribute('x', '-80%'); gf.setAttribute('y', '-80%');
    gf.setAttribute('width', '260%'); gf.setAttribute('height', '260%');
    gf.innerHTML = '<feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b"/>' +
      '<feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>';
    defs.appendChild(gf);

    // Wide blur (background)
    var wf = document.createElementNS(NS, 'filter');
    wf.setAttribute('id', 'wide');
    wf.setAttribute('x', '-80%'); wf.setAttribute('y', '-80%');
    wf.setAttribute('width', '260%'); wf.setAttribute('height', '260%');
    wf.innerHTML = '<feGaussianBlur in="SourceGraphic" stdDeviation="4.5" />';
    defs.appendChild(wf);

    svg.appendChild(defs);

    TRACES.forEach(function (t, i) {
      var trace = { dots:[] };
      var isBg = t.bg === 1;

      // Glow path behind
      var gp = document.createElementNS(NS, 'path');
      gp.setAttribute('d', t.d);
      gp.setAttribute('fill', 'none');
      gp.setAttribute('stroke', t.glow);
      gp.setAttribute('stroke-width', String(t.w * (isBg ? 6 : 4)));
      gp.setAttribute('stroke-linecap', 'round');
      gp.setAttribute('stroke-linejoin', 'round');
      gp.setAttribute('filter', isBg ? 'url(#wide)' : 'url(#neon)');
      gp.setAttribute('opacity', '0');
      gp.setAttribute('pathLength', '1');
      trace.glow = gp;
      svg.appendChild(gp);

      // Sharp main path
      var p = document.createElementNS(NS, 'path');
      p.setAttribute('d', t.d);
      p.setAttribute('fill', 'none');
      p.setAttribute('stroke', t.color);
      p.setAttribute('stroke-width', String(t.w));
      p.setAttribute('stroke-linecap', 'round');
      p.setAttribute('stroke-linejoin', 'round');
      p.setAttribute('opacity', '0');
      trace.path = p;
      svg.appendChild(p);

      // Tiny via circles at turns
      trace.vias = [];
      t.vias.forEach(function (v) {
        var c = document.createElementNS(NS, 'circle');
        c.setAttribute('cx', String(v[0]));
        c.setAttribute('cy', String(v[1]));
        c.setAttribute('r', String(t.w * 0.55));
        c.setAttribute('fill', t.color);
        c.setAttribute('opacity', '0');
        trace.vias.push(c);
        svg.appendChild(c);
      });

      // Small endpoint pad
      var ep = document.createElementNS(NS, 'circle');
      ep.setAttribute('cx', String(t.end[0]));
      ep.setAttribute('cy', String(t.end[1]));
      ep.setAttribute('r', String(t.w * 1.6));
      ep.setAttribute('fill', 'none');
      ep.setAttribute('stroke', t.color);
      ep.setAttribute('stroke-width', String(t.w * 0.6));
      ep.setAttribute('opacity', '0');
      trace.endDot = ep;
      svg.appendChild(ep);

      // Traveling dots (subtle)
      for (var d = 0; d < DOTS_PER_TRACE; d++) {
        var dot = document.createElementNS(NS, 'circle');
        dot.setAttribute('r', String(t.w * 1.2));
        dot.setAttribute('fill', '#FFFFFF');
        dot.setAttribute('opacity', '0');
        trace.dots.push(dot);
        svg.appendChild(dot);
      }

      trace.speed = isBg ? 0.55 : 1.0;
      trace.scrollStart = t.sS;
      trace.scrollEnd = t.sE;
      allTraces.push(trace);
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

    if (Math.abs(progress - lastProgress) < 0.0002) return;
    lastProgress = progress;

    for (var i = 0; i < allTraces.length; i++) {
      var t = allTraces[i];
      var ep = progress * t.speed;
      var range = t.scrollEnd - t.scrollStart;
      var local = range > 0 ? (ep - t.scrollStart) / range : 0;
      local = local < 0 ? 0 : local > 1 ? 1 : local;
      var eased = local * local * (3 - 2 * local);

      // Path reveal
      var reveal = pathLengths[i] * eased;
      t.path.setAttribute('stroke-dashoffset', String(pathLengths[i] - reveal));

      // Fade in/out
      var fi = local < 0.12 ? local / 0.12 : 1;
      var fo = local > 0.88 ? (1 - local) / 0.12 : 1;
      var a = Math.min(fi, fo);
      t.path.setAttribute('opacity', String(a * 0.75));
      t.glow.setAttribute('opacity', String(a * (t.speed < 0.6 ? 0.25 : 0.35)));

      // Vias
      for (var v = 0; v < t.vias.length; v++) {
        t.vias[v].setAttribute('opacity', String(a * 0.55));
      }

      // Endpoint
      t.endDot.setAttribute('opacity', eased > 0.9 ? String((eased - 0.9) / 0.1 * a) : '0');

      // Traveling dots
      for (var d = 0; d < t.dots.length; d++) {
        if (eased < 0.03) { t.dots[d].setAttribute('opacity', '0'); continue; }
        var dp = (eased * 1.08 + d / t.dots.length) % 1.0;
        var pt = t.path.getPointAtLength(dp * pathLengths[i]);
        t.dots[d].setAttribute('cx', String(pt.x));
        t.dots[d].setAttribute('cy', String(pt.y));
        t.dots[d].setAttribute('opacity', String(a * 0.7));
      }
    }
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  function onResize() { measurePaths(); update(); }

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
