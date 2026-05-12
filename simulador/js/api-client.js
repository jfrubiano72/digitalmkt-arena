/**
 * DigitalMKT Arena — API Client
 * VISORIA Intelligence | Sprint 1
 *
 * Wrapper sobre fetch para hablar con el Apps Script Web App.
 * Expone una API global `DMKTApi` con los endpoints del Sprint 1.
 */
(function (global) {
  'use strict';

  // URL del Web App desplegado en Apps Script
  const API_URL = 'https://script.google.com/macros/s/AKfycbxTeweGtfKzJDDcGxBg6e8LyVFz4pbSKTKzUC2_zk2M0e0pJTHgKAm_17G8S5LlOLnuZA/exec';

  // Cohorte por defecto del Sprint 1
  const DEFAULT_COHORTE_ID = 'COH-2026-1';

  /**
   * Llamada GET al backend.
   * @param {string} action — nombre del endpoint
   * @param {Object} [params] — query string adicional
   * @returns {Promise<*>} data devuelta por el backend
   * @throws {Error} con `mensaje` si ok=false
   */
  async function get(action, params) {
    const url = new URL(API_URL);
    url.searchParams.set('action', action);
    if (params) {
      Object.keys(params).forEach(function (k) {
        if (params[k] !== undefined && params[k] !== null) {
          url.searchParams.set(k, params[k]);
        }
      });
    }
    const res = await fetch(url.toString(), { method: 'GET' });
    const json = await res.json();
    if (!json.ok) {
      const mensaje = (json.error && json.error.mensaje) || 'Error desconocido del backend';
      const err = new Error(mensaje);
      err.codigo = json.error && json.error.codigo;
      err.detalles = json.error && json.error.detalles;
      throw err;
    }
    return json.data;
  }

  /**
   * Llamada POST al backend. Usa Content-Type text/plain
   * para evitar el preflight CORS de Apps Script.
   */
  async function post(action, params) {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: action, params: params || {} })
    });
    const json = await res.json();
    if (!json.ok) {
      const mensaje = (json.error && json.error.mensaje) || 'Error desconocido del backend';
      const err = new Error(mensaje);
      err.codigo = json.error && json.error.codigo;
      err.detalles = json.error && json.error.detalles;
      throw err;
    }
    return json.data;
  }

  // ============== ENDPOINTS DEL SPRINT 1 ==============

  const api = {
    ping: function () { return get('ping'); },

    listarCohortes: function () { return get('listarCohortes'); },

    obtenerConfigJuego: function (cohorteId) {
      return get('obtenerConfigJuego', { cohorte_id: cohorteId || DEFAULT_COHORTE_ID });
    },

    listarMarcasDisponibles: function (cohorteId) {
      return get('listarMarcasDisponibles', { cohorte_id: cohorteId || DEFAULT_COHORTE_ID });
    },

    /**
     * Crea un equipo nuevo. La marca se asigna aleatoriamente si no se especifica marca_id.
     * @param {Object} payload
     */
    crearEquipo: function (payload) {
      const params = Object.assign({ cohorte_id: DEFAULT_COHORTE_ID }, payload);
      return post('crearEquipo', params);
    },

    autenticarEquipo: function (codigoAcceso) {
      return get('autenticarEquipo', { codigo_acceso: codigoAcceso });
    },

    obtenerEquipo: function (equipoId) {
      return get('obtenerEquipo', { equipo_id: equipoId });
    },

    listarEquiposPorCohorte: function (cohorteId) {
      return get('listarEquiposPorCohorte', { cohorte_id: cohorteId || DEFAULT_COHORTE_ID });
    },

    /**
     * Crea una jugada nueva. Sprint 2.
     * @param {string} codigoAcceso
     * @param {Object} inversiones - { MEDPAG: 10000000, MEDTRAD: 5000000, ... }
     */
    crearJugada: function (codigoAcceso, inversiones) {
      return post('crearJugada', { codigo_acceso: codigoAcceso, inversiones: inversiones });
    },

    /** Obtiene el histórico de jugadas de un equipo. Sprint 2. */
    obtenerHistoricoJugadas: function (equipoId) {
      return get('obtenerHistoricoJugadas', { equipo_id: equipoId });
    },

    /** Obtiene el ranking de equipos de una cohorte. Sprint 2. */
    obtenerRanking: function (cohorteId) {
      return get('obtenerRanking', { cohorte_id: cohorteId || DEFAULT_COHORTE_ID });
    },

    DEFAULT_COHORTE_ID: DEFAULT_COHORTE_ID,
    API_URL: API_URL
  };

  global.DMKTApi = api;
})(window);
