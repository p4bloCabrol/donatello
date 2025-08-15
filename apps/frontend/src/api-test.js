// api-test.js - helpers para pruebas de backend

/**
 * Prueba de conexión a la API backend
 * @returns {Promise<Object>} respuesta del backend
 */
export async function testBackend() {
  const res = await fetch('http://localhost:4000/db-test');
  if (!res.ok) throw new Error('Error de conexión');
  return await res.json();
}
