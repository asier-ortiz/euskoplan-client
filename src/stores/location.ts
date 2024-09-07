// src/stores/location.ts
import { defineStore } from 'pinia';

export const useLocationStore = defineStore('location', {
    state: () => ({
        userLocation: null,
        locationPermissionDenied: false, // Track if the location permission was denied
    }),
    actions: {
        async fetchUserLocation() {
            return new Promise((resolve, reject) => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                          this.userLocation = {
                              latitude: position.coords.latitude,
                              longitude: position.coords.longitude,
                          };
                          this.locationPermissionDenied = false; // Reset if permission is granted
                          resolve(this.userLocation);
                      },
                      (error) => {
                          if (error.code === error.PERMISSION_DENIED) {
                              this.locationPermissionDenied = true; // Set the flag if permission is denied
                          }
                          console.error('Error getting user location:', error);
                          reject(error);
                      }
                    );
                } else {
                    const error = new Error('Geolocation is not supported by this browser.');
                    console.error(error);
                    reject(error);
                }
            });
        },
    },
});
