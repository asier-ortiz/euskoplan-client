// src/store/collections.ts

import { defineStore } from 'pinia';
import axios from 'axios';
import config from '../config';
import { useLocalStorage } from '@vueuse/core';

axios.defaults.baseURL = config.apiBaseUrl;

export const useCollectionsStore = defineStore('collections', {
  state: () => ({
    filteredResults: [],
    selectedCategory: useLocalStorage('selectedCategory', ''), // Default to an empty string
    searchQuery: useLocalStorage('searchQuery', ''),
    searchResults: [],
    searchCancelToken: null,
    loading: false,
    currentDetail: null,
    relatedResources: [], // Add state for related resources
    cache: new Map(), // Cache for filtered results
    searchCache: new Map(), // Cache for search results
    sortField: useLocalStorage('sortField', 'name'),
    sortOrder: useLocalStorage('sortOrder', 'asc'),
    activeTab: useLocalStorage('activeTab', 'cards'), // Store active tab state
    mapCenter: useLocalStorage('mapCenter', { lat: 0, lng: 0 }), // Store map center
    mapZoom: useLocalStorage('mapZoom', 5), // Store map zoom level
    mapMarkers: useLocalStorage('mapMarkers', []), // Store map markers
    mapMode: useLocalStorage('mapMode', 'light'), // Store map mode (light or dark)
  }),

  actions: {
    async fetchRelatedResources(category, language = 'es') {
      try {
        if (!category) {
          console.warn('No category provided for fetching related resources.');
          this.relatedResources = [];
          return;
        }
        const response = await axios.get(`/${category}/results/filter`, {
          params: {
            idioma: language,
            aleatorio: 'si', // Fetch random resources
            limite: 3, // Limit to 3 results
          },
        });
        this.relatedResources = response.data;
      } catch (error) {
        console.error(`Error fetching related resources for category ${category}:`, error);
      }
    },

    async filterResultsByCategory(category, filters) {
      if (!category) {
        console.warn('No category provided for filtering results.');
        this.filteredResults = [];
        return;
      }

      // Generate a unique cache key for the filter combination
      const cacheKey = JSON.stringify({ category, filters });

      // Check if the results are already cached
      if (this.cache.has(cacheKey)) {
        this.filteredResults = this.cache.get(cacheKey);
        return;
      }

      this.loading = true;
      try {
        let endpoint = '';
        let params = { idioma: 'es' };

        // Determine endpoint and parameters based on category
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
            params = { ...params, ...filters };
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

        const response = await axios.get(endpoint, { params });
        this.filteredResults = response.data;

        // Cache the results
        this.cache.set(cacheKey, this.filteredResults);
      } catch (error) {
        console.error(`Error filtering results for category ${category}:`, error);
      } finally {
        this.loading = false;
      }
    },

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

    // Individual search actions for different categories
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

    async searchAllCollections(query, language) {
      const cacheKey = JSON.stringify({ query, language });

      // Check if the results are already cached
      if (this.searchCache.has(cacheKey)) {
        this.searchResults = this.searchCache.get(cacheKey);
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

          // Cache the search results
          this.searchCache.set(cacheKey, this.searchResults);
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

      const cacheKey = JSON.stringify({ category, query, language });

      // Check if the results are already cached
      if (this.searchCache.has(cacheKey)) {
        this.searchResults = this.searchCache.get(cacheKey);
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

        // Cache the search results
        this.searchCache.set(cacheKey, this.searchResults);
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
      this.selectedCategory = category || ''; // Set to empty string if null
    },

    // Add actions to update sortField and sortOrder
    setSortField(field) {
      this.sortField = field;
    },

    setSortOrder(order) {
      this.sortOrder = order;
    },

    setActiveTab(tab) {
      this.activeTab = tab;
    },

    setMapCenter(center) {
      this.mapCenter = center;
    },

    setMapZoom(zoom) {
      this.mapZoom = zoom;
    },

    setMapMarkers(markers) {
      this.mapMarkers = markers;
    },

    setMapMode(mode) {
      this.mapMode = mode;
    }
  },
});
