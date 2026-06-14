"use strict";

// Keep all page behavior in this file so the HTML stays clean and easy to scan.
document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  setupNavbar();
  setupSplitText();
  setupRevealAnimations();
  setupSkillBars();
  setupTiltCards();
  setupMagneticLinks();
  setupHeroScene();
  setupShowcaseScene();
});

function setupNavbar() {
  const navbar = document.querySelector(".site-navbar");
  const links = document.querySelectorAll(".navbar .nav-link, .navbar .nav-cta");
  const collapse = document.getElementById("mainNavbar");
  const bsCollapse = collapse && window.bootstrap ? new bootstrap.Collapse(collapse, { toggle: false }) : null;

  const updateNavbar = () => {
    if (!navbar) return;
    navbar.classList.toggle("nav-scrolled", window.scrollY > 20);
  };

  updateNavbar();
  window.addEventListener("scroll", updateNavbar, { passive: true });

  links.forEach((link) => {
    link.addEventListener("click", () => {
      if (bsCollapse && collapse.classList.contains("show")) {
        bsCollapse.hide();
      }
    });
  });
}

function setupSplitText() {
  if (!window.SplitType) return;

  document.querySelectorAll(".hero-title, .hero-subtitle, .section-title").forEach((element) => {
    if (!element.dataset.splitReady) {
      new SplitType(element, { types: "words" });
      element.dataset.splitReady = "true";
    }
  });
}

function setupRevealAnimations() {
  const revealItems = document.querySelectorAll(".reveal");

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    const standardRevealItems = Array.from(revealItems).filter(
      (item) => !item.matches(".hero-title, .hero-subtitle, .hero-portrait-card")
    );

    gsap.set(standardRevealItems, { autoAlpha: 0, y: 28, rotateX: 7, transformPerspective: 900 });
    gsap.set(".hero-title, .hero-subtitle, .hero-portrait-card", { autoAlpha: 1, y: 0, rotateX: 0 });

    standardRevealItems.forEach((item) => {
      gsap.to(item, {
        autoAlpha: 1,
        y: 0,
        rotateX: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 88%",
          once: true
        }
      });
    });

    const heroWords = document.querySelectorAll(".hero-title .word, .hero-subtitle .word");
    if (heroWords.length) {
      gsap.fromTo(
        heroWords,
        { yPercent: 105, rotateX: -70, autoAlpha: 0 },
        {
          yPercent: 0,
          rotateX: 0,
          autoAlpha: 1,
          duration: 1.05,
          ease: "power4.out",
          stagger: 0.055,
          delay: 0.12
        }
      );
    } else {
      gsap.fromTo(
        ".hero-title, .hero-subtitle",
        { y: 34, rotateX: 12, autoAlpha: 0 },
        { y: 0, rotateX: 0, autoAlpha: 1, duration: 1.1, ease: "power3.out", stagger: 0.12 }
      );
    }

    gsap.fromTo(
      ".hero-portrait-frame",
      { y: 130, scale: 0.94, autoAlpha: 0, rotateX: -10 },
      { y: 0, scale: 1, autoAlpha: 1, rotateX: 0, duration: 1.25, ease: "power4.out", delay: 0.35 }
    );

    gsap.to(".hero-metrics .metric-item", {
      y: -10,
      duration: 2.4,
      ease: "sine.inOut",
      stagger: 0.18,
      repeat: -1,
      yoyo: true
    });

    return;
  }

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function setupSkillBars() {
  const skillRows = document.querySelectorAll(".skill-row");

  const fillBar = (row) => {
    const progressBar = row.querySelector(".progress-bar");
    const level = row.dataset.level || "0";
    if (progressBar) {
      progressBar.style.width = `${level}%`;
    }
  };

  if (!("IntersectionObserver" in window)) {
    skillRows.forEach(fillBar);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fillBar(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.35 }
  );

  skillRows.forEach((row) => observer.observe(row));
}

