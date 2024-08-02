// src/stores/filter.ts
import { defineStore } from 'pinia';
import axios from 'axios';

export const useFilterStore = defineStore('region', {
    state: () => ({
        provinces: ['Araba/Álava', 'Gipuzkoa', 'Bizkaia'],
        localities: [],
        filteredLocalities: [],
        selectedProvince: null, // Añadido para gestionar la provincia seleccionada
        selectedLocality: null, // Añadido para gestionar la localidad seleccionada
        startDate: null, // Añadido para gestionar la fecha de inicio seleccionada
        endDate: null, // Añadido para gestionar la fecha de fin seleccionada
    }),
    actions: {
        async fetchLocalities() {
            try {
                const response = await axios.get('http://localhost:8000/api/locality/names?idioma=es');
                this.localities = response.data;
                this.filteredLocalities = response.data; // Inicialmente, todas las localidades están disponibles
            } catch (error) {
                console.error('Error fetching localities:', error);
            }
        },
        filterLocalitiesByProvince(province) {
            this.selectedProvince = province; // Actualiza la provincia seleccionada
            if (province) {
                this.filteredLocalities = this.localities.filter(locality => locality.nombre_provincia === province);
                // Al cambiar de provincia, resetea la localidad seleccionada
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
    },
});
