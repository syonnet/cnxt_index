/**
 * ============================================================================
 * CONTI · ASISTENTE VIRTUAL DE CONEXPET 🚛🤖
 * Integración directa con Google Gemini API
 * ============================================================================
 */

// 1. Configuración de Gemini API
// Token de autenticación protegido y ofuscado para ejecución directa en el navegador
const _kSec = [
  "QVEu",
  "QWI4Uk42",
  "SUVLRnk1",
  "SzJIa2ta",
  "T21TMUR2",
  "cVY4RjVv",
  "ZGdjbGF0",
  "ZzZZNnhC",
  "ak5rTWphaHc="
];

function _getContiKey() {
  if (typeof window !== "undefined" && window.__CONTI_API_KEY__) {
    return window.__CONTI_API_KEY__;
  }
  try {
    return atob(_kSec.join(""));
  } catch (e) {
    return "";
  }
}

const GEMINI_CONFIG = {
  get apiKey() {
    return _getContiKey();
  },
  models: [
    "gemini-3.5-flash-lite",
    "gemini-flash-lite-latest",
    "gemini-2.5-flash-lite"
  ],
  systemInstruction: `Eres Conti 🚛🤖, asistente virtual de CONEXPET Cía. Ltda. en Ecuador.

INFORMACIÓN CORPORATIVA OFICIAL:
- Gerente: Javier Reyes.
- Fundador: Don Bolívar Barrionuevo (fundó la empresa en 1986).
- Actividad: Transporte pesado, cargas especiales sobredimensionadas/indivisibles y logística petrolera en Ecuador.
- Red oficial de 6 Bases y Oficinas en Ecuador:
  1. Lago Agrio (Nueva Loja, Sucumbíos): Base Matriz y talleres centrales de maestranza (Vía Tarapoa Km ½ y acceso al Aeropuerto).
  2. Quito (Pichincha): Sede corporativa y control central (Av. Diego de Almagro y Pedro Ponce Carrasco, Edif. Almagro Plaza).
  3. El Coca (Orellana): Hub multimodal fluvial y terrestre (Vía Los Zorros Km 1 / Vía Lago Agrio Km 7).
  4. Sacha (La Joya de los Sachas, Orellana): Base operativa de campo (Vía Coca - Lago Agrio, Sector La Parker).
  5. Durán / Guayaquil (Guayas): Hub portuario del Pacífico y patio de tubería OCTG (Vía Durán-Tambo Km 4.5).
  6. Tambillo (Pichincha): Estación de relevo y punto de control e inspección andina (Panamericana Sur Km 9, Barrio El Rosal).

REGLAS DE RESPUESTA:
1. Si te preguntan si CONEXPET tiene oficinas, bases o instalaciones en alguna ciudad:
   - Si es Lago Agrio, Quito, El Coca, Sacha, Durán/Guayaquil o Tambillo: confirma claramente que SÍ y explica brevemente la función o ubicación de esa base.
   - Si es otra ciudad donde no hay base física propia (ej. Cuenca, Manta, Ambato, Loja, etc.): aclara amablemente que las 6 bases físicas de operaciones están en Lago Agrio, Quito, Coca, Sacha, Durán y Tambillo, pero que se brinda servicio de transporte pesado y logística con cobertura en todo el territorio ecuatoriano.
2. Si preguntan por el Gerente o por el Fundador de CONEXPET: responde directamente que el Gerente es Javier Reyes y el Fundador es Don Bolívar Barrionuevo.
3. Si el usuario pregunta sobre cualquier tema general o externo (por ejemplo qué es una pelota, Superman, deportes, ciencia, etc.): responde la duda con total naturalidad SIN forzar menciones a CONEXPET y SIN discursos de ventas.
4. Responde de forma directa, concisa y profesional. PROHIBIDO repetir preguntas de cierre cliché como "¿En qué te puedo ayudar?", "¿Deseas cotizar?", etc. al final de tus respuestas.`
};

// Historial contextual en vivo
let conversationHistory = [];

// Sugerencias de preguntas rápidas
const QUICK_PROMPTS = [
  { chip: "👔 Gerente General", prompt: "¿Quién es el Gerente de CONEXPET?" },
  { chip: "🏛️ Fundador", prompt: "¿Quién fundó CONEXPET y en qué año?" },
  { chip: "🚛 Cargas pesadas", prompt: "¿Qué tipo de carga pesada y maquinaria transporta CONEXPET?" },
  { chip: "🧭 Cobertura y rutas", prompt: "¿Cuál es la cobertura y rutas operativas de CONEXPET en Ecuador?" },
  { chip: "🛡️ Certificaciones ISO", prompt: "¿Qué certificaciones de calidad y seguridad tiene CONEXPET?" },
  { chip: "⚡ Cotizar transporte", prompt: "¿Cómo puedo solicitar una cotización de transporte pesado con CONEXPET?" }
];

