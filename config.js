/* ============================================================
   HEY BLESS! — CONFIGURACIÓN TÉCNICA (no hace falta tocarla)
   Todo lo demás (beats, kits, precios, licencias, promo, reseñas,
   trabajos, redes, preguntas) se edita en el panel:
   https://app.pagescms.org  ->  HEYBLESS/la-cocina
   ============================================================ */
window.CONFIG_TECNICO = {
  // Programa de entregas (Google Apps Script)
  backend: "https://script.google.com/macros/s/AKfycbx1FtCSJnPk4bjAwgb4NdcUsAhXYqoTyePgLf5YIXghhJSfFz5Cg3ZBhDx_0oDfWQc/exec",
  paypalClientId: ""   // vacío: se usa PayPal.me + aprobación por correo
};
window.CONFIG = window.CONFIG || { backend: window.CONFIG_TECNICO.backend };
