/**
 * CONEXPET — Módulo JS: Filas Expandibles Suizas / Acordeón de Ingeniería (Opción 3)
 * Transiciones CSS fluidas, control de teclado y accesibilidad ARIA
 */

document.addEventListener('DOMContentLoaded', () => {
  const rows = document.querySelectorAll('[data-swiss-row]');
  if (rows.length === 0) return;

  const closeRow = (row) => {
    const trigger = row.querySelector('[data-swiss-trigger]');
    const content = row.querySelector('[data-swiss-content]');
    const icon = row.querySelector('[data-swiss-icon]');
    const indicator = row.querySelector('[data-swiss-indicator]');

    row.setAttribute('data-state', 'closed');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    if (content) {
      content.style.maxHeight = '0px';
      content.classList.add('opacity-0');
      content.classList.remove('opacity-100');
    }
    if (icon) {
      icon.style.transform = 'rotate(0deg)';
    }
    if (indicator) {
      indicator.classList.remove('bg-red', 'w-3');
      indicator.classList.add('bg-transparent', 'w-1.5');
    }
    row.classList.remove('row-expanded');
  };

  const openRow = (row) => {
    const trigger = row.querySelector('[data-swiss-trigger]');
    const content = row.querySelector('[data-swiss-content]');
    const icon = row.querySelector('[data-swiss-icon]');
    const indicator = row.querySelector('[data-swiss-indicator]');

    row.setAttribute('data-state', 'open');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    if (content) {
      content.style.maxHeight = `${content.scrollHeight + 40}px`;
      content.classList.remove('opacity-0');
      content.classList.add('opacity-100');
    }
    if (icon) {
      icon.style.transform = 'rotate(45deg)';
    }
    if (indicator) {
      indicator.classList.remove('bg-transparent', 'w-1.5');
      indicator.classList.add('bg-red', 'w-3');
    }
    row.classList.add('row-expanded');
  };

  rows.forEach((row, index) => {
    const trigger = row.querySelector('[data-swiss-trigger]');
    if (!trigger) return;

    // Inicializar fila 1 abierta por defecto, las demás cerradas
    if (index === 0) {
      openRow(row);
    } else {
      closeRow(row);
    }

    trigger.addEventListener('click', () => {
      const isOpen = row.getAttribute('data-state') === 'open';

      if (isOpen) {
        closeRow(row);
      } else {
        // Cerrar otras filas
        rows.forEach((r) => {
          if (r !== row) closeRow(r);
        });
        openRow(row);
      }
    });

    // Accesibilidad por teclado (Flechas de navegación)
    trigger.addEventListener('keydown', (e) => {
      const triggersArray = Array.from(document.querySelectorAll('[data-swiss-trigger]'));
      const currIdx = triggersArray.indexOf(trigger);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = triggersArray[(currIdx + 1) % triggersArray.length];
        next.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = triggersArray[(currIdx - 1 + triggersArray.length) % triggersArray.length];
        prev.focus();
      }
    });
  });

  // Reajustar maxHeight al redimensionar la ventana
  window.addEventListener('resize', () => {
    const openRowEl = document.querySelector('[data-swiss-row][data-state="open"]');
    if (openRowEl) {
      const content = openRowEl.querySelector('[data-swiss-content]');
      if (content) content.style.maxHeight = `${content.scrollHeight + 40}px`;
    }
  });
});
