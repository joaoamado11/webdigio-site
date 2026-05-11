/* ============================================================
   Feature Carousel — Auto-cycling process steps with GSAP
   ============================================================ */

(function () {
  'use strict';

  var carousel = document.getElementById('featureCarousel');
  if (!carousel) return;

  var stepLabel = document.getElementById('fcStepLabel');
  var title = document.getElementById('fcTitle');
  var desc = document.getElementById('fcDesc');
  var img1 = document.getElementById('fcImg1');
  var img2 = document.getElementById('fcImg2');
  var navBtns = document.querySelectorAll('#fcNav .fc-nav__btn');

  var steps = [
    {
      label: 'Step 1', title: 'Contacto inicial',
      desc: 'Falamos por WhatsApp. Percebemos o seu negócio e objetivos. Sem compromisso, 15 minutos.',
      img1: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80',
      img2: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80'
    },
    {
      label: 'Step 2', title: 'Criação rápida',
      desc: 'Desenvolvemos o site em 2 a 5 dias úteis. Design, textos e SEO base incluídos. Pagamento único, sem mensalidades.',
      img1: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      img2: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80'
    },
    {
      label: 'Step 3', title: 'Refinamento',
      desc: 'Após a entrega inicial, recolhemos feedback através de formulário estruturado e otimizamos o conteúdo para o seu negócio.',
      img1: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
      img2: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80'
    },
    {
      label: 'Step 4', title: 'Entrega final',
      desc: 'Site completo, otimizado e pronto para gerar clientes. Com suporte contínuo para o que precisar.',
      img1: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=800&q=80',
      img2: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80'
    }
  ];

  var currentStep = 0;
  var intervalId = null;
  var AUTO_DELAY = 5000;
  var progressStart = 0;
  var progressRaf = null;

  function animateProgress() {
    var elapsed = performance.now() - progressStart;
    var pct = Math.min(1, elapsed / AUTO_DELAY);
    for (var i = 0; i < navBtns.length; i++) {
      var val = i === currentStep ? pct : 0;
      // For completed steps (before current), show full fill
      if (i < currentStep) val = 1;
      navBtns[i].style.setProperty('--fc-progress', val);
    }
    if (pct < 1) {
      progressRaf = requestAnimationFrame(animateProgress);
    }
  }

  function startProgress() {
    if (progressRaf) cancelAnimationFrame(progressRaf);
    // Reset all non-active, non-completed buttons
    for (var i = 0; i < navBtns.length; i++) {
      if (i < currentStep) navBtns[i].style.setProperty('--fc-progress', '1');
      else if (i > currentStep) navBtns[i].style.setProperty('--fc-progress', '0');
    }
    progressStart = performance.now();
    progressRaf = requestAnimationFrame(animateProgress);
  }

  function stopProgress() {
    if (progressRaf) { cancelAnimationFrame(progressRaf); progressRaf = null; }
  }

  function renderStep(direction) {
    var s = steps[currentStep];
    for (var i = 0; i < navBtns.length; i++) {
      navBtns[i].classList.toggle('fc-nav__btn--active', parseInt(navBtns[i].getAttribute('data-step')) === currentStep);
    }
    if (typeof gsap !== 'undefined') {
      var tl = gsap.timeline();
      tl.to([stepLabel, title, desc], { opacity: 0, y: direction > 0 ? -15 : 15, duration: 0.2, stagger: 0.05 })
        .call(function () { stepLabel.textContent = s.label; title.textContent = s.title; desc.textContent = s.desc; })
        .to([stepLabel, title, desc], { opacity: 1, y: 0, duration: 0.3, stagger: 0.05 });
      gsap.to(img1, { opacity: 0, scale: 0.95, duration: 0.2, onComplete: function () {
        img1.src = s.img1; gsap.to(img1, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' });
      }});
      img2.style.display = 'block';
      gsap.to(img2, { opacity: 0, duration: 0.2, onComplete: function () {
        img2.src = s.img2; gsap.to(img2, { opacity: 0.7, duration: 0.4, ease: 'power2.out' });
      }});
    } else {
      stepLabel.textContent = s.label; title.textContent = s.title; desc.textContent = s.desc;
      img1.src = s.img1; img2.src = s.img2;
    }
  }

  function nextStep() { currentStep = (currentStep + 1) % steps.length; renderStep(1); resetTimer(); startProgress(); }

  function resetTimer() {
    if (document.body.classList.contains('carousel-paused')) return;
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(nextStep, AUTO_DELAY);
  }

  for (var i = 0; i < navBtns.length; i++) {
    navBtns[i].addEventListener('click', function () {
      var step = parseInt(this.getAttribute('data-step'));
      if (step === currentStep) return;
      var dir = step > currentStep ? 1 : -1;
      currentStep = step;
      renderStep(dir);
      resetTimer();
      startProgress();
    });
  }

  carousel.addEventListener('mouseenter', function () { if (intervalId) { clearInterval(intervalId); intervalId = null; } stopProgress(); });
  carousel.addEventListener('mouseleave', function () { if (!document.body.classList.contains('carousel-paused')) { resetTimer(); startProgress(); } });
  carousel.addEventListener('mouseleave', function () { resetTimer(); startProgress(); });
  resetTimer();
  startProgress();
})();