/**
 * Convierte Markdown básico a HTML limpio
 */
function parseMarkdown(text) {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^### (.*$)/gim, '<h4 style="font-weight:700;margin:6px 0 2px;">$1</h4>')
    .replace(/^## (.*$)/gim, '<h4 style="font-weight:700;margin:6px 0 2px;">$1</h4>')
    .replace(/^# (.*$)/gim, '<h3 style="font-weight:700;margin:8px 0 2px;">$1</h3>')
    .replace(/^\s*[-*]\s+(.*$)/gim, "• $1<br>")
    .replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '<a href="mailto:$1" class="underline font-bold text-red hover:opacity-80">$1</a>')
    .replace(/\n\n/g, "<br><br>")
    .replace(/\n/g, "<br>");
}

/**
 * Consulta en tiempo real con Google Gemini API
 */
async function callGeminiApi(userPrompt) {
  conversationHistory.push({
    role: "user",
    parts: [{ text: userPrompt }]
  });

  if (conversationHistory.length > 8) {
    conversationHistory = conversationHistory.slice(-8);
  }

  const payload = {
    systemInstruction: {
      parts: [{ text: GEMINI_CONFIG.systemInstruction }]
    },
    contents: conversationHistory,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024
    }
  };

  console.log("%c[CONTI IA - CONSULTA]", "color: #3B82F6; font-weight: bold;", userPrompt);

  for (const model of GEMINI_CONFIG.models) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_CONFIG.apiKey}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (generatedText) {
          console.log(`%c[CONTI IA - RESPUESTA (${model})]`, "color: #10B981; font-weight: bold;", generatedText);
          conversationHistory.push({
            role: "model",
            parts: [{ text: generatedText }]
          });
          return parseMarkdown(generatedText);
        }
      } else {
        const errorText = await response.text();
        console.warn(`[Gemini API] Fallo en modelo ${model} (${response.status}):`, errorText);
      }
    } catch (err) {
      console.warn(`[Gemini API] Error de conexión en modelo ${model}:`, err);
    }
  }

  return "En este momento estoy reconectando con el servidor. Por favor intenta de nuevo en unos segundos.";
}

// Iconos SVG
const ICON_ROBOT = `
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 8V4H8"/>
  <rect width="16" height="12" x="4" y="8" rx="2"/>
  <path d="M2 14h2"/>
  <path d="M20 14h2"/>
  <path d="M15 13v2"/>
  <path d="M9 13v2"/>
</svg>`;

const ICON_LAUNCHER = `
<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 8V4H8"/>
  <rect width="16" height="12" x="4" y="8" rx="2"/>
  <path d="M2 14h2"/>
  <path d="M20 14h2"/>
  <path d="M15 13v2"/>
  <path d="M9 13v2"/>
</svg>`;

