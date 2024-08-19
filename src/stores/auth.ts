import { defineStore } from 'pinia';
import axios from 'axios';
import router from '../router';
import config from '../config';
import Swal from 'sweetalert2';
import { useFavoritesStore } from './favorites'; // Import Favorites Store
import type { UserModel } from '@/models/user.model'; // Import UserModel

// Configure the base URL for Axios
axios.defaults.baseURL = config.apiBaseUrl;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null') as UserModel | null,
    token: localStorage.getItem('token'),
    redirectTo: null, // Add redirectTo to store intended path
  }),
  actions: {
    async login(credentials) {
      try {
        const response = await axios.post('/user/login', credentials);
        this.token = response.data.jwt;
        localStorage.setItem('token', this.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

        // Additional call to fetch user data
        await this.fetchUser();

        // Use the redirect path or default to home
        const redirectTo = this.redirectTo || '/';
        this.redirectTo = null; // Clear redirect path after use
        await router.push(redirectTo);
      } catch (error) {
        throw new Error('Invalid credentials');
      }
    },
    async logout() {
      try {
        await axios.post('/user/logout');
        this.user = null;
        this.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];

        // Clear the favorites store on logout
        const favoritesStore = useFavoritesStore();
        favoritesStore.clearFavorites();

        await router.push('/');
        await Swal.fire({
          icon: 'success',
          title: 'Logged out',
          text: 'You have been logged out successfully.',
        });
      } catch (error) {
        console.error(error);
        await Swal.fire({
          icon: 'error',
          title: 'Logout failed',
          text: 'There was a problem logging you out. Please try again.',
        });
      }
    },
    async fetchUser() {
      try {
        const response = await axios.get('/user/user');
        const userData: UserModel = {
          id: response.data.id,
          email: response.data.email,
          nombre_usuario: response.data.nombre_usuario,
        };
        this.user = userData;
        localStorage.setItem('user', JSON.stringify(this.user));
      } catch (error) {
        this.user = null;
        this.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        await router.push('/auth/login');
      }
    },
    async verifyEmail(token) {
      try {
        const response = await axios.post('/account/verify', { token });
        const userData: UserModel = {
          id: response.data.id,
          email: response.data.email,
          nombre_usuario: response.data.nombre_usuario,
        };
        this.user = userData;
        localStorage.setItem('user', JSON.stringify(this.user));
        await router.push('/');
      } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 400) {
          await Swal.fire({
            icon: 'error',
            title: 'Token expired',
            text: 'Your token has expired. We have sent you a new verification email.',
          });
          await axios.post('/account/sendEmail', { email: this.user?.email });
        }
      }
    },
    async requestPasswordReset(email) {
      try {
        await axios.post('/password/sendEmail', { email });
        await router.push('/auth/password-reset');
      } catch (error) {
        console.error(error);
      }
    },
    async resetPassword(data) {
      try {
        const response = await axios.post('/password/reset', data);
        const userData: UserModel = {
          id: response.data.id,
          email: response.data.email,
          nombre_usuario: response.data.nombre_usuario,
        };
        this.user = userData;
        localStorage.setItem('user', JSON.stringify(this.user));
        await router.push('/auth/login');
      } catch (error) {
        console.error(error);
      }
    },
    async register(credentials) {
      try {
        await axios.post('/user/register', credentials);
        await axios.post('/account/sendEmail', { email: credentials.email }); // Send verification email
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'Please check your email to verify your account.',
        }).then(() => {
          router.push('/auth/login');
        });
      } catch (error) {
        throw new Error('Registration failed');
      }
    },
    isLoggedIn() {
      return !!this.token;
    },
    // Method to set redirect path
    setRedirectTo(path) {
      this.redirectTo = path;
    },
  },
});
