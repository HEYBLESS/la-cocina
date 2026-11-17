/* HEY BLESS! — Remate del Chef (no necesitas editar este archivo)
   Los beats salen solos de la carpeta REMATE de tu Drive (MP3 con tag + WAV sin tag). */
(async () => {
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const T = await fetch("data/tienda.json?v=" + Date.now(), { cache: "no-store" }).then(r => r.ok ? r.json() : {}).catch(() => ({}));
const R = T.redes || {}, P = T.pagos || {};
const C = { backend: (window.CONFIG_TECNICO || {}).backend, paypal: P.paypal || "https://paypal.me/HEYBLESS",
  pct: +(P.comisionPorcentaje || 0.054), fija: +(P.comisionFija || 0.30), ig: R.instagram || "prod.bless", wa: R.whatsapp || "" };

/* encabezado y pie, igual que el resto de la tienda */
const ICON = {
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg>',
  sp: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="11"/><path d="M6.5 9.2c3.8-1.2 8-.9 11.2.9M7.2 12.4c3-.9 6.4-.6 9 .8M7.9 15.4c2.4-.6 4.9-.4 6.9.6" stroke="#f7f3eb" stroke-width="1.8" stroke-linecap="round" fill="none"/></svg>',
  yt: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="1.5" y="4.5" width="21" height="15" rx="4"/><path d="M10 8.8v6.4l5.5-3.2z" fill="#f7f3eb"/></svg>',
  play: '<svg viewBox="0 0 24 24"><path d="M7 4.5v15l13-7.5z"/></svg>',
  pause: '<svg viewBox="0 0 24 24"><rect x="6" y="4.5" width="4" height="15"/><rect x="14" y="4.5" width="4" height="15"/></svg>'
};
const WA = C.wa ? "https://wa.me/" + C.wa : "";
const waPretty = C.wa ? "+" + C.wa.replace(/^(\d{2})(\d{3})(\d{3})(\d{3})$/, "$1 $2 $3 $4") : "";
const socials = `<a href="https://instagram.com/${esc(C.ig)}" target="_blank" rel="noopener">${ICON.ig}@${esc(C.ig)}</a>
  ${WA ? `<a href="${WA}" target="_blank" rel="noopener">${ICON.wa}${esc(waPretty)}</a>` : ""}
  ${R.spotify ? `<a href="${esc(R.spotify)}" target="_blank" rel="noopener">${ICON.sp}HEY BLESS!</a>` : ""}
  ${R.youtube ? `<a href="${esc(R.youtube)}" target="_blank" rel="noopener">${ICON.yt}HEY BLESS!</a>` : ""}`;
$("#socials").innerHTML = socials; $("#socials2").innerHTML = socials;
$("#yr").textContent = new Date().getFullYear();
$("#menu").innerHTML = [["Catálogo de beats", "index.html#beats"], ["Licencias", "index.html#licencias"], ["Beats personalizados", "index.html#personalizados"],
  ["Mix &amp; Master", "index.html#mixmaster"], ["Drum Kits", "drumkits.html"], ["Remate", "remate.html"]]
  .map(([t, h]) => `<a href="${h}"${h === "remate.html" ? ' class="rem on"' : ""}>${t}</a>`).join("");
if (WA) $("#wa").href = WA + "?text=" + encodeURIComponent("Hola HEY BLESS! Quiero comprar beats del Remate del Chef pagando en soles.");

/* datos del remate (desde tu Drive, vía el programa de entregas) */
let PRECIO = 15, BEATS = [], TOTAL = 0;
async function cargar() {
  try {
    const j = await fetch(C.backend + "?remate=1&t=" + Date.now()).then(r => r.json());
    if (!j || !j.ok) throw 0;
    PRECIO = +j.precio || 15; BEATS = j.beats || []; TOTAL = +j.total || BEATS.length;
    if (j.terminos && j.terminos.length) $("#tlist").innerHTML = j.terminos.map(t => `<li>${esc(t)}</li>`).join("");
  } catch { $("#rlist").innerHTML = '<div class="ph">No se pudo cargar el menú. Recarga la página en un momento.</div>'; return; }
  $("#precio").textContent = PRECIO;
  render();
}

const sel = new Set();
const pagar = n => PRECIO * (n - Math.floor(n / 4));
const ppTotal = p => Math.ceil(((p + C.fija) / (1 - C.pct)) * 100) / 100;
const usd = n => "$" + (Number.isInteger(n) ? n : n.toFixed(2));

function render() {
  [...sel].forEach(id => { if (!BEATS.some(b => b.id === id)) sel.delete(id); });
  $("#quedan").textContent = BEATS.length ? `quedan ${BEATS.length} de ${TOTAL}` : "agotado";
  $("#rlist").innerHTML = BEATS.length ? BEATS.map(b => `<div class="ri">
      <button class="pb${playing === b.id && !audio.paused ? " on" : ""}" data-play="${esc(b.id)}" aria-label="Escuchar ${esc(b.nombre)}">${loading === b.id ? "…" : playing === b.id && !audio.paused ? ICON.pause : ICON.play}</button>
      <span class="nm">${esc(b.nombre)}</span><span class="mt">${esc([b.genero, b.bpm ? b.bpm + " BPM" : ""].filter(Boolean).join(" · "))}</span>
      <span class="dots"></span><span class="pr">$${PRECIO}</span>
      <button class="add${sel.has(b.id) ? " on" : ""}" data-add="${esc(b.id)}" aria-label="${sel.has(b.id) ? "Quitar del pedido" : "Agregar al pedido"}">${sel.has(b.id) ? "✓" : "+"}</button>
    </div>`).join("") : '<div class="ph">Todo el remate se vendió. ¡Vuelve pronto!</div>';
  upd();
}
function upd() {
  const n = sel.size, f = Math.floor(n / 4);
  $("#cnt").textContent = n + (n === 1 ? " beat" : " beats");
  $("#tot").textContent = usd(pagar(n));
  $("#free").textContent = f ? `${f} gratis por el 3x4` + (n % 4 === 3 ? " · agrega 1 más y otro sale gratis" : "") : (n ? `Agrega ${4 - n % 4} más y uno sale gratis` : "");
}

/* audio */
const audio = $("#audio"); let playing = null;
const blobs = {};
async function respaldo(b) {
  // si el enlace directo de Drive no suena, se pide el audio al programa de entregas
  if (!blobs[b.id]) {
    loading = b.id; render(); barra();
    try {
      const j = await fetch(C.backend + "?audio=" + encodeURIComponent(b.pid)).then(r => r.json());
      if (!j.ok) throw 0;
      const bin = atob(j.b64), u = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
      blobs[b.id] = URL.createObjectURL(new Blob([u], { type: j.mime || "audio/mpeg" }));
    } catch { loading = null; render(); return; }
    loading = null;
  }
  if (playing !== b.id) return;
  audio.src = blobs[b.id]; audio.play().catch(() => render());
}
let loading = null;
function toggle(id) {
  const b = BEATS.find(x => x.id === id); if (!b) return;
  if (playing === id && audio.src) { audio.paused ? audio.play().catch(() => {}) : audio.pause(); return; }
  playing = id;
  audio.onerror = () => { audio.onerror = null; if (playing === b.id) respaldo(b); };
  audio.src = blobs[id] || b.audio; audio.play().catch(() => {});
  render(); barra();
}
["play", "pause", "ended"].forEach(ev => audio.addEventListener(ev, () => { render(); barra(); }));

/* reproductor: play y línea de tiempo */
const fmt = s => isFinite(s) ? Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0") : "0:00";
let arrastrando = false;
function barra() {
  const b = BEATS.find(x => x.id === playing);
  if (!b) { $("#rp").hidden = true; return; }
  $("#rp").hidden = false;
  $("#rp-t").textContent = b.nombre;
  $("#rp-m").textContent = [b.genero, b.bpm ? b.bpm + " BPM" : ""].filter(Boolean).join(" · ");
  $("#rp-play").innerHTML = loading === b.id ? "…" : audio.paused ? ICON.play : ICON.pause;
}
audio.addEventListener("timeupdate", () => {
  if (!arrastrando && audio.duration) $("#rp-seek").value = Math.round(audio.currentTime / audio.duration * 1000);
  $("#rp-time").textContent = fmt(audio.currentTime) + " / " + fmt(audio.duration);
});
audio.addEventListener("loadedmetadata", barra);
const seek = $("#rp-seek");
seek.addEventListener("input", () => { arrastrando = true; if (audio.duration) $("#rp-time").textContent = fmt(seek.value / 1000 * audio.duration) + " / " + fmt(audio.duration); });
seek.addEventListener("change", () => { if (audio.duration) audio.currentTime = seek.value / 1000 * audio.duration; arrastrando = false; });
$("#rp-play").addEventListener("click", () => playing && toggle(playing));

/* la cuenta */
const code = "HB-" + Math.random().toString(36).slice(2, 7).toUpperCase();
function abrirCuenta() {
  if (!sel.size) { $("#err").textContent = "Agrega al menos un beat"; return; }
  const n = sel.size, p = pagar(n), t = ppTotal(p), names = BEATS.filter(b => sel.has(b.id)).map(b => b.nombre);
  $("#sum").innerHTML = names.map(esc).join(" · ") + `<br>${n} beat${n > 1 ? "s" : ""}${Math.floor(n / 4) ? " · " + Math.floor(n / 4) + " gratis" : ""} · ${usd(p)}`;
  $("#ptot").textContent = usd(t) + " USD";
  $("#pp").href = `${C.paypal.replace(/\/+$/, "")}/${t.toFixed(2)}USD`;
  $("#code").textContent = code;
  $("#menu-sec").hidden = true; $("#pay").hidden = false; $("#err2").textContent = "";
  $("#board").scrollIntoView({ behavior: "smooth", block: "start" });
}
function datos() {
  const nombre = $("#fn").value.trim(), correo = $("#fe").value.trim();
  if (nombre.length < 2) return "Escribe tu nombre";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return "Revisa tu correo";
  if (!$("#fterm").checked) return "Acepta los términos del remate";
  return "";
}
async function enviar() {
  const e = datos(); if (e) { $("#err2").textContent = e; return; }
  const btn = $("#sent"); btn.disabled = true; btn.textContent = "Enviando…"; $("#err2").textContent = "";
  try {
    const r = await fetch(C.backend, { method: "POST", body: JSON.stringify({ action: "pedido", tipo: "remate", ids: [...sel],
      nombre: $("#fn").value.trim(), artista: $("#fa").value.trim(), correo: $("#fe").value.trim(), code, terminos: true }) }).then(r => r.json());
    if (!r.ok) throw new Error(r.error || "");
    $("#pay").hidden = true; $("#done").hidden = false;
    $("#donemsg").innerHTML = `Gracias, <b style="font-weight:400">${esc($("#fn").value.trim())}</b>. Tu pedido <b style="font-weight:400">${esc(code)}</b> está en la cocina.<br>Apenas confirme tu pago en PayPal, tus WAV sin tag te llegan a <b style="font-weight:400">${esc($("#fe").value.trim())}</b>. Revisa también la carpeta de spam.`;
  } catch (err) {
    $("#err2").textContent = (err && err.message) || "No se pudo enviar el pedido. Inténtalo de nuevo o escríbeme por Instagram.";
    btn.disabled = false; btn.textContent = "2 · Ya pagué, enviar pedido";
    if (err && /vendió|ya no está/.test(err.message)) cargar();
  }
}

document.addEventListener("click", e => {
  const t = e.target.closest("[data-play],[data-add],#go,#sent,#back,#vt,#pp");
  if (!t) return;
  if (t.dataset.play) toggle(t.dataset.play);
  else if (t.dataset.add) { const id = t.dataset.add; sel.has(id) ? sel.delete(id) : sel.add(id); $("#err").textContent = ""; render(); }
  else if (t.id === "go") abrirCuenta();
  else if (t.id === "sent") enviar();
  else if (t.id === "back") { $("#pay").hidden = true; $("#menu-sec").hidden = false; }
  else if (t.id === "vt") { e.preventDefault(); $("#terminos").open = true; $("#terminos").scrollIntoView({ behavior: "smooth" }); }
  else if (t.id === "pp") { const er = datos(); if (er) { e.preventDefault(); $("#err2").textContent = er; } }
});

["#fn", "#fe", "#fterm"].forEach(s => $(s).addEventListener("input", () => $("#err2").textContent = ""));
cargar();
})();
