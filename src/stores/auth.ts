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
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        this.user = response.data.user; // Asume que el endpoint de login también devuelve los datos del usuario
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
    async verifyEmail(token) {
      try {
        const response = await axios.post('/account/verify', { token });
        this.user = response.data;
        router.push('/');
      } catch (error) {
        console.error(error);
      }
    },
    async requestPasswordReset(email) {
      try {
        await axios.post('/password/sendEmail', { email });
        router.push('/password-reset');
      } catch (error) {
        console.error(error);
      }
    },
    async resetPassword(data) {
      try {
        const response = await axios.post('/password/reset', data);
        this.user = response.data;
        router.push('/login');
      } catch (error) {
        console.error(error);
      }
    },
  },
});
