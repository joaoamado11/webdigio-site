/* ============================================================
   Webdigio — Scroll-Expand Hero (bidirectional)
   Driven by GSAP ScrollTrigger with pin + scrub
   Includes word-by-word DigitalSerenity entrance & fade-out
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
  var wordSpans = [];

  // ---- Split element text into word spans ----
  function splitIntoWords(el, stagger) {
    if (!el) return [];
    var text = el.textContent.trim();
    var words = text.split(/\s+/);
    el.innerHTML = '';
    var spans = [];
    words.forEach(function (word, i) {
      var span = document.createElement('span');
      span.className = 'word-animate';
      span.dataset.index = i;
      span.textContent = word;
      span.style.setProperty('--delay', (i * stagger).toFixed(3) + 's');
      el.appendChild(span);
      if (i < words.length - 1) {
        el.appendChild(document.createTextNode(' '));
      }
      spans.push(span);
    });
    return spans;
  }

  // ---- Entrance: trigger word-appear animation ----
  function animateWordsIn() {
    wordSpans.forEach(function (sp) {
      sp.classList.add('word-animate--visible');
    });
  }

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

    // Hint fades quickly
    if (hint) hint.style.opacity = Math.max(0, 1 - p * 3);

    // Background fades out (revealing particles underneath)
    if (bg) bg.style.opacity = Math.max(0, 1 - p);

    // --- Word-by-word staggered fade-out ---
    var n = wordSpans.length;
    if (n > 0) {
      for (var i = 0; i < n; i++) {
        // Each word starts fading when progress passes its threshold
        // threshold = i / n  (0 to 1), word fully faded at (i+1)/n
        var threshold = i / n;
        var fadeP = Math.max(0, Math.min(1, (p - threshold) * n));
        wordSpans[i].style.opacity = 1 - fadeP;
        wordSpans[i].style.transform = 'translateY(' + (-fadeP * 25) + 'px)';
        wordSpans[i].style.filter = 'blur(' + (fadeP * 8) + 'px)';
      }
    } else {
      // Fallback: fade whole elements
      if (heroTitle) heroTitle.style.opacity = Math.max(0, 1 - p * 1.3);
      if (tagline) tagline.style.opacity = Math.max(0, 1 - p * 1.5);
    }

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

  // ---- Init words + entrance ----
  function initWords() {
    // If words were already split, don't do it again
    if (heroTitle && !heroTitle.querySelector('.word-animate')) {
      var titleWords = splitIntoWords(heroTitle, 0.12);
      var tagWords = tagline ? splitIntoWords(tagline, 0.06) : [];
      wordSpans = titleWords.concat(tagWords);
      // Trigger entrance after a tiny delay (post-reveal)
      setTimeout(animateWordsIn, 100);
    }
  }

  // Wait for hero reveal (after loader)
  function waitForReveal() {
    if (document.querySelector('.hero--reveal')) {
      initWords();
      createScrollTrigger();
    } else {
      setTimeout(waitForReveal, 150);
    }
  }

  waitForReveal();
})();
