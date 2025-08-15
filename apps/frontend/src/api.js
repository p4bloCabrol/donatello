/**
 * Obtiene todas las donaciones del usuario autenticado.
 *
 * @function
 * @param {string} token - Token JWT de autenticación.
 * @returns {Promise<Array>} Array de donaciones.
 * @example
 *   const donations = await getDonations(token);
 */
export async function getDonations(token) {
  const res = await fetch('http://localhost:4000/donations', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error al cargar donaciones');
  return await res.json();
}

/**
 * Acepta una donación.
 *
 * @function
 * @param {string|number} donationId - ID de la donación.
 * @param {string} token - Token JWT de autenticación.
 * @returns {Promise<void>}
 * @example
 *   await acceptDonation(123, token);
 */
export async function acceptDonation(donationId, token) {
  const res = await fetch(`http://localhost:4000/donations/${donationId}/accept`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error al aceptar donación');
}

/**
 * Marca una donación como entregada.
 *
 * @function
 * @param {string|number} donationId - ID de la donación.
 * @param {string} token - Token JWT de autenticación.
 * @returns {Promise<void>}
 * @example
 *   await deliverDonation(123, token);
 */
export async function deliverDonation(donationId, token) {
  const res = await fetch(`http://localhost:4000/donations/${donationId}/deliver`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error al confirmar entrega');
}
/**
 * Login de usuario.
 *
 * @function
 * @param {Object} form - { email, password }
 * @returns {Promise<Object>} Objeto con user y token.
 * @example
 *   const { user, token } = await loginUser({ email, password });
 */
export async function loginUser(form) {
  const res = await fetch('http://localhost:4000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error');
  return data;
}

/**
 * Registro de usuario.
 *
 * @function
 * @param {Object} form - { name, email, password, role }
 * @returns {Promise<Object>} Objeto user.
 * @example
 *   const user = await registerUser({ name, email, password, role });
 */
export async function registerUser(form) {
  const res = await fetch('http://localhost:4000/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error');
  return data;
}
/**
 * Obtiene el perfil del usuario autenticado.
 *
 * @function
 * @param {string} token - Token JWT de autenticación.
 * @returns {Promise<Object>} Objeto perfil de usuario.
 * @example
 *   const profile = await getProfile(token);
 */
export async function getProfile(token) {
  const res = await fetch('http://localhost:4000/users/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error al cargar perfil');
  return await res.json();
}

/**
 * Actualiza el perfil del usuario autenticado.
 *
 * @function
 * @param {Object} data - { name, role }
 * @param {string} token - Token JWT de autenticación.
 * @returns {Promise<Object>} Objeto perfil actualizado.
 * @example
 *   const updated = await updateProfile({ name, role }, token);
 */
export async function updateProfile(data, token) {
  const res = await fetch('http://localhost:4000/users/me', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar');
  return await res.json();
}
/**
 * Realiza la postulación (match) a una publicación.
 *
 * @function
 * @param {string|number} listingId - ID de la publicación.
 * @param {string} token - Token JWT de autenticación.
 * @returns {Promise<void>}
 * @example
 *   await postularse(listingId, token);
 */
export async function postularse(listingId, token) {
  const res = await fetch(`${API_URL}/${listingId}/match`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error al postularse');
}

/**
 * Cancela la postulación (despostular).
 *
 * @function
 * @param {string|number} donationId - ID de la donación.
 * @param {string} token - Token JWT de autenticación.
 * @returns {Promise<void>}
 * @example
 *   await despostularse(donationId, token);
 */
export async function despostularse(donationId, token) {
  const res = await fetch(`${DONATIONS_API}/${donationId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error('La postulación ya no existe o fue eliminada.');
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Error al cancelar postulación');
  }
}
/**
 * Obtiene los postulantes de una publicación.
 *
 * @function
 * @param {string|number} listingId - ID de la publicación.
 * @param {string} token - Token JWT de autenticación.
 * @returns {Promise<Array>} Array de postulantes.
 * @example
 *   const applicants = await getApplicants(listingId, token);
 */
export async function getApplicants(listingId, token) {
  const res = await fetch(`${API_URL}/${listingId}/applicants`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error al cargar postulantes');
  return await res.json();
}
// api.js - funciones reutilizables para llamadas a la API

const API_URL = 'http://localhost:4000/listings';
const DONATIONS_API = 'http://localhost:4000/donations';

export async function fetchListings({ filters = {} } = {}) {
  const params = new URLSearchParams();
  if (filters.type) params.append('type', filters.type);
  if (filters.category) params.append('category', filters.category);
  if (filters.location) params.append('location', filters.location);
  const res = await fetch(`${API_URL}?${params.toString()}`);
  if (!res.ok) throw new Error('Error al cargar publicaciones');
  return await res.json();
}

export async function fetchUserDonations(token) {
  const res = await fetch(DONATIONS_API, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error al cargar postulaciones');
  return await res.json();
}

export async function createListing(form, token) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(form),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Error');
  }
  return await res.json();
}

export async function deleteListing(id, token) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Error');
  }
  return true;
}

// Puedes agregar más helpers según sea necesario
