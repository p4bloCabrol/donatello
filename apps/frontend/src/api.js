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
