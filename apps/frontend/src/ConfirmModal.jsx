import React from "react";

export default function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs">
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <div className="mb-4">{message}</div>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">Cancelar</button>
          <button onClick={onConfirm} className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">Confirmar</button>
        </div>
      </div>
    </div>
  );
}
