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

  // --- Process Accordion ---
  var accordion = document.getElementById('processAccordion');
  if (accordion) {
    var accordionTriggers = accordion.querySelectorAll('.accordion__trigger');
    for (var ai = 0; ai < accordionTriggers.length; ai++) {
      accordionTriggers[ai].addEventListener('click', function () {
        var item = this.parentElement;
        var isActive = item.classList.contains('active');
        // Close all
        var allItems = accordion.querySelectorAll('.accordion__item');
        for (var aj = 0; aj < allItems.length; aj++) {
          allItems[aj].classList.remove('active');
        }
        // Open clicked (unless it was already open)
        if (!isActive) item.classList.add('active');
      });
    }
  }

  // --- Pricing Reveal ---
  var pricingBox = document.querySelector('.pricing-single__box');
  var pricingUpsells = document.querySelector('.pricing-single__upsells');
  var pricingRevealed = false;

  function revealPricing() {
    if (pricingRevealed) return;
    pricingRevealed = true;
    if (pricingBox) pricingBox.classList.add('revealed');
    if (pricingUpsells) pricingUpsells.classList.add('revealed');
  }

  if ('IntersectionObserver' in window && pricingBox) {
    var pricingSection = document.getElementById('preco');
    var pricingObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        revealPricing();
        pricingObserver.disconnect();
      }
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    if (pricingSection) {
      requestAnimationFrame(function () {
        pricingObserver.observe(pricingSection);
      });
    }
  } else {
    setTimeout(revealPricing, 300);
  }

})();
