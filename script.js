/**
 * CONEXPET — Lógica Interactiva Central
 * Módulos Globales: Anti-FOUC, Métricas Animadas, Canvas 3D, Telemetría & Video Modal
 */

(function () {
  // Inicialización inmediata para evitar parpadeo de tema (Anti-FOUC)
  // Modo oscuro prioritario por defecto salvo selección explícita 'light'
  const savedTheme = localStorage.getItem('conexpet-theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Manejo robusto del video de fondo en móviles y preferencias de accesibilidad
  const heroVideo = document.getElementById('hero-bg-video');
  if (heroVideo) {
    if (prefersReducedMotion) {
      heroVideo.pause();
    } else {
      // En móviles (iOS Safari / Android), muted por JS es mandatorio para permitir autoplay
      heroVideo.muted = true;
      const playPromise = heroVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Si el modo de ahorro de energía bloquea el autoplay en el móvil,
          // el poster de fondo ya está desplegado como respaldo visual.
        });
      }
    }
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

      const hasPlus = finalVal.startsWith('+');
      const prefix = hasPlus ? '+' : '';
      const usesApostrophe = finalVal.includes("'");

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / duration);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.round(easeOut * target);

        if (progress < 1) {
          let formatted = currentVal.toLocaleString('de-DE');
          if (usesApostrophe) {
            formatted = formatted.replace('.', "'");
          }
          el.textContent = prefix + formatted + suffix;
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

  /* ==========================================================================
     6. MODAL LEGAL: TÉRMINOS Y CONDICIONES & LOPDP (ECUADOR)
     ========================================================================== */
  const legalModal = document.getElementById('cnx-legal-modal');
  const legalBackdrop = document.getElementById('cnx-legal-backdrop');
  const legalCloseBtns = document.querySelectorAll('[data-close-legal]');
  const legalTabBtns = document.querySelectorAll('[data-legal-tab]');
  const legalPanels = document.querySelectorAll('[data-legal-panel]');
  const legalTriggers = document.querySelectorAll('[data-open-legal]');
  const legalAcceptBtn = document.getElementById('cnx-legal-accept-btn');

  function openLegalModal(tabName) {
    if (!legalModal) return;
    switchLegalTab(tabName || 'lopdp');
    legalModal.classList.remove('hidden');
    legalModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      legalModal.classList.add('is-open');
    });
  }

  function closeLegalModal() {
    if (!legalModal) return;
    legalModal.classList.remove('is-open');
    legalModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!legalModal.classList.contains('is-open')) {
        legalModal.classList.add('hidden');
      }
    }, 250);
  }

  function switchLegalTab(tabName) {
    legalTabBtns.forEach(btn => {
      const isActive = btn.getAttribute('data-legal-tab') === tabName;
      btn.classList.toggle('is-active', isActive);
      if (isActive) {
        btn.classList.add('text-carbon', 'dark:text-white', 'border-red');
        btn.classList.remove('text-graphite', 'dark:text-white/60', 'border-transparent');
      } else {
        btn.classList.remove('text-carbon', 'dark:text-white', 'border-red');
        btn.classList.add('text-graphite', 'dark:text-white/60', 'border-transparent');
      }
    });

    legalPanels.forEach(panel => {
      const matches = panel.getAttribute('data-legal-panel') === tabName;
      panel.classList.toggle('hidden', !matches);
    });
  }

  legalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = trigger.getAttribute('data-open-legal') || 'lopdp';
      openLegalModal(tab);
    });
  });

  legalCloseBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeLegalModal();
    });
  });

  if (legalBackdrop) {
    legalBackdrop.addEventListener('click', closeLegalModal);
  }

  legalTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-legal-tab');
      switchLegalTab(tab);
    });
  });

  if (legalAcceptBtn) {
    legalAcceptBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Auto-marcar checkbox de consentimiento en los formularios
      document.querySelectorAll('input[name="acepta_terminos_lopdp"]').forEach(chk => {
        chk.checked = true;
      });
      closeLegalModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && legalModal && !legalModal.classList.contains('hidden')) {
      closeLegalModal();
    }
  });

  /* ==========================================================================
     8. GESTIÓN DE FORMULARIOS DE COTIZACIÓN (cPanel PHP Nativo + Respaldo)
     ========================================================================== */
  const quoteForms = document.querySelectorAll('#form-flota, #form-cobertura');

  quoteForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

      // Remover feedback previo si existía
      const prevFeedback = form.querySelector('.cnx-form-feedback');
      if (prevFeedback) prevFeedback.remove();

      // Estado de carga en botón
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-80', 'cursor-not-allowed');
        submitBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span>Transmitiendo solicitud a conexpet@conexpet.com...</span>
        `;
      }

      const formData = new FormData(form);
      const dataObj = Object.fromEntries(formData.entries());

      // Intento 1: Endpoint PHP Nativo en servidor cPanel (conexpet.com)
      // Intento 2 (contingencia en entornos sin PHP como GitHub Pages): FormSubmit AJAX
      const sendRequest = async (url) => {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(dataObj)
        });
        const json = await res.json();
        if (!res.ok && json.success !== true && json.success !== "true") {
          throw new Error(json.message || 'Error en respuesta del servidor');
        }
        return json;
      };

      try {
        let result;
        try {
          result = await sendRequest('enviar_cotizacion.php');
        } catch (phpErr) {
          result = await sendRequest('https://formsubmit.co/ajax/conexpet@conexpet.com');
        }

        if (result && (result.success === "true" || result.success === true)) {
          // Contenedor de éxito estilizado
          const feedbackDiv = document.createElement('div');
          feedbackDiv.className = 'cnx-form-feedback p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-carbon dark:text-white my-4 text-center';
          feedbackDiv.innerHTML = `
            <div class="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 class="font-display font-bold text-lg text-emerald-600 dark:text-emerald-400">¡Solicitud recibida con éxito!</h4>
            <p class="text-xs sm:text-sm text-graphite dark:text-white/80 mt-1.5 max-w-lg mx-auto leading-relaxed">
              Hemos transmitido tus requerimientos técnicos al correo corporativo <strong>conexpet@conexpet.com</strong>.<br>Un asesor comercial de operaciones se comunicará contigo de inmediato.
            </p>
          `;

          form.reset();
          if (submitBtn) {
            submitBtn.parentNode.insertBefore(feedbackDiv, submitBtn);
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-80', 'cursor-not-allowed');
            submitBtn.innerHTML = originalBtnHtml;
          }
          feedbackDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          throw new Error(result.message || 'Error en respuesta del servidor');
        }
      } catch (err) {
        console.warn('[CONEXPET] Envío AJAX en proceso de contingencia:', err);

        // Construir mailto estructurado como respaldo transparente
        const subject = encodeURIComponent(dataObj._subject || 'Solicitud de Cotización CONEXPET');
        const bodyLines = [
          'NUEVA SOLICITUD DE COTIZACIÓN - CONEXPET',
          '========================================',
          `Nombre: ${dataObj.nombre || 'No especificado'}`,
          `Empresa / Operadora: ${dataObj.empresa || 'No especificado'}`,
          `Correo: ${dataObj.email || 'No especificado'}`,
          `Teléfono: ${dataObj.telefono || 'No especificado'}`,
          dataObj.unidad_requerida ? `Unidad Requerida: ${dataObj.unidad_requerida}` : '',
          dataObj.ruta_destino ? `Ruta / Destino: ${dataObj.ruta_destino}` : '',
          dataObj.base_origen ? `Base Origen: ${dataObj.base_origen}` : '',
          dataObj.destino_final ? `Destino Final: ${dataObj.destino_final}` : '',
          `Detalles de la Carga: ${dataObj.detalles_carga || dataObj.descripcion_carga || 'Sin detalles adicionales'}`,
          '========================================'
        ].filter(Boolean).join('\n');

        const mailtoUrl = `mailto:conexpet@conexpet.com?subject=${subject}&body=${encodeURIComponent(bodyLines)}`;

        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'cnx-form-feedback p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-carbon dark:text-white my-4 text-center';
        feedbackDiv.innerHTML = `
          <h4 class="font-display font-bold text-base text-amber-600 dark:text-amber-400">Canal de envío directo</h4>
          <p class="text-xs text-graphite dark:text-white/80 mt-1 max-w-md mx-auto">
            Puedes remitir tus datos directamente en tu cliente de correo (Outlook / Gmail) a <strong>conexpet@conexpet.com</strong>:
          </p>
          <a href="${mailtoUrl}" class="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red hover:bg-red-deep text-white font-bold text-xs uppercase tracking-wider transition-colors shadow">
            <span>Abrir en mi correo</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        `;

        if (submitBtn) {
          submitBtn.parentNode.insertBefore(feedbackDiv, submitBtn);
          submitBtn.disabled = false;
          submitBtn.classList.remove('opacity-80', 'cursor-not-allowed');
          submitBtn.innerHTML = originalBtnHtml;
        }
      }
    });
  });
});
