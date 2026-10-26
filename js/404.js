/**
 * CONEXPET — Controlador Interactivo 404 (Astro Telemetry Edition)
 * Incluye: Sincronización de Tema (Claro/Oscuro), Física Zero-G Continua + Paralaje Multicapa y Telemetría GPS
 */

(function () {
  // Inicialización inmediata de tema (Modo Oscuro por defecto salvo elección explícita 'light')
  const savedTheme = localStorage.getItem('conexpet-theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. CONMUTADOR DE TEMA CLARO / OSCURO (SINCRONIZADO CON EL PROYECTO)
     ========================================================================== */
  const themeBtn = document.getElementById('cnx-404-theme-btn');

  const sunSVG = `
    <svg width="16" height="16" fill="none" stroke="#F59E0B" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  `;

  const moonSVG = `
    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  `;

  const updateThemeIcon = () => {
    if (!themeBtn) return;
    const isDark = document.documentElement.classList.contains('dark');
    themeBtn.innerHTML = isDark ? sunSVG : moonSVG;
    themeBtn.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    themeBtn.setAttribute('title', isDark ? 'Modo Claro' : 'Modo Oscuro');
  };

  updateThemeIcon();

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('conexpet-theme', isDark ? 'dark' : 'light');
      updateThemeIcon();
    });
  }

  /* ==========================================================================
     2. FÍSICA ZERO-G CONTINUA + PARALAJE SUAVE MULTICAPA
     Combina flotación orgánica ininterrumpida con respuesta elástica al cursor
     ========================================================================== */
  const oh = document.querySelector('.circle.oh');
  const astro = document.querySelector('.astronaut');
  const four1 = document.querySelector('.four--1');
  const four2 = document.querySelector('.four--2');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (oh && !prefersReducedMotion) {
    // Desactivamos el keyframe CSS en .oh porque este bucle rAF combina flotación + paralaje sin cortes
    oh.style.animation = 'none';
    oh.style.transition = 'none';

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (event) => {
      const w = document.body.clientWidth || window.innerWidth;
      const h = document.body.clientHeight || window.innerHeight;
      const range = 14;

      targetX = ((event.clientX / w) - 0.5) * 2 * range;
      targetY = ((event.clientY / h) - 0.5) * 2 * range;
    });

    document.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
    });

    const animateZeroG = (time) => {
      // Interpolación suave (lerp) hacia la posición del cursor
      currentX += (targetX - currentX) * 0.065;
      currentY += (targetY - currentY) * 0.065;

      // Oscilación orgánica continua en gravedad cero (nunca se congela)
      const floatX = Math.cos(time * 0.0015) * 3.5;
      const floatY = Math.sin(time * 0.0022) * 6.0;
      const floatRot = Math.sin(time * 0.0018) * 2.2 + (currentX * 0.18);

      const finalX = currentX + floatX;
      const finalY = currentY + floatY;

      oh.style.transform = `translate3d(${finalX.toFixed(2)}px, ${finalY.toFixed(2)}px, 0) rotate(${floatRot.toFixed(2)}deg)`;

      if (four1) {
        four1.style.transform = `translate3d(${(-currentX * 0.45).toFixed(2)}px, ${(-currentY * 0.45).toFixed(2)}px, 0)`;
      }
      if (four2) {
        four2.style.transform = `translate3d(${(currentX * 0.35).toFixed(2)}px, ${(currentY * 0.35).toFixed(2)}px, 0)`;
      }

      requestAnimationFrame(animateZeroG);
    };

    requestAnimationFrame(animateZeroG);
  }

  /* ==========================================================================
     3. SIMULACIÓN DE TELEMETRÍA GPS EN CABECERA
     ========================================================================== */
  const gpsReadout = document.getElementById('cnx-404-gps');
  if (gpsReadout && !prefersReducedMotion) {
    const base = { lat: 2.1, lon: 41.3 };
    setInterval(() => {
      const lat = (base.lat + (Math.random() - 0.5) * 1.8).toFixed(1);
      const lon = (base.lon + (Math.random() - 0.5) * 1.8).toFixed(1);
      gpsReadout.textContent = `GPS: 0°05'${lat}"S · 76°52'${lon}"W · SIN RUTA`;
    }, 2200);
  }
});
