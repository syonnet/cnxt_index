<?php
/**
 * CONEXPET CÍA. LTDA. — Endpoint Nativo de Recepción de Cotizaciones (cPanel)
 * Procesa los formularios de Flota (#form-flota) y Cobertura (#form-cobertura)
 * y envía la notificación directamente al correo corporativo oficial.
 */

header('Content-Type: application/json; charset=UTF-8');

// Permitir únicamente peticiones POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido. Use POST.'
    ]);
    exit;
}

// Leer payload JSON (fetch AJAX) o $_POST tradicional
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);
if (!is_array($data) || empty($data)) {
    $data = $_POST;
}

// Función de limpieza y sanitización contra inyección de cabeceras
function clean_field($value) {
    if (!is_string($value)) {
        return '';
    }
    $value = trim($value);
    $value = str_replace(["\r", "\n", "%0a", "%0d"], ' ', $value);
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

$nombre         = clean_field($data['nombre'] ?? '');
$empresa        = clean_field($data['empresa'] ?? '');
$email          = filter_var(trim($data['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$telefono       = clean_field($data['telefono'] ?? '');
$unidad         = clean_field($data['unidad_requerida'] ?? '');
$rutaDestino    = clean_field($data['ruta_destino'] ?? '');
$baseOrigen     = clean_field($data['base_origen'] ?? '');
$destinoFinal   = clean_field($data['destino_final'] ?? '');
$detalles       = isset($data['detalles_carga'])
    ? htmlspecialchars(trim($data['detalles_carga']), ENT_QUOTES, 'UTF-8')
    : (isset($data['descripcion_carga']) ? htmlspecialchars(trim($data['descripcion_carga']), ENT_QUOTES, 'UTF-8') : '');
$asuntoCustom   = clean_field($data['_subject'] ?? 'Nueva Solicitud de Cotización Web — CONEXPET');

// Validar campos obligatorios mínimos
if (empty($nombre) || empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Por favor complete su nombre y un correo electrónico corporativo válido.'
    ]);
    exit;
}

// Destinatario corporativo oficial en cPanel
$destinatario = 'conexpet@conexpet.com';
$asunto       = $asuntoCustom . ' | ' . ($empresa !== '' ? $empresa : $nombre);

// Construir filas dinámicas según el formulario de origen (Flota o Cobertura)
$filasOperativas = '';
if ($unidad !== '') {
    $filasOperativas .= "
      <tr>
        <td style='padding:10px 14px;border-bottom:1px solid #e5e7eb;font-weight:bold;color:#374151;width:38%;'>Unidad / Equipo Requerido</td>
        <td style='padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#111827;'>{$unidad}</td>
      </tr>";
}
if ($rutaDestino !== '') {
    $filasOperativas .= "
      <tr>
        <td style='padding:10px 14px;border-bottom:1px solid #e5e7eb;font-weight:bold;color:#374151;'>Ruta / Destino de Operación</td>
        <td style='padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#111827;'>{$rutaDestino}</td>
      </tr>";
}
if ($baseOrigen !== '') {
    $filasOperativas .= "
      <tr>
        <td style='padding:10px 14px;border-bottom:1px solid #e5e7eb;font-weight:bold;color:#374151;'>Base Operativa de Origen</td>
        <td style='padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#111827;'>{$baseOrigen}</td>
      </tr>";
}
if ($destinoFinal !== '') {
    $filasOperativas .= "
      <tr>
        <td style='padding:10px 14px;border-bottom:1px solid #e5e7eb;font-weight:bold;color:#374151;'>Locación / Pozo / Destino Final</td>
        <td style='padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#111827;'>{$destinoFinal}</td>
      </tr>";
}

$detallesHtml = nl2br($detalles !== '' ? $detalles : 'Sin especificaciones adicionales');
$fechaEnvio   = date('d/m/Y H:i:s');

// Plantilla HTML corporativa CONEXPET
$mensajeHtml = "
<!DOCTYPE html>
<html lang='es'>
<head>
  <meta charset='UTF-8'>
  <title>{$asunto}</title>
</head>
<body style='margin:0;padding:24px;background-color:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#111827;'>
  <table width='100%' cellpadding='0' cellspacing='0' style='max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #d1d5db;'>
    <tr>
      <td style='background-color:#0B0B0C;padding:20px 24px;border-bottom:4px solid #D91E18;'>
        <h2 style='margin:0;color:#ffffff;font-size:18px;letter-spacing:0.5px;'>CONEXPET CÍA. LTDA. — PORTAL WEB OFICIAL</h2>
        <p style='margin:4px 0 0;color:#9ca3af;font-size:12px;'>Notificación Automática de Requerimiento Comercial y Operaciones</p>
      </td>
    </tr>
    <tr>
      <td style='padding:24px;'>
        <p style='margin:0 0 16px;font-size:14px;color:#374151;'>Se ha registrado una nueva solicitud de cotización desde <strong>conexpet.com</strong> con el siguiente detalle técnico:</p>
        <table width='100%' cellpadding='0' cellspacing='0' style='border-collapse:collapse;font-size:13px;border:1px solid #e5e7eb;'>
          <tr>
            <td style='padding:10px 14px;border-bottom:1px solid #e5e7eb;font-weight:bold;color:#374151;width:38%;'>Nombre del Solicitante</td>
            <td style='padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#111827;'>{$nombre}</td>
          </tr>
          <tr>
            <td style='padding:10px 14px;border-bottom:1px solid #e5e7eb;font-weight:bold;color:#374151;'>Empresa / Operadora</td>
            <td style='padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#111827;'>" . ($empresa !== '' ? $empresa : 'No especificada') . "</td>
          </tr>
          <tr>
            <td style='padding:10px 14px;border-bottom:1px solid #e5e7eb;font-weight:bold;color:#374151;'>Correo Electrónico</td>
            <td style='padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#111827;'><a href='mailto:{$email}' style='color:#D91E18;text-decoration:none;'>{$email}</a></td>
          </tr>
          <tr>
            <td style='padding:10px 14px;border-bottom:1px solid #e5e7eb;font-weight:bold;color:#374151;'>Teléfono de Contacto</td>
            <td style='padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#111827;'>" . ($telefono !== '' ? $telefono : 'No especificado') . "</td>
          </tr>
          {$filasOperativas}
          <tr>
            <td style='padding:10px 14px;font-weight:bold;color:#374151;vertical-align:top;'>Especificaciones de la Carga / Requerimiento</td>
            <td style='padding:10px 14px;color:#111827;line-height:1.5;'>{$detallesHtml}</td>
          </tr>
        </table>
        <p style='margin:18px 0 0;font-size:12px;color:#6b7280;'>
          <strong>Nota:</strong> Puede responder directamente a este correo para contestar a <em>{$nombre} ({$email})</em>.
        </p>
      </td>
    </tr>
    <tr>
      <td style='background-color:#f9fafb;padding:14px 24px;border-top:1px solid #e5e7eb;font-size:11px;color:#6b7280;text-align:center;'>
        Enviado desde el servidor oficial conexpet.com &bull; Fecha: {$fechaEnvio}
      </td>
    </tr>
  </table>
</body>
</html>
";

// Cabeceras SMTP / PHP mail() compatibles con cPanel Exim
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: Portal Web CONEXPET <conexpet@conexpet.com>\r\n";
$headers .= "Reply-To: {$nombre} <{$email}>\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$enviado = @mail($destinatario, '=?UTF-8?B?' . base64_encode($asunto) . '?=', $mensajeHtml, $headers, '-fconexpet@conexpet.com');

if (!$enviado) {
    // Reintento sin parámetro adicional -f en caso de restricción del servidor Exim
    $enviado = @mail($destinatario, '=?UTF-8?B?' . base64_encode($asunto) . '?=', $mensajeHtml, $headers);
}

if ($enviado) {
    echo json_encode([
        'success' => true,
        'message' => 'Solicitud transmitida correctamente a conexpet@conexpet.com.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'No se pudo completar el despacho interno de correo en el servidor.'
    ]);
}
