import { defineStore } from 'pinia';
import axios from 'axios';
import config from '../config';

// Configurar la base URL de Axios
axios.defaults.baseURL = config.apiBaseUrl;

export const useCollectionsStore = defineStore('collections', {
  state: () => ({
    accommodations: [],
    caves: [],
    culturals: [],
    events: [],
    fairs: [],
    museums: [],
    naturals: [],
    restaurants: [],
    accommodationCategories: [],
    caveCategories: [],
    culturalCategories: [],
    eventCategories: [],
    museumCategories: [],
    naturalCategories: [],
    restaurantCategories: [],

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

    // Estado de carga
    loading: false,
  }),
  getters: {
    getFilteredResults: (state) => state.filteredResults,
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

    // Métodos para obtener elementos aleatorios
    async loadRandomCollections() {
      this.loading = true;
      try {
        await this.getAccommodationsFiltering({ idioma: 'es', aleatorio: 'si', limite: '5' });
        this.randomAccommodations = this.accommodations;

        await this.getCavesFiltering({ idioma: 'es', aleatorio: 'si', limite: '5' });
        this.randomCaves = this.caves;

        await this.getCulturalsFiltering({ idioma: 'es', aleatorio: 'si', limite: '5' });
        this.randomCulturals = this.culturals;

        await this.getEventsFiltering({ idioma: 'es', aleatorio: 'si', limite: '5' });
        this.randomEvents = this.events;

        await this.getFairsFiltering({ idioma: 'es', aleatorio: 'si', limite: '5' });
        this.randomFairs = this.fairs;

        await this.getMuseumsFiltering({ idioma: 'es', aleatorio: 'si', limite: '5' });
        this.randomMuseums = this.museums;

        await this.getNaturalsFiltering({ idioma: 'es', aleatorio: 'si', limite: '5' });
        this.randomNaturals = this.naturals;

        await this.getRestaurantsFiltering({ idioma: 'es', aleatorio: 'si', limite: '5' });
        this.randomRestaurants = this.restaurants;
      } finally {
        this.loading = false;
      }
    },

    // Método para obtener resultados filtrados según la categoría seleccionada
    async filterResultsByCategory(category, language) {
      this.loading = true;
      try {
        switch (category.toLowerCase()) {
          case 'alojamientos':
            await this.getAccommodationsFiltering({ idioma: language });
            this.filteredResults = this.accommodations;
            break;
          case 'cuevas y restos arqueológicos':
            await this.getCavesFiltering({ idioma: language });
            this.filteredResults = this.caves;
            break;
          case 'edificios religiosos y castillos':
            await this.getCulturalsFiltering({ idioma: language });
            this.filteredResults = this.culturals;
            break;
          case 'eventos':
            await this.getEventsFiltering({ idioma: language });
            this.filteredResults = this.events;
            break;
          case 'parques temáticos':
            await this.getFairsFiltering({ idioma: language });
            this.filteredResults = this.fairs;
            break;
          case 'museos y centros de interpretación':
            await this.getMuseumsFiltering({ idioma: language });
            this.filteredResults = this.museums;
            break;
          case 'espacios naturales':
            await this.getNaturalsFiltering({ idioma: language });
            this.filteredResults = this.naturals;
            break;
          case 'restaurantes':
            await this.getRestaurantsFiltering({ idioma: language });
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
  },
});
