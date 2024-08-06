<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useCollectionsStore } from '@/stores/collections';

// Get the Mapbox access token from the environment
const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

// Initialize the map container reference
const mapContainer = ref(null);

// Access the collections store
const collectionsStore = useCollectionsStore();

// Define the default center of the map to be the Basque Country
const defaultCenter = [-2.6189, 43.25]; // Coordinates for the Basque Country

// Set up options for the map
const mapOptions = {
  style: 'mapbox://styles/mapbox/streets-v11',
  center: defaultCenter,
  zoom: 8,
};

// Map categories to their corresponding marker images
const categoryMarkerMap = {
  'alojamientos': '/images/map/accommodations-marker.svg',
  'cuevas y restos arqueológicos': '/images/map/caves-marker.svg',
  'edificios religiosos y castillos': '/images/map/culturals-marker.svg',
  'eventos': '/images/map/events-marker.svg',
  'parques temáticos': '/images/map/fairs-marker.svg',
  'museos y centros de interpretación': '/images/map/museums-marker.svg',
  'espacios naturales': '/images/map/naturals-marker.svg',
  'restaurantes': '/images/map/restaurants-marker.svg',
};

// Compute the results used for both cards and markers
const mapResults = computed(() => {
  if (collectionsStore.searchQuery.length >= 3) {
    return collectionsStore.searchResults;
  }
  if (collectionsStore.selectedCategory) {
    return collectionsStore.filteredResults;
  }
  return [];
});

// Array to keep track of marker references
let markers = [];

// Function to add markers and popups to the map
const addMarkersToMap = (map, markersData, markerImageUrl) => {
  // Clear existing markers
  markers.forEach(marker => marker.remove());
  markers = [];

  const bounds = new mapboxgl.LngLatBounds();

  markersData.forEach((markerData) => {
    // Check for valid coordinates
    if (!markerData.longitud || !markerData.latitud) {
      console.warn('Invalid marker data:', markerData);
      return; // Skip invalid marker
    }

    // Create a popup with card details and a link to the detail page
    const popupContent = `
      <div style="min-width: 150px;">
        <h3>${markerData.nombre}</h3>
        <p>${markerData.municipio}</p>
        <a href="/detail/${markerData.codigo}" target="_blank">View Details</a>
      </div>
    `;

    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);

    // Create a custom HTML element for the marker
    const el = document.createElement('div');
    el.className = 'custom-marker';
    el.style.backgroundImage = `url(${markerImageUrl})`;
    el.style.width = '40px';
    el.style.height = '40px';
    el.style.backgroundSize = 'cover';

    // Create a new marker using the custom element
    const newMarker = new mapboxgl.Marker(el)
      .setLngLat([markerData.longitud, markerData.latitud])
      .setPopup(popup)
      .addTo(map);

    // Extend map bounds to include this marker
    bounds.extend(newMarker.getLngLat());

    // Store marker reference for later removal
    markers.push(newMarker);
  });

  // Fit the map to the bounds of the markers only if there are valid markers
  if (!bounds.isEmpty()) {
    map.fitBounds(bounds, {
      padding: { top: 50, bottom: 50, left: 50, right: 50 },
      maxZoom: 12,
    });
  } else {
    console.warn('No valid markers to fit bounds.');
  }
};

onMounted(() => {
  mapboxgl.accessToken = accessToken;

  // Initialize the map
  const map = new mapboxgl.Map({
    container: mapContainer.value,
    ...mapOptions,
  });

  // Watch for changes in the computed map results and update markers accordingly
  watch(
    [mapResults, () => collectionsStore.selectedCategory],
    ([newResults, selectedCategory]) => {
      // Get the corresponding marker image URL for the selected category
      const markerImageUrl = categoryMarkerMap[selectedCategory.toLowerCase()] || '/images/map/default-marker.svg';

      // Ensure the map is fully loaded before adding markers
      if (map.isStyleLoaded()) {
        addMarkersToMap(map, newResults, markerImageUrl);
      } else {
        map.on('load', () => {
          addMarkersToMap(map, newResults, markerImageUrl);
        });
      }
    },
    { immediate: true }
  );
});
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 500px;
  border-radius: 8px;
  overflow: hidden;
}

.custom-marker {
  background-size: cover;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
}
</style>
