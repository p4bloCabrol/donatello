import React, { useState, useEffect, useContext } from 'react';
import AuthContext from './AuthContext';

const API_URL = 'http://localhost:4000/listings';

export default function ApplicantsList({ listingId, show, onClose }) {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    if (!show) return;
    setLoading(true);
    setError(null);
    fetch(`${API_URL}/${listingId}/applicants`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar postulantes');
        return res.json();
      })
      .then(setApplicants)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [show, listingId, token]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
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
