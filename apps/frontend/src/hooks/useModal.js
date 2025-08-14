import { useState, useCallback } from 'react';

/**
 * useModal - Custom hook to manage modal state and logic
 * @param {Object} initialState - Initial modal state
 * @returns {Object} { modal, openModal, closeModal, setModal }
 */
export default function useModal(initialState = { open: false, type: null, listing: null, donation: null }) {
  const [modal, setModal] = useState(initialState);

  const openModal = useCallback((modalProps = {}) => {
    setModal({ ...initialState, ...modalProps, open: true });
  }, [initialState]);

  const closeModal = useCallback(() => {
    setModal(initialState);
  }, [initialState]);

  return { modal, openModal, closeModal, setModal };
}
