import React from "react";

export default function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs">
        {title && <h3 className="font-bold text-lg mb-2">{title}</h3>}
        <div className="mb-4">{children}</div>
        <div className="flex justify-end">
          <button onClick={onClose} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">Cerrar</button>
        </div>
      </div>
    </div>
  );
}
