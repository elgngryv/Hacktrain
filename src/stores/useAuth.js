import { create } from 'zustand';
import axios from 'axios';

// Define the API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Create the Zustand store
export const useAuth = create((set) => ({
  user: null, // Stores the user object if logged in
  isLoading: false,
  error: null,

  // Action to sign up a user
  signUp: async (email, password, username) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        email,
        password,
        username,
      });

      // After successful registration, you might want to automatically log the user in
      // For this example, we'll just return success and let the component handle the toast message.
      // If the API returns a user object, you can set it here:
      // set({ user: response.data.user, isLoading: false });
      return { success: true };
    } catch (err) {
      set({
        isLoading: false,
        error: { message: err.response?.data?.message || 'Qeydiyyat xətası baş verdi.' },
      });
      return { error: { message: err.response?.data?.message || 'Qeydiyyat xətası baş verdi.' } };
    }
  },

  // Action to sign in a user
  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });

      // Assuming the API returns a user object on successful login
      set({ user: response.data.user, isLoading: false });
      return { success: true };
    } catch (err) {
      set({
        isLoading: false,
        error: { message: err.response?.data?.message || 'Giriş xətası baş verdi.' },
      });
      return { error: { message: err.response?.data?.message || 'Giriş xətası baş verdi.' } };
    }
  },

  // Action to sign out a user
  signOut: () => {
    set({ user: null });
  },

  // Helper function to check auth status (e.g., from localStorage)
  // This is a placeholder; you'd typically check for a token
  checkAuthStatus: () => {
    // Implement logic to check for a token in localStorage
    // If a valid token exists, fetch user data and set state
  },
}));