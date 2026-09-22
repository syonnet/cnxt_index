/**
 * CONEXPET — Módulo JS: Cobertura Nacional, Mapa Satelital & Modal HUD
 */

document.addEventListener('DOMContentLoaded', () => {
  const basesData = {
    '1': {
      nodo: 'Base Matriz N01',
      ciudad: 'Nueva Loja',
      subtitulo: 'Lago Agrio — Sucumbíos (Matriz)',
      estado: 'Operativa 24/7',
      direccion: 'Vía al aeropuerto Km ½ y Vía Tarapoa (Oficina Principal y Talleres).',
      rol: 'Oficina matriz, coordinación central de flota pesada para operaciones petroleras, taller central y asistencia mecánica de emergencia inmediata.',
      coords: '00°05\'05"N 76°53\'01"W'
    },
    '2': {
      nodo: 'Nodo N02',
      ciudad: 'Sacha',
      subtitulo: 'La Joya de los Sachas — Orellana',
      estado: 'Operativa 24/7',
      direccion: 'Barrio La Parker, diagonal a EP Petroecuador B60.',
      rol: 'Soporte táctico y respuesta rápida en locaciones de pozo, taladros y bloques petroleros estratégicos de la cuenca amazónica.',
      coords: '00°21\'43"S 76°51\'36"W'
    },
    '3': {
      nodo: 'Nodo N03',
      ciudad: 'El Coca',
      subtitulo: 'Francisco de Orellana',
      estado: 'Operativa 24/7',
      direccion: 'Vía a Lago Agrio, Km 7, ingreso a Corazón del Oriente.',
      rol: 'Conexión fluvial y terrestre estratégica con el bloque Orellana/Pastaza y logística multimodal hacia la cuenca del Río Napo.',
      coords: '00°27\'48"S 76°59\'31"W'
    },
    '4': {
      nodo: 'Nodo N04',
      ciudad: 'Quito',
      subtitulo: 'Distrito Metropolitano — Pichincha',
      estado: 'Administración',
      direccion: 'Pedro Ponce Carrasco E8-06 y Av. Diego de Almagro, Edif. Almagro Plaza, Of. 603.',
      rol: 'Sede corporativa central, administración financiera, relaciones comerciales corporativas, gestión de contratos y supervisión integral de telemetría.',
      coords: '00°12\'09"S 78°29\'23"W'
    },
    '5': {
      nodo: 'Nodo N05',
      ciudad: 'Durán',
      subtitulo: 'Gran Guayaquil — Guayas',
      estado: 'Conexión Puerto',
      direccion: 'Solar #1, manzana U, área 24-L (Acceso estratégico a puertos marítimos).',
      rol: 'Acceso directo a terminales portuarias del Pacífico para recepción y traslado expedito de maquinaria pesada, tubería y carga extra-dimensionada.',
      coords: '02°10\'24"S 79°49\'52"W'
    },
    '6': {
      nodo: 'Nodo N06',
      ciudad: 'Tambillo',
      subtitulo: 'Cantón Mejía — Eje Sierra Central',
      estado: 'Eje Sierra',
      direccion: 'Cantón Mejía, Panamericana Sur Km 9, Barrio El Rosal.',
      rol: 'Punto de control y transbordo clave para el cruce cordillerano andino y la distribución logística de carga pesada a lo largo del corredor Panamericano.',
      coords: '00°24\'35"S 78°33\'12"W'
    }
  };

  const hudModalEl = document.getElementById('cnx-base-modal');
  const hudBackdrop = document.getElementById('cnx-modal-backdrop');
  const hudCloseBtn = document.getElementById('cnx-modal-close-btn');
  const hudSecondaryBtn = document.getElementById('cnx-modal-secondary-btn');
  const nodeTagEl = document.getElementById('cnx-modal-node-tag');
  const statusTextEl = document.getElementById('cnx-modal-status-text');
  const cityTitleEl = document.getElementById('cnx-modal-city-title');
  const citySubtitleEl = document.getElementById('cnx-modal-city-subtitle');
  const addressEl = document.getElementById('cnx-modal-address');
  const roleEl = document.getElementById('cnx-modal-role');
  const coordsEl = document.getElementById('cnx-modal-coords');

  const mapPins = document.querySelectorAll('.cnx-map-pin');
  const baseChips = document.querySelectorAll('.cnx-base-chip');

  function openBaseModal(baseId) {
    const data = basesData[baseId];
    if (!data || !hudModalEl) return;

    if (nodeTagEl) nodeTagEl.textContent = `${data.nodo.toUpperCase()} // TELEMETRÍA`;
    if (statusTextEl) statusTextEl.textContent = data.estado;
    if (cityTitleEl) cityTitleEl.textContent = data.ciudad;
    if (citySubtitleEl) citySubtitleEl.textContent = data.subtitulo;
    if (addressEl) addressEl.textContent = data.direccion;
    if (roleEl) roleEl.textContent = data.rol;
    if (coordsEl) coordsEl.textContent = data.coords;

    // Resaltar pin y chip correspondiente
    mapPins.forEach(p => p.classList.toggle('is-active', p.getAttribute('data-base-id') === baseId));
    baseChips.forEach(c => c.classList.toggle('is-active', c.getAttribute('data-base-id') === baseId));

    hudModalEl.classList.remove('hidden');
    hudModalEl.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => {
      hudModalEl.classList.add('is-open');
    });
  }

  function closeBaseModal() {
    if (!hudModalEl) return;
    hudModalEl.classList.remove('is-open');
    hudModalEl.setAttribute('aria-hidden', 'true');
    mapPins.forEach(p => p.classList.remove('is-active'));
    baseChips.forEach(c => c.classList.remove('is-active'));

    setTimeout(() => {
      if (!hudModalEl.classList.contains('is-open')) {
        hudModalEl.classList.add('hidden');
      }
    }, 250);
  }

  // Clic en los pines del mapa
  mapPins.forEach(pin => {
    pin.addEventListener('click', (e) => {
      e.preventDefault();
      const baseId = pin.getAttribute('data-base-id');
      openBaseModal(baseId);
    });
  });

  // Clic en los chips de la barra inferior
  baseChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      const baseId = chip.getAttribute('data-base-id');
      openBaseModal(baseId);
    });
  });

  // Cierre del modal
  if (hudCloseBtn) hudCloseBtn.addEventListener('click', closeBaseModal);
  if (hudSecondaryBtn) hudSecondaryBtn.addEventListener('click', closeBaseModal);
  if (hudBackdrop) hudBackdrop.addEventListener('click', closeBaseModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hudModalEl && !hudModalEl.classList.contains('hidden')) {
      closeBaseModal();
    }
  });
});
