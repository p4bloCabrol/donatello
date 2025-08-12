import React, { useState } from 'react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    // MVP: solo simular envío
    setSent(true);
  };

  return (
    <div className="bg-white rounded-xl shadow p-8">
      <h1 className="text-3xl font-bold mb-4">Queremos escucharte</h1>
      <p className="text-gray-700 mb-6">Si querés saber más, hacer una consulta o contarnos tu experiencia usando Donatello, estamos para ayudarte.</p>
      <div className="mb-6 text-gray-800">
        <div><span className="font-semibold">Email:</span> contacto@donatello.org</div>
      </div>
      {sent ? (
        <div className="text-green-700 font-semibold">¡Gracias! Recibimos tu mensaje.</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Nombre</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400" required />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400" required />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Mensaje</label>
            <textarea name="message" value={form.message} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400" rows={5} required />
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded font-semibold">Enviar</button>
        </form>
      )}
      <div className="mt-6 text-gray-700">Redes sociales: seguinos para conocer las últimas historias y actualizaciones.</div>
      <div className="mt-2 text-gray-600">Tu voz y tus ideas son parte de esta comunidad. No dudes en escribirnos.</div>
    </div>
  );
};

export default Contact;
