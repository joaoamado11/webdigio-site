/* ============================================================
   Webnify — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  // --- DOM Elements ---
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');
  const navLinks = document.querySelectorAll('.nav__link');
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const whatsappFloat = document.getElementById('whatsappFloat');
  const whatsappBtn = document.getElementById('whatsappBtn');
  const emailBtn = document.getElementById('emailBtn');

  // --- Configuration ---
  const CONFIG = {
    whatsappNumber: '351912345678',
    emailAddress: 'geral@webnify.pt',
  };

  // --- Sticky Header ---
  function handleScroll() {
    const scrolled = window.scrollY > 20;
    header.classList.toggle('header--scrolled', scrolled);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // initial check

  // --- Mobile Navigation ---
  navToggle.addEventListener('click', function () {
    this.classList.toggle('active');
    navList.classList.toggle('active');
    document.body.style.overflow = navList.classList.contains('active') ? 'hidden' : '';
  });

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('active');
      navList.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --- WhatsApp Integration ---
  function getWhatsAppURL(message) {
    var encoded = encodeURIComponent(message || 'Olá Webnify! Gostaria de criar um site para o meu negócio.');
    return 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encoded;
  }

  if (whatsappFloat) {
    whatsappFloat.href = getWhatsAppURL();
  }

  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.open(getWhatsAppURL(), '_blank');
    });
  }

  // --- Email ---
  if (emailBtn) {
    emailBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.href = 'mailto:' + CONFIG.emailAddress + '?subject=Contacto%20Webnify%20-%20Pedido%20de%20Orçamento';
    });
  }

  // --- Contact Form ---
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var formData = {
        name: document.getElementById('name').value.trim(),
        business: document.getElementById('business').value.trim(),
        whatsapp: document.getElementById('whatsapp').value.trim(),
        message: document.getElementById('message').value.trim(),
      };

      if (!formData.name || !formData.whatsapp) {
        shakeElement(contactForm);
        return;
      }

      // Attempt to send via FormSubmit or similar service
      // Falls back to WhatsApp message if no backend configured
      var whatsappMsg =
        'Olá Webnify!%0A%0A' +
        'Nome: ' + encodeURIComponent(formData.name) + '%0A' +
        'Negócio: ' + encodeURIComponent(formData.business || 'Não especificado') + '%0A' +
        'WhatsApp: ' + encodeURIComponent(formData.whatsapp) + '%0A' +
        'Mensagem: ' + encodeURIComponent(formData.message || 'N/A');

      // Try form submission endpoint if configured
      var formAction = contactForm.getAttribute('action');
      if (formAction) {
        var submitData = new FormData(contactForm);
        fetch(formAction, { method: 'POST', body: submitData })
          .then(function (res) {
            if (res.ok) showSuccess();
            else fallbackToWhatsApp(whatsappMsg);
          })
          .catch(function () {
            fallbackToWhatsApp(whatsappMsg);
          });
      } else {
        // No backend: show success and offer WhatsApp
        showSuccess();
        // Open WhatsApp as backup
        setTimeout(function () {
          window.open('https://wa.me/' + CONFIG.whatsappNumber + '?text=' + whatsappMsg, '_blank');
        }, 1500);
      }
    });
  }

  function showSuccess() {
    if (contactForm) contactForm.style.display = 'none';
    if (formSuccess) formSuccess.style.display = 'flex';
  }

  function fallbackToWhatsApp(msg) {
    showSuccess();
    window.open('https://wa.me/' + CONFIG.whatsappNumber + '?text=' + msg, '_blank');
  }

  function shakeElement(el) {
    el.style.animation = 'none';
    el.offsetHeight; // trigger reflow
    el.style.animation = 'shake .5s ease';
    setTimeout(function () {
      el.style.animation = '';
    }, 500);
  }

  // --- Scroll Reveal Animation ---
  var revealElements = [];
  var observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };

  function initReveal() {
    var sections = document.querySelectorAll(
      '.problem__card, .service__card, .diff__card, .target__card, .process__step, .strategy__card, .pricing__box'
    );
    sections.forEach(function (el) {
      el.classList.add('reveal');
    });
    revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      revealElements.forEach(function (el) { observer.observe(el); });
    } else {
      // Fallback: show all immediately
      revealElements.forEach(function (el) { el.classList.add('visible'); });
    }
  }

  // --- Animate hero stats counting ---
  function animateStats() {
    var statNumbers = document.querySelectorAll('.hero__stat-number');
    var animated = false;

    function runAnimation() {
      if (animated) return;
      var hero = document.querySelector('.hero');
      if (!hero) return;
      var rect = hero.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      animated = true;
      statNumbers.forEach(function (el) {
        var text = el.textContent;
        // Only animate pure numbers
        if (/^\d[\d.,]*$/.test(text.trim())) {
          animateNumber(el, text.trim());
        }
      });
    }

    window.addEventListener('scroll', runAnimation, { passive: true });
    runAnimation();
  }

  function animateNumber(el, raw) {
    var target = parseInt(raw.replace(/[^0-9]/g, ''), 10);
    var suffix = raw.replace(/^[\d.,]+/, '');
    var prefix = raw.match(/^[^\d]*/) ? raw.match(/^[^\d]*/)[0] : '';
    var duration = 1500;
    var start = performance.now();

    function tick(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(target * eased);
      el.textContent = prefix + current + suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  // --- Initialize ---
  function init() {
    initReveal();
    animateStats();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
