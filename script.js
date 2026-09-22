/**
 * CONEXPET — Lógica Interactiva Central
 * Módulos Globales: Anti-FOUC, Métricas Animadas, Canvas 3D, Telemetría & Video Modal
 */

(function () {
  // Inicialización inmediata para evitar parpadeo de tema (Anti-FOUC)
  const savedTheme = localStorage.getItem('conexpet-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Pausar video de fondo automáticamente si el usuario prefiere movimiento reducido
  const heroVideo = document.getElementById('hero-bg-video');
  if (heroVideo && prefersReducedMotion) {
    heroVideo.pause();
  }

  /* ==========================================================================
     1. CONTADORES DE MÉTRICAS OPERATIVAS
     ========================================================================== */
  const counters = document.querySelectorAll('[data-count-to]');

  if (counters.length > 0) {
    const animateCount = (el) => {
      const target = parseInt(el.getAttribute('data-count-to'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const finalVal = el.getAttribute('data-final') || (target + suffix);

      if (prefersReducedMotion || isNaN(target)) {
        el.textContent = finalVal;
        return;
      }

      const duration = 1200;
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / duration);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.round(easeOut * target);

        if (progress < 1) {
          el.textContent = currentVal.toLocaleString('de-DE') + suffix;
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = finalVal;
        }
      };

      requestAnimationFrame(updateCounter);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.35,
      rootMargin: '0px 0px -40px 0px'
    });

    counters.forEach((counter) => counterObserver.observe(counter));
  }

  /* ==========================================================================
     2. SIMULACIÓN DE TELEMETRÍA GPS (BASE NUEVA LOJA)
     ========================================================================== */
  const gpsElement = document.getElementById('gps-readout');

  if (gpsElement && !prefersReducedMotion) {
    const baseCoords = { latSec: 2.1, lonSec: 41.3 };

    setInterval(() => {
      const jitterLat = (baseCoords.latSec + (Math.random() - 0.5) * 1.6).toFixed(1);
      const jitterLon = (baseCoords.lonSec + (Math.random() - 0.5) * 1.6).toFixed(1);
      gpsElement.textContent = `0°05'${jitterLat}"S · 76°52'${jitterLon}"W`;
    }, 2400);
  }

  /* ==========================================================================
     3. CANVAS INTERACTIVO 3D DE TELEMETRÍA Y PARTÍCULAS (HERO)
     ========================================================================== */
  const canvas = document.getElementById('hero-particles-canvas');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', onResize);

    const particleCount = Math.min(45, Math.floor((width * height) / 25000));
    const particles = [];
    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: Math.random() * 2 + 1,
        z: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.25,
        isRed: Math.random() > 0.75
      });
    }

    const heroSection = document.getElementById('top');
    if (heroSection) {
      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        mouse.targetX = e.clientX - rect.left;
        mouse.targetY = e.clientY - rect.top;
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      const isDark = document.documentElement.classList.contains('dark');
      const baseColor = isDark ? '255, 255, 255' : '24, 24, 27';

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        p1.x += p1.vx + ((mouse.x - width / 2) * 0.0003 * p1.z);
        p1.y += p1.vy + ((mouse.y - height / 2) * 0.0003 * p1.z);

        if (p1.x < 0) p1.x = width;
        if (p1.x > width) p1.x = 0;
        if (p1.y < 0) p1.y = height;
        if (p1.y > height) p1.y = 0;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * (isDark ? 0.16 : 0.09);
            ctx.beginPath();
            ctx.strokeStyle = p1.isRed ? `rgba(198, 12, 48, ${lineAlpha * 1.5})` : `rgba(${baseColor}, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.size, 0, Math.PI * 2);
        ctx.fillStyle = p1.isRed
          ? `rgba(198, 12, 48, ${p1.alpha * (isDark ? 0.85 : 0.6)})`
          : `rgba(${baseColor}, ${p1.alpha * (isDark ? 0.4 : 0.25)})`;
        ctx.fill();
      }

      requestAnimationFrame(render);
    };

    render();
  }

  /* ==========================================================================
     4. EFECTO 3D TILT INTERACTIVO (TARJETA DE TELEMETRÍA DEL HERO)
     ========================================================================== */
  const tiltWrappers = document.querySelectorAll('.tilt-card-wrapper');
  if (tiltWrappers.length > 0 && !prefersReducedMotion) {
    tiltWrappers.forEach((wrapper) => {
      const card = wrapper.querySelector('.tilt-card');
      if (!card) return;

      const handleMove = (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(16px)`;
      };

      const handleLeave = () => {
        card.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
      };

      wrapper.addEventListener('mousemove', handleMove);
      wrapper.addEventListener('mouseleave', handleLeave);
    });
  }

  /* ==========================================================================
     5. MODAL POPUP CINEMATOGRÁFICO DE VIDEO
     ========================================================================== */
  const openVideoBtn = document.getElementById('open-video-modal');
  const closeVideoBtn = document.getElementById('close-video-modal');
  const videoModalEl = document.getElementById('video-modal');
  const videoBackdropEl = document.getElementById('video-modal-backdrop');
  const videoPlayerEl = document.getElementById('modal-player-video');

  if (openVideoBtn && videoModalEl && videoPlayerEl) {
    const openVideo = () => {
      videoModalEl.classList.remove('modal-closed');
      videoModalEl.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
      videoPlayerEl.currentTime = 0;
      videoPlayerEl.play().catch(() => {});
    };

    const closeVideo = () => {
      videoModalEl.classList.remove('modal-open');
      videoModalEl.classList.add('modal-closed');
      document.body.style.overflow = '';
      videoPlayerEl.pause();
    };

    openVideoBtn.addEventListener('click', openVideo);
    if (closeVideoBtn) closeVideoBtn.addEventListener('click', closeVideo);
    if (videoBackdropEl) videoBackdropEl.addEventListener('click', closeVideo);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && videoModalEl.classList.contains('modal-open')) {
        closeVideo();
      }
    });
  }
});