function setupTiltCards() {
  if (!window.VanillaTilt) return;

  const tiltTargets = document.querySelectorAll(
    ".profile-card, .service-card, .skills-panel, .toolbox-card, .project-card, .testimonial-card, .testimonial-feature-card, .testimonial-stat, .contact-3d-panel, .contact-method, .footer-panel, .footer-cta"
  );

  VanillaTilt.init(tiltTargets, {
    max: 7,
    speed: 650,
    scale: 1.015,
    glare: true,
    "max-glare": 0.16,
    perspective: 1100
  });
}

function setupPremiumSectionAnimations() {
  if (!window.gsap || !window.ScrollTrigger) return;

  const motion = gsap.matchMedia();

  document.querySelectorAll(".section-title").forEach((title) => {
    const words = title.querySelectorAll(".word");
    if (!words.length) return;

    gsap.from(words, {
      scrollTrigger: {
        trigger: title,
        start: "top 86%",
        once: true
      },
      yPercent: 70,
      rotateX: -45,
      autoAlpha: 0,
      duration: 0.85,
      ease: "power3.out",
      stagger: 0.035
    });
  });

  motion.add("(min-width: 768px)", () => {
    gsap.from(".service-card .card-icon", {
      scrollTrigger: {
        trigger: "#services",
        start: "top 70%",
        once: true
      },
      autoAlpha: 0,
      y: 28,
      rotateY: -70,
      scale: 0.72,
      duration: 0.9,
      ease: "back.out(1.8)",
      stagger: 0.08
    });

    gsap.from(".service-card .service-number", {
      scrollTrigger: {
        trigger: "#services",
        start: "top 70%",
        once: true
      },
      autoAlpha: 0,
      x: 26,
      duration: 0.85,
      ease: "power3.out",
      stagger: 0.06
    });

    gsap.from(".service-card h3, .service-card p, .service-card .service-link", {
      scrollTrigger: {
        trigger: "#services",
        start: "top 70%",
        once: true
      },
      autoAlpha: 0,
      y: 18,
      duration: 0.75,
      ease: "power3.out",
      stagger: 0.035
    });

    gsap.to(".service-card .card-icon", {
      y: -7,
      rotateZ: 3,
      duration: 2.6,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      stagger: 0.18
    });
  });

  gsap.from(".testimonial-feature-card .quote-icon", {
    scrollTrigger: {
      trigger: "#testimonials",
      start: "top 72%",
      once: true
    },
    autoAlpha: 0,
    scale: 0.45,
    rotate: -18,
    duration: 0.9,
    ease: "back.out(1.8)"
  });

  gsap.from(".testimonial-card .mini-quote", {
    scrollTrigger: {
      trigger: "#testimonials",
      start: "top 66%",
      once: true
    },
    autoAlpha: 0,
    y: 20,
    rotateY: -55,
    duration: 0.8,
    ease: "back.out(1.7)",
    stagger: 0.12
  });

  gsap.from(".testimonial-stat span", {
    scrollTrigger: {
      trigger: ".testimonial-stat",
      start: "top 82%",
      once: true
    },
    autoAlpha: 0,
    y: 18,
    scale: 0.9,
    duration: 0.65,
    ease: "power3.out",
    stagger: 0.08
  });

  gsap.to(".stars i", {
    y: -3,
    duration: 1.1,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    stagger: 0.06
  });

  gsap.to(".testimonial-stat span", {
    y: -5,
    duration: 2.4,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    stagger: 0.14
  });

  gsap.to(".contact-method .method-icon", {
    rotateZ: 4,
    y: -4,
    duration: 2.2,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    stagger: 0.16
  });
}

function setupMagneticLinks() {
  const links = document.querySelectorAll(".magnetic-link");

  links.forEach((link) => {
    link.addEventListener("pointermove", (event) => {
      const rect = link.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      link.style.transform = `translate3d(${x * 0.14}px, ${y * 0.14}px, 18px)`;
    });

    link.addEventListener("pointerleave", () => {
      link.style.transform = "";
    });
  });
}

