// src/store/map.ts

import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

export const useMapStore = defineStore('map', {
  state: () => ({
    mapCenter: useLocalStorage('mapCenter', { lat: 43.0000, lng: -2.6197 }), // Default to Basque Country coordinates
    mapZoom: useLocalStorage('mapZoom', 5), // Store map zoom level
    mapMode: useLocalStorage('mapMode', 'light'), // Store map mode (light or dark)
    mapPopup: useLocalStorage('mapPopup', null), // Store map popup state
    didCategoryChange: false, // Track if the category changed
    shouldRefitBounds: false, // Track if the map should refit bounds after filter changes
  }),

  actions: {
    setMapPopup(popup) {
      // this.mapPopup = popup;
      this.mapPopup = popup ? JSON.stringify(popup) : null;
    },

    setMapCenter(center: { lat: number; lng: number }) {
      this.mapCenter = center;
    },

    setMapZoom(zoom: number) {
      this.mapZoom = zoom;
    },

    setMapMode(mode: 'light' | 'dark') {
      this.mapMode = mode;
    },
  },
});
