import { defineStore } from 'pinia';
import axios from 'axios';
import router from '../router';
import config from '../config';

// Configurar la base URL de Axios
axios.defaults.baseURL = config.apiBaseUrl;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
  }),
  actions: {
    async login(credentials) {
      try {
        const response = await axios.post('/user/login', credentials);
        this.token = response.data.jwt;
        this.user = response.data.user; // Store the user data
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      } catch (error) {
        throw new Error('Invalid credentials');
      }
    },
    async logout() {
      try {
        await axios.post('/user/logout');
        this.user = null;
        this.token = null;
        delete axios.defaults.headers.common['Authorization'];
        router.push('/login');
      } catch (error) {
        console.error(error);
      }
    },
    isLoggedIn() {
      return !this.user;
    },
  },
});
