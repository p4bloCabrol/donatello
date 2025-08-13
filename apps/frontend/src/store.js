import { create } from 'zustand';
    
const useStore = create((set, get) => ({
  user: null,
  token: null,
  listings: [],
  userDonations: [],
  applicantsCount: {},
  modal: { open: false, type: null, listing: null, donation: null },
  toast: null, // mensaje de notificación global
  // User/session
  setUser: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
  // Listings
  setListings: listings => set({ listings }),
  // Donations
  setUserDonations: userDonations => set({ userDonations }),
  // Applicants count
  setApplicantsCount: applicantsCount => set({ applicantsCount }),
  // Modal
  openModal: (type, listing, donation = null) => set({ modal: { open: true, type, listing, donation } }),
  closeModal: () => set({ modal: { open: false, type: null, listing: null, donation: null } }),
  // Toast
  showToast: (msg) => set({ toast: msg }),
  hideToast: () => set({ toast: null }),
}));

export default useStore;
