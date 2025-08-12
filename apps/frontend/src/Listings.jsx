import React, { useContext, useEffect, useState } from 'react';
import AuthContext from './AuthContext';

const API_URL = 'http://localhost:4000/listings';


const Listings = () => {
  const { token, user } = useContext(AuthContext);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    type: 'offer',
    title: '',
    description: '',
    category: '',
    quantity: 1,
    location: '',
    photos: [],
  });
  const [success, setSuccess] = useState(null);

  // Filtros
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchListings = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.category) params.append('category', filters.category);
      if (filters.location) params.append('location', filters.location);
      const res = await fetch(`${API_URL}?${params.toString()}`);
      const data = await res.json();
      setListings(data);
    } catch (err) {
      setError('Error al cargar publicaciones');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFilter = e => {
    e.preventDefault();
    fetchListings({
      type: filterType,
      category: filterCategory,
      location: filterLocation,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
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
      setSuccess('Publicación creada');
      setForm({ type: 'offer', title: '', description: '', category: '', quantity: 1, location: '', photos: [] });
      fetchListings();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar publicación?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error');
      }
      fetchListings();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Publicaciones</h2>

      {/* Filtros */}
      <form onSubmit={handleFilter} className="mb-6 flex flex-wrap gap-2 items-end bg-white p-4 rounded shadow">
        <div>
          <label className="block text-gray-700 text-sm mb-1">Tipo</label>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="w-32 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition">
            <option value="">Todos</option>
            <option value="offer">Ofrezco</option>
            <option value="need">Necesito</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 text-sm mb-1">Categoría</label>
          <input value={filterCategory} onChange={e => setFilterCategory(e.target.value)} placeholder="Categoría" className="w-32 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
        </div>
        <div>
          <label className="block text-gray-700 text-sm mb-1">Ubicación</label>
          <input value={filterLocation} onChange={e => setFilterLocation(e.target.value)} placeholder="Ubicación" className="w-32 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
        </div>
        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 font-semibold">Filtrar</button>
      </form>

      {loading && <div>Cargando...</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {user && showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-2 bg-white p-4 rounded shadow">
          <div className="flex gap-2">
            <select name="type" value={form.type} onChange={handleChange} className="w-32 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition">
              <option value="offer">Ofrezco</option>
              <option value="need">Necesito</option>
            </select>
            <input name="title" value={form.title} onChange={handleChange} placeholder="Título" required className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
          </div>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Descripción" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
          <div className="flex gap-2">
            <input name="category" value={form.category} onChange={handleChange} placeholder="Categoría" className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
            <input name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange} placeholder="Cantidad" className="w-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
          </div>
          <input name="location" value={form.location} onChange={handleChange} placeholder="Ubicación" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
          <button type="submit" className="w-full bg-blue-600 text-white rounded py-2 font-semibold">Crear publicación</button>
        </form>
      )}
      {user && (
        <button
          type="button"
          onClick={() => setShowForm(v => !v)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-3xl leading-[56px] shadow-lg"
          title={showForm ? 'Cerrar formulario' : 'Nueva publicación'}
        >
          {showForm ? '×' : '+'}
        </button>
      )}
      <ul className="space-y-4">
        {listings.map(listing => (
          <li key={listing.id} className="bg-white p-4 rounded shadow flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="font-bold">{listing.title}</span>
              {user && listing.author_id === user.id && (
                <button onClick={() => handleDelete(listing.id)} className="text-red-500 hover:underline text-sm">Eliminar</button>
              )}
            </div>
            <div className="text-gray-600 text-sm">{listing.type === 'offer' ? 'Ofrece' : 'Solicita'} - {listing.category} - {listing.quantity} - {listing.location}</div>
            <div>{listing.description}</div>
            <div className="text-xs text-gray-400">ID: {listing.id} | Autor: {listing.author_id}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Listings;
