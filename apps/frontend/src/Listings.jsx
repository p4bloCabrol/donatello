
import React, { useContext, useEffect, useState } from 'react';
import AuthContext from './AuthContext';
// import ApplicantsList from './ApplicantsList';
import ApplicantsModal from './ApplicantsModal';
import useApplicants from './hooks/useApplicants';
import ApplicantsModal from './ApplicantsModal';
import Toast from './Toast';
import Modal from './Modal';
import useStore from './store';
import useListings from './hooks/useListings';
import useForm from './hooks/useForm';
import useModal from './hooks/useModal';
import { postularse, despostularse } from './api';
const StarIcon = (props) => (
  <svg viewBox="0 0 20 20" fill="currentColor" {...props} width={20} height={20}>
    <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
  </svg>
);


const Listings = () => {
  const { token, user } = useContext(AuthContext);
  const listings = useStore(s => s.listings);
  const setListings = useStore(s => s.setListings);
  const userDonations = useStore(s => s.userDonations);
  const setUserDonations = useStore(s => s.setUserDonations);

  // Hook para lógica de publicaciones y postulaciones
  const {
    loading,
    error,
    success,
    setError,
    setSuccess,
    fetchListings,
    fetchUserDonations,
    handleSubmit,
    handleDelete,
  } = useListings({ token, setListings, setUserDonations });
  const initialForm = {
    type: 'offer',
    title: '',
    description: '',
    category: '',
    quantity: 1,
    location: '',
    photos: [],
  };
  const formValidation = values => {
    const errors = {};
    if (!values.title) errors.title = 'El título es obligatorio';
    if (!values.type) errors.type = 'El tipo es obligatorio';
    // Puedes agregar más validaciones aquí
    return errors;
  };
  const {
    values: form,
    setValues: setForm,
    errors: formErrors,
    handleChange: handleFormChange,
    handleSubmit: handleFormSubmit,
    resetForm,
  } = useForm(initialForm, formValidation);
  // Para mostrar el modal de postulantes
  const [showApplicants, setShowApplicants] = useState({ open: false, listingId: null });
  const { applicants, loading: applicantsLoading, error: applicantsError } = useApplicants(showApplicants.listingId, token, showApplicants.open);
  // Modal de confirmación para postularse/despostularse
  const { modal, openModal, closeModal, setModal } = useModal({ open: false, type: null, listing: null, donation: null });
  const showToast = useStore(s => s.showToast);
  const toast = useStore(s => s.toast);
  const hideToast = useStore(s => s.hideToast);
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
            try {
              const data = await import('../api').then(m => m.getApplicants(listing.id, token));
              // Contar postulantes únicos por receiver_id
              const unique = new Set(data.map(a => a.receiver_id));
              counts[listing.id] = unique.size;
            } catch {}
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


  // fetchListings ahora proviene del hook useListings

  useEffect(() => {
    fetchListings();
    if (token) fetchUserDonations();
    // eslint-disable-next-line
  }, [token]);

  // Traer donaciones del usuario para saber si ya se postuló

  // fetchUserDonations ahora proviene del hook useListings



  const handleFilter = e => {
    e.preventDefault();
    fetchListings({
      type: filterType,
      category: filterCategory,
      location: filterLocation,
    });
  };


  const onFormSubmit = async e => {
    e.preventDefault();
    await handleFormSubmit(async (values, reset) => {
      await handleSubmit(values, reset);
    });
  };


  // handleDelete ahora viene del hook

  // --- Funciones de eventos declaradas dentro del componente ---
  const handleToggleForm = () => {
    setShowForm(v => !v);
  };

  const handleCloseModal = () => {
    closeModal();
  };

  const handleConfirmPostular = async () => {
    await postularse(modal.listing.id, token);
    await Promise.all([fetchUserDonations(), fetchListings()]);
    closeModal();
    showToast('Te postulaste correctamente');
  };

  const handleConfirmDespostular = async () => {
    try {
      await despostularse(modal.donation.id, token);
      await Promise.all([fetchUserDonations(), fetchListings()]);
      closeModal();
      showToast('Cancelaste tu postulación');
    } catch (e) {
      showToast(e.message || 'Error de red al cancelar postulación');
    }
  };

  const renderListingItem = (listing) => {
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
                donation: myDonation // importante: solo se pasa aquí, no se elimina hasta confirmar
              })}
            >
              {myDonation && myDonation.status === 'proposed' ? 'Despostularme' : 'Postularme'}
            </button>
          </div>
        )}
      </li>
    );
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
  <form onSubmit={onFormSubmit} className="mb-6 space-y-2 bg-white p-4 rounded shadow">
          <div className="flex gap-2">
            <select name="type" value={form.type} onChange={handleFormChange} className="w-32 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition">
              <option value="offer">Ofrezco</option>
              <option value="need">Necesito</option>
            </select>
            <input name="title" value={form.title} onChange={handleFormChange} placeholder="Título" required className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
            {formErrors.title && <span className="text-red-500 text-xs ml-2">{formErrors.title}</span>}
          </div>
          <textarea name="description" value={form.description} onChange={handleFormChange} placeholder="Descripción" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
          <div className="flex gap-2">
            <input name="category" value={form.category} onChange={handleFormChange} placeholder="Categoría" className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
            <input name="quantity" type="number" min="1" value={form.quantity} onChange={handleFormChange} placeholder="Cantidad" className="w-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
          </div>
          <input name="location" value={form.location} onChange={handleFormChange} placeholder="Ubicación" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
          <button type="submit" className="w-full bg-blue-600 text-white rounded py-2 font-semibold">Crear publicación</button>
        </form>
      )}
      {user && (
        <button
          type="button"
          onClick={handleToggleForm}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-3xl leading-[56px] shadow-lg"
          title={showForm ? 'Cerrar formulario' : 'Nueva publicación'}
        >
          {showForm ? '×' : '+'}
        </button>
      )}
      <ul className="space-y-4">
         {listings.map(listing => renderListingItem(listing))}
      </ul>
      {/* Modal de postulantes para el donante */}
      <ApplicantsModal
        open={showApplicants.open}
        applicants={applicants}
        loading={applicantsLoading}
        error={applicantsError}
        onClose={() => setShowApplicants({ open: false, listingId: null })}
      />
      <Toast message={toast} onClose={hideToast} />
      {/* Modal reutilizable para postularse/despostularse */}
      <Modal
        open={modal.open}
        title={modal.type === 'postular' ? 'Confirmar postulación' : modal.type === 'despostular' ? 'Cancelar postulación' : ''}
        onClose={closeModal}
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
                onClick={handleConfirmPostular}
              >Confirmar</button>
              <button
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm border border-gray-300 hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                onClick={handleCloseModal}
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
                onClick={handleConfirmDespostular}
              >Confirmar</button>
              <button
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm border border-gray-300 hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                onClick={handleCloseModal}
              >Cancelar</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Listings;