function setupHeroScene() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas || !window.THREE) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 0, 8);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: "high-performance"
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));

  const group = new THREE.Group();
  scene.add(group);

  const particleCount = 72;
  const positions = new Float32Array(particleCount * 3);
  const basePositions = [];

  for (let index = 0; index < particleCount; index += 1) {
    const x = (Math.random() - 0.5) * 11;
    const y = (Math.random() - 0.5) * 6.2;
    const z = (Math.random() - 0.5) * 4;
    positions[index * 3] = x;
    positions[index * 3 + 1] = y;
    positions[index * 3 + 2] = z;
    basePositions.push({ x, y, z, speed: 0.45 + Math.random() * 0.8 });
  }

  const pointGeometry = new THREE.BufferGeometry();
  pointGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const pointMaterial = new THREE.PointsMaterial({
    color: 0x2563eb,
    size: 0.045,
    transparent: true,
    opacity: 0.72
  });

  const points = new THREE.Points(pointGeometry, pointMaterial);
  group.add(points);

  const lineGeometry = new THREE.BufferGeometry();
  const linePositions = new Float32Array((particleCount - 1) * 6);
  lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x06b6d4,
    transparent: true,
    opacity: 0.12
  });

  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  group.add(lines);

  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x0f172a,
    wireframe: true,
    transparent: true,
    opacity: 0.16
  });

  const ring = new THREE.Mesh(new THREE.TorusKnotGeometry(1.15, 0.16, 96, 10), ringMaterial);
  ring.position.set(3.4, -0.6, -1.8);
  group.add(ring);

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1.35, 1.35, 1.35),
    new THREE.MeshBasicMaterial({
      color: 0x2563eb,
      wireframe: true,
      transparent: true,
      opacity: 0.17
    })
  );
  cube.position.set(4.2, 1.8, -2.2);
  group.add(cube);

  const panelGroup = new THREE.Group();
  const panelMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide
  });
  const accentPanelMaterial = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    transparent: true,
    opacity: 0.14,
    side: THREE.DoubleSide
  });

  [
    { x: -3.9, y: 1.7, z: -2.1, w: 1.45, h: 0.74, ry: 0.38, material: panelMaterial },
    { x: -4.45, y: -1.25, z: -1.4, w: 1.1, h: 0.58, ry: -0.22, material: accentPanelMaterial },
    { x: 2.55, y: 2.75, z: -2.9, w: 1.34, h: 0.68, ry: -0.48, material: panelMaterial },
    { x: 4.75, y: -1.82, z: -1.8, w: 1.2, h: 0.62, ry: 0.3, material: accentPanelMaterial }
  ].forEach((panel) => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(panel.w, panel.h), panel.material);
    mesh.position.set(panel.x, panel.y, panel.z);
    mesh.rotation.y = panel.ry;
    mesh.userData.baseY = panel.y;
    panelGroup.add(mesh);
  });
  group.add(panelGroup);

  const pointer = { x: 0, y: 0 };
  const onPointerMove = (event) => {
    pointer.x = (event.clientX / window.innerWidth - 0.5) * 0.7;
    pointer.y = (event.clientY / window.innerHeight - 0.5) * 0.7;
  };

  window.addEventListener("pointermove", onPointerMove, { passive: true });

  const updateSize = () => {
    const rect = canvas.parentElement.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  updateSize();
  window.addEventListener("resize", updateSize);

  let frameId = 0;
  const clock = new THREE.Clock();

  const animate = () => {
    const elapsed = clock.getElapsedTime();
    const positionArray = pointGeometry.attributes.position.array;
    const lineArray = lineGeometry.attributes.position.array;

    for (let index = 0; index < particleCount; index += 1) {
      const base = basePositions[index];
      const offset = index * 3;
      positionArray[offset] = base.x + Math.sin(elapsed * base.speed + index) * 0.08;
      positionArray[offset + 1] = base.y + Math.cos(elapsed * base.speed + index * 0.4) * 0.08;
      positionArray[offset + 2] = base.z + Math.sin(elapsed * 0.45 + index) * 0.05;
    }

    for (let index = 0; index < particleCount - 1; index += 1) {
      const source = index * 3;
      const target = (index + 1) * 3;
      const line = index * 6;
      lineArray[line] = positionArray[source];
      lineArray[line + 1] = positionArray[source + 1];
      lineArray[line + 2] = positionArray[source + 2];
      lineArray[line + 3] = positionArray[target];
      lineArray[line + 4] = positionArray[target + 1];
      lineArray[line + 5] = positionArray[target + 2];
    }

    pointGeometry.attributes.position.needsUpdate = true;
    lineGeometry.attributes.position.needsUpdate = true;

    group.rotation.y += (pointer.x - group.rotation.y) * 0.025;
    group.rotation.x += (-pointer.y * 0.35 - group.rotation.x) * 0.025;
    ring.rotation.x = elapsed * 0.18;
    ring.rotation.y = elapsed * 0.28;
    cube.rotation.x = elapsed * 0.22;
    cube.rotation.y = elapsed * 0.32;
    panelGroup.children.forEach((panel, index) => {
      panel.position.y = panel.userData.baseY + Math.sin(elapsed * 1.1 + index) * 0.08;
      panel.rotation.z = Math.sin(elapsed * 0.6 + index) * 0.035;
    });

    renderer.render(scene, camera);
    frameId = requestAnimationFrame(animate);
  };

  animate();

  window.addEventListener("beforeunload", () => {
    cancelAnimationFrame(frameId);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("resize", updateSize);
    renderer.dispose();
  });
}

