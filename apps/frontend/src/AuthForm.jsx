import React, { useState, useContext, useEffect } from 'react';
import AuthContext from './AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

const AuthForm = ({ setToast, initialMode = 'login' }) => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'donor' });
  const [error, setError] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = e => {
    setForm({ ...form, role: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    const url = isLogin ? '/auth/login' : '/auth/register';
    try {
      const res = await fetch(`http://localhost:4000${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      if (isLogin) {
        login(data.user, data.token);
        if (setToast) setToast('Login exitoso');
        navigate('/listings');
      } else {
        if (setToast) setToast('Registro exitoso');
        navigate('/welcome');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    setIsLogin(initialMode === 'login');
  }, [initialMode]);

  if (user) return <Navigate to="/listings" replace />;

  return (
    <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md mb-6 mx-auto">
  <h2 className="text-2xl font-bold mb-6 text-center">{isLogin ? 'Iniciar sesión' : 'Registrarse'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <>
            <div>
              <input
                name="name"
                placeholder="Nombre"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Rol</label>
              <select
                name="role"
                value={form.role}
                onChange={handleRoleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              >
                <option value="donor">Donante</option>
                <option value="receiver">Receptor</option>
              </select>
            </div>
          </>
        )}
        <div>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
        <div>
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
        <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
          {isLogin ? 'Entrar' : 'Registrarse'}
        </button>
      </form>
      <button onClick={() => { setIsLogin(!isLogin); setError(null); }} className="w-full mt-4 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition">
        {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
      </button>
      {error && <div className="text-red-600 mt-4 text-center">{error}</div>}
    </div>
  );
};

export default AuthForm;
