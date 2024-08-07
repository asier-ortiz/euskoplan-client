<template>
  <div v-if="resource.latitud && resource.longitud" class="detail-map">
    <!-- Add the heading for the map -->
    <h3 class="map-heading">Ubicación</h3>
    <div ref="mapContainer" class="map-container">
      <div v-show="showZoomMessage" class="zoom-message">
        Mantén presionada la tecla Ctrl (Cmd en Mac) para hacer zoom
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineProps } from 'vue';
import mapboxgl from 'mapbox-gl';

const props = defineProps<{
  resource: any;
  isDarkMode: string;
}>();

const mapContainer = ref<HTMLDivElement | null>(null);
let map: mapboxgl.Map | undefined;

// State for displaying the zoom message
const showZoomMessage = ref(false);
let zoomMessageTimeout: number | null = null;

const initializeMap = () => {
  if (mapContainer.value) {
    map = new mapboxgl.Map({
      container: mapContainer.value,
      style: props.isDarkMode === 'dark'
        ? 'mapbox://styles/mapbox/dark-v10'
        : 'mapbox://styles/mapbox/streets-v11',
      center: [parseFloat(props.resource.longitud), parseFloat(props.resource.latitud)],
      zoom: 14,
    });

    // Place controls on the top-right corner
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

    const markerImageUrl = getMarkerImageUrl(props.resource.coleccion?.toLowerCase());

    const markerElement = document.createElement('div');
    markerElement.className = 'marker';
    markerElement.style.backgroundImage = `url(${markerImageUrl})`;
    markerElement.style.width = '30px';
    markerElement.style.height = '30px';
    markerElement.style.backgroundSize = '100%';

    const popup = new mapboxgl.Popup({
      offset: 25,
      closeButton: false,
      closeOnClick: false
    }).setText(props.resource.nombre);

    const marker = new mapboxgl.Marker({ element: markerElement })
      .setLngLat([parseFloat(props.resource.longitud), parseFloat(props.resource.latitud)])
      .setPopup(popup) // Add popup to the marker
      .addTo(map);

    // Show the popup on mouse enter and hide on mouse leave
    markerElement.addEventListener('mouseenter', () => popup.addTo(map));
    markerElement.addEventListener('mouseleave', () => popup.remove());

    // Disable scroll zoom initially
    map.scrollZoom.disable();

    // Listen for wheel events to control zoom with the Ctrl key
    mapContainer.value?.addEventListener('wheel', handleWheelZoom);
  }
};

// Handle wheel zoom with Ctrl/Cmd key
const handleWheelZoom = (event: WheelEvent) => {
  if (event.ctrlKey || event.metaKey) {
    map?.scrollZoom.enable();
    event.preventDefault(); // Prevent page scroll
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

const getMarkerImageUrl = (collection: string) => {
  const categoryMarkerMap = {
    'accommodation': '/images/map/accommodations-marker.png',
    'cave': '/images/map/caves-marker.png',
    'cultural': '/images/map/culturals-marker.png',
    'event': '/images/map/events-marker.png',
    'fair': '/images/map/fairs-marker.png',
    'museum': '/images/map/museums-marker.png',
    'natural': '/images/map/naturals-marker.png',
    'restaurant': '/images/map/restaurants-marker.png'
  };

  return categoryMarkerMap[collection] || '/images/map/default-marker.png';
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
</script>

<style scoped>
.detail-map {
  display: flex;
  flex-direction: column; /* Ensures the heading and map are in a column layout */
  justify-content: center;
  width: 100%;
  max-width: 600px; /* Consistent width with carousel and images */
  /* Center map horizontally with top margin for spacing */
  margin: 2rem auto 1rem;
  position: relative;
}

.map-heading {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
  text-align: center; /* Center align the heading */
}

.map-container {
  width: 100%;
  height: 300px; /* Consistent height with carousel and images */
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.marker {
  cursor: pointer; /* Indicate the marker is interactive */
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
</style>
