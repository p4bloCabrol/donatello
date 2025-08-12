import React from 'react';
import { Link } from 'react-router-dom';

const Stat = ({ value, label }) => (
  <div className="text-center">
    <div className="text-2xl font-extrabold text-blue-700">{value}</div>
    <div className="text-gray-600 text-sm">{label}</div>
  </div>
);

const Landing = () => {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="bg-white rounded-xl shadow p-8 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Conectamos donaciones con quienes más las necesitan</h1>
        <p className="text-gray-700 max-w-2xl mx-auto mb-6">
          Transformamos la solidaridad en acción. Unimos personas e instituciones para que la ayuda llegue a tiempo y donde más importa.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded font-semibold">Quiero Donar</Link>
          <Link to="/register" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded font-semibold">Necesito Ayuda</Link>
        </div>
      </section>

      {/* Why join */}
      <section className="bg-white rounded-xl shadow p-8">
        <h2 className="text-2xl font-bold mb-2">¿Por qué unirte a Donatello?</h2>
        <p className="text-gray-700 mb-4">Porque cada pequeño gesto puede cambiar una historia. Donatello es el puente entre quienes quieren ayudar y quienes más lo necesitan.</p>
        <ul className="space-y-2 list-disc pl-5 text-gray-800">
          <li><span className="font-semibold">Ayudá de forma directa:</span> Tu aporte llega sin intermediarios innecesarios.</li>
          <li><span className="font-semibold">Elegí tu impacto:</span> Decidí a quién y cómo ayudar.</li>
          <li><span className="font-semibold">Sumá esperanza:</span> Lo que ya no usás puede ser el comienzo de algo nuevo para otra persona.</li>
        </ul>
      </section>

      {/* How it works */}
      <section className="bg-white rounded-xl shadow p-8">
        <h2 className="text-2xl font-bold mb-2">Ayudar nunca fue tan simple</h2>
        <ol className="space-y-2 list-decimal pl-5 text-gray-800">
          <li><span className="font-semibold">Unite:</span> Registrate como donante o institución.</li>
          <li><span className="font-semibold">Compartí:</span> Publicá lo que querés donar o lo que necesitás.</li>
          <li><span className="font-semibold">Conectá:</span> Charlá y coordiná directamente con la otra parte.</li>
          <li><span className="font-semibold">Celebrá:</span> Confirmá la entrega y sabé que hiciste la diferencia.</li>
        </ol>
      </section>

      {/* Impact */}
      <section className="bg-white rounded-xl shadow p-8">
        <h2 className="text-2xl font-bold mb-2">Juntos hacemos más</h2>
        <p className="text-gray-700 mb-6">Cada historia empieza con un sí. En Donatello creemos que la solidaridad se multiplica cuando es fácil y accesible para todos.</p>
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
          <Stat value="+500" label="gestos de ayuda realizados" />
          <Stat value="+200" label="instituciones beneficiadas" />
          <Stat value="+1.000" label="personas alcanzadas" />
        </div>
      </section>

      {/* Trust */}
      <section className="bg-white rounded-xl shadow p-8">
        <h2 className="text-2xl font-bold mb-2">Ayudá con tranquilidad</h2>
        <p className="text-gray-700">Cuidamos tu privacidad, verificamos las instituciones y creamos un espacio seguro para que la solidaridad fluya sin riesgos.</p>
      </section>

      {/* Final CTA */}
      <section className="bg-blue-50 rounded-xl border border-blue-100 p-8 text-center">
        <p className="text-lg text-gray-800 mb-4">Lo que para vos es un objeto olvidado, para alguien puede ser un nuevo comienzo. Unite hoy y formá parte de algo más grande.</p>
        <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold">Quiero empezar ahora</Link>
      </section>
    </div>
  );
};

export default Landing;
