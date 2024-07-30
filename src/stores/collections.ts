import { defineStore } from 'pinia';
import axios from 'axios';
import config from '../config';
import { useLocalStorage } from '@vueuse/core';

// Configurar la base URL de Axios
axios.defaults.baseURL = config.apiBaseUrl;

export const useCollectionsStore = defineStore('collections', {
  state: () => ({
    accommodations: useLocalStorage('accommodations', []),
    caves: useLocalStorage('caves', []),
    culturals: useLocalStorage('culturals', []),
    events: useLocalStorage('events', []),
    fairs: useLocalStorage('fairs', []),
    museums: useLocalStorage('museums', []),
    naturals: useLocalStorage('naturals', []),
    restaurants: useLocalStorage('restaurants', []),
    accommodationCategories: useLocalStorage('accommodationCategories', []),
    caveCategories: useLocalStorage('caveCategories', []),
    culturalCategories: useLocalStorage('culturalCategories', []),
    eventCategories: useLocalStorage('eventCategories', []),
    museumCategories: useLocalStorage('museumCategories', []),
    naturalCategories: useLocalStorage('naturalCategories', []),
    restaurantCategories: useLocalStorage('restaurantCategories', []),

    // Estado para los elementos aleatorios
    randomAccommodations: [],
    randomCaves: [],
    randomCulturals: [],
    randomEvents: [],
    randomFairs: [],
    randomMuseums: [],
    randomNaturals: [],
    randomRestaurants: [],

    // Estado para la categoría seleccionada
    selectedCategory: null,
    filteredResults: [],

    // Estado de búsqueda
    searchQuery: '',
    searchResults: [],
    searchCancelToken: null,

    // Estado de carga
    loading: false,
  }),
  getters: {
    getFilteredResults: (state) => state.filteredResults,
    getSearchResults: (state) => state.searchResults,
  },
  actions: {
    // Métodos de filtrado para cada tipo de colección
    async getAccommodationsFiltering(query: Record<string, string>) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/accommodation/results/filter', { params });
        this.accommodations = response.data;
      } catch (error) {
        console.error('Error fetching accommodations:', error);
      }
    },
    async getCavesFiltering(query: Record<string, string>) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/cave/results/filter', { params });
        this.caves = response.data;
      } catch (error) {
        console.error('Error fetching caves:', error);
      }
    },
    async getCulturalsFiltering(query: Record<string, string>) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/cultural/results/filter', { params });
        this.culturals = response.data;
      } catch (error) {
        console.error('Error fetching culturals:', error);
      }
    },
    async getEventsFiltering(query: Record<string, string>) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/event/results/filter', { params });
        this.events = response.data;
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    },
    async getFairsFiltering(query: Record<string, string>) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/fair/results/filter', { params });
        this.fairs = response.data;
      } catch (error) {
        console.error('Error fetching fairs:', error);
      }
    },
    async getMuseumsFiltering(query: Record<string, string>) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/museum/results/filter', { params });
        this.museums = response.data;
      } catch (error) {
        console.error('Error fetching museums:', error);
      }
    },
    async getNaturalsFiltering(query: Record<string, string>) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/natural/results/filter', { params });
        this.naturals = response.data;
      } catch (error) {
        console.error('Error fetching naturals:', error);
      }
    },
    async getRestaurantsFiltering(query: Record<string, string>) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/restaurant/results/filter', { params });
        this.restaurants = response.data;
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    },

    // Métodos de búsqueda para cada tipo de colección
    async getAccommodationsSearching(query: Record<string, string>, cancelToken) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/accommodation/results/search', { params, cancelToken });
        this.searchResults.push(...response.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error('Error searching accommodations:', error);
        }
      }
    },
    async getCavesSearching(query: Record<string, string>, cancelToken) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/cave/results/search', { params, cancelToken });
        this.searchResults.push(...response.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error('Error searching caves:', error);
        }
      }
    },
    async getCulturalsSearching(query: Record<string, string>, cancelToken) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/cultural/results/search', { params, cancelToken });
        this.searchResults.push(...response.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error('Error searching culturals:', error);
        }
      }
    },
    async getEventsSearching(query: Record<string, string>, cancelToken) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/event/results/search', { params, cancelToken });
        this.searchResults.push(...response.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error('Error searching events:', error);
        }
      }
    },
    async getFairsSearching(query: Record<string, string>, cancelToken) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/fair/results/search', { params, cancelToken });
        this.searchResults.push(...response.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error('Error searching fairs:', error);
        }
      }
    },
    async getMuseumsSearching(query: Record<string, string>, cancelToken) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/museum/results/search', { params, cancelToken });
        this.searchResults.push(...response.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error('Error searching museums:', error);
        }
      }
    },
    async getNaturalsSearching(query: Record<string, string>, cancelToken) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/natural/results/search', { params, cancelToken });
        this.searchResults.push(...response.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error('Error searching naturals:', error);
        }
      }
    },
    async getRestaurantsSearching(query: Record<string, string>, cancelToken) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/restaurant/results/search', { params, cancelToken });
        this.searchResults.push(...response.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error('Error searching restaurants:', error);
        }
      }
    },

    // Métodos para obtener elementos aleatorios
    async loadRandomCollections() {
      this.loading = true;
      try {
        this.randomAccommodations = await this.fetchRandomItems('/accommodation/results/filter');

        this.randomCaves = await this.fetchRandomItems('/cave/results/filter');

        this.randomCulturals = await this.fetchRandomItems('/cultural/results/filter');

        this.randomEvents = await this.fetchRandomItems('/event/results/filter');

        this.randomFairs = await this.fetchRandomItems('/fair/results/filter');

        this.randomMuseums = await this.fetchRandomItems('/museum/results/filter');

        this.randomNaturals = await this.fetchRandomItems('/natural/results/filter');

        this.randomRestaurants = await this.fetchRandomItems('/restaurant/results/filter');
      } finally {
        this.loading = false;
      }
    },

    async fetchRandomItems(endpoint: string) {
      const params = new URLSearchParams({ idioma: 'es', aleatorio: 'si', limite: '5' });
      try {
        const response = await axios.get(endpoint, { params });
        return response.data;
      } catch (error) {
        console.error(`Error fetching random items from ${endpoint}:`, error);
        return [];
      }
    },

    // Método para obtener resultados filtrados según la categoría seleccionada
    async filterResultsByCategory(category, language) {
      if (!category) {
        this.filteredResults = [];
        return;
      }

      this.loading = true;
      try {
        switch (category.toLowerCase()) {
          case 'alojamientos':
            if (this.accommodations.length === 0) {
              await this.getAccommodationsFiltering({ idioma: language });
            }
            this.filteredResults = this.accommodations;
            break;
          case 'cuevas y restos arqueológicos':
            if (this.caves.length === 0) {
              await this.getCavesFiltering({ idioma: language });
            }
            this.filteredResults = this.caves;
            break;
          case 'edificios religiosos y castillos':
            if (this.culturals.length === 0) {
              await this.getCulturalsFiltering({ idioma: language });
            }
            this.filteredResults = this.culturals;
            break;
          case 'eventos':
            if (this.events.length === 0) {
              await this.getEventsFiltering({ idioma: language });
            }
            this.filteredResults = this.events;
            break;
          case 'parques temáticos':
            if (this.fairs.length === 0) {
              await this.getFairsFiltering({ idioma: language });
            }
            this.filteredResults = this.fairs;
            break;
          case 'museos y centros de interpretación':
            if (this.museums.length === 0) {
              await this.getMuseumsFiltering({ idioma: language });
            }
            this.filteredResults = this.museums;
            break;
          case 'espacios naturales':
            if (this.naturals.length === 0) {
              await this.getNaturalsFiltering({ idioma: language });
            }
            this.filteredResults = this.naturals;
            break;
          case 'restaurantes':
            if (this.restaurants.length === 0) {
              await this.getRestaurantsFiltering({ idioma: language });
            }
            this.filteredResults = this.restaurants;
            break;
          default:
            this.filteredResults = [];
            break;
        }
      } finally {
        this.loading = false;
      }
    },


    async searchAllCollections(query, language) {
      if (this.searchCancelToken) {
        this.searchCancelToken.cancel('Operation canceled due to new request.');
      }

      this.searchCancelToken = axios.CancelToken.source();

      if (query.length < 3) {
        this.searchResults = [];
        return;
      }

      this.loading = true;
      this.searchResults = [];

      try {
        await this.getAccommodationsSearching({ idioma: language, busqueda: query }, this.searchCancelToken.token);
        await this.getCavesSearching({ idioma: language, busqueda: query }, this.searchCancelToken.token);
        await this.getCulturalsSearching({ idioma: language, busqueda: query }, this.searchCancelToken.token);
        await this.getEventsSearching({ idioma: language, busqueda: query }, this.searchCancelToken.token);
        await this.getFairsSearching({ idioma: language, busqueda: query }, this.searchCancelToken.token);
        await this.getMuseumsSearching({ idioma: language, busqueda: query }, this.searchCancelToken.token);
        await this.getNaturalsSearching({ idioma: language, busqueda: query }, this.searchCancelToken.token);
        await this.getRestaurantsSearching({ idioma: language, busqueda: query }, this.searchCancelToken.token);
      } finally {
        console.log('Search results:', this.searchResults); // Verificar el contenido de searchResults
        this.loading = false;
      }
    }
  },
});
