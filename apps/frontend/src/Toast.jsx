import React, { useEffect } from 'react';

/**
 * Toast - Componente de notificación visual unificada
 * @param {Object} props
 * @param {string|null} props.message - Mensaje a mostrar
 * @param {function} props.onClose - Handler para cerrar el toast
 * @param {number} [props.duration=3000] - Duración en ms
 */
export default function Toast({ message, onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) return null;
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900 text-white px-4 py-2 rounded shadow-lg animate-fade-in">
      {message}
    </div>
  );
}
