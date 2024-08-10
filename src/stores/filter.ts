// src/store/filter.ts
import { defineStore } from 'pinia';
import axios from 'axios';
import { useLocalStorage } from '@vueuse/core';

export const useFilterStore = defineStore('filter', {
    state: () => ({
        provinces: ['Araba/Álava', 'Gipuzkoa', 'Bizkaia'],
        localities: [],
        filteredLocalities: [],
        selectedProvince: useLocalStorage('selectedProvince', null),
        selectedLocality: useLocalStorage('selectedLocality', null),
        startDate: useLocalStorage('startDate', null),
        endDate: useLocalStorage('endDate', null),
        categories: {
            accommodation: [],
            cave: [],
            cultural: [],
            event: [],
            museum: [],
            natural: {
                espacio_natural: [],
                playas_pantanos_rios: [],
            },
            restaurant: [],
        },
        // Store each collection's category in local storage
        selectedCategories: useLocalStorage('selectedCategories', {
            accommodation: null,
            cave: null,
            cultural: null,
            event: null,
            museum: null,
            natural: {
                espacio_natural: null,
                playas_pantanos_rios: null,
            },
            restaurant: null,
        }),
    }),
    getters: {
        filterCount: (state) => {
            let count = 0;
            if (state.selectedProvince) count++;
            if (state.selectedLocality) count++;
            if (state.startDate) count++;
            if (state.endDate) count++;
            for (const category in state.selectedCategories) {
                if (category === 'natural') {
                    if (
                      state.selectedCategories.natural.espacio_natural ||
                      state.selectedCategories.natural.playas_pantanos_rios
                    ) {
                        count++;
                    }
                } else if (state.selectedCategories[category]) {
                    count++;
                }
            }
            return count;
        },
    },
    actions: {
        async fetchLocalities() {
            try {
                const response = await axios.get('http://localhost:8000/api/locality/names?idioma=es');
                this.localities = response.data;
                this.filteredLocalities = response.data;
            } catch (error) {
                console.error('Error fetching localities:', error);
            }
        },
        filterLocalitiesByProvince(province) {
            this.selectedProvince = province;
            if (province) {
                this.filteredLocalities = this.localities.filter(
                  (locality) => locality.nombre_provincia === province
                );
                this.selectedLocality = null;
            } else {
                this.filteredLocalities = this.localities;
            }
        },
        setSelectedLocality(locality) {
            this.selectedLocality = locality;
        },
        setStartDate(date) {
            this.startDate = date;
        },
        setEndDate(date) {
            this.endDate = date;
        },
        async fetchCategories() {
            try {
                const accommodationResponse = await axios.get(
                  'http://localhost:8000/api/accommodation/categories/es'
                );
                this.categories.accommodation = accommodationResponse.data.map(
                  (cat) => cat.nombre_subtipo_recurso
                );

                const caveResponse = await axios.get('http://localhost:8000/api/cave/categories/es');
                this.categories.cave = caveResponse.data.map((cat) => cat.nombre_subtipo_recurso);

                const culturalResponse = await axios.get(
                  'http://localhost:8000/api/cultural/categories/es'
                );
                this.categories.cultural = culturalResponse.data.map(
                  (cat) => cat.nombre_subtipo_recurso
                );

                const eventResponse = await axios.get('http://localhost:8000/api/event/categories/es');
                this.categories.event = eventResponse.data.map((cat) => cat.nombre_subtipo_recurso);

                const museumResponse = await axios.get(
                  'http://localhost:8000/api/museum/categories/es'
                );
                this.categories.museum = museumResponse.data.map((cat) => cat.nombre_subtipo_recurso);

                const naturalResponse = await axios.get(
                  'http://localhost:8000/api/natural/categories/es'
                );
                this.categories.natural.espacio_natural = naturalResponse.data.espacio_natural.map(
                  (cat) => cat.nombre_subtipo_recurso_espacio_natural
                );
                this.categories.natural.playas_pantanos_rios =
                  naturalResponse.data.playas_pantanos_rios.map(
                    (cat) => cat.nombre_subtipo_recurso_playas_pantanos_rios
                  );

                const restaurantResponse = await axios.get(
                  'http://localhost:8000/api/restaurant/categories/es'
                );
                this.categories.restaurant = restaurantResponse.data.map(
                  (cat) => cat.nombre_subtipo_recurso
                );
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        },
        setSelectedCategory(collection, category) {
            if (collection === 'natural') {
                if (this.categories.natural.espacio_natural.includes(category)) {
                    this.selectedCategories.natural.espacio_natural = category;
                    this.selectedCategories.natural.playas_pantanos_rios = null;
                } else if (this.categories.natural.playas_pantanos_rios.includes(category)) {
                    this.selectedCategories.natural.playas_pantanos_rios = category;
                    this.selectedCategories.natural.espacio_natural = null;
                }
            } else {
                this.selectedCategories[collection] = category;
            }
            console.log('Selected Categories:', this.selectedCategories); // Debugging log
        },
        clearFilters() {
            this.selectedProvince = null;
            this.selectedLocality = null;
            this.startDate = null;
            this.endDate = null;
            this.selectedCategories = {
                accommodation: null,
                cave: null,
                cultural: null,
                event: null,
                museum: null,
                natural: {
                    espacio_natural: null,
                    playas_pantanos_rios: null,
                },
                restaurant: null,
            };
            console.log('Filters cleared');
        },
    },
});
