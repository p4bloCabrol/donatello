import React from 'react';

/**
 * ApplicantsModal - Modal reutilizable para mostrar postulantes de una publicación
 * @param {Object} props
 * @param {boolean} props.open - Si el modal está abierto
 * @param {function} props.onClose - Handler para cerrar el modal
 * @param {Array} props.applicants - Lista de postulantes
 * @param {boolean} props.loading - Estado de carga
 * @param {string|null} props.error - Mensaje de error
 */
export default function ApplicantsModal({ open, onClose, applicants = [], loading, error }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="font-bold text-lg mb-2">Postulantes</h3>
        {loading && <div>Cargando...</div>}
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {!loading && applicants.length === 0 && <div className="text-gray-600">Sin postulantes</div>}
        <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
          {applicants.map(a => (
            <li key={a.id} className="py-2 flex flex-col">
              <span className="font-semibold">{a.name} ({a.email})</span>
              <span className="text-xs text-gray-500">ID usuario: {a.receiver_id} | Estado: {a.status}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">Cerrar</button>
        </div>
      </div>
    </div>
  );
}
