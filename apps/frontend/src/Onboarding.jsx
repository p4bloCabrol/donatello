import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  useEffect(() => {
    if (user) navigate('/listings', { replace: true });
  }, [user, navigate]);

  const complete = () => {
    navigate('/login', { replace: true });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-lg rounded-xl p-8">
  <h2 className="text-3xl font-bold mb-2">¡Gracias por registrarte!</h2>
  <p className="text-gray-700 mb-6">Para continuar, revisá tu email para verificar tu cuenta (flujo a definir). Cuando estés listo, iniciá sesión para acceder a Donatello.</p>
  <button onClick={complete} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded">Ir a iniciar sesión</button>
      </div>
    </div>
  );
};

export default Onboarding;
