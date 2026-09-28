/**
 * CONEXPET — Módulo JS: Cobertura Nacional, Mapa Satelital & Card Orgánica de Ciudad
 * Información estrictamente informativa y comercial (cero datos privados ni coordenadas GPS)
 */

document.addEventListener('DOMContentLoaded', () => {
  const basesData = {
    '1': {
      region: 'Amazonía Petrolera',
      regionTheme: 'emerald',
      regionBadgeClasses: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
      ciudad: 'Nueva Loja (Lago Agrio)',
      provincia: 'Sucumbíos — Cuenca Petrolera Norte',
      tipo: 'Base Matriz & Centro Operativo',
      estado: 'Operaciones 24/7',
      descripcion: 'Sede central de operaciones en el Oriente ecuatoriano. Cuenta con infraestructura in-house de talleres de maestranza mecánica, amplio parque de maniobras y despacho prioritario de convoyes pesados hacia plataformas y bloques petroleros.',
      ubicacion: 'Vía Tarapoa Km ½ y acceso al Aeropuerto',
      servicios: ['Cabezales 6x4', 'Tanqueros Vacuum', 'Talleres In-House', 'Grúas Telescópicas'],
      contactoUrl: '#contacto'
    },
    '2': {
      region: 'Amazonía Petrolera',
      regionTheme: 'emerald',
      regionBadgeClasses: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
      ciudad: 'La Joya de los Sachas',
      provincia: 'Orellana — Enlace Directo a Bloques',
      tipo: 'Base Operativa de Campo',
      estado: 'Respuesta en Pozo 24/7',
      descripcion: 'Punto de apoyo táctico y respuesta ágil en locación. Diseñado para la atención rápida de requerimientos operativos en pozo, transferencia continua de lodos y fluidos de perforación y sostenimiento de taladros activos.',
      ubicacion: 'Vía Coca - Lago Agrio, Sector La Parker',
      servicios: ['Fluidos & Lodos', 'Cisternas Vacuum', 'Auxilio Mecánico', 'Carga Petrolera'],
      contactoUrl: '#contacto'
    },
    '3': {
      region: 'Amazonía Fluvial & Terrestre',
      regionTheme: 'teal',
      regionBadgeClasses: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/25',
      ciudad: 'Puerto Francisco de Orellana (El Coca)',
      provincia: 'Orellana — Hub Multimodal',
      tipo: 'Hub Multimodal Fluvial & Terrestre',
      estado: 'Operaciones 24/7',
      descripcion: 'Centro logístico neurálgico para movilizaciones complejas de taladros (Rig Move), izajes de alto tonelaje de hasta 120 t y conexión con barcazas fluviales para el abastecimiento de los bloques petroleros en la cuenca del Río Napo y Bloque 43.',
      ubicacion: 'Vía Los Zorros Km 1 / Vía Lago Agrio Km 7',
      servicios: ['Grúas hasta 120 t', 'Rig Move', 'Plataformas & Lowboys', 'Conexión Fluvial'],
      contactoUrl: '#contacto'
    },
    '4': {
      region: 'Distrito Metropolitano / Sierra',
      regionTheme: 'amber',
      regionBadgeClasses: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25',
      ciudad: 'Quito (Distrito Metropolitano)',
      provincia: 'Pichincha — Sede Corporativa',
      tipo: 'Sede Corporativa & Control Central',
      estado: 'Atención Comercial 24/7',
      descripcion: 'Sede administrativa principal de Conexpet. Desde aquí se coordinan contratos corporativos, licitaciones de gran porte, supervisión de calidad y seguridad HSEQ y la atención personalizada para clientes y operadoras.',
      ubicacion: 'Av. Diego de Almagro y Pedro Ponce Carrasco (Edif. Almagro Plaza)',
      servicios: ['Gerencia HSEQ', 'Contratos Corporativos', 'Monitoreo de Flota', 'Atención Comercial'],
      contactoUrl: '#contacto'
    },
    '5': {
      region: 'Litoral Pacífico / Costa',
      regionTheme: 'sky',
      regionBadgeClasses: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/25',
      ciudad: 'Durán (Gran Guayaquil)',
      provincia: 'Guayas — Enlace Portuario',
      tipo: 'Hub Portuario del Pacífico',
      estado: 'Recepción Portuaria 24/7',
      descripcion: 'Acceso directo a las principales terminales marítimas del Pacífico (Contecon, DP World). Especializado en recepción y nacionalización de tubería petrolera OCTG, maquinaria extradimensionada y despacho terrestre hacia la Sierra y Amazonía.',
      ubicacion: 'Vía Durán - Tambo Km 4.5 (Sector Industrial)',
      servicios: ['Recepción Portuaria', 'Tubería OCTG', 'Cargas Sobredimensionadas', 'Despacho Terrestre'],
      contactoUrl: '#contacto'
    },
    '6': {
      region: 'Eje Panamericano Sur / Sierra',
      regionTheme: 'indigo',
      regionBadgeClasses: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/25',
      ciudad: 'Tambillo (Cantón Mejía)',
      provincia: 'Pichincha — Corredor Panamericano',
      tipo: 'Estación de Relevo & Inspección Andina',
      estado: 'Punto de Control 24/7',
      descripcion: 'Estación estratégica sobre la carretera Panamericana Sur. Punto de relevo reglamentario para tripulaciones, revisión preventiva de frenos auxiliares Jake Brake y verificación de amarre de carga antes de iniciar el descenso hacia la cordillera.',
      ubicacion: 'Panamericana Sur Km 9 (Barrio El Rosal)',
      servicios: ['Relevo de Conductores', 'Inspección de Frenos', 'Consolidación de Carga', 'Soporte de Ruta'],
      contactoUrl: '#contacto'
    }
  };

  const hudModalEl = document.getElementById('cnx-base-modal');
  const hudBackdrop = document.getElementById('cnx-modal-backdrop');
  const hudCloseBtn = document.getElementById('cnx-modal-close-btn');
  const hudSecondaryBtn = document.getElementById('cnx-modal-secondary-btn');
  
  // Elementos de la Card Orgánica
  const regionBadgeEl = document.getElementById('cnx-modal-region-badge');
  const regionTextEl = document.getElementById('cnx-modal-region-text');
  const baseTypeEl = document.getElementById('cnx-modal-base-type');
  const statusTextEl = document.getElementById('cnx-modal-status-text');
  const cityTitleEl = document.getElementById('cnx-modal-city-title');
  const citySubtitleEl = document.getElementById('cnx-modal-city-subtitle');
  const descEl = document.getElementById('cnx-modal-desc');
  const locationEl = document.getElementById('cnx-modal-location');
  const servicesListEl = document.getElementById('cnx-modal-services-list');
  const ctaBtn = document.getElementById('cnx-modal-cta-btn');
  const ctaText = document.getElementById('cnx-modal-cta-text');

  const mapPins = document.querySelectorAll('.cnx-map-pin');
  const baseChips = document.querySelectorAll('.cnx-base-chip');

  function openBaseModal(baseId) {
    const data = basesData[baseId];
    if (!data || !hudModalEl) return;

    if (regionTextEl) regionTextEl.textContent = data.region;
    if (regionBadgeEl) {
      regionBadgeEl.className = `inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wide uppercase border ${data.regionBadgeClasses}`;
    }
    if (baseTypeEl) baseTypeEl.textContent = data.tipo;
    if (statusTextEl) statusTextEl.textContent = data.estado;
    if (cityTitleEl) cityTitleEl.textContent = data.ciudad;
    if (citySubtitleEl) citySubtitleEl.textContent = data.provincia;
    if (descEl) descEl.textContent = data.descripcion;
    if (locationEl) locationEl.textContent = data.ubicacion;

    if (servicesListEl && Array.isArray(data.servicios)) {
      servicesListEl.innerHTML = data.servicios.map(serv => `
        <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-paper dark:bg-white/5 border border-steel/70 dark:border-white/10 text-xs font-medium text-carbon dark:text-white shadow-2xs">
          <span class="w-1.5 h-1.5 rounded-full bg-red"></span>
          <span>${serv}</span>
        </span>
      `).join('');
    }

    if (ctaText) ctaText.textContent = `Cotizar Transporte desde ${data.ciudad.split(' ')[0]}`;
    if (ctaBtn) ctaBtn.href = data.contactoUrl || '#contacto';

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
