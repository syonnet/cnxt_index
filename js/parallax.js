/**
 * CONEXPET — Módulo JS: Cordillera Parallax & Conócenos Asimétrico (60 FPS GPU)
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const parallaxSection = document.getElementById('cordillera-parallax');
  const conocenosSection = document.getElementById('conocenos');

  const mtnLeft = document.getElementById('cnx-p-mtn-left');
  const mtnRight = document.getElementById('cnx-p-mtn-right');
  const cloud1 = document.getElementById('cnx-p-clouds1');
  const cloud2 = document.getElementById('cnx-p-clouds2');
  const pText = document.getElementById('cnx-p-text');
  const pBg = document.getElementById('cnx-p-bg');
  const conocenosParallaxItems = conocenosSection ? conocenosSection.querySelectorAll('[data-parallax-speed]') : [];

  let ticking = false;

  const updateAllParallax = () => {
    const windowH = window.innerHeight;

    // A. Cordillera Parallax (Apertura geológica limpia y descenso suave del titular con desvanecimiento)
    if (parallaxSection) {
      const rect = parallaxSection.getBoundingClientRect();

      if (rect.bottom >= 0 && rect.top <= windowH * 1.25) {
        const progressDistance = Math.max(0, (windowH * 1.15) - rect.top);

        // Flancos/Montañas: ancladas a los bordes exteriores (cero cortes ni franjas laterales)
        // Se abren progresivamente hacia afuera al descender
        const mtnOffset = (progressDistance * 0.20).toFixed(1);
        if (mtnLeft) mtnLeft.style.transform = `translate3d(-${mtnOffset}px, 0, 0)`;
        if (mtnRight) mtnRight.style.transform = `translate3d(${mtnOffset}px, 0, 0)`;

        // Nubes intermedias
        const c1Offset = (progressDistance * 0.12).toFixed(1);
        const c2Offset = (progressDistance * 0.09).toFixed(1);
        if (cloud1) cloud1.style.transform = `translate3d(${c1Offset}px, 0, 0)`;
        if (cloud2) cloud2.style.transform = `translate3d(-${c2Offset}px, 0, 0)`;

        // Titular & Logo: desciende poco a poco y se desvanece suavemente
        const textOffset = (progressDistance * 0.14).toFixed(1);
        const scrollPastTop = Math.max(0, -rect.top);
        const textOpacity = Math.max(0, Math.min(1, 1 - (scrollPastTop / (windowH * 0.75)))).toFixed(2);
        if (pText) {
          pText.style.transform = `translate3d(0, ${textOffset}px, 0)`;
          pText.style.opacity = textOpacity;
        }

        // Fondo amazónico: profundidad sutil
        const bgOffset = (progressDistance * 0.035).toFixed(1);
        if (pBg) pBg.style.transform = `scale(1.05) translate3d(0, ${bgOffset}px, 0)`;
      }
    }

    // B. Parallax Asimétrico en CONÓCENOS (Collage de Fotos & KPI Flotante)
    if (conocenosSection && conocenosParallaxItems.length > 0) {
      const cRect = conocenosSection.getBoundingClientRect();
      if (cRect.bottom >= -100 && cRect.top <= windowH + 100) {
        const centerDist = (windowH * 0.5) - (cRect.top + 300);
        conocenosParallaxItems.forEach((el) => {
          const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0;
          const y = (centerDist * speed).toFixed(1);
          el.style.transform = `translate3d(0, ${y}px, 0)`;
        });
      }
    }

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateAllParallax);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateAllParallax);
      ticking = true;
    }
  }, { passive: true });

  window.requestAnimationFrame(updateAllParallax);
});
