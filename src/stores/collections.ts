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
    selectedCategory: null,
    filteredResults: [],
    searchQuery: '',
    searchResults: [],
    searchCancelToken: null,
    loading: false,
  }),
  getters: {
    getFilteredResults: (state) => state.filteredResults,

    getSearchResults: (state) => state.searchResults,
  },
  actions: {

    async getAccommodationsFiltering(query) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/accommodation/results/filter', { params });
        this.accommodations = response.data;
      } catch (error) {
        console.error('Error fetching accommodations:', error);
      }
    },

    async getCavesFiltering(query) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/cave/results/filter', { params });
        this.caves = response.data;
      } catch (error) {
        console.error('Error fetching caves:', error);
      }
    },

    async getCulturalsFiltering(query) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/cultural/results/filter', { params });
        this.culturals = response.data;
      } catch (error) {
        console.error('Error fetching culturals:', error);
      }
    },

    async getEventsFiltering(query) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/event/results/filter', { params });
        this.events = response.data;
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    },

    async getFairsFiltering(query) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/fair/results/filter', { params });
        this.fairs = response.data;
      } catch (error) {
        console.error('Error fetching fairs:', error);
      }
    },

    async getMuseumsFiltering(query) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/museum/results/filter', { params });
        this.museums = response.data;
      } catch (error) {
        console.error('Error fetching museums:', error);
      }
    },

    async getNaturalsFiltering(query) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/natural/results/filter', { params });
        this.naturals = response.data;
      } catch (error) {
        console.error('Error fetching naturals:', error);
      }
    },

    async getRestaurantsFiltering(query) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/restaurant/results/filter', { params });
        this.restaurants = response.data;
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    },

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    async getAccommodationsSearching(query, cancelToken) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/accommodation/results/search', { params, cancelToken });
        return response.data;
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error('Error searching accommodations:', error);
        }
        return [];
      }
    },

    async getCavesSearching(query, cancelToken) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/cave/results/search', { params, cancelToken });
        return response.data;
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error('Error searching caves:', error);
        }
        return [];
      }
    },

    async getCulturalsSearching(query, cancelToken) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/cultural/results/search', { params, cancelToken });
        return response.data;
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error('Error searching culturals:', error);
        }
        return [];
      }
    },

    async getEventsSearching(query, cancelToken) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/event/results/search', { params, cancelToken });
        return response.data;
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error('Error searching events:', error);
        }
        return [];
      }
    },

    async getFairsSearching(query, cancelToken) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/fair/results/search', { params, cancelToken });
        return response.data;
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error('Error searching fairs:', error);
        }
        return [];
      }
    },

    async getMuseumsSearching(query, cancelToken) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/museum/results/search', { params, cancelToken });
        return response.data;
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error('Error searching museums:', error);
        }
        return [];
      }
    },

    async getNaturalsSearching(query, cancelToken) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/natural/results/search', { params, cancelToken });
        return response.data;
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error('Error searching naturals:', error);
        }
        return [];
      }
    },

    async getRestaurantsSearching(query, cancelToken) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/restaurant/results/search', { params, cancelToken });
        return response.data;
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error('Error searching restaurants:', error);
        }
        return [];
      }
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

    // async searchInCategory(category, query, language) {
    //   if (this.searchCancelToken) {
    //     this.searchCancelToken.cancel('Operation canceled due to new request.');
    //   }
    //
    //   this.searchCancelToken = axios.CancelToken.source();
    //
    //   if (query.length < 3) {
    //     this.searchResults = [];
    //     return;
    //   }
    //
    //   this.loading = true;
    //   this.searchResults = [];
    //
    //   try {
    //     switch (category.toLowerCase()) {
    //       case 'alojamientos':
    //         this.searchResults = await this.getAccommodationsSearching(
    //             { idioma: language, busqueda: query },
    //             this.searchCancelToken.token
    //         );
    //         break;
    //       case 'cuevas y restos arqueológicos':
    //         this.searchResults = await this.getCavesSearching(
    //             { idioma: language, busqueda: query },
    //             this.searchCancelToken.token
    //         );
    //         break;
    //       case 'edificios religiosos y castillos':
    //         this.searchResults = await this.getCulturalsSearching(
    //             { idioma: language, busqueda: query },
    //             this.searchCancelToken.token
    //         );
    //         break;
    //       case 'eventos':
    //         this.searchResults = await this.getEventsSearching(
    //             { idioma: language, busqueda: query },
    //             this.searchCancelToken.token
    //         );
    //         break;
    //       case 'parques temáticos':
    //         this.searchResults = await this.getFairsSearching(
    //             { idioma: language, busqueda: query },
    //             this.searchCancelToken.token
    //         );
    //         break;
    //       case 'museos y centros de interpretación':
    //         this.searchResults = await this.getMuseumsSearching(
    //             { idioma: language, busqueda: query },
    //             this.searchCancelToken.token
    //         );
    //         break;
    //       case 'espacios naturales':
    //         this.searchResults = await this.getNaturalsSearching(
    //             { idioma: language, busqueda: query },
    //             this.searchCancelToken.token
    //         );
    //         break;
    //       case 'restaurantes':
    //         this.searchResults = await this.getRestaurantsSearching(
    //             { idioma: language, busqueda: query },
    //             this.searchCancelToken.token
    //         );
    //         break;
    //       default:
    //         this.searchResults = [];
    //         break;
    //     }
    //   } finally {
    //     this.loading = false;
    //   }
    // },

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

  },
});
