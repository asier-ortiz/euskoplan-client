// src/store/collections.ts
import { defineStore } from 'pinia';
import axios from 'axios';
import config from '../config';
import { useLocalStorage } from '@vueuse/core';

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
    randomAccommodations: [],
    randomCaves: [],
    randomCulturals: [],
    randomEvents: [],
    randomFairs: [],
    randomMuseums: [],
    randomNaturals: [],
    randomRestaurants: [],
    selectedCategory: useLocalStorage('selectedCategory', null),
    filteredResults: [],
    searchQuery: useLocalStorage('searchQuery', ''),
    searchResults: [],
    searchCancelToken: null,
    loading: false,
    currentDetail: null,
  }),
  getters: {
    getFilteredResults: (state) => state.filteredResults,
    getSearchResults: (state) => state.searchResults,
    getResourceById: (state) => (category: string, id: number) => {
      switch (category.toLowerCase()) {
        case 'accommodation':
          return state.accommodations.find((item) => item.id === id);
        case 'cave':
          return state.caves.find((item) => item.id === id);
        case 'cultural':
          return state.culturals.find((item) => item.id === id);
        case 'event':
          return state.events.find((item) => item.id === id);
        case 'fair':
          return state.fairs.find((item) => item.id === id);
        case 'museum':
          return state.museums.find((item) => item.id === id);
        case 'natural':
          return state.naturals.find((item) => item.id === id);
        case 'restaurant':
          return state.restaurants.find((item) => item.id === id);
        default:
          return null;
      }
    },
  },
  actions: {
    async performSearch(endpoint, query, cancelToken) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get(endpoint, { params, cancelToken });
        return response.data;
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error(`Error searching ${endpoint.split('/')[1]}:`, error);
        }
        return [];
      }
    },

    async getAccommodationsSearching(query, cancelToken) {
      return this.performSearch('/accommodation/results/search', query, cancelToken);
    },

    async getCavesSearching(query, cancelToken) {
      return this.performSearch('/cave/results/search', query, cancelToken);
    },

    async getCulturalsSearching(query, cancelToken) {
      return this.performSearch('/cultural/results/search', query, cancelToken);
    },

    async getEventsSearching(query, cancelToken) {
      return this.performSearch('/event/results/search', query, cancelToken);
    },

    async getFairsSearching(query, cancelToken) {
      return this.performSearch('/fair/results/search', query, cancelToken);
    },

    async getMuseumsSearching(query, cancelToken) {
      return this.performSearch('/museum/results/search', query, cancelToken);
    },

    async getNaturalsSearching(query, cancelToken) {
      return this.performSearch('/natural/results/search', query, cancelToken);
    },

    async getRestaurantsSearching(query, cancelToken) {
      return this.performSearch('/restaurant/results/search', query, cancelToken);
    },

    async loadCollectionData(category, filters, language = 'es') {
      const params = new URLSearchParams({ idioma: language, ...filters });

      try {
        switch (category.toLowerCase()) {
          case 'alojamientos':
            const accommodationsResponse = await axios.get('/accommodation/results/filter', { params });
            this.accommodations = accommodationsResponse.data;
            this.filteredResults = this.accommodations;
            break;
          case 'cuevas y restos arqueológicos':
            const cavesResponse = await axios.get('/cave/results/filter', { params });
            this.caves = cavesResponse.data;
            this.filteredResults = this.caves;
            break;
          case 'edificios religiosos y castillos':
            const culturalsResponse = await axios.get('/cultural/results/filter', { params });
            this.culturals = culturalsResponse.data;
            this.filteredResults = this.culturals;
            break;
          case 'eventos':
            const eventsResponse = await axios.get('/event/results/filter', { params });
            this.events = eventsResponse.data;
            this.filteredResults = this.events;
            break;
          case 'parques temáticos':
            const fairsResponse = await axios.get('/fair/results/filter', { params });
            this.fairs = fairsResponse.data;
            this.filteredResults = this.fairs;
            break;
          case 'museos y centros de interpretación':
            const museumsResponse = await axios.get('/museum/results/filter', { params });
            this.museums = museumsResponse.data;
            this.filteredResults = this.museums;
            break;
          case 'espacios naturales':
            const naturalsResponse = await axios.get('/natural/results/filter', { params });
            this.naturals = naturalsResponse.data;
            this.filteredResults = this.naturals;
            break;
          case 'restaurantes':
            const restaurantsResponse = await axios.get('/restaurant/results/filter', { params });
            this.restaurants = restaurantsResponse.data;
            this.filteredResults = this.restaurants;
            break;
          default:
            console.error('Invalid category:', category);
            this.filteredResults = [];
        }
      } catch (error) {
        console.error(`Error fetching data for category ${category}:`, error);
      }
    },

    async filterResultsByCategory(category, filters) {
      if (!category) {
        this.filteredResults = [];
        return;
      }

      this.loading = true;
      try {
        // Decide the endpoint and filters based on the selected category
        let endpoint = '';
        let params = { idioma: 'es' };

        switch (category.toLowerCase()) {
          case 'alojamientos':
            endpoint = '/accommodation/results/filter';
            params = { ...params, ...filters };
            break;
          case 'cuevas y restos arqueológicos':
            endpoint = '/cave/results/filter';
            params = { ...params, ...filters };
            break;
          case 'edificios religiosos y castillos':
            endpoint = '/cultural/results/filter';
            params = { ...params, ...filters };
            break;
          case 'eventos':
            endpoint = '/event/results/filter';
            params = { ...params, ...filters };
            break;
          case 'parques temáticos':
            endpoint = '/fair/results/filter';
            params = { ...params, ...filters };
            break;
          case 'museos y centros de interpretación':
            endpoint = '/museum/results/filter';
            params = { ...params, ...filters };
            break;
          case 'espacios naturales':
            endpoint = '/natural/results/filter';
            if (filters['nombre_subtipo_recurso_espacio_natural']) {
              params = { ...params, nombre_subtipo_recurso_espacio_natural: filters['nombre_subtipo_recurso_espacio_natural'] };
            } else if (filters['nombre_subtipo_recurso_playas_pantanos_rios']) {
              params = { ...params, nombre_subtipo_recurso_playas_pantanos_rios: filters['nombre_subtipo_recurso_playas_pantanos_rios'] };
            }
            break;
          case 'restaurantes':
            endpoint = '/restaurant/results/filter';
            params = { ...params, ...filters };
            break;
          default:
            console.error('Invalid category:', category);
            this.filteredResults = [];
            return;
        }

        // Fetch filtered results
        const response = await axios.get(endpoint, { params });
        this.filteredResults = response.data;

      } catch (error) {
        console.error(`Error filtering results for category ${category}:`, error);
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
        if (this.selectedCategory) {
          await this.searchInCategory(this.selectedCategory, query, language);
        } else {
          const accommodations = await this.getAccommodationsSearching(
            { idioma: language, busqueda: query },
            this.searchCancelToken.token
          );
          const caves = await this.getCavesSearching(
            { idioma: language, busqueda: query },
            this.searchCancelToken.token
          );
          const culturals = await this.getCulturalsSearching(
            { idioma: language, busqueda: query },
            this.searchCancelToken.token
          );
          const events = await this.getEventsSearching(
            { idioma: language, busqueda: query },
            this.searchCancelToken.token
          );
          const fairs = await this.getFairsSearching(
            { idioma: language, busqueda: query },
            this.searchCancelToken.token
          );
          const museums = await this.getMuseumsSearching(
            { idioma: language, busqueda: query },
            this.searchCancelToken.token
          );
          const naturals = await this.getNaturalsSearching(
            { idioma: language, busqueda: query },
            this.searchCancelToken.token
          );
          const restaurants = await this.getRestaurantsSearching(
            { idioma: language, busqueda: query },
            this.searchCancelToken.token
          );

          this.searchResults = [
            ...accommodations,
            ...caves,
            ...culturals,
            ...events,
            ...fairs,
            ...museums,
            ...naturals,
            ...restaurants,
          ];
        }
      } finally {
        this.loading = false;
      }
    },

    async searchInCategory(category: string | null, query: string, language: string) {
      if (!category) {
        console.error('Category is null or undefined.');
        this.searchResults = [];
        return;
      }

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
        switch (category.toLowerCase()) {
          case 'alojamientos':
            this.searchResults = await this.getAccommodationsSearching(
              { idioma: language, busqueda: query },
              this.searchCancelToken.token
            );
            break;
          case 'cuevas y restos arqueológicos':
            this.searchResults = await this.getCavesSearching(
              { idioma: language, busqueda: query },
              this.searchCancelToken.token
            );
            break;
          case 'edificios religiosos y castillos':
            this.searchResults = await this.getCulturalsSearching(
              { idioma: language, busqueda: query },
              this.searchCancelToken.token
            );
            break;
          case 'eventos':
            this.searchResults = await this.getEventsSearching(
              { idioma: language, busqueda: query },
              this.searchCancelToken.token
            );
            break;
          case 'parques temáticos':
            this.searchResults = await this.getFairsSearching(
              { idioma: language, busqueda: query },
              this.searchCancelToken.token
            );
            break;
          case 'museos y centros de interpretación':
            this.searchResults = await this.getMuseumsSearching(
              { idioma: language, busqueda: query },
              this.searchCancelToken.token
            );
            break;
          case 'espacios naturales':
            this.searchResults = await this.getNaturalsSearching(
              { idioma: language, busqueda: query },
              this.searchCancelToken.token
            );
            break;
          case 'restaurantes':
            this.searchResults = await this.getRestaurantsSearching(
              { idioma: language, busqueda: query },
              this.searchCancelToken.token
            );
            break;
          default:
            console.error('Unrecognized category:', category);
            this.searchResults = [];
            break;
        }
      } catch (error) {
        console.error('Error during search:', error);
      } finally {
        this.loading = false;
        console.log('Search results:', this.searchResults);
      }
    },

    async fetchResourceById(category: string, id: number, language: string) {
      try {
        const response = await axios.get(`/${category}/result/${id}/${language}`);
        this.currentDetail = response.data;
      } catch (error) {
        console.error(`Error fetching ${category} with id ${id}:`, error);
      }
    },

    setSelectedCategory(category) {
      this.selectedCategory = category;
    },
  },
});
