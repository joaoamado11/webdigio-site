/* ============================================================
   Webdigio — Interactive 3D Hero (Blue/Tech Edition)
   Dynamic geometric core, orbiting rings, particles, mouse-driven
   ============================================================ */

(function () {
  'use strict';

  var canvas = document.getElementById('heroCanvas');
  var hero = document.querySelector('.hero');
  if (!canvas || !hero) return;

  var isMobile = window.matchMedia('(max-width: 767px)').matches;
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isMobile || prefersReduced) {
    canvas.style.display = 'none';
    return;
  }

  if (typeof THREE === 'undefined') {
    canvas.style.display = 'none';
    return;
  }

  // --- Scene ---
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(55, hero.clientWidth / hero.clientHeight, 0.1, 50);
  camera.position.z = 10;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(hero.clientWidth, hero.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // --- Lights (blue/cyan tones) ---
  scene.add(new THREE.AmbientLight(0x1a2a44, 1.2));

  var blueLight = new THREE.PointLight(0x3B82F6, 3, 20);
  blueLight.position.set(4, 2, 5);
  scene.add(blueLight);

  var cyanLight = new THREE.PointLight(0x60A5FA, 3, 20);
  cyanLight.position.set(-4, -1, 4);
  scene.add(cyanLight);

  var whiteLight = new THREE.PointLight(0xeef2ff, 1.5, 15);
  whiteLight.position.set(0, 4, 6);
  scene.add(whiteLight);

  // --- Central Core (Icosahedron) ---
  var coreGeo = new THREE.IcosahedronGeometry(1.1, 2);
  var coreMat = new THREE.MeshPhysicalMaterial({
    color: 0x3B82F6,
    metalness: 0.1,
    roughness: 0.1,
    clearcoat: 0.5,
    clearcoatRoughness: 0.08,
    emissive: 0x001133,
    emissiveIntensity: 0.4,
  });
  var core = new THREE.Mesh(coreGeo, coreMat);
  scene.add(core);

  // --- Wireframe outer shell ---
  var shellGeo = new THREE.IcosahedronGeometry(1.4, 1);
  var shellMat = new THREE.MeshBasicMaterial({
    color: 0x60A5FA,
    wireframe: true,
    transparent: true,
    opacity: 0.25,
  });
  var shell = new THREE.Mesh(shellGeo, shellMat);
  scene.add(shell);

  // --- Orbiting Torus Ring 1 ---
  var ring1Geo = new THREE.TorusGeometry(2.2, 0.03, 16, 100);
  var ring1Mat = new THREE.MeshStandardMaterial({
    color: 0x60A5FA,
    metalness: 0.4,
    roughness: 0.25,
    emissive: 0x001122,
    emissiveIntensity: 0.5,
  });
  var ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
  ring1.rotation.x = Math.PI / 2.5;
  scene.add(ring1);

  // --- Orbiting Torus Ring 2 ---
  var ring2Geo = new THREE.TorusGeometry(2.6, 0.025, 16, 100);
  var ring2Mat = new THREE.MeshStandardMaterial({
    color: 0x3B82F6,
    metalness: 0.4,
    roughness: 0.25,
    emissive: 0x001133,
    emissiveIntensity: 0.4,
  });
  var ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.x = -Math.PI / 3;
  ring2.rotation.y = Math.PI / 4;
  scene.add(ring2);

  // --- Orbiting Ring 3 ---
  var ring3Geo = new THREE.TorusGeometry(3.0, 0.02, 16, 80);
  var ring3Mat = new THREE.MeshStandardMaterial({
    color: 0x93C5FD,
    metalness: 0.4,
    roughness: 0.2,
    transparent: true,
    opacity: 0.5,
  });
  var ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
  ring3.rotation.x = Math.PI / 1.8;
  ring3.rotation.y = -Math.PI / 5;
  scene.add(ring3);

  // --- Small orbiting cubes ---
  var cubes = [];
  var cubeColors = [0x3B82F6, 0x60A5FA, 0x2563EB, 0x1D4ED8, 0x93C5FD, 0x4F8AF7];
  for (var c = 0; c < 6; c++) {
    var cubeGeo = new THREE.BoxGeometry(0.15, 0.15, 0.15);
    var cubeMat = new THREE.MeshPhysicalMaterial({
      color: cubeColors[c],
      metalness: 0.15,
      roughness: 0.12,
      clearcoat: 0.5,
    });
    var cube = new THREE.Mesh(cubeGeo, cubeMat);
    cube.userData = {
      orbitRadius: 2.8 + Math.random() * 0.8,
      speed: 0.3 + Math.random() * 0.5,
      offset: (c / 6) * Math.PI * 2,
      axisY: Math.random() * 0.5,
    };
    scene.add(cube);
    cubes.push(cube);
  }

  // --- Particles ---
  var particlesCount = 500;
  var particlesGeo = new THREE.BufferGeometry();
  var positions = new Float32Array(particlesCount * 3);
  for (var p = 0; p < particlesCount; p++) {
    var theta = Math.random() * Math.PI * 2;
    var phi = Math.acos(2 * Math.random() - 1);
    var radius = 3 + Math.random() * 7;
    positions[p * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[p * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[p * 3 + 2] = radius * Math.cos(phi);
  }
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  var particlesMat = new THREE.PointsMaterial({
    color: 0x60A5FA,
    size: 0.04,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    opacity: 0.5,
  });
  var particles = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particles);

  // --- Floating dots ring ---
  var dotsCount = 80;
  var dotsGeo = new THREE.BufferGeometry();
  var dotPositions = new Float32Array(dotsCount * 3);
  var dotRadius = 3.4;
  for (var d = 0; d < dotsCount; d++) {
    var angle = (d / dotsCount) * Math.PI * 2;
    dotPositions[d * 3] = Math.cos(angle) * dotRadius;
    dotPositions[d * 3 + 1] = 0;
    dotPositions[d * 3 + 2] = Math.sin(angle) * dotRadius;
  }
  dotsGeo.setAttribute('position', new THREE.BufferAttribute(dotPositions, 3));
  var dotsMat = new THREE.PointsMaterial({
    color: 0x3B82F6,
    size: 0.06,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  var dots = new THREE.Points(dotsGeo, dotsMat);
  scene.add(dots);

  // --- Mouse Tracking ---
  var mouseX = 0, mouseY = 0;
  var targetMouseX = 0, targetMouseY = 0;

  document.addEventListener('mousemove', function (e) {
    targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  document.addEventListener('touchmove', function (e) {
    if (e.touches.length) {
      targetMouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
    }
  }, { passive: true });

  // --- Click interaction: burst ---
  var burstScale = 1;
  document.addEventListener('click', function () {
    burstScale = 1.3;
  });

  // --- Visibility ---
  var heroVisible = true;
  var observer = new IntersectionObserver(function (entries) {
    heroVisible = entries[0].isIntersecting;
  }, { threshold: 0 });
  observer.observe(hero);
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) heroVisible = false;
  });

  // --- Animation Loop ---
  var clock = new THREE.Clock();

  function animate() {
    if (!heroVisible) {
      requestAnimationFrame(animate);
      return;
    }

    var elapsed = clock.getElapsedTime();

    // Smooth mouse
    mouseX += (targetMouseX - mouseX) * 0.04;
    mouseY += (targetMouseY - mouseY) * 0.04;

    // Burst decay
    burstScale += (1 - burstScale) * 0.08;

    // Core rotation + burst
    core.rotation.x += 0.004;
    core.rotation.y += 0.006;
    core.scale.setScalar(burstScale);

    // Shell counter-rotation
    shell.rotation.x -= 0.003;
    shell.rotation.y -= 0.005;
    shell.rotation.z += 0.002;
    shell.scale.setScalar(burstScale);

    // Camera follows mouse
    camera.position.x += (mouseX * 2 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 1.5 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);

    // Rings rotate at different speeds
    ring1.rotation.z += 0.004;
    ring1.rotation.x += mouseX * 0.002;
    ring2.rotation.z -= 0.005;
    ring2.rotation.y += mouseY * 0.003;
    ring3.rotation.z += 0.003;
    ring3.rotation.x -= mouseX * 0.001;

    // Orbiting cubes
    for (var i = 0; i < cubes.length; i++) {
      var cu = cubes[i];
      var ud = cu.userData;
      var a = elapsed * ud.speed + ud.offset;
      cu.position.x = Math.cos(a) * ud.orbitRadius;
      cu.position.z = Math.sin(a) * ud.orbitRadius;
      cu.position.y = Math.sin(elapsed * 0.4 + ud.offset) * ud.axisY;
      cu.rotation.x += 0.02;
      cu.rotation.y += 0.03;
    }

    // Particles slowly rotate
    particles.rotation.y += 0.0004;
    particles.rotation.x += 0.0002;

    // Dots ring rotate in opposite direction
    dots.rotation.y -= 0.008;
    dots.rotation.z += 0.003;

    // Light animation
    blueLight.intensity = 3 + Math.sin(elapsed * 0.5) * 0.8;
    cyanLight.intensity = 3 + Math.cos(elapsed * 0.6) * 0.8;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  // --- Resize ---
  function onResize() {
    if (!hero || !canvas) return;
    var w = hero.clientWidth;
    var h = hero.clientHeight || 1;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', function () { setTimeout(onResize, 100); });

  animate();
})();