function setupShowcaseScene() {
  const canvas = document.getElementById("showcase-canvas");
  if (!canvas || !window.THREE) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(4.2, 3.1, 8.5);
  camera.lookAt(0, 0.5, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

  const laptop = createLaptopModel();
  laptop.position.set(1.9, -0.65, 0);
  laptop.rotation.y = -0.38;
  scene.add(laptop);
  let laptopBaseY = -0.65;

  const lights = [
    new THREE.AmbientLight(0xffffff, 0.95),
    new THREE.DirectionalLight(0xffffff, 0.85),
    new THREE.PointLight(0x06b6d4, 1.6, 12),
    new THREE.PointLight(0x2563eb, 1.3, 12)
  ];
  lights[1].position.set(4, 6, 5);
  lights[2].position.set(-3, 2, 4);
  lights[3].position.set(4, -1, 3);
  lights.forEach((light) => scene.add(light));

  const pointer = { x: 0, y: 0 };
  const onPointerMove = (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 0.9;
    pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 0.9;
  };
  canvas.addEventListener("pointermove", onPointerMove, { passive: true });

  const updateSize = () => {
    const rect = canvas.parentElement.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    if (width < 760) {
      camera.position.set(3.1, 2.7, 8.7);
      laptopBaseY = -1.1;
      laptop.position.set(0.6, laptopBaseY, 0);
      laptop.scale.setScalar(0.82);
    } else {
      camera.position.set(4.2, 3.1, 8.5);
      laptopBaseY = -0.65;
      laptop.position.set(1.9, laptopBaseY, 0);
      laptop.scale.setScalar(1);
    }

    camera.lookAt(0.4, 0.35, 0);
  };

  updateSize();
  window.addEventListener("resize", updateSize);

  let frameId = 0;
  const clock = new THREE.Clock();

  const animate = () => {
    const elapsed = clock.getElapsedTime();

    laptop.rotation.y += (-0.38 + pointer.x * 0.38 - laptop.rotation.y) * 0.035;
    laptop.rotation.x += (pointer.y * 0.16 - laptop.rotation.x) * 0.035;
    laptop.position.y += (laptopBaseY + Math.sin(elapsed * 1.2) * 0.08 - laptop.position.y) * 0.05;

    laptop.children.forEach((child, index) => {
      if (child.userData.floatPanel) {
        child.position.y = child.userData.baseY + Math.sin(elapsed * 1.4 + index) * 0.08;
        child.rotation.z = Math.sin(elapsed + index) * 0.03;
      }
    });

    renderer.render(scene, camera);
    frameId = requestAnimationFrame(animate);
  };

  animate();

  window.addEventListener("beforeunload", () => {
    cancelAnimationFrame(frameId);
    canvas.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("resize", updateSize);
    renderer.dispose();
  });
}

function createLaptopModel() {
  const group = new THREE.Group();

  const navy = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.42,
    roughness: 0.34
  });

  const blue = new THREE.MeshStandardMaterial({
    color: 0x2563eb,
    metalness: 0.18,
    roughness: 0.36
  });

  const cyan = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    metalness: 0.12,
    roughness: 0.3,
    emissive: 0x063744,
    emissiveIntensity: 0.16
  });

  const glass = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.62,
    metalness: 0.1,
    roughness: 0.18
  });

  const base = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.22, 3.0), navy);
  base.position.set(0, 0, 0);
  group.add(base);

  const trackpad = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.025, 0.78), glass);
  trackpad.position.set(0, 0.14, 0.82);
  group.add(trackpad);

  const screenBack = new THREE.Mesh(new THREE.BoxGeometry(4.35, 2.7, 0.16), navy);
  screenBack.position.set(0, 1.62, -1.36);
  screenBack.rotation.x = -0.16;
  group.add(screenBack);

  const screenGlow = new THREE.Mesh(new THREE.PlaneGeometry(3.82, 2.24), cyan);
  screenGlow.position.set(0, 1.64, -1.265);
  screenGlow.rotation.x = -0.16;
  group.add(screenGlow);

  const screenGlass = new THREE.Mesh(new THREE.PlaneGeometry(3.64, 2.04), glass);
  screenGlass.position.set(0, 1.66, -1.245);
  screenGlass.rotation.x = -0.16;
  group.add(screenGlass);

  const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.15, 24), blue);
  hinge.position.set(0, 0.26, -1.38);
  hinge.rotation.z = Math.PI / 2;
  group.add(hinge);

  const keyMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.05,
    roughness: 0.4
  });
  const keyGeometry = new THREE.BoxGeometry(0.28, 0.035, 0.2);
  const keys = new THREE.InstancedMesh(keyGeometry, keyMaterial, 48);
  const matrix = new THREE.Matrix4();
  let keyIndex = 0;

  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 12; col += 1) {
      const x = -1.85 + col * 0.34 + (row % 2) * 0.08;
      const z = -0.62 + row * 0.28;
      matrix.setPosition(x, 0.16, z);
      keys.setMatrixAt(keyIndex, matrix);
      keyIndex += 1;
    }
  }

  group.add(keys);

  const codeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.82
  });

  for (let index = 0; index < 7; index += 1) {
    const width = 0.72 + (index % 3) * 0.35;
    const line = new THREE.Mesh(new THREE.PlaneGeometry(width, 0.045), codeMaterial);
    line.position.set(-1.2 + (index % 2) * 0.28, 2.25 - index * 0.22, -1.225);
    line.rotation.x = -0.16;
    group.add(line);
  }

  const panels = [
    { x: -2.7, y: 1.75, z: -0.2, w: 1.1, h: 0.64, color: 0xffffff },
    { x: 2.72, y: 1.25, z: -0.42, w: 1.24, h: 0.74, color: 0xffffff },
    { x: 2.35, y: 2.35, z: -0.34, w: 0.92, h: 0.5, color: 0x06b6d4 }
  ];

  panels.forEach((panel, index) => {
    const panelMaterial = new THREE.MeshStandardMaterial({
      color: panel.color,
      transparent: true,
      opacity: index === 2 ? 0.62 : 0.72,
      metalness: 0.04,
      roughness: 0.18
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(panel.w, panel.h), panelMaterial);
    mesh.position.set(panel.x, panel.y, panel.z);
    mesh.rotation.y = index === 0 ? 0.38 : -0.36;
    mesh.userData.floatPanel = true;
    mesh.userData.baseY = panel.y;
    group.add(mesh);
  });

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.58, 0.025, 12, 80),
    new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.62
    })
  );
  ring.position.set(-2.08, 2.56, -0.48);
  ring.rotation.y = 0.6;
  ring.userData.floatPanel = true;
  ring.userData.baseY = ring.position.y;
  group.add(ring);

  return group;
}


