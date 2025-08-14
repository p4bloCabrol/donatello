import { useState } from 'react';

/**
 * Hook reutilizable para manejar formularios controlados.
 * @param {object} initialValues - Estado inicial del formulario
 * @param {function} [validate] - Función opcional de validación, debe devolver un objeto de errores
 */
export default function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setValues(v => ({
      ...v,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (onSubmit) => {
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length > 0) return;
    }
    await onSubmit(values, resetForm);
  };

  const resetForm = () => setValues(initialValues);

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
