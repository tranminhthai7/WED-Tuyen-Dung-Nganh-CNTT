import { create } from 'zustand';

const useAuthStore = create((set) => {
  // Read initial values from localStorage safely
  const initialToken = localStorage.getItem('itmatch_token') || null;
  let initialUser = null;
  try {
    const userStr = localStorage.getItem('itmatch_user');
    if (userStr) {
      initialUser = JSON.parse(userStr);
    }
  } catch (e) {
    localStorage.removeItem('itmatch_user');
  }

  return {
    token: initialToken,
    user: initialUser,
    isAuthenticated: !!initialToken,
    login: (user, token) => {
      localStorage.setItem('itmatch_token', token);
      localStorage.setItem('itmatch_user', JSON.stringify(user));
      set({ token, user, isAuthenticated: true });
    },
    logout: () => {
      localStorage.removeItem('itmatch_token');
      localStorage.removeItem('itmatch_user');
      set({ token: null, user: null, isAuthenticated: false });
    },
    updateUser: (updatedUser) => {
      localStorage.setItem('itmatch_user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
    },
  };
});

export default useAuthStore;
