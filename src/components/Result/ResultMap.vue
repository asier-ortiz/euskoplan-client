<!-- src/components/Result/ResultMap.vue -->
<template>
  <MapboxMap
    :accessToken="accessToken"
    :options="mapOptions"
    class="map-container"
    @load="onMapLoad"
  >
    <!-- Map content goes here -->
  </MapboxMap>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import MapboxMap from 'vue3-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useCollectionsStore } from '@/stores/collections';
import mapboxgl from 'mapbox-gl';

// Access your collections store
const collectionsStore = useCollectionsStore();

// Get your Mapbox access token from the environment
const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

// Set up Mapbox map options
const mapOptions = {
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-74.5, 40], // Default center, update as needed
  zoom: 9,
};

// Markers based on search results
const markers = computed(() => {
  return collectionsStore.searchResults.map((item) => ({
    lng: item.location.lng, // Ensure items have lat/lng properties
    lat: item.location.lat,
    name: item.nombre, // Assuming 'nombre' is a property with the name
  }));
});

// Mapbox marker setup function
const onMapLoad = (map) => {
  // Add markers to the map
  markers.value.forEach((marker) => {
    const popup = new mapboxgl.Popup().setText(marker.name);

    // Create a new marker
    new mapboxgl.Marker()
      .setLngLat([marker.lng, marker.lat])
      .setPopup(popup) // Optional: add popup to marker
      .addTo(map);
  });
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 500px;
  border-radius: 8px;
  overflow: hidden;
}
</style>
