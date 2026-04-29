/**
 * DigitalMKT Arena — Auth & UI Helpers
 * VISORIA Intelligence | Sprint 1
 */
(function (global) {
  'use strict';

  const KEY_EQUIPO = 'dmkt_equipo';
  const KEY_CODIGO = 'dmkt_codigo_acceso';

  function guardarSesion(equipo, codigoAcceso) {
    try {
      localStorage.setItem(KEY_EQUIPO, JSON.stringify(equipo));
      if (codigoAcceso) localStorage.setItem(KEY_CODIGO, codigoAcceso);
    } catch (e) { console.warn('No fue posible guardar sesión:', e); }
  }

  function leerSesion() {
    try {
      const equipoStr = localStorage.getItem(KEY_EQUIPO);
      const codigo = localStorage.getItem(KEY_CODIGO);
      if (!equipoStr) return null;
      return { equipo: JSON.parse(equipoStr), codigo_acceso: codigo };
    } catch (e) { return null; }
  }

  function cerrarSesion() {
    try {
      localStorage.removeItem(KEY_EQUIPO);
      localStorage.removeItem(KEY_CODIGO);
    } catch (e) { console.warn('No fue posible cerrar sesión:', e); }
  }

  function haySesion() { return leerSesion() !== null; }

  async function refrescarSesion() {
    const sesion = leerSesion();
    if (!sesion || !sesion.codigo_acceso) {
      throw new Error('No hay sesión activa para refrescar');
    }
    const data = await DMKTApi.autenticarEquipo(sesion.codigo_acceso);
    guardarSesion(data.equipo, sesion.codigo_acceso);
    return data;
  }

  function ensureToastStack() {
    let stack = document.querySelector('.toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.className = 'toast-stack';
      document.body.appendChild(stack);
    }
    return stack;
  }

  function toast(mensaje, tipo, titulo) {
    const stack = ensureToastStack();
    const el = document.createElement('div');
    el.className = 'toast ' + (tipo || 'info');
    el.innerHTML =
      '<div class="toast-content">' +
        (titulo ? '<strong>' + escapeHtml(titulo) + '</strong>' : '') +
        escapeHtml(mensaje) +
      '</div>' +
      '<button class="toast-close" aria-label="Cerrar">&times;</button>';
    el.querySelector('.toast-close').addEventListener('click', () => el.remove());
    stack.appendChild(el);
    setTimeout(() => {
      if (el.parentNode) {
        el.style.opacity = '0';
        el.style.transform = 'translateX(20px)';
        el.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        setTimeout(() => el.remove(), 250);
      }
    }, 6000);
  }

  function formatearCOP(monto) {
    if (monto === null || monto === undefined || isNaN(monto)) return '—';
    const formateado = Number(monto).toLocaleString('es-CO', { maximumFractionDigits: 0 });
    return '$ ' + formateado;
  }

  function formatearAbreviado(monto) {
    if (monto === null || monto === undefined || isNaN(monto)) return '—';
    const num = Number(monto);
    if (num >= 1e12) return (num / 1e12).toFixed(1) + ' B';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + ' MM';
    if (num >= 1e6) return (num / 1e6).toFixed(0) + ' M';
    if (num >= 1e3) return (num / 1e3).toFixed(0) + ' K';
    return String(num);
  }

  function formatearFecha(iso) {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) { return iso; }
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  async function copiarAlPortapapeles(texto) {
    try {
      await navigator.clipboard.writeText(texto);
      return true;
    } catch (e) {
      try {
        const ta = document.createElement('textarea');
        ta.value = texto;
        ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        return true;
      } catch (e2) { return false; }
    }
  }

  global.DMKTAuth = {
    guardarSesion: guardarSesion,
    leerSesion: leerSesion,
    cerrarSesion: cerrarSesion,
    haySesion: haySesion,
    refrescarSesion: refrescarSesion
  };

  global.DMKTUtils = {
    toast: toast,
    formatearCOP: formatearCOP,
    formatearAbreviado: formatearAbreviado,
    formatearFecha: formatearFecha,
    escapeHtml: escapeHtml,
    copiarAlPortapapeles: copiarAlPortapapeles
  };
})(window);
