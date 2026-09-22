/**
 * CONEXPET — Módulo JS: Barra de Navegación, Animated Top Dock, Tema & Progreso de Scroll
 * Implementación modular de física elástica (Spring Physics) adaptada de ThreeUI Sable/Modern Dock
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. GESTIÓN DE TEMA CLARO / OSCURO (THEME SWITCHER)
     ========================================================================== */
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');

  const sunIconSVG = `
    <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  `;

  const moonIconSVG = `
    <svg class="w-4 h-4 text-carbon/70 dark:text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  `;

  const updateToggleButtons = (isDark) => {
    themeToggleBtns.forEach((btn) => {
      btn.innerHTML = isDark ? sunIconSVG : moonIconSVG;
      btn.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
      btn.setAttribute('title', isDark ? 'Modo Claro' : 'Modo Oscuro');
    });
  };

  const isCurrentDark = document.documentElement.classList.contains('dark');
  updateToggleButtons(isCurrentDark);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('conexpet-theme', isDark ? 'dark' : 'light');
    updateToggleButtons(isDark);
  };

  themeToggleBtns.forEach((btn) => {
    btn.addEventListener('click', toggleTheme);
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('conexpet-theme')) {
      const shouldBeDark = e.matches;
      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      updateToggleButtons(shouldBeDark);
    }
  });

  /* ==========================================================================
     2. MENÚ MÓVIL ACCESIBLE
     ========================================================================== */
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    let isOpen = false;

    const toggleMenu = (state) => {
      isOpen = typeof state === 'boolean' ? state : !isOpen;
      menuBtn.setAttribute('aria-expanded', String(isOpen));

      if (isOpen) {
        mobileMenu.style.maxHeight = `${mobileMenu.scrollHeight + 30}px`;
        mobileMenu.style.opacity = '1';
      } else {
        mobileMenu.style.maxHeight = '0px';
        mobileMenu.style.opacity = '0';
      }
    };

    menuBtn.addEventListener('click', () => toggleMenu());

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        toggleMenu(false);
        menuBtn.focus();
      }
    });
  }

  /* ==========================================================================
     3. BARRA DE PROGRESO DE SCROLL CON CAMIÓN VECTORIZADO
     ========================================================================== */
  const progressBar = document.getElementById('scroll-progress-bar');
  if (progressBar) {
    let ticking = false;
    const updateScrollProgress = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      progressBar.style.width = Math.min(100, Math.max(0, scrolled)) + '%';
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', updateScrollProgress, { passive: true });
    updateScrollProgress();
  }

  /* ==========================================================================
     4. RESALTADO DINÁMICO DE NAVEGACIÓN (ACTIVE NAV SPY)
     ========================================================================== */
  const sections = document.querySelectorAll('main section[id], section[id]');
  const desktopNavLinks = document.querySelectorAll('#site-nav a[href^="#"]');

  if (sections.length > 0 && desktopNavLinks.length > 0) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          desktopNavLinks.forEach((link) => {
            const href = link.getAttribute('href');
            const isActive = href === `#${currentId}`;
            if (isActive) {
              link.classList.add('is-active');
              link.setAttribute('aria-pressed', 'true');
              if (!link.classList.contains('atd-modern__item')) {
                link.classList.add('text-red', 'font-semibold');
                link.classList.remove('text-graphite', 'dark:text-white/60');
              }
            } else {
              link.classList.remove('is-active');
              link.setAttribute('aria-pressed', 'false');
              if (!link.classList.contains('atd-modern__item')) {
                link.classList.remove('text-red', 'font-semibold');
                link.classList.add('text-graphite', 'dark:text-white/60');
              }
            }
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -70% 0px'
    });

    sections.forEach((sec) => navObserver.observe(sec));
  }

  /* ==========================================================================
     5. ANIMATED TOP DOCK: CONTROLADOR DE FÍSICA DE RESORTE Y PROXIMIDAD
        Adaptación directa del kernel matemático ThreeUI Sable/Modern Dock
     ========================================================================== */
  const dockTrack = document.getElementById('atd-dock-track');
  if (dockTrack) {
    initTopDockController(dockTrack, {
      proximity: 115,    // Rango de detección magnética del cursor en px
      spring: 0.19,      // Coeficiente de elasticidad del resorte
      damping: 0.70,     // Factor de amortiguación (0.7 = crítico/suave sin oscilación desmedida)
      widthGrowth: 14,   // Crecimiento máximo en anchura por ítem (px)
      heightGrowth: 6,   // Crecimiento máximo en altura por ítem (px)
      drop: 3,           // Desplazamiento sutil hacia abajo al aproximarse (px)
      lockTrack: true    // Evita que el contenedor oscile en tamaño al expandir elementos
    });
  }

  function initTopDockController(root, options) {
    const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const precisionQuery = window.matchMedia('(hover:hover) and (pointer:fine)');

    const itemElements = Array.from(root.querySelectorAll('[data-dock-item]'));
    const items = itemElements.map((el) => ({
      element: el,
      baseWidth: 0,
      baseHeight: 0,
      value: 0,
      velocity: 0,
      target: 0
    }));

    let enabled = false;
    let pointerActive = false;
    let dirty = false;
    let frameId = 0;

    const canAnimate = () => (
      !reducedQuery.matches &&
      root.clientWidth > 0 &&
      window.innerWidth >= 1024 &&
      precisionQuery.matches
    );

    const measure = () => {
      enabled = canAnimate();
      if (options.lockTrack) {
        root.style.width = '';
      }
      for (const st of items) {
        st.element.style.width = '';
        st.element.style.height = '';
        st.element.style.transform = '';
        st.element.dataset.dockNear = 'false';
      }
      for (const st of items) {
        const rect = st.element.getBoundingClientRect();
        st.baseWidth = rect.width;
        st.baseHeight = rect.height;
        st.value = 0;
        st.velocity = 0;
        st.target = 0;
      }
      pointerActive = false;
      dirty = false;
      if (options.lockTrack) {
        root.style.width = `${root.getBoundingClientRect().width.toFixed(2)}px`;
      }
      root.dataset.dockState = enabled ? 'idle' : 'static';
      root.dataset.dockMax = '0.00';
    };

    const setTargets = (clientX) => {
      if (!enabled) return;
      const rects = items.map((st) => st.element.getBoundingClientRect());
      for (let i = 0; i < items.length; i++) {
        const rect = rects[i];
        const center = rect.left + rect.width * 0.5;
        // Distancia normalizada e inversión suave
        const proximity = clamp(1 - Math.abs(clientX - center) / Math.max(1, options.proximity), 0, 1);
        // Hermite smoothstep cúbico: 3x^2 - 2x^3
        const influence = proximity * proximity * (3 - 2 * proximity);
        items[i].target = influence;
        items[i].element.dataset.dockNear = influence > 0.08 ? 'true' : 'false';
      }
      pointerActive = true;
      dirty = true;
      root.dataset.dockState = 'active';
    };

    const focusItem = (itemEl) => {
      if (!enabled) return;
      const index = items.findIndex((st) => st.element === itemEl);
      if (index < 0) return;
      items.forEach((st, i) => {
        st.target = i === index ? 1 : Math.abs(i - index) === 1 ? 0.25 : 0;
        st.element.dataset.dockNear = st.target > 0.08 ? 'true' : 'false';
      });
      pointerActive = false;
      dirty = true;
      root.dataset.dockState = 'focus';
    };

    const reset = () => {
      pointerActive = false;
      dirty = true;
      items.forEach((st) => {
        st.target = 0;
        st.element.dataset.dockNear = 'false';
      });
    };

    const applyLayout = () => {
      for (const st of items) {
        const val = clamp(st.value, 0, 1.08);
        const extraWidth = Math.min(options.widthGrowth, st.baseWidth * 0.22);
        const extraHeight = options.heightGrowth;
        st.element.style.width = `${(st.baseWidth + extraWidth * val).toFixed(2)}px`;
        st.element.style.height = `${(st.baseHeight + extraHeight * val).toFixed(2)}px`;
        st.element.style.transform = `translateY(${(val * options.drop).toFixed(2)}px)`;
      }
    };

    const draw = () => {
      if (enabled && dirty) {
        let moving = false;
        let maxValue = 0;

        for (const st of items) {
          st.velocity += (st.target - st.value) * options.spring;
          st.velocity *= options.damping;
          st.value += st.velocity;

          if (Math.abs(st.target - st.value) < 0.001 && Math.abs(st.velocity) < 0.001) {
            st.value = st.target;
            st.velocity = 0;
          } else {
            moving = true;
          }
          maxValue = Math.max(maxValue, clamp(st.value, 0, 1.08));
        }

        applyLayout();
        root.dataset.dockMax = maxValue.toFixed(2);

        if (!moving) {
          dirty = false;
          if (items.every((st) => st.target === 0)) {
            root.dataset.dockState = 'idle';
          }
        }
      }
      frameId = requestAnimationFrame(draw);
    };

    // Eventos de entrada
    const onPointerMove = (e) => setTargets(e.clientX);
    const onWindowPointerMove = (e) => {
      if (!pointerActive) return;
      const rootRect = root.getBoundingClientRect();
      const itemRects = items.map((st) => st.element.getBoundingClientRect());
      const bottom = Math.max(rootRect.bottom, ...itemRects.map((r) => r.bottom)) + 15;
      const top = Math.min(rootRect.top, ...itemRects.map((r) => r.top)) - 10;
      const outside = e.clientX < rootRect.left - 20 || e.clientX > rootRect.right + 20 || e.clientY < top || e.clientY > bottom;
      if (outside) reset();
    };

    const onFocusIn = (e) => {
      const itemEl = e.target?.closest?.('[data-dock-item]');
      if (itemEl) focusItem(itemEl);
    };

    const onFocusOut = () => {
      requestAnimationFrame(() => {
        if (!root.contains(document.activeElement)) reset();
      });
    };

    const onKeyDown = (e) => {
      const itemEl = e.target?.closest?.('[data-dock-item]');
      if (itemEl && (e.key === 'Enter' || e.key === ' ')) {
        itemEl.click();
      }
    };

    // Observar redimensionamiento del contenedor o viewport
    const resizeObserver = new ResizeObserver(() => measure());
    resizeObserver.observe(root.parentElement || root);

    root.addEventListener('pointermove', onPointerMove, { passive: true });
    root.addEventListener('pointerleave', reset);
    root.addEventListener('focusin', onFocusIn);
    root.addEventListener('focusout', onFocusOut);
    root.addEventListener('keydown', onKeyDown);
    root.addEventListener('click', reset);
    window.addEventListener('pointermove', onWindowPointerMove, { passive: true });

    reducedQuery.addEventListener('change', measure);
    precisionQuery.addEventListener('change', measure);

    // Medición inicial una vez que las fuentes estén listas
    if (document.fonts?.ready) {
      document.fonts.ready.then(measure);
    } else {
      measure();
    }

    frameId = requestAnimationFrame(draw);

    window.addEventListener('unload', () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    });
  }
});
