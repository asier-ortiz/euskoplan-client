// src/stores/location.ts
import { defineStore } from 'pinia';

export const useLocationStore = defineStore('location', {
    state: () => ({
        userLocation: null,
    }),
    actions: {
        async fetchUserLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.userLocation = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        };
                    },
                    (error) => {
                        console.error('Error getting user location:', error);
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser.');
            }
        },
    },
});
