import React, { useContext, useEffect, useState } from 'react';
import AuthContext from './AuthContext';
import ApplicantsList from './ApplicantsList';
import Modal from './Modal';
const StarIcon = (props) => (
  <svg viewBox="0 0 20 20" fill="currentColor" {...props} width={20} height={20}>
    <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
  </svg>
);

const API_URL = 'http://localhost:4000/listings';

const DONATIONS_API = 'http://localhost:4000/donations';


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
  // Para saber si el usuario ya se postuló a cada publicación
  const [userDonations, setUserDonations] = useState([]);
  // Para mostrar el modal de postulantes
  const [showApplicants, setShowApplicants] = useState({ open: false, listingId: null });
  // Modal de confirmación para postularse/despostularse
  const [modal, setModal] = useState({ open: false, type: null, listing: null });
  // Para guardar el número de postulantes únicos por publicación
  const [applicantsCount, setApplicantsCount] = useState({});

  // Cargar número de postulantes únicos para publicaciones del usuario
  useEffect(() => {
    if (!user) return;
    const fetchCounts = async () => {
      const counts = {};
      for (const listing of listings) {
        if (listing.author_id === user.id && listing.type === 'offer') {
          try {
            const res = await fetch(`${API_URL}/${listing.id}/applicants`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
              const data = await res.json();
              // Contar postulantes únicos por receiver_id
              const unique = new Set(data.map(a => a.receiver_id));
              counts[listing.id] = unique.size;
            }
          } catch {}
        }
      }
      setApplicantsCount(counts);
    };
    fetchCounts();
    // eslint-disable-next-line
  }, [user, listings, token]);

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
    if (token) fetchUserDonations();
    // eslint-disable-next-line
  }, [token]);

  // Traer donaciones del usuario para saber si ya se postuló
  const fetchUserDonations = async () => {
    try {
      const res = await fetch(DONATIONS_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUserDonations(data);
    } catch (e) {
      // No feedback, solo para UX
    }
  };

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
        {listings.map(listing => {
          // Buscar si el usuario ya se postuló a esta publicación
          const myDonation = userDonations.find(d => d.listing_id === listing.id && d.receiver_id === user?.id);
          const isOwn = user && listing.author_id === user.id;
          return (
            <li key={listing.id} className="bg-white p-4 rounded shadow flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="font-bold flex items-center gap-2">
                  {listing.title}
                  {/* Estrella solo si la publicación es propia */}
                  {isOwn && (
                    <StarIcon className="inline text-yellow-400" title="Tu publicación" />
                  )}
                </span>
                {isOwn && (
                  <div className="flex gap-2 items-center">
                    <button onClick={() => handleDelete(listing.id)} className="text-red-500 hover:underline text-sm">Eliminar</button>
                    {listing.type === 'offer' && (
                      <button
                        className="relative flex items-center bg-orange-500 hover:bg-orange-600 text-white rounded-full px-3 py-1 text-sm font-semibold shadow"
                        onClick={() => setShowApplicants({ open: true, listingId: listing.id })}
                      >
                        Postulantes
                        <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-white text-orange-600 font-bold border border-orange-300">
                          {applicantsCount[listing.id] ?? 0}
                        </span>
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="text-gray-600 text-sm">{listing.type === 'offer' ? 'Ofrece' : 'Solicita'} - {listing.category} - {listing.quantity} - {listing.location}</div>
              <div>{listing.description}</div>
              <div className="text-xs text-gray-500">
                Donante: {isOwn ? (user.name || user.email) : (listing.author_name || listing.author_id)}
              </div>
              {/* Feedback visual para postulaciones y botón de postularme */}
              {user && !isOwn && listing.type === 'offer' && (
                <div className="mt-2">
                  <button
                    className={
                      myDonation && myDonation.status === 'proposed'
                        ? 'bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors duration-150 hover:bg-green-700 active:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-400'
                        : 'bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors duration-150 hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400'
                    }
                    onClick={() => setModal({
                      open: true,
                      type: myDonation && myDonation.status === 'proposed' ? 'despostular' : 'postular',
                      listing,
                      donation: myDonation
                    })}
                  >
                    {myDonation && myDonation.status === 'proposed' ? 'Despostularme' : 'Postularme'}
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {/* Modal de postulantes para el donante */}
      <ApplicantsList
        listingId={showApplicants.listingId}
        show={showApplicants.open}
        onClose={() => setShowApplicants({ open: false, listingId: null })}
      />
      {/* Modal reutilizable para postularse/despostularse */}
      <Modal
        open={modal.open}
        title={modal.type === 'postular' ? 'Confirmar postulación' : modal.type === 'despostular' ? 'Cancelar postulación' : ''}
        onClose={() => setModal({ open: false, type: null, listing: null })}
      >
        {modal.type === 'postular' && modal.listing && (
          <div>
            <div className="mb-2">¿Seguro que quieres postularte a esta publicación?</div>
            <div className="text-sm text-gray-700 mb-1"><b>Título:</b> {modal.listing.title}</div>
            <div className="text-sm text-gray-700 mb-1"><b>Descripción:</b> {modal.listing.description}</div>
            <div className="text-sm text-gray-700 mb-1"><b>Categoría:</b> {modal.listing.category}</div>
            <div className="text-sm text-gray-700 mb-1"><b>Ubicación:</b> {modal.listing.location}</div>
            <div className="flex gap-2 mt-4">
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={async () => {
                  await fetch(`${API_URL}/${modal.listing.id}/match`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  setModal({ open: false, type: null, listing: null });
                  fetchUserDonations();
                  fetchListings();
                }}
              >Confirmar</button>
              <button
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm border border-gray-300 hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                onClick={() => setModal({ open: false, type: null, listing: null })}
              >Cancelar</button>
            </div>
          </div>
        )}
        {modal.type === 'despostular' && modal.listing && modal.donation && (
          <div>
            <div className="mb-2">¿Seguro que quieres cancelar tu postulación?</div>
            <div className="text-sm text-gray-700 mb-1"><b>Título:</b> {modal.listing.title}</div>
            <div className="text-sm text-gray-700 mb-1"><b>Descripción:</b> {modal.listing.description}</div>
            <div className="text-sm text-gray-700 mb-1"><b>Categoría:</b> {modal.listing.category}</div>
            <div className="text-sm text-gray-700 mb-1"><b>Ubicación:</b> {modal.listing.location}</div>
            <div className="flex gap-2 mt-4">
              <button
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-400"
                onClick={async () => {
                  await fetch(`${DONATIONS_API}/${modal.donation.id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  setModal({ open: false, type: null, listing: null });
                  fetchUserDonations();
                  fetchListings();
                }}
              >Confirmar</button>
              <button
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm border border-gray-300 hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                onClick={() => setModal({ open: false, type: null, listing: null })}
              >Cancelar</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Listings;
