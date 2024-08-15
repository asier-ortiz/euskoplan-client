<template>
  <div v-if="resource.latitud && resource.longitud" class="detail-map">
    <!-- Add the heading for the map -->
    <h3 class="map-heading">Ubicación</h3>
    <div ref="mapContainer" class="map-container">
      <!-- Add the toggle style button -->
      <button class="toggle-style-button" @click="toggleMapStyle" title="Toggle Dark/Light Mode">
        <FontAwesomeIcon :icon="[mapStore.mapMode === 'dark' ? 'fas' : 'fas', mapStore.mapMode === 'dark' ? 'sun' : 'moon']" />
      </button>
      <div v-show="showZoomMessage" class="zoom-message">
        Mantén presionada la tecla Ctrl (Cmd en Mac) para hacer zoom
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import mapboxgl from 'mapbox-gl';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useMapStore } from '@/stores/map';
import { getMarkerImageUrl } from '@/utils/map';

// Set the Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const props = defineProps<{
  resource: any;
}>();

const mapStore = useMapStore();

const mapContainer = ref<HTMLDivElement | null>(null);
let map: mapboxgl.Map | undefined;

// State for displaying the zoom message
const showZoomMessage = ref(false);
let zoomMessageTimeout: number | null = null;

// Computed property to determine the text color based on map mode
const textColor = computed(() => {
  return mapStore.mapMode === 'dark' ? '#ffffff' : '#000000';
});

const initializeMap = () => {
  if (mapContainer.value) {
    map = new mapboxgl.Map({
      container: mapContainer.value,
      style: mapStore.mapMode === 'dark'
          ? 'mapbox://styles/mapbox/dark-v10'
          : 'mapbox://styles/mapbox/streets-v11',
      center: [parseFloat(props.resource.longitud), parseFloat(props.resource.latitud)],
      zoom: 14,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');
    map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
          showUserHeading: true,
        }),
        'top-right'
    );

    const markerImageUrl = getMarkerImageUrl(props.resource.coleccion?.toLowerCase() || '');

    const markerElement = document.createElement('div');
    markerElement.className = 'marker';
    markerElement.style.backgroundImage = `url(${markerImageUrl})`;
    markerElement.style.width = '40px'; // Adjust size to match ResultMap.vue
    markerElement.style.height = '40px';
    markerElement.style.backgroundSize = 'contain';

    // Create and style the marker text to match ResultMap.vue
    const markerText = document.createElement('div');
    markerText.className = 'marker-text';
    markerText.textContent = props.resource.nombre;
    markerText.style.color = textColor.value; // Set the text color based on map mode
    markerText.style.fontSize = '14px'; // Match font size with ResultMap.vue
    markerText.style.fontFamily = 'Open Sans Regular, Arial Unicode MS Regular'; // Match font family
    markerText.style.textAlign = 'center';
    markerText.style.width = 'max-content';
    markerText.style.transform = 'translateX(-50%)';
    markerText.style.position = 'absolute';
    markerText.style.top = '45px'; // Adjust the position below the marker
    markerText.style.left = '50%';
    markerText.style.textShadow = mapStore.mapMode === 'dark' ? '0 0 3px #000' : '0 0 3px #fff'; // Add text halo effect

    markerElement.appendChild(markerText);

    new mapboxgl.Marker({ element: markerElement })
        .setLngLat([parseFloat(props.resource.longitud), parseFloat(props.resource.latitud)])
        .addTo(map);

    map.scrollZoom.disable();

    mapContainer.value?.addEventListener('wheel', handleWheelZoom);
  }
};

const handleWheelZoom = (event: WheelEvent) => {
  if (event.ctrlKey || event.metaKey) {
    map?.scrollZoom.enable();
    event.preventDefault();
  } else {
    map?.scrollZoom.disable();
    showZoomMessage.value = true;
    if (zoomMessageTimeout) {
      clearTimeout(zoomMessageTimeout);
    }
    zoomMessageTimeout = setTimeout(() => {
      showZoomMessage.value = false;
    }, 2000);
  }
};

const toggleMapStyle = () => {
  mapStore.setMapMode(mapStore.mapMode === 'dark' ? 'light' : 'dark');

  if (map) {
    const currentCenter = map.getCenter();
    const currentZoom = map.getZoom();
    map.setStyle(
        mapStore.mapMode === 'dark'
            ? 'mapbox://styles/mapbox/dark-v10'
            : 'mapbox://styles/mapbox/streets-v11'
    );

    map.once('style.load', () => {
      map.setCenter(currentCenter);
      map.setZoom(currentZoom);
      // Update the text color based on the new map style
      updateMarkerTextColor();
    });
  }
};

const updateMarkerTextColor = () => {
  const markerTextElements = document.querySelectorAll('.marker-text');
  markerTextElements.forEach((element) => {
    (element as HTMLElement).style.color = textColor.value;
    (element as HTMLElement).style.textShadow = mapStore.mapMode === 'dark' ? '0 0 3px #000' : '0 0 3px #fff'; // Update text halo effect
  });
};

onMounted(() => {
  initializeMap();
});

onUnmounted(() => {
  if (map) {
    map.remove();
    mapContainer.value?.removeEventListener('wheel', handleWheelZoom);
  }
});

// Watch for changes in the map mode and update text color accordingly
watch(
    () => mapStore.mapMode,
    () => {
      updateMarkerTextColor();
    }
);
</script>

<style scoped>
.detail-map {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  max-width: 600px;
  margin: 2rem auto 1rem;
  position: relative;
}

.map-heading {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
}

.map-container {
  width: 100%;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.marker {
  cursor: pointer;
  position: relative;
}

.marker-text {
  position: absolute;
  top: 45px; /* Position text below the marker */
  left: 50%;
  transform: translateX(-50%);
  color: inherit; /* Inherit color from the computed style */
  font-size: 14px; /* Match font size with ResultMap.vue */
  text-align: center;
  width: max-content;
  text-shadow: inherit; /* Inherit text shadow for halo effect */
}

.zoom-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 3;
  text-align: center;
  font-size: 1rem;
}

.toggle-style-button {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #fff;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 2;
}

.toggle-style-button:hover {
  background-color: #f0f0f0;
}
</style>
