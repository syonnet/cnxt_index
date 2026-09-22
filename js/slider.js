/**
 * CONEXPET — Módulo JS: Slider Cinemático de la Flota Especializada
 */

document.addEventListener('DOMContentLoaded', () => {
  const csliderSection = document.getElementById('flota') || document.getElementById('galeria-flota');
  if (!csliderSection) return;

  const csliderList = csliderSection.querySelector('.cnx-cslider-list');
  if (!csliderList) return;

  // Botones de navegación Anterior y Siguiente
  csliderSection.addEventListener('click', (e) => {
    const nextBtn = e.target.closest('.cnx-cslider-next');
    const prevBtn = e.target.closest('.cnx-cslider-prev');
    const items = csliderList.querySelectorAll('.cnx-cslider-item');

    if (nextBtn && items.length > 0) {
      csliderList.append(items[0]);
    }
    if (prevBtn && items.length > 0) {
      csliderList.prepend(items[items.length - 1]);
    }
  });

  // Hacer clic directo en una tarjeta flotante lateral la trae al frente
  csliderList.addEventListener('click', (e) => {
    const clickedItem = e.target.closest('.cnx-cslider-item');
    if (clickedItem && !e.target.closest('a') && !e.target.closest('button')) {
      const items = Array.from(csliderList.querySelectorAll('.cnx-cslider-item'));
      const clickedIndex = items.indexOf(clickedItem);
      if (clickedIndex > 1) {
        for (let i = 0; i < clickedIndex - 1; i++) {
          csliderList.append(csliderList.querySelectorAll('.cnx-cslider-item')[0]);
        }
      }
    }
  });
});
