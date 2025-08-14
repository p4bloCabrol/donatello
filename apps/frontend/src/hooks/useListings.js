import { useState, useEffect, useCallback } from 'react';
import { fetchListings as apiFetchListings, fetchUserDonations as apiFetchUserDonations, createListing, deleteListing } from '../api';

export default function useListings({ token, setListings, setUserDonations }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchListings = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetchListings({ filters });
      setListings(data);
    } catch (err) {
      setError('Error al cargar publicaciones');
    }
    setLoading(false);
  }, [setListings]);

  const fetchUserDonations = useCallback(async () => {
    try {
      const data = await apiFetchUserDonations(token);
      setUserDonations(data);
    } catch (e) {
      // No feedback, solo para UX
    }
  }, [token, setUserDonations]);

  const handleSubmit = useCallback(async (form, resetForm) => {
    setError(null);
    setSuccess(null);
    try {
      await createListing(form, token);
      setSuccess('Publicación creada');
      resetForm();
      fetchListings();
    } catch (err) {
      setError(err.message);
    }
  }, [token, fetchListings]);

  const handleDelete = useCallback(async id => {
    if (!window.confirm('¿Eliminar publicación?')) return;
    try {
      await deleteListing(id, token);
      fetchListings();
    } catch (err) {
      setError(err.message);
    }
  }, [token, fetchListings]);

  useEffect(() => {
    fetchListings();
    if (token) fetchUserDonations();
    // eslint-disable-next-line
  }, [token]);

  return {
    loading,
    error,
    success,
    setError,
    setSuccess,
    fetchListings,
    fetchUserDonations,
    handleSubmit,
    handleDelete,
  };
}
