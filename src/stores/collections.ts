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
    selectedCategory: useLocalStorage('selectedCategory', null), // <- Add this line
    filteredResults: [],
    searchQuery: useLocalStorage('searchQuery', ''), // Modificación aquí
    searchResults: [],
    searchCancelToken: null,
    loading: false,
    currentDetail: null, // Store the current detail data
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
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    async loadRandomCollections() {
      // this.loading = true;
      // try {
      //   this.randomAccommodations = await this.fetchRandomItems('/accommodation/results/filter');
      //
      //   this.randomCaves = await this.fetchRandomItems('/cave/results/filter');
      //
      //   this.randomCulturals = await this.fetchRandomItems('/cultural/results/filter');
      //
      //   this.randomEvents = await this.fetchRandomItems('/event/results/filter');
      //
      //   this.randomFairs = await this.fetchRandomItems('/fair/results/filter');
      //
      //   this.randomMuseums = await this.fetchRandomItems('/museum/results/filter');
      //
      //   this.randomNaturals = await this.fetchRandomItems('/natural/results/filter');
      //
      //   this.randomRestaurants = await this.fetchRandomItems('/restaurant/results/filter');
      // } finally {
      //   this.loading = false;
      // }
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

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    async filterResultsByCategory(category, language) {
      if (!category) {
        this.filteredResults = [];
        return;
      }

      this.loading = true;
      try {
        // Determine the category and set the filtered results from the state
        switch (category.toLowerCase()) {
          case 'alojamientos':
            this.filteredResults = [...this.accommodations];
            break;
          case 'cuevas y restos arqueológicos':
            this.filteredResults = [...this.caves];
            break;
          case 'edificios religiosos y castillos':
            this.filteredResults = [...this.culturals];
            break;
          case 'eventos':
            this.filteredResults = [...this.events];
            break;
          case 'parques temáticos':
            this.filteredResults = [...this.fairs];
            break;
          case 'museos y centros de interpretación':
            this.filteredResults = [...this.museums];
            break;
          case 'espacios naturales':
            this.filteredResults = [...this.naturals];
            break;
          case 'restaurantes':
            this.filteredResults = [...this.restaurants];
            break;
          default:
            this.filteredResults = [];
            break;
        }

        // If the filteredResults are empty, it means we need to fetch from the API
        if (this.filteredResults.length === 0) {
          await this.loadCollectionData(category, language);
        }
      } finally {
        this.loading = false;
      }
    },

    async loadCollectionData(category, language) {
      const params = new URLSearchParams({ idioma: language });

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
          // If a category is selected, search in that specific collection
          await this.searchInCategory(this.selectedCategory, query, language);
        } else {
          // Search in all collections if no category is selected
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
      // Check if category is null or undefined
      if (!category) {
        console.error('Category is null or undefined.');
        this.searchResults = []; // Optionally reset the search results or handle as needed
        return;
      }

      // Cancel previous requests
      if (this.searchCancelToken) {
        this.searchCancelToken.cancel('Operation canceled due to new request.');
      }
      this.searchCancelToken = axios.CancelToken.source();

      // Check for minimum query length
      if (query.length < 3) {
        this.searchResults = []; // Clear search results if the query is too short
        return;
      }

      // Set loading state and initialize search results
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
            this.searchResults = []; // Optionally handle unrecognized categories
            break;
        }
      } catch (error) {
        console.error('Error during search:', error);
      } finally {
        this.loading = false;
        console.log('Search results:', this.searchResults);
      }
    },

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Fetch a single resource by ID and category
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
