import { defineStore } from 'pinia';
import { useLocalStorage, useSessionStorage } from '@vueuse/core';

export const useMapStore = defineStore('map', {
  state: () => ({
    mapCenter: useSessionStorage('mapCenter', { lat: 43.0000, lng: -2.6197 }), // Default to Basque Country coordinates
    mapZoom: useSessionStorage('mapZoom', 10), // Store map zoom level
    mapMode: useLocalStorage('mapMode', 'light'), // Store map mode (light or dark)
    mapPopup: useSessionStorage('mapPopup', null), // Store map popup state
    didCategoryChange: false, // Track if the category changed
    shouldRefitBounds: false, // Track if the map should refit bounds after filter changes
    returningFromDetail: false, // Track if the user is returning from the DetailView
  }),

  actions: {
    setMapPopup(popup) {
      this.mapPopup = popup ? JSON.stringify(popup) : null;
    },

    setMapCenter(center) {
      this.mapCenter = center;
    },

    setMapZoom(zoom) {
      this.mapZoom = zoom;
    },

    setMapMode(mode) {
      this.mapMode = mode;
    },

    setDidCategoryChange(status) {
      this.didCategoryChange = status;
    },

    setShouldRefitBounds(status) {
      this.shouldRefitBounds = status;
    },

    setReturningFromDetail(status) {
      this.returningFromDetail = status;
    },

    resetReturningFromDetail() {
      this.returningFromDetail = false;
    },

    resetAllFlags() {
      this.didCategoryChange = false;
      this.shouldRefitBounds = false;
      this.returningFromDetail = false;
    },
  },
});
