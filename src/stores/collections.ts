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
    async fetchResults(category: string | null, searchQuery: string, filters: any) {
      this.loading = true; // Set loading to true at the start of the request
      const cacheKey = JSON.stringify({ category, searchQuery, filters });

      // Check if the results are already cached
      if (this.cache.has(cacheKey)) {
        this.results = this.cache.get(cacheKey);
        this.loading = false; // Set loading to false after cache check
        return;
      }

      try {
        let endpoint = '';
        let params = { idioma: 'es', ...filters };

        // Determine endpoint and parameters based on category
        switch (category?.toLowerCase()) {
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
            // If no category is selected, perform a general search across all collections
            await this.searchAllCollections(searchQuery, 'es');
            this.loading = false; // Ensure loading is set to false here
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
        this.loading = false; // Set loading to false in the finally block
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

    // Helper function to perform search requests
    async performSearch(endpoint: string, params: any) {
      try {
        const response = await axios.get(endpoint, { params, cancelToken: this.searchCancelToken?.token });
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

    // Perform a search across all collections
    async searchAllCollections(query: string, language: string) {
      if (!query || query.length < 3) {
        this.results = [];
        return;
      }

      this.loading = true; // Set loading to true when starting the search
      this.searchResults = [];

      try {
        const endpoints = [
          '/accommodation/results/filter',
          '/cave/results/filter',
          '/cultural/results/filter',
          '/event/results/filter',
          '/fair/results/filter',
          '/museum/results/filter',
          '/natural/results/filter',
          '/restaurant/results/filter',
        ];

        const requests = endpoints.map(endpoint =>
          axios.get(endpoint, { params: { idioma: language, busqueda: query } })
        );

        const responses = await Promise.all(requests);
        this.results = responses.flatMap(response => response.data);
      } catch (error) {
        console.error('Error fetching results for all collections:', error);
        this.results = [];
      } finally {
        this.loading = false; // Ensure loading is set to false in the finally block
      }
    },
  },
});
