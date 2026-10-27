<div align="center">

# CONEXPET S.A. · PLATAFORMA DIGITAL INSTITUCIONAL

[![Status](https://img.shields.io/badge/Status-Production%20Ready-emerald?style=for-the-badge&logo=statuspage)](https://conexpet.com)
[![Version](https://img.shields.io/badge/Version-1.0.0-red?style=for-the-badge)](https://github.com/syonnet/cnxt_index)
[![Standards](https://img.shields.io/badge/Standards-ISO%209001%20%7C%2014001%20%7C%2045001%20%7C%20BASC-black?style=for-the-badge)](https://conexpet.com)
[![Compliance](https://img.shields.io/badge/Compliance-LOPDP%20Ecuador%20%28POL--SIG--02%29-blue?style=for-the-badge)](https://conexpet.com)

<p align="center">
  <b>Ingeniería y Logística de Alto Nivel para la Industria Energética, Petrolera e Industrial del Ecuador</b>
  <br>
  <i>40 Años de Trayectoria (1986 – 2026) · Flota Pesada · Izaje Especializado · Cobertura Nacional Estratégica</i>
</p>

---

</div>

## 📌 Tabla de Contenidos

- [1. Descripción del Proyecto](#1-descripción-del-proyecto)
- [2. Arquitectura de Software y Stack Tecnológico](#2-arquitectura-de-software-y-stack-tecnológico)
- [3. Estructura de Directorios](#3-estructura-de-directorios)
- [4. Módulos y Componentes de Ingeniería](#4-módulos-y-componentes-de-ingeniería)
  - [4.1 Conti-Bot 7.0 (Asistente Logístico)](#41-conti-bot-70-asistente-logístico)
  - [4.2 Motor de Parallax Multi-Capa](#42-motor-de-parallax-multi-capa)
  - [4.3 Sistema de Sliders y HUD de Telemetría](#43-sistema-de-sliders-y-hud-de-telemetría)
  - [4.4 Red Logística y Mapa Interactivo de Cobertura](#44-red-logística-y-mapa-interactivo-de-cobertura)
  - [4.5 Módulo de Cumplimiento Legal y Tratamiento de Datos (LOPDP)](#45-módulo-de-cumplimiento-legal-y-tratamiento-de-datos-lopdp)
  - [4.6 Portal 404 (Zero-G Space Experience)](#46-portal-404-zero-g-space-experience)
- [5. Instalación y Despliegue Local](#5-instalación-y-despliegue-local)
- [6. Directrices de Calidad, Rendimiento y SEO](#6-directrices-de-calidad-rendimiento-y-seo)
- [7. Flujo de Control de Versiones (Git Workflow)](#7-flujo-de-control-de-versiones-git-workflow)
- [8. Créditos y Autoría](#8-créditos-y-autoría)

---

## 1. Descripción del Proyecto

La plataforma web de **CONEXPET CÍA. LTDA.** es un portal de ingeniería frontend de alto rendimiento diseñado para representar la infraestructura operativa, solvencia técnica y catálogo de servicios de transporte pesado, movilización de RIGs (taladros petroleros), transporte de fluidos/combustibles e izaje de alto tonelaje en territorio ecuatoriano.

Diseñado bajo una estética **industrial suiza/neobrutalista hipermoderna**, combina interfaces tácticas de visualización de datos con microinteracciones fluidas, soporte de tema oscuro/claro de grado aeroespacial, y optimización estricta para terminales móviles y de escritorio.

---

## 2. Arquitectura de Software y Stack Tecnológico

La plataforma adopta el paradigma **Vanilla Modern Web Architecture**: sin sobrecargas de frameworks pesados, garantizando tiempos de carga ultrarrápidos (First Contentful Paint < 0.6s) y un ciclo de vida predecible en cualquier infraestructura de hosting estático o CDN perimetral.

```
┌──────────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                     │
│    HTML5 Semántico + Tailwind CSS (Utility Engine JIT)       │
│    + Vanilla CSS Custom Properties (Theme Tokens)            │
├──────────────────────────────────────────────────────────────┤
│                    CAPA DE COMPORTAMIENTO                    │
│    JavaScript ES2022 Modular Desacoplado                     │
│    (IntersectionObserver, Web Audio, RequestAnimationFrame)   │
├──────────────────────────────────────────────────────────────┤
│                    ACTIVOS Y COMPRESIÓN                      │
│    WebP Media + SVG Icons + Formatos Vectoriales Optimizados │
├──────────────────────────────────────────────────────────────┤
│                    COMPLIANCE Y SEGURIDAD                    │
│    CORS Headers, Sandboxed iframes, LOPDP Sanitization        │
└──────────────────────────────────────────────────────────────┘
```

### Tecnologías Clave:
- **Core Markup:** HTML5 Semántico estructurado con accesibilidad WCAG 2.1 AA.
- **Styling Architecture:** Tailwind CSS CDN Engine combinado con módulos de hojas de estilo (`css/*.css`) dedicadas por componente.
- **Dynamic Theming:** Sistema reactivo de variables CSS (`--bg-primary`, `--accent-red`, `--carbon-tone`) con sincronización bidireccional `localStorage` y media queries `prefers-color-scheme`.
- **Media Optimization:** Conversión integral de imágenes de flota e infraestructura al formato de compresión moderna **WebP** y video background optimizado en **MP4 H.264**.

---

## 3. Estructura de Directorios

```tree
cnxt_index/
├── .gitignore                    # Reglas de exclusión (documentos, binarios, temporales)
├── README.md                     # Documentación técnica del repositorio
├── index.html                    # Landing page principal y catálogo general
├── flota.html                    # Especificaciones de unidades, capacidades y equipos
├── cobertura.html                # Matriz logística nacional, bases y corredores viales
├── 404.html                      # Manejador de error interactivo gravedad cero
├── script.js                     # Controlador core de UI, modales y validación de forms
├── styles.css                    # Estilos globales, diseño de tokens y reset
│
├── assets/                       # Recursos estáticos de alta densidad
│   ├── hero-video.mp4            # Video institucional principal
│   ├── hero-video-web.mp4        # Video background comprimido para web
│   ├── logos/                    # Identidad de marca, imagotipos e isolux
│   └── pdf/
│       └── PDPv2.pdf             # Política de Protección de Datos Personales (POL-SIG-02)
│
├── css/                          # Hojas de estilo modulares por subsistema
│   ├── 404.css                   # Animaciones orbitales y física espacial del 404
│   ├── cobertura.css             # Marcadores de mapa, matrices de rutas y tabs tácticos
│   ├── conti-bot.css             # Glassmorphism, viewport flotante y mensajes del bot
│   ├── flip-cards.css            # Transformadas 3D de tarjetas de especificaciones
│   ├── navbar.css                # Header flotante, blur dinámico y menú móvil
│   ├── parallax.css              # Canvas visual y niveles de profundidad Z
│   └── slider.css                # Transiciones, paginación HUD y cronómetros de slide
│
├── js/                           # Lógica desacoplada y módulos funcionales
│   ├── 404.js                    # Motor físico de partículas y acelerómetro
│   ├── cobertura.js              # Controlador del sistema de red logística
│   ├── conti-bot.js              # Cerebro conversacional y árbol de decisiones logísticas
│   ├── flip-cards.js             # Gestor de eventos táctiles/hover para fichas técnicas
│   ├── navbar.js                 # Manejador del header reactivo al scroll y dark mode
│   ├── parallax.js               # Cálculo cinemático de scroll en capas visuales
│   ├── scrollytelling.js         # Disparador de animaciones por umbral de visibilidad
│   ├── services-console.js       # Consola de servicios e inspección técnica
│   ├── slider.js                 # Carrusel autónomo con aceleración por hardware
│   └── swiss-rows.js             # Acordeones y tablas de arquitectura helvética
│
└── images/                       # Activos gráficos optimizados (WebP / SVG)
    ├── brazos_H.webp             # Brazo grúa hidráulico
    ├── cama_baja.webp            # Cama baja para carga sobredimensionada
    ├── lowboys.webp              # Semirremolques cuello de ganso
    ├── truck-heavy.webp          # Cabezales de tracción pesada 6x4
    ├── vacuum-tanker.webp        # Tanqueros y bombas de vacío
    ├── oilfield-crane.webp       # Grúas telescópicas para campos petroleros
    ├── ec_mapa.webp              # Mapa geoespacial de la República del Ecuador
    ├── conocenos/                # Registro fotográfico operativo
    └── parallax/                 # Capas de profundidad (cordillera, nubes, atmósfera)
```

---

## 4. Módulos y Componentes de Ingeniería

### 4.1 Conti-Bot 7.0 (Asistente Logístico)
- **Archivo:** `js/conti-bot.js` · `css/conti-bot.css`
- **Características:** Asistente conversacional virtual con arquitectura de respuestas basadas en heurística contextual. Permite cotizar directamente, canalizar solicitudes a WhatsApp empresarial con payloads estructurados, consultar especificaciones técnicas y resolver dudas sobre políticas de transporte y permisos MTOP/ARH. Incluye modo minimizado, sonidos de respuesta mediante Web Audio API sintético y almacenamiento de estado de sesión.

### 4.2 Motor de Parallax Multi-Capa
- **Archivo:** `js/parallax.js` · `css/parallax.css`
- **Características:** Renderizado de múltiples planos visuales sincronizados con la tasa de refresco de pantalla mediante `window.requestAnimationFrame`. Emplea transformaciones `translate3d` para acelerar el procesamiento en GPU (hardware acceleration), evitando recálculos de layout (`reflow`) en el hilo principal del DOM.

### 4.3 Sistema de Sliders y HUD de Telemetría
- **Archivo:** `js/slider.js` · `css/slider.css`
- **Características:** Carrusel táctil con aceleración inercial y soporte para punteros táctiles (`touch-events`). Cada slide despliega un HUD (*Heads-Up Display*) técnico con métricas de tracción, potencia, tonelaje y dimensiones de cada categoría de la flota vehicular.

### 4.4 Red Logística y Mapa Interactivo de Cobertura
- **Archivo:** `cobertura.html` · `js/cobertura.js` · `css/cobertura.css`
- **Características:** Representación cartográfica de las bases estratégicas operativas (Quito, Guayaquil, Lago Agrio, Coca, Shushufindi, Puyo). Incluye selector dinámico de rutas interandinas y amazónicas con cálculo estimado de tiempos, requerimientos de escolta vial y especificaciones de puente.

### 4.5 Módulo de Cumplimiento Legal y Tratamiento de Datos (LOPDP)
- **Archivos:** `index.html`, `flota.html`, `cobertura.html` · `script.js` · `assets/pdf/PDPv2.pdf`
- **Normativa:** Ley Orgánica de Protección de Datos Personales (Ecuador) · Resolución DPD Oficial · Documento SIG: **POL-SIG-02 (Versión 02)**.
- **Características:** Modal accesible por teclado (`Escape`, navegación por tabs) con dos paneles estructurados:
  1. *Política de Protección de Datos Personales:* Detalle de finalidades, derechos ARCO (Acceso, Rectificación, Cancelación, Oposición), canales de contacto DPD (`datospersonales@conexpet.com`) y descarga directa del PDF institucional firmado.
  2. *Términos y Condiciones:* Términos de cotización web, sistemas de gestión HSEQ (ISO 9001, 14001, 45001, BASC, 39001) y principios de Responsabilidad Social Empresarial.

### 4.6 Portal 404 (Zero-G Space Experience)
- **Archivo:** `404.html` · `js/404.js` · `css/404.css`
- **Características:** Entorno interactivo temático que simula ingravidez espacial con estrellas dinámicas generadas en Canvas y micro-interacciones de física recreativa al pasar el cursor, orientando fluidamente al usuario de vuelta a las operaciones terrestres.

---

## 5. Instalación y Despliegue Local

No requiere de compiladores como Webpack o Vite para el entorno de ejecución, aunque puede servirse con cualquier servidor HTTP local:

### Requisitos Previos:
- Navegador moderno con soporte para ES6+ (Chrome, Firefox, Safari, Edge).
- Servidor web local ligero (opcional, pero recomendado para evitar restricciones CORS con módulos locales).

### Ejecución Local:

#### Opción 1: Con Python (Rápido)
```bash
# Navegar a la carpeta del proyecto
cd cnxt_index

# Iniciar servidor local en el puerto 8000
python -m http.server 8000
```
Abrir navegador en: `http://localhost:8000`

#### Opción 2: Con Node.js (`npx serve`)
```bash
npx -y serve . -l 3000
```
Abrir navegador en: `http://localhost:3000`

#### Opción 3: Con la extensión Live Server de VS Code
Hacer clic derecho sobre `index.html` y seleccionar **"Open with Live Server"**.

---

## 6. Directrices de Calidad, Rendimiento y SEO

- **Imágenes:** Todo nuevo activo visual debe suministrarse preferentemente en formato `.webp`, optimizado por debajo de 350 KB por fotografía estándar y 1.2 MB en banners full-width.
- **Microdatos & SEO:** Cada documento HTML cuenta con metaetiquetas OpenGraph (`og:title`, `og:image`, `og:description`) y Twitter Cards, además de estructura jerárquica limpia con un único `<h1>` por documento.
- **Accesibilidad (a11y):** Los botones interactivos y modales cuentan con atributos `aria-expanded`, `aria-label`, `aria-hidden` y `role="dialog"` para compatibilidad con lectores de pantalla.

---

## 7. Flujo de Control de Versiones (Git Workflow)

El repositorio opera bajo una convención estricta de ramas:

- `main`: Código en estado de producción estable. Protegido para despliegues.
- `Dev`: Rama de integración activa para pruebas de diseño, nuevos módulos y refactorizaciones.

### Política de Exclusión (.gitignore)
Se encuentra estrictamente prohibido el versionado de:
- Documentos de procesamiento de texto (`*.docx`, `*.doc`, `*.txt`).
- Archivos de bloqueo temporal generados por Microsoft Office (`~$*`).
- Archivos comprimidos o backups en desuso (`*.zip`, `*.tar`, `*.initial.backup.html`).

---

## 8. Créditos y Autoría

- **Organización:** [CONEXPET CÍA. LTDA.](https://conexpet.com)
- **Diseño & Ingeniería de Software:** Victor Ojeda (`//VoJ.DEV// · Enterprise Engineering`)
- **Vigencia Operativa:** 1986 – 2026 · *40 Años en Ruta · República del Ecuador*
