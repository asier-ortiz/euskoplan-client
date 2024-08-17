import { defineStore } from 'pinia';
import axios from 'axios';
import config from '../config';
import { useLocalStorage } from '@vueuse/core';

import type { AccommodationModel } from '@/models/accommodation.model';
import type { CaveModel } from '@/models/cave.model';
import type { CulturalModel } from '@/models/cultural.model';
import type { EventModel } from '@/models/event.model';
import type { FairModel } from '@/models/fair.model';
import type { MuseumModel } from '@/models/museum.model';
import type { NaturalModel } from '@/models/natural.model';
import type { RestaurantModel } from '@/models/restaurant.model';

axios.defaults.baseURL = config.apiBaseUrl;

export const useCollectionsStore = defineStore('collections', {
  state: () => ({
    results: [] as (
        AccommodationModel[] |
        CaveModel[] |
        CulturalModel[] |
        EventModel[] |
        FairModel[] |
        MuseumModel[] |
        NaturalModel[] |
        RestaurantModel[]
        ),
    selectedCategory: useLocalStorage('selectedCategory', ''),
    searchQuery: useLocalStorage('searchQuery', ''),
    loading: false,
    currentDetail: null as AccommodationModel | CaveModel | CulturalModel | EventModel | FairModel | MuseumModel | NaturalModel | RestaurantModel | null,
    relatedResources: [] as (
        AccommodationModel[] |
        CaveModel[] |
        CulturalModel[] |
        EventModel[] |
        FairModel[] |
        MuseumModel[] |
        NaturalModel[] |
        RestaurantModel[]
        ),
    cache: new Map(),
    sortField: useLocalStorage('sortField', 'name'),
    sortOrder: useLocalStorage('sortOrder', 'asc'),
    activeTab: useLocalStorage('activeTab', 'cards'),
    requestCounter: 0, // Add a request counter to the state
    fetchResourceAbortController: null as AbortController | null, // Controller for fetchResourceById
    fetchRelatedResourcesAbortController: null as AbortController | null, // Controller for fetchRelatedResources

    // Pagination related state
    currentPage: useLocalStorage('currentPage', 1), // Save the current page in LocalStorage
    itemsPerPage: 12, // Number of items per page
  }),

  getters: {
    // Compute total pages based on the number of results and items per page
    totalPages: (state) => {
      return Math.ceil(state.results.length / state.itemsPerPage);
    },

    // Get the paginated results for the current page
    paginatedResults: (state) => {
      const start = (state.currentPage - 1) * state.itemsPerPage;
      const end = start + state.itemsPerPage;
      return state.results.slice(start, end);
    },
  },

  actions: {
    async fetchResults(category: string | null, searchQuery: string, filters: any) {
      this.loading = true;
      const currentRequest = ++this.requestCounter; // Increment and capture the current request counter

      const cacheKey = JSON.stringify({ category, searchQuery, filters });

      if (this.cache.has(cacheKey)) {
        this.results = this.cache.get(cacheKey);
        this.loading = false;
        return;
      }

      try {
        let endpoint = '';
        const params = { idioma: 'es', ...filters };

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
            this.loading = false;
            return;
        }

        if (searchQuery && searchQuery.length >= 3) {
          params.busqueda = searchQuery;
        }

        const response = await axios.get(endpoint, { params });

        // Only update results if this is the latest request
        if (currentRequest === this.requestCounter) {
          this.results = response.data;
          this.cache.set(cacheKey, this.results);
          this.setCurrentPage(1); // Reset to the first page when new results are fetched
        }
      } catch (error) {
        if (currentRequest === this.requestCounter) {
          console.error(`Error fetching results for category ${category}:`, error);
          this.results = [];
        }
      } finally {
        // Only stop loading if this is the latest request
        if (currentRequest === this.requestCounter) {
          this.loading = false;
        }
      }
    },

    setSearchQuery(query: string) {
      this.searchQuery = query;
    },

    setSortField(field: string) {
      this.sortField = field;
    },

    setSortOrder(order: string) {
      this.sortOrder = order;
    },

    setActiveTab(tab: string) {
      this.activeTab = tab;
    },

    setSelectedCategory(category: string | null) {
      if (this.selectedCategory !== category) {
        this.searchQuery = ''; // Reset the search query
        this.selectedCategory = category || '';
      }
    },

    async fetchResourceById(category: string, id: number, language: string) {
      // Check if the resource is already cached in currentDetail
      if (this.currentDetail && this.currentDetail.id === id && this.currentDetail.coleccion === category) {
        // No need to refetch if it's already in the store
        return;
      }

      // Abort previous request if exists
      if (this.fetchResourceAbortController) {
        this.fetchResourceAbortController.abort();
      }
      this.fetchResourceAbortController = new AbortController();

      try {
        const response = await axios.get(`/${category}/result/${id}/${language}`, {
          signal: this.fetchResourceAbortController.signal,
        });
        this.currentDetail = response.data;
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          console.error(`Error fetching ${category} with id ${id}:`, error);
        }
      } finally {
        this.fetchResourceAbortController = null; // Reset controller after request completes
      }
    },

    async fetchRelatedResources(category: string, language: string) {
      // Abort previous request if exists
      if (this.fetchRelatedResourcesAbortController) {
        this.fetchRelatedResourcesAbortController.abort();
      }
      this.fetchRelatedResourcesAbortController = new AbortController();

      try {
        const response = await axios.get(`/${category}/results/filter`, {
          params: {
            idioma: language,
            aleatorio: 'si',
            limite: 3,
          },
          signal: this.fetchRelatedResourcesAbortController.signal,
        });
        this.relatedResources = response.data;
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          console.error(`Error fetching related resources for category ${category}:`, error);
        }
      } finally {
        this.fetchRelatedResourcesAbortController = null; // Reset controller after request completes
      }
    },

    // Pagination actions
    setCurrentPage(page: number) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
  },
});
