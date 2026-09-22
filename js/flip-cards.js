/**
 * CONEXPET — Módulo JS: Tarjetas 3D Flip de Servicios (Hover & Táctil en Móviles)
 */

document.addEventListener('DOMContentLoaded', () => {
  const flipCards = document.querySelectorAll('.service-flip-card');
  if (flipCards.length === 0) return;

  flipCards.forEach((card) => {
    // Volteo por clic en dispositivos táctiles / móviles
    card.addEventListener('click', (e) => {
      // Si el usuario hace clic directamente en un enlace o botón de acción, no alternar el flip
      if (e.target.closest('a') || e.target.closest('button')) return;
      card.classList.toggle('is-flipped');
    });

    // Accesibilidad por teclado: alternar con Enter o Barra Espaciadora
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.closest('a') || e.target.closest('button')) return;
        e.preventDefault();
        card.classList.toggle('is-flipped');
      }
    });
  });
});
