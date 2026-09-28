/**
 * CONEXPET — Módulo JS: Sticky Split-Screen Scrollytelling (Opción 2)
 * Sincronización a 60fps con IntersectionObserver entre los bloques de texto y la ventana fija
 */

document.addEventListener('DOMContentLoaded', () => {
  const steps = document.querySelectorAll('[data-scrolly-step]');
  const images = document.querySelectorAll('[data-scrolly-img]');
  const pills = document.querySelectorAll('[data-scrolly-pill]');
  const badgeText = document.getElementById('scrolly-hud-badge');

  if (steps.length === 0 || images.length === 0) return;

  const badgeLabels = {
    '1': 'DIVISIÓN 01 · RIGS & CAMAS BAJAS 4 EJES',
    '2': 'DIVISIÓN 02 · VACUUM 120-200 BBL & CRUDO',
    '3': 'DIVISIÓN 03 · IZAJE CRÍTICO HASTA 120T'
  };

  const setActiveStep = (stepIndex) => {
    // 1. Transición de imágenes (cross-fade)
    images.forEach((img) => {
      const imgStep = img.getAttribute('data-scrolly-img');
      if (imgStep === stepIndex) {
        img.classList.remove('opacity-0', 'scale-105', 'pointer-events-none');
        img.classList.add('opacity-100', 'scale-100');
      } else {
        img.classList.add('opacity-0', 'scale-105', 'pointer-events-none');
        img.classList.remove('opacity-100', 'scale-100');
      }
    });

    // 2. Indicadores de progreso (pills)
    pills.forEach((pill) => {
      const pillStep = pill.getAttribute('data-scrolly-pill');
      if (pillStep === stepIndex) {
        pill.classList.add('bg-red', 'text-white', 'scale-105');
        pill.classList.remove('bg-white/20', 'text-white/70');
      } else {
        pill.classList.remove('bg-red', 'text-white', 'scale-105');
        pill.classList.add('bg-white/20', 'text-white/70');
      }
    });

    // 3. Texto del badge HUD
    if (badgeText && badgeLabels[stepIndex]) {
      badgeText.textContent = badgeLabels[stepIndex];
    }
  };

  // IntersectionObserver para detectar el bloque de servicio visible
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -40% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const stepIndex = entry.target.getAttribute('data-scrolly-step');
        setActiveStep(stepIndex);
      }
    });
  }, observerOptions);

  steps.forEach((step) => observer.observe(step));

  // Clic directo en las pastillas (pills) para saltar al servicio
  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const stepIndex = pill.getAttribute('data-scrolly-pill');
      const targetStep = document.querySelector(`[data-scrolly-step="${stepIndex}"]`);
      if (targetStep) {
        targetStep.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });
});
