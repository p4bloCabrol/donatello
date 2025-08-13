import React, { useContext, useEffect, useState } from 'react';
import AuthContext from './AuthContext';

const Profile = () => {
  const { token, user, login } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [role, setRole] = useState('donor');

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch('http://localhost:4000/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setName(data.name);
        setRole(data.role || 'donor');
        setLoading(false);
      })
      .catch(() => {
        setError('Error al cargar perfil');
        setLoading(false);
      });
  }, [token]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('http://localhost:4000/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, role }),
      });
      if (!res.ok) throw new Error('Error al actualizar');
      const data = await res.json();
      setProfile(data);
      setSuccess('Perfil actualizado');
      // Actualizar nombre en contexto
  login({ ...user, name: data.name, role: data.role }, token);
    } catch {
      setError('Error al actualizar');
    }
  };

  if (!token) return null;
  if (loading) return <div className="text-center">Cargando perfil...</div>;
  if (!profile) return <div className="text-center text-red-600">No se pudo cargar el perfil</div>;

  return (
    <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md mb-6 mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Mi perfil</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Nombre</label>
          <input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input value={profile.email} disabled className="w-full px-3 py-2 border rounded-lg bg-gray-100" />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Rol</label>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            <option value="donor">Donante</option>
            <option value="receiver">Receptor</option>
          </select>
        </div>
        <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">Guardar cambios</button>
        {error && <div className="text-red-600 text-center">{error}</div>}
        {success && <div className="text-green-600 text-center">{success}</div>}
      </form>
    </div>
  );
};

export default Profile;
