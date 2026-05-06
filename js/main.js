/* ============================================================
   Webdigio — Main JavaScript
   Navigation, contact form, WhatsApp
   ============================================================ */

(function () {
  'use strict';

  // --- Scroll to top on refresh ---
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // --- DOM Elements ---
  var header = document.getElementById('header');
  var navToggle = document.getElementById('navToggle');
  var navList = document.getElementById('navList');
  var navLinks = document.querySelectorAll('.nav__link');
  var contactForm = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');
  var whatsappFloat = document.getElementById('whatsappFloat');
  var whatsappBtn = document.getElementById('whatsappBtn');
  var emailBtn = document.getElementById('emailBtn');

  // --- Configuration ---
  var CONFIG = {
    whatsappNumber: '351912345678',
    emailAddress: 'geral@webdigio.pt',
  };

  // --- Sticky Header ---
  function handleScroll() {
    var scrolled = window.scrollY > 40;
    if (header) header.classList.toggle('header--scrolled', scrolled);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- Mobile Navigation ---
  if (navToggle && navList) {
    navToggle.addEventListener('click', function () {
      this.classList.toggle('active');
      navList.classList.toggle('active');
      document.body.style.overflow = navList.classList.contains('active') ? 'hidden' : '';
    });

    for (var i = 0; i < navLinks.length; i++) {
      navLinks[i].addEventListener('click', function () {
        navToggle.classList.remove('active');
        navList.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  }

  // --- Smooth Scroll for Anchor Links ---
  var allAnchors = document.querySelectorAll('a[href^="#"]');
  for (var a = 0; a < allAnchors.length; a++) {
    allAnchors[a].addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // --- WhatsApp Integration ---
  function getWhatsAppURL(message) {
    var encoded = encodeURIComponent(message || 'Olá Webdigio! Gostaria de criar um site para o meu negócio.');
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
      window.location.href = 'mailto:' + CONFIG.emailAddress + '?subject=Contacto%20Webdigio%20-%20Pedido%20de%20Informa%C3%A7%C3%B5es';
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

      var whatsappMsg =
        'Olá Webdigio!%0A%0A' +
        'Nome: ' + encodeURIComponent(formData.name) + '%0A' +
        'Negócio: ' + encodeURIComponent(formData.business || 'Não especificado') + '%0A' +
        'WhatsApp: ' + encodeURIComponent(formData.whatsapp) + '%0A' +
        'Mensagem: ' + encodeURIComponent(formData.message || 'N/A');

      showSuccess();
      setTimeout(function () {
        window.open('https://wa.me/' + CONFIG.whatsappNumber + '?text=' + whatsappMsg, '_blank');
      }, 1500);
    });
  }

  function showSuccess() {
    if (contactForm) contactForm.style.display = 'none';
    if (formSuccess) formSuccess.style.display = 'flex';
  }

  function shakeElement(el) {
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = 'shake .5s ease';
    setTimeout(function () {
      el.style.animation = '';
    }, 500);
  }

  // --- Pricing Toggle ---
  var pricingToggle = document.getElementById('pricingToggle');
  if (pricingToggle) {
    var toggleBtns = pricingToggle.querySelectorAll('.pricing-toggle__btn');
    var indicator = document.createElement('span');
    indicator.className = 'pricing-toggle__indicator';
    pricingToggle.appendChild(indicator);

    var amountEls = document.querySelectorAll('.pricing-card__amount');
    var periodEls = document.querySelectorAll('.pricing-card__period');
    var currentPeriod = 'monthly';
    var pricesAnimated = false;

    function updateCards(period, animate) {
      currentPeriod = period;
      for (var i = 0; i < amountEls.length; i++) {
        var el = amountEls[i];
        var val = period === 'yearly' ? el.getAttribute('data-yearly') : el.getAttribute('data-monthly');
        if (animate) {
          animatePrice(el, val);
        } else {
          el.textContent = val;
        }
      }
      for (var j = 0; j < periodEls.length; j++) {
        periodEls[j].textContent = period === 'yearly' ? '/ano' : '/mês';
      }
      indicator.className = 'pricing-toggle__indicator' + (period === 'yearly' ? ' yearly' : '');
    }

    function animatePrice(el, target) {
      var current = parseInt(el.textContent, 10);
      var targetVal = parseInt(target, 10);
      if (current === targetVal) return;
      var duration = 500;
      var start = performance.now();
      function step(now) {
        var progress = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(current + (targetVal - current) * eased);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    for (var t = 0; t < toggleBtns.length; t++) {
      toggleBtns[t].addEventListener('click', function () {
        var period = this.getAttribute('data-period');
        for (var b = 0; b < toggleBtns.length; b++) {
          toggleBtns[b].classList.remove('active');
        }
        this.classList.add('active');
        updateCards(period, true);
      });
    }

    // Scroll-triggered card reveal
    var pricingCards = document.querySelectorAll('.pricing-card');
    for (var pc = 0; pc < pricingCards.length; pc++) {
      pricingCards[pc].style.opacity = '0';
      pricingCards[pc].style.transform = 'translateY(30px)';
      pricingCards[pc].style.filter = 'blur(10px)';
      pricingCards[pc].style.transition = 'opacity 0.5s ease, transform 0.5s ease, filter 0.5s ease';
    }

    function revealCards() {
      if (pricesAnimated) return;
      pricesAnimated = true;
      for (var i = 0; i < pricingCards.length; i++) {
        (function (idx) {
          setTimeout(function () {
            pricingCards[idx].style.opacity = '1';
            pricingCards[idx].style.transform = 'translateY(0)';
            pricingCards[idx].style.filter = 'blur(0px)';
          }, idx * 150);
        })(i);
      }
    }

    if ('IntersectionObserver' in window) {
      var pricingSection = document.getElementById('preco');
      var observer = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          revealCards();
          observer.disconnect();
        }
      }, { threshold: 0.2 });
      if (pricingSection) observer.observe(pricingSection);
    } else {
      revealCards();
    }
  }

})();
