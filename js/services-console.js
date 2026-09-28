/**
 * CONEXPET — Módulo JS: Consola de Operaciones de Servicios (Opción 1)
 * Selector de pestañas técnico, transiciones fluidas y sincronización HUD
 */

document.addEventListener('DOMContentLoaded', () => {
  const tabButtons = document.querySelectorAll('[data-service-tab]');
  const tabPanels = document.querySelectorAll('[data-service-panel]');

  if (tabButtons.length === 0 || tabPanels.length === 0) return;

  const switchTab = (targetId) => {
    // 1. Actualizar estado de las pestañas
    tabButtons.forEach((btn) => {
      const isSelected = btn.getAttribute('data-service-tab') === targetId;
      btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');

      if (isSelected) {
        btn.classList.add('tab-active');
        btn.classList.remove('tab-inactive');
      } else {
        btn.classList.remove('tab-active');
        btn.classList.add('tab-inactive');
      }
    });

    // 2. Transición suave de los paneles de contenido
    tabPanels.forEach((panel) => {
      if (panel.id === targetId) {
        panel.classList.remove('hidden');
        // Pequeño timeout para activar animación de opacidad
        requestAnimationFrame(() => {
          panel.classList.remove('opacity-0', 'translate-y-2');
          panel.classList.add('opacity-100', 'translate-y-0');
        });
      } else {
        panel.classList.add('opacity-0', 'translate-y-2');
        panel.classList.remove('opacity-100', 'translate-y-0');
        panel.classList.add('hidden');
      }
    });
  };

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-service-tab');
      switchTab(targetId);
    });

    // Navegación por teclado (Flechas Izquierda / Derecha)
    btn.addEventListener('keydown', (e) => {
      const tabsArray = Array.from(tabButtons);
      const currentIndex = tabsArray.indexOf(btn);

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextTab = tabsArray[(currentIndex + 1) % tabsArray.length];
        nextTab.focus();
        nextTab.click();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevTab = tabsArray[(currentIndex - 1 + tabsArray.length) % tabsArray.length];
        prevTab.focus();
        prevTab.click();
      }
    });
  });
});