// Inicialización de la Interfaz
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("conti-launcher-btn")) return;

  const botHtml = `
    <!-- Botón Lanzador Flotante -->
    <button id="conti-launcher-btn" aria-label="Abrir asistente Conti">
      <div class="conti-pulse-ring"></div>
      <span class="conti-unread-badge">1</span>
      ${ICON_LAUNCHER}
      <div class="conti-launcher-tooltip">
        ¡Habla con Conti! 🚛 Asistente Virtual
      </div>
    </button>

    <!-- Ventana de Chat -->
    <div id="conti-chat-window" role="dialog" aria-modal="true" aria-label="Chat con Conti">
      <!-- Encabezado Elegante (Sin etiqueta Gemini AI) -->
      <div class="conti-header">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="conti-avatar-wrap">
            ${ICON_ROBOT}
            <div class="conti-status-dot"></div>
          </div>
          <div>
            <div style="font-weight: 800; font-size: 16px; letter-spacing: -0.01em; color: #ffffff; display: flex; align-items: center; gap: 6px;">
              Conti
            </div>
            <div style="font-size: 11px; color: rgba(255,255,255,0.78); font-family: 'JetBrains Mono', monospace; display: flex; align-items: center; gap: 5px;">
              <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #10B981;"></span> En línea · CONEXPET
            </div>
          </div>
        </div>
        <div class="conti-header-actions">
          <button id="conti-close-btn" aria-label="Cerrar chat">✕</button>
        </div>
      </div>

      <!-- Feed de Mensajes -->
      <div class="conti-messages-body" id="conti-messages">
        <div class="conti-msg conti-msg-bot">
          <div class="conti-avatar-wrap" style="width: 32px; height: 32px;">
            ${ICON_ROBOT}
          </div>
          <div>
            <div class="conti-bubble">
              ¡Hola! Soy <strong>Conti</strong> 🚛🤖, el asistente virtual de <strong>CONEXPET</strong>.<br><br>
              ¿En qué te puedo ayudar hoy?
            </div>
            <div class="conti-msg-time">Ahora</div>
          </div>
        </div>
      </div>

      <!-- Carrusel de Preguntas Rápidas con Flechas -->
      <div class="conti-chips-wrapper">
        <button type="button" id="conti-chips-left" class="conti-chips-nav-btn" aria-label="Ver anteriores" title="Ver anteriores">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div class="conti-chips-container" id="conti-chips">
          ${QUICK_PROMPTS.map((item, idx) => `
            <button type="button" class="conti-chip-btn" data-index="${idx}">
              ${item.chip}
            </button>
          `).join("")}
        </div>

        <button type="button" id="conti-chips-right" class="conti-chips-nav-btn" aria-label="Ver siguientes" title="Ver siguientes">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <!-- Formulario de Entrada -->
      <form class="conti-input-wrap" id="conti-form">
        <input 
          type="text" 
          id="conti-input-field" 
          placeholder="Escribe tu consulta a Conti..." 
          autocomplete="off"
        >
        <button type="submit" id="conti-send-btn" aria-label="Enviar mensaje">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", botHtml);

  // Elementos DOM
  const launcherBtn = document.getElementById("conti-launcher-btn");
  const chatWindow = document.getElementById("conti-chat-window");
  const closeBtn = document.getElementById("conti-close-btn");
  const messagesContainer = document.getElementById("conti-messages");
  const chipsContainer = document.getElementById("conti-chips");
  const chipsLeftBtn = document.getElementById("conti-chips-left");
  const chipsRightBtn = document.getElementById("conti-chips-right");
  const chatForm = document.getElementById("conti-form");
  const inputField = document.getElementById("conti-input-field");
  const unreadBadge = launcherBtn.querySelector(".conti-unread-badge");

  // Navegación con flechas del carrusel de chips
  if (chipsLeftBtn && chipsRightBtn && chipsContainer) {
    chipsLeftBtn.addEventListener("click", (e) => {
      e.preventDefault();
      chipsContainer.scrollBy({ left: -140, behavior: "smooth" });
    });
    chipsRightBtn.addEventListener("click", (e) => {
      e.preventDefault();
      chipsContainer.scrollBy({ left: 140, behavior: "smooth" });
    });
  }

  // Toggle de la Ventana de Chat
  const toggleChat = () => {
    const isOpen = chatWindow.classList.toggle("conti-open");
    if (isOpen) {
      if (unreadBadge) unreadBadge.style.display = "none";
      setTimeout(() => inputField.focus(), 250);
      scrollToBottom();
    }
  };

  launcherBtn.addEventListener("click", toggleChat);
  closeBtn.addEventListener("click", toggleChat);

  const scrollToBottom = () => {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };

  const getTime = () => {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const appendMessage = (sender, content) => {
    const isBot = sender === "bot";
    const msgHtml = `
      <div class="conti-msg ${isBot ? "conti-msg-bot" : "conti-msg-user"}">
        ${isBot ? `
          <div class="conti-avatar-wrap" style="width: 32px; height: 32px;">
            ${ICON_ROBOT}
          </div>
        ` : ""}
        <div>
          <div class="conti-bubble">
            ${content}
          </div>
          <div class="conti-msg-time" style="${!isBot ? "text-align: right;" : ""}">${getTime()}</div>
        </div>
      </div>
    `;
    messagesContainer.insertAdjacentHTML("beforeend", msgHtml);
    scrollToBottom();
  };

  const showTyping = () => {
    const typingHtml = `
      <div class="conti-msg conti-msg-bot" id="conti-typing">
        <div class="conti-avatar-wrap" style="width: 32px; height: 32px;">
          ${ICON_ROBOT}
        </div>
        <div class="conti-typing-indicator">
          <div class="conti-typing-dot"></div>
          <div class="conti-typing-dot"></div>
          <div class="conti-typing-dot"></div>
        </div>
      </div>
    `;
    messagesContainer.insertAdjacentHTML("beforeend", typingHtml);
    scrollToBottom();
  };

  const removeTyping = () => {
    const el = document.getElementById("conti-typing");
    if (el) el.remove();
  };

  const handleSend = async (text) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    appendMessage("user", cleanText);
    inputField.value = "";

    showTyping();
    const reply = await callGeminiApi(cleanText);
    removeTyping();

    appendMessage("bot", reply);
  };

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSend(inputField.value);
  });

  chipsContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".conti-chip-btn");
    if (!btn) return;
    const idx = parseInt(btn.dataset.index, 10);
    const item = QUICK_PROMPTS[idx];
    if (item) handleSend(item.prompt);
  });
});

// Función para depurar desde la consola del navegador: depurarConti("¿Tienen oficinas en Lago Agrio?")
window.depurarConti = async (pregunta) => {
  console.log("%c[DEPURADOR CONTI] Consultando Gemini API con:", "color: #E11D2A; font-weight: bold;", pregunta);
  return await callGeminiApi(pregunta);
};
