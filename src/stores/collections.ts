// src/stores/collections.ts

import { defineStore } from 'pinia';
import axios from 'axios';
import config from '../config';
import { useLocalStorage } from '@vueuse/core';

// Set the base URL for axios from your configuration
axios.defaults.baseURL = config.apiBaseUrl;

export const useCollectionsStore = defineStore('collections', {
  state: () => ({
    results: [], // Unified results array for search and filters
    filteredResults: [], // Results filtered by category and other filters
    searchResults: [], // Results from search operations
    selectedCategory: useLocalStorage('selectedCategory', ''), // Default to an empty string
    searchQuery: useLocalStorage('searchQuery', ''), // Store search query
    searchCancelToken: null, // Cancel token for search requests
    loading: false, // Loading state
    currentDetail: null, // Current detailed resource
    relatedResources: [], // Related resources for detail view
    cache: new Map(), // Cache for filtered results
    searchCache: new Map(), // Cache for search results
    sortField: useLocalStorage('sortField', 'name'), // Field for sorting results
    sortOrder: useLocalStorage('sortOrder', 'asc'), // Order for sorting results
    activeTab: useLocalStorage('activeTab', 'cards'), // Store active tab state
  }),

  actions: {
    // Fetch results based on category, search query, and filters
    async fetchResults(category: string, searchQuery: string, filters: any) {
      if (!category) {
        this.results = [];
        return;
      }

      this.loading = true;
      const cacheKey = JSON.stringify({ category, searchQuery, filters });

      // Check if the results are already cached
      if (this.cache.has(cacheKey)) {
        this.results = this.cache.get(cacheKey);
        this.loading = false;
        return;
      }

      try {
        let endpoint = '';
        let params = { idioma: 'es', ...filters };

        // Determine endpoint and parameters based on category
        switch (category.toLowerCase()) {
          case 'alojamientos':
            endpoint = '/accommodation/results/filter';
            break;
          case 'cuevas y restos arqueológicos':
            endpoint = '/cave/results/filter';
            break;
          case 'edificios religiosos y castillos':
            endpoint = '/cultural/results/filter';
            break;
          case 'eventos':
            endpoint = '/event/results/filter';
            break;
          case 'parques temáticos':
            endpoint = '/fair/results/filter';
            break;
          case 'museos y centros de interpretación':
            endpoint = '/museum/results/filter';
            break;
          case 'espacios naturales':
            endpoint = '/natural/results/filter';
            break;
          case 'restaurantes':
            endpoint = '/restaurant/results/filter';
            break;
          default:
            console.error('Invalid category:', category);
            this.results = [];
            this.loading = false;
            return;
        }

        if (searchQuery && searchQuery.length >= 3) {
          params.busqueda = searchQuery;
        }

        const response = await axios.get(endpoint, { params });
        this.results = response.data;
        this.cache.set(cacheKey, this.results);
      } catch (error) {
        console.error(`Error fetching results for category ${category}:`, error);
        this.results = [];
      } finally {
        this.loading = false;
      }
    },

    // Set the search query in the store
    setSearchQuery(query: string) {
      this.searchQuery = query;
    },

    // Set the sorting field for results
    setSortField(field: string) {
      this.sortField = field;
    },

    // Set the sorting order for results
    setSortOrder(order: string) {
      this.sortOrder = order;
    },

    // Set the active tab in the view
    setActiveTab(tab: string) {
      this.activeTab = tab;
    },

    // Set the selected category in the store
    setSelectedCategory(category: string | null) {
      if (this.selectedCategory !== category) {
        this.selectedCategory = category || ''; // Set to empty string if null
      }
    },

    // Fetch a resource by its ID and category
    async fetchResourceById(category: string, id: number, language: string) {
      try {
        const response = await axios.get(`/${category}/result/${id}/${language}`);
        this.currentDetail = response.data;
      } catch (error) {
        console.error(`Error fetching ${category} with id ${id}:`, error);
      }
    },

    // Fetch related resources for a given category
    async fetchRelatedResources(category: string, language: string) {
      try {
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

    // Perform a search within a specific category
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
            this.searchResults = await this.performSearch('/accommodation/results/search', { idioma: language, busqueda: query });
            break;
          case 'cuevas y restos arqueológicos':
            this.searchResults = await this.performSearch('/cave/results/search', { idioma: language, busqueda: query });
            break;
          case 'edificios religiosos y castillos':
            this.searchResults = await this.performSearch('/cultural/results/search', { idioma: language, busqueda: query });
            break;
          case 'eventos':
            this.searchResults = await this.performSearch('/event/results/search', { idioma: language, busqueda: query });
            break;
          case 'parques temáticos':
            this.searchResults = await this.performSearch('/fair/results/search', { idioma: language, busqueda: query });
            break;
          case 'museos y centros de interpretación':
            this.searchResults = await this.performSearch('/museum/results/search', { idioma: language, busqueda: query });
            break;
          case 'espacios naturales':
            this.searchResults = await this.performSearch('/natural/results/search', { idioma: language, busqueda: query });
            break;
          case 'restaurantes':
            this.searchResults = await this.performSearch('/restaurant/results/search', { idioma: language, busqueda: query });
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
      }
    },

    // Perform a search across all collections
    async searchAllCollections(query: string, language: string) {
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
          const accommodations = await this.performSearch('/accommodation/results/search', { idioma: language, busqueda: query });
          const caves = await this.performSearch('/cave/results/search', { idioma: language, busqueda: query });
          const culturals = await this.performSearch('/cultural/results/search', { idioma: language, busqueda: query });
          const events = await this.performSearch('/event/results/search', { idioma: language, busqueda: query });
          const fairs = await this.performSearch('/fair/results/search', { idioma: language, busqueda: query });
          const museums = await this.performSearch('/museum/results/search', { idioma: language, busqueda: query });
          const naturals = await this.performSearch('/natural/results/search', { idioma: language, busqueda: query });
          const restaurants = await this.performSearch('/restaurant/results/search', { idioma: language, busqueda: query });

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

    // Helper function to perform search requests
    async performSearch(endpoint: string, params: any) {
      try {
        const response = await axios.get(endpoint, { params, cancelToken: this.searchCancelToken.token });
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
  },
});
