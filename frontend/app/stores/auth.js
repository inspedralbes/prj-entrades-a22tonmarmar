import { defineStore } from "pinia";

const TOKEN_KEY = "token";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
    user: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    initFromStorage() {
      if (!import.meta.client) return;
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        this.token = storedToken;
      }
    },
    setAuth({ token, user }) {
      this.token = token;
      this.user = user || null;
      if (import.meta.client) {
        localStorage.setItem(TOKEN_KEY, token);
      }
    },
    clearAuth() {
      this.token = null;
      this.user = null;
      if (import.meta.client) {
        localStorage.removeItem(TOKEN_KEY);
      }
    },
  },
});
