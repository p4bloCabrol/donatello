// utils.js - helpers puros para formateo, validaciones, etc.

/**
 * Formatea una fecha a string local.
 *
 * @function
 * @param {string|Date} date - Fecha en formato string o Date.
 * @returns {string} Fecha formateada en string local, o vacío si inválida.
 * @example
 *   formatDate('2025-08-15T12:00:00Z'); // '15/8/2025 9:00:00' (según locale)
 */
export function formatDate(date) {
  if (!date) return '';
  try {
    return new Date(date).toLocaleString();
  } catch {
    return '';
  }
}

/**
 * Valida si un string es un email válido.
 *
 * @function
 * @param {string} email - Email a validar.
 * @returns {boolean} true si el email es válido, false si no.
 * @example
 *   isValidEmail('test@mail.com'); // true
 *   isValidEmail('no-es-email'); // false
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Agrega aquí más helpers puros según necesidad.
