/**
 * CONEXPET — Módulo JS: Slider Cinemático de la Flota Especializada (Edición Premium)
 * Funcionalidades:
 * - Rotación de elementos en DOM con transiciones cinematográficas
 * - Contador dinámico de diapositivas (01 / 07)
 * - Autoplay inteligente con barra de progreso lineal sincronizada
 * - Pausa automática al pasar el cursor o al interactuar
 * - Soporte para gestos táctiles (Touch Swipe en móviles)
 * - Navegación con teclado (Flechas Izquierda / Derecha)
 */

document.addEventListener('DOMContentLoaded', () => {
  const csliderSection = document.getElementById('flota') || document.querySelector('.cnx-cslider-section');
  if (!csliderSection) return;

  const csliderContainer = csliderSection.querySelector('.cnx-cslider-container');
  const csliderList = csliderSection.querySelector('.cnx-cslider-list');
  if (!csliderList) return;

  // Elementos del Dock de Control
  const currentNumEl = document.getElementById('flota-current-num');
  const totalNumEl = document.getElementById('flota-total-num');
  const progressBarEl = document.getElementById('flota-progress-bar');
  const autoplayToggleBtn = document.getElementById('flota-autoplay-toggle');
  const autoplayTextEl = document.getElementById('flota-autoplay-text');

  // Configuración de Autoplay
  const SLIDE_DURATION = 6000; // 6 segundos por diapositiva
  let isAutoplayActive = true;
  let isHovered = false;
  let progressStartTime = null;
  let progressRafId = null;
  let elapsedBeforePause = 0;

  // Total de unidades
  const totalSlides = csliderList.querySelectorAll('.cnx-cslider-item').length;
  if (totalNumEl) {
    totalNumEl.textContent = String(totalSlides).padStart(2, '0');
  }

  // Actualizar el contador de la diapositiva activa
  function updateCounter() {
    const items = csliderList.querySelectorAll('.cnx-cslider-item');
    if (items.length >= 2 && currentNumEl) {
      // El slide visible en pantalla completa con contenido es el segundo (:nth-child(2))
      const activeItem = items[1];
      const index = activeItem.getAttribute('data-index') || '1';
      currentNumEl.textContent = String(index).padStart(2, '0');
    }
  }

  // Avanzar diapositiva
  function nextSlide() {
    const items = csliderList.querySelectorAll('.cnx-cslider-item');
    if (items.length > 0) {
      csliderList.append(items[0]);
      updateCounter();
      resetProgressBar();
    }
  }

  // Retroceder diapositiva
  function prevSlide() {
    const items = csliderList.querySelectorAll('.cnx-cslider-item');
    if (items.length > 0) {
      csliderList.prepend(items[items.length - 1]);
      updateCounter();
      resetProgressBar();
    }
  }

  // Ir a un índice específico por clic en miniatura lateral
  function goToSlide(targetItem) {
    const items = Array.from(csliderList.querySelectorAll('.cnx-cslider-item'));
    const clickedIndex = items.indexOf(targetItem);
    if (clickedIndex > 1) {
      for (let i = 0; i < clickedIndex - 1; i++) {
        csliderList.append(csliderList.querySelectorAll('.cnx-cslider-item')[0]);
      }
      updateCounter();
      resetProgressBar();
    }
  }

  // Ciclo de la Barra de Progreso
  function runProgressBar(timestamp) {
    if (!isAutoplayActive || isHovered) {
      progressRafId = requestAnimationFrame(runProgressBar);
      return;
    }

    if (!progressStartTime) {
      progressStartTime = timestamp - elapsedBeforePause;
    }

    const elapsed = timestamp - progressStartTime;
    elapsedBeforePause = elapsed;
    const progressPercent = Math.min((elapsed / SLIDE_DURATION) * 100, 100);

    if (progressBarEl) {
      progressBarEl.style.width = `${progressPercent}%`;
    }

    if (elapsed >= SLIDE_DURATION) {
      nextSlide();
    } else {
      progressRafId = requestAnimationFrame(runProgressBar);
    }
  }

  function resetProgressBar() {
    if (progressRafId) {
      cancelAnimationFrame(progressRafId);
    }
    progressStartTime = null;
    elapsedBeforePause = 0;
    if (progressBarEl) {
      progressBarEl.style.width = '0%';
    }
    progressRafId = requestAnimationFrame(runProgressBar);
  }

  // Iniciar Autoplay
  resetProgressBar();
  updateCounter();

  // Pausar con hover sobre el contenedor
  if (csliderContainer) {
    csliderContainer.addEventListener('mouseenter', () => {
      isHovered = true;
    });

    csliderContainer.addEventListener('mouseleave', () => {
      isHovered = false;
      progressStartTime = null; // Reanudar suavemente
    });
  }

  // Botón Toggle Autoplay / Pausa manual
  if (autoplayToggleBtn) {
    autoplayToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isAutoplayActive = !isAutoplayActive;
      if (autoplayTextEl) {
        autoplayTextEl.textContent = isAutoplayActive ? 'AUTO' : 'PAUSA';
      }
      const pulseDot = autoplayToggleBtn.querySelector('span');
      if (pulseDot) {
        pulseDot.className = isAutoplayActive 
          ? 'w-1.5 h-1.5 rounded-full bg-green animate-pulse' 
          : 'w-1.5 h-1.5 rounded-full bg-amber-400';
      }
      if (isAutoplayActive) {
        resetProgressBar();
      }
    });
  }

  // Clic en botones Prev / Next
  csliderSection.addEventListener('click', (e) => {
    const nextBtn = e.target.closest('.cnx-cslider-next');
    const prevBtn = e.target.closest('.cnx-cslider-prev');

    if (nextBtn) {
      nextSlide();
    } else if (prevBtn) {
      prevSlide();
    }
  });

  // Clic en miniaturas flotantes
  csliderList.addEventListener('click', (e) => {
    const clickedItem = e.target.closest('.cnx-cslider-item');
    if (clickedItem && !e.target.closest('a') && !e.target.closest('button')) {
      goToSlide(clickedItem);
    }
  });

  // Navegación por teclado (Flechas)
  window.addEventListener('keydown', (e) => {
    // Solo si el slider está en viewport o visible
    const rect = csliderSection.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!isInView) return;

    if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    }
  });

  // Gestos táctiles (Touch Swipe en smartphones y tablets)
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;

  csliderSection.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  csliderSection.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    // Verificar si el gesto fue predominantemente horizontal
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX < 0) {
        // Deslizamiento hacia la izquierda -> siguiente
        nextSlide();
      } else {
        // Deslizamiento hacia la derecha -> anterior
        prevSlide();
      }
    }
  }, { passive: true });

  /* ==========================================================================
     CONTROLADOR DEL CUADRO OPERATIVO (CONSOLA DE HOMOLOGACIÓN 360°)
     ========================================================================== */
  const opSection = document.getElementById('cuadro-operativo');
  if (opSection) {
    const vectorButtons = opSection.querySelectorAll('.cnx-op-btn');
    const panels = opSection.querySelectorAll('.cnx-op-panel');
    let activeSys = 1;
    let opAutoTimer = null;
    let isOpHovered = false;

    function activateSystem(sysId) {
      activeSys = sysId;
      vectorButtons.forEach(btn => {
        const isCurrent = btn.getAttribute('data-system') === String(sysId);
        btn.classList.toggle('op-active', isCurrent);
        btn.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
      });

      panels.forEach(panel => {
        const isCurrent = panel.id === `op-panel-${sysId}`;
        panel.classList.toggle('panel-active', isCurrent);
        
        // Re-animar barras de telemetría del panel activo
        if (isCurrent) {
          const fills = panel.querySelectorAll('.cnx-gauge-fill');
          fills.forEach(fill => {
            const currentW = fill.style.width;
            fill.style.width = '0%';
            requestAnimationFrame(() => {
              setTimeout(() => {
                fill.style.width = currentW;
              }, 40);
            });
          });
        }
      });
    }

    // Clic en los botones de vector
    vectorButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const sysId = parseInt(btn.getAttribute('data-system'), 10);
        activateSystem(sysId);
      });
    });

    // Auto-ciclo suave de demostración cada 7 segundos si el usuario no interactúa
    function startOpAutoCycle() {
      opAutoTimer = setInterval(() => {
        if (!isOpHovered) {
          activeSys = (activeSys % vectorButtons.length) + 1;
          activateSystem(activeSys);
        }
      }, 7000);
    }

    opSection.addEventListener('mouseenter', () => {
      isOpHovered = true;
    });

    opSection.addEventListener('mouseleave', () => {
      isOpHovered = false;
    });

    startOpAutoCycle();
  }
});
