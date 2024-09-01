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
    redirectTo: null, // Store intended path for redirection
  }),

  actions: {

    async initializeAuth() {
      if (this.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        try {
          await this.fetchUser();
        } catch (error) {
          await this.logout(); // Logout if token validation fails
        }
      }
    },

    async login(credentials) {
      try {
        const response = await axios.post('/user/login', credentials);
        this.token = response.data.jwt;
        localStorage.setItem('token', this.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

        // Fetch user data after successful login
        await this.fetchUser();

        // Redirect to the intended path or home
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
      } catch (error) {
        console.error('Logout request failed', error);
      } finally {
        this.clearAuthData();
        await router.push('/');
        await Swal.fire({
          icon: 'success',
          title: 'Logged out',
          text: 'You have been logged out successfully.',
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
        this.clearAuthData();
        await router.push('/auth/login');
        throw error;
      }
    },

    async verifyEmail(token: string) {
      try {
        console.log('Sending verification request with token:', token);
        const response = await axios.post('/account/verify', { token });

        // Handle successful verification
        this.token = response.data.token;
        localStorage.setItem('token', this.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        this.user = response.data.user;
        localStorage.setItem('user', JSON.stringify(this.user));
      } catch (error) {
        console.error('Verification error:', error);
        console.error('Error response data:', error.response?.data);

        if (error.response && error.response.status === 400) {
          await Swal.fire({
            icon: 'error',
            title: 'Token expired',
            text: 'Your token has expired. We have sent you a new verification email.',
          });
          await axios.post('/account/sendEmail', { email: this.user?.email });
        } else {
          await Swal.fire({
            icon: 'error',
            title: 'Verification failed',
            text: 'There was an error verifying your email. Please try again.',
          });
        }
      }
    },

    async requestPasswordReset(email: string) {
      try {
        await axios.post('/password/sendEmail', { email });
      } catch (error) {
        console.error('Error during password reset request:', error);
        if (error.response && error.response.status === 404) {
          throw new Error('Email not found');
        } else {
          throw new Error('Failed to send password reset email');
        }
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

    async findPasswordResetToken(token: string) {
      try {
        const response = await axios.get(`/password/find/${token}`);
        return response.data;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          throw new Error('Invalid token');
        } else if (error.response && error.response.status === 400) {
          throw new Error('Token expired');
        } else {
          throw new Error('Failed to verify token');
        }
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

    async checkUsernameAvailability(username) {
      try {
        const response = await axios.get(`/user/find/username/${username}`);
        return response.status === 200;
      } catch (error) {
        if (error.response && error.response.status === 409) {
          return false;
        }
        throw new Error('Failed to check username availability');
      }
    },

    async checkEmailAvailability(email) {
      try {
        const response = await axios.get(`/user/find/email/${email}`);
        return response.status === 200;
      } catch (error) {
        if (error.response && error.response.status === 409) {
          return false;
        }
        throw new Error('Failed to check email availability');
      }
    },

    isLoggedIn() {
      return !!this.token;
    },

    setRedirectTo(path) {
      this.redirectTo = path;
    },

    clearAuthData() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];

      // Clear the favorites store on logout
      const favoritesStore = useFavoritesStore();
      favoritesStore.clearFavorites();
    },

  },
});
