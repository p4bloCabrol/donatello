
import React, { useEffect, useState } from 'react';
import { testBackend } from './api-test';

const TestBackend = () => {
  const [dbTime, setDbTime] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    testBackend()
      .then(data => {
        if (data.dbTime) setDbTime(data.dbTime);
        else setError(data.error || 'Sin respuesta');
      })
      .catch(err => setError(err.message));
  }, []);

  return (
    <div style={{marginTop: 20}}>
      <h2>Prueba de conexión backend</h2>
      {dbTime && <div>Hora de la DB: {dbTime}</div>}
      {error && <div style={{color: 'red'}}>Error: {error}</div>}
    </div>
  );
};

export default TestBackend;
