import { useState, useEffect } from 'react';
import { getApplicants } from '../api';

/**
 * useApplicants - Hook para manejar el fetch y estado de postulantes de una publicación
 * @param {string|number|null} listingId
 * @param {string} token
 * @param {boolean} open - Si el modal está abierto
 * @returns {{applicants: Array, loading: boolean, error: string|null}}
 */
export default function useApplicants(listingId, token, open) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    if (!open || !listingId) return;
    setLoading(true);
    setError(null);
    getApplicants(listingId, token)
      .then(setApplicants)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [open, listingId, token]);

  return { applicants, loading, error };
}
