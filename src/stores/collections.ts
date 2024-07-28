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
    localities: [],
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

  }),
  actions: {
    // Accommodation methods
    async getAccommodationsFiltering(query: Record<string, string>) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/accommodation/results/filter', { params });
        this.accommodations = response.data;
      } catch (error) {
        console.error('Error fetching accommodations:', error);
      }
    },
    async getAccommodationsSearching(query: Record<string, string>) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/accommodation/results/search', { params });
        this.accommodations = response.data;
      } catch (error) {
        console.error('Error searching accommodations:', error);
      }
    },
    async getAccommodation(code: number, language: string) {
      try {
        const response = await axios.get(`/accommodation/result/${code}/${language}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching accommodation:', error);
      }
    },
    async getAccommodationCategories(language: string) {
      try {
        const response = await axios.get(`/accommodation/categories/${language}`);
        this.accommodationCategories = response.data;
      } catch (error) {
        console.error('Error fetching accommodation categories:', error);
      }
    },

    // Cave methods
    async getCavesFiltering(query: Record<string, string>) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/cave/results/filter', { params });
        this.caves = response.data;
      } catch (error) {
        console.error('Error fetching caves:', error);
      }
    },
    async getCavesSearching(query: Record<string, string>) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/cave/results/search', { params });
        this.caves = response.data;
      } catch (error) {
        console.error('Error searching caves:', error);
      }
    },
    async getCave(code: number, language: string) {
      try {
        const response = await axios.get(`/cave/result/${code}/${language}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching cave:', error);
      }
    },
    async getCaveCategories(language: string) {
      try {
        const response = await axios.get(`/cave/categories/${language}`);
        this.caveCategories = response.data;
      } catch (error) {
        console.error('Error fetching cave categories:', error);
      }
    },

    // Cultural methods
    async getCulturalsFiltering(query: Record<string, string>) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/cultural/results/filter', { params });
        this.culturals = response.data;
      } catch (error) {
        console.error('Error fetching culturals:', error);
      }
    },
    async getCulturalsSearching(query: Record<string, string>) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/cultural/results/search', { params });
        this.culturals = response.data;
      } catch (error) {
        console.error('Error searching culturals:', error);
      }
    },
    async getCultural(code: number, language: string) {
      try {
        const response = await axios.get(`/cultural/result/${code}/${language}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching cultural:', error);
      }
    },
    async getCulturalCategories(language: string) {
      try {
        const response = await axios.get(`/cultural/categories/${language}`);
        this.culturalCategories = response.data;
      } catch (error) {
        console.error('Error fetching cultural categories:', error);
      }
    },

    // Event methods
    async getEventsFiltering(query: Record<string, string>) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/event/results/filter', { params });
        this.events = response.data;
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    },
    async getEventsSearching(query: Record<string, string>) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/event/results/search', { params });
        this.events = response.data;
      } catch (error) {
        console.error('Error searching events:', error);
      }
    },
    async getEvent(code: number, language: string) {
      try {
        const response = await axios.get(`/event/result/${code}/${language}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    },
    async getEventCategories(language: string) {
      try {
        const response = await axios.get(`/event/categories/${language}`);
        this.eventCategories = response.data;
      } catch (error) {
        console.error('Error fetching event categories:', error);
      }
    },

    // Fair methods
    async getFairsFiltering(query: Record<string, string>) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/fair/results/filter', { params });
        this.fairs = response.data;
      } catch (error) {
        console.error('Error fetching fairs:', error);
      }
    },
    async getFairsSearching(query: Record<string, string>) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/fair/results/search', { params });
        this.fairs = response.data;
      } catch (error) {
        console.error('Error searching fairs:', error);
      }
    },
    async getFair(code: number, language: string) {
      try {
        const response = await axios.get(`/fair/result/${code}/${language}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching fair:', error);
      }
    },

    // Locality methods
    async getLocalitiesFiltering(query: Record<string, string>) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/locality/results/filter', { params });
        this.localities = response.data;
      } catch (error) {
        console.error('Error fetching localities:', error);
      }
    },
    async getLocalitiesSearching(query: Record<string, string>) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/locality/results/search', { params });
        this.localities = response.data;
      } catch (error) {
        console.error('Error searching localities:', error);
      }
    },
    async getLocality(code: number, language: string) {
      try {
        const response = await axios.get(`/locality/${code}/${language}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching locality:', error);
      }
    },
    async getLocalityNames(query: Record<string, string>) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/locality/names', { params });
        return response.data;
      } catch (error) {
        console.error('Error fetching locality names:', error);
      }
    },

    // Museum methods
    async getMuseumsFiltering(query: Record<string, string>) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/museum/results/filter', { params });
        this.museums = response.data;
      } catch (error) {
        console.error('Error fetching museums:', error);
      }
    },
    async getMuseumsSearching(query: Record<string, string>) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/museum/results/search', { params });
        this.museums = response.data;
      } catch (error) {
        console.error('Error searching museums:', error);
      }
    },
    async getMuseum(code: number, language: string) {
      try {
        const response = await axios.get(`/museum/result/${code}/${language}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching museum:', error);
      }
    },
    async getMuseumCategories(language: string) {
      try {
        const response = await axios.get(`/museum/categories/${language}`);
        this.museumCategories = response.data;
      } catch (error) {
        console.error('Error fetching museum categories:', error);
      }
    },

    // Natural methods
    async getNaturalsFiltering(query: Record<string, string>) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/natural/results/filter', { params });
        this.naturals = response.data;
      } catch (error) {
        console.error('Error fetching naturals:', error);
      }
    },
    async getNaturalsSearching(query: Record<string, string>) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/natural/results/search', { params });
        this.naturals = response.data;
      } catch (error) {
        console.error('Error searching naturals:', error);
      }
    },
    async getNatural(code: number, language: string) {
      try {
        const response = await axios.get(`/natural/result/${code}/${language}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching natural:', error);
      }
    },
    async getNaturalCategories(language: string) {
      try {
        const response = await axios.get(`/natural/categories/${language}`);
        this.naturalCategories = response.data;
      } catch (error) {
        console.error('Error fetching natural categories:', error);
      }
    },

    // Restaurant methods
    async getRestaurantsFiltering(query: Record<string, string>) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/restaurant/results/filter', { params });
        this.restaurants = response.data;
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    },
    async getRestaurantsSearching(query: Record<string, string>) {
      const params = new URLSearchParams(query);
      try {
        const response = await axios.get('/restaurant/results/search', { params });
        this.restaurants = response.data;
      } catch (error) {
        console.error('Error searching restaurants:', error);
      }
    },
    async getRestaurant(code: number, language: string) {
      try {
        const response = await axios.get(`/restaurant/result/${code}/${language}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching restaurant:', error);
      }
    },
    async getRestaurantCategories(language: string) {
      try {
        const response = await axios.get(`/restaurant/categories/${language}`);
        this.restaurantCategories = response.data;
      } catch (error) {
        console.error('Error fetching restaurant categories:', error);
      }
    },

    // Métodos para obtener elementos aleatorios
    async loadRandomCollections() {
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
    }


  },
});
