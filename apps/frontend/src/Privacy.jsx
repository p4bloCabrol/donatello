import React from 'react';

const Privacy = () => (
  <div className="space-y-4 bg-white rounded-xl shadow p-8">
    <h1 className="text-3xl font-bold">Tu privacidad es importante para nosotros</h1>
    <p className="text-gray-700">En Donatello respetamos y protegemos tus datos personales. La información que compartas con nosotros se utilizará exclusivamente para mejorar tu experiencia en la plataforma y facilitar la conexión entre donantes e instituciones.</p>
    <h2 className="text-xl font-semibold">Principios básicos de privacidad:</h2>
    <ul className="list-disc pl-5 text-gray-800 space-y-1">
      <li><span className="font-semibold">Protección de datos:</span> ciframos y resguardamos tu información.</li>
      <li><span className="font-semibold">Uso responsable:</span> solo solicitamos la información necesaria para el funcionamiento de la plataforma.</li>
      <li><span className="font-semibold">Transparencia:</span> podés solicitar en cualquier momento saber qué datos tenemos y pedir su eliminación.</li>
    </ul>
    <p className="text-gray-700">No compartimos tus datos con terceros sin tu consentimiento, salvo requerimiento legal.</p>
    <p className="text-gray-700">Contacto sobre privacidad: Si tenés dudas o querés ejercer tus derechos, escribinos a <span className="font-semibold">privacidad@donatello.org</span>.</p>
  </div>
);

export default Privacy;
