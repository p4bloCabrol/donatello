# Convención de Acceso a la API

**Importante:** Todo acceso a la API debe realizarse exclusivamente a través de helpers centralizados en `src/api.js` (o archivos de servicios similares, como `api-test.js`).

**No se permite** el uso directo de `fetch`, `axios` o cualquier otro cliente HTTP en componentes, hooks o utilidades fuera de estos helpers.

**Ventajas:**
- Centraliza la lógica de red y manejo de errores.
- Facilita cambios de endpoints, headers, autenticación, etc.
- Mejora la seguridad y el mantenimiento.
- Permite agregar lógica cross-cutting (logging, retries, etc.) fácilmente.

**Ejemplo correcto:**

```js
// src/api.js
export async function getProfile(token) {
	const res = await fetch('http://localhost:4000/users/me', { headers: { Authorization: `Bearer ${token}` } });
	if (!res.ok) throw new Error('Error');
	return await res.json();
}

// En un componente o hook:
import { getProfile } from './api';
// ...
const profile = await getProfile(token);
```

**Ejemplo incorrecto:**

```js
// ❌ No permitido
fetch('http://localhost:4000/users/me', { headers: { Authorization: `Bearer ${token}` } });
```

Sigue esta convención para cualquier nuevo acceso a la API.
# Donatello Frontend

React + Vite frontend for Donatello.
