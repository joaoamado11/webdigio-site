/* ============================================================
   Webdigio — Hero Particle Network (port from AetherFlow)
   Canvas-based connected particles, revealed as globe fades
   ============================================================ */

(function () {
  'use strict';

  var canvas = document.getElementById('heroParticles');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var particles = [];
  var mouse = { x: null, y: null, radius: 200 };
  var animId = null;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // ---- Particle class ----
  function Particle() {
    this.size = Math.random() * 2 + 1;
    this.x = Math.random() * (innerWidth - this.size * 2) + this.size * 2;
    this.y = Math.random() * (innerHeight - this.size * 2) + this.size * 2;
    this.dx = (Math.random() * 0.4) - 0.2;
    this.dy = (Math.random() * 0.4) - 0.2;
    this.color = 'rgba(59, 130, 246, 0.8)';
  }

  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  };

  Particle.prototype.update = function () {
    if (this.x > canvas.width || this.x < 0) this.dx = -this.dx;
    if (this.y > canvas.height || this.y < 0) this.dy = -this.dy;

    if (mouse.x !== null && mouse.y !== null) {
      var dx = mouse.x - this.x;
      var dy = mouse.y - this.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius + this.size) {
        var fx = dx / dist;
        var fy = dy / dist;
        var force = (mouse.radius - dist) / mouse.radius;
        this.x -= fx * force * 5;
        this.y -= fy * force * 5;
      }
    }

    this.x += this.dx;
    this.y += this.dy;
    this.draw();
  };

  function init() {
    particles = [];
    var count = Math.floor((canvas.height * canvas.width) / 9000);
    for (var i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connect() {
    for (var a = 0; a < particles.length; a++) {
      for (var b = a; b < particles.length; b++) {
        var dx = particles[a].x - particles[b].x;
        var dy = particles[a].y - particles[b].y;
        var distSq = dx * dx + dy * dy;
        var threshold = (canvas.width / 7) * (canvas.height / 7);

        if (distSq < threshold) {
          var opacity = 1 - (distSq / 20000);

          var mouseNear = mouse.x !== null && mouse.y !== null;
          var dmx = particles[a].x - (mouse.x || 0);
          var dmy = particles[a].y - (mouse.y || 0);
          var mouseDist = Math.sqrt(dmx * dmx + dmy * dmy);
          var mouseAtEdge = mouseNear && mouseDist < mouse.radius;

          ctx.strokeStyle = mouseAtEdge
            ? 'rgba(255, 255, 255, ' + opacity + ')'
            : 'rgba(59, 130, 246, ' + opacity + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    animId = requestAnimationFrame(animate);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < particles.length; i++) {
      particles[i].update();
    }
    connect();
  }

  // ---- Events ----
  window.addEventListener('resize', function () {
    resize();
    init();
  });

  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', function () {
    mouse.x = null;
    mouse.y = null;
  });

  // ---- Start ----
  resize();
  init();
  animate();
})();
