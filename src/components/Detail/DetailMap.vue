<template>
  <div v-if="resource.latitud && resource.longitud" class="detail-map">
    <div ref="mapContainer" class="map-container"></div>
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

    map.addControl(new mapboxgl.NavigationControl(), 'top-left');
    map.addControl(new mapboxgl.FullscreenControl(), 'top-left');
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      'top-left'
    );

    const markerImageUrl = getMarkerImageUrl(props.resource.coleccion?.toLowerCase());

    const markerElement = document.createElement('div');
    markerElement.className = 'marker';
    markerElement.style.backgroundImage = `url(${markerImageUrl})`;
    markerElement.style.width = '30px';
    markerElement.style.height = '30px';
    markerElement.style.backgroundSize = '100%';

    new mapboxgl.Marker({ element: markerElement })
      .setLngLat([parseFloat(props.resource.longitud), parseFloat(props.resource.latitud)])
      .addTo(map);
  }
};

const getMarkerImageUrl = (collection: string) => {
  const categoryMarkerMap = {
    alojamientos: '/images/map/accommodations-marker.png',
    'cuevas y restos arqueológicos': '/images/map/caves-marker.png',
    'edificios religiosos y castillos': '/images/map/culturals-marker.png',
    eventos: '/images/map/events-marker.png',
    'parques temáticos': '/images/map/fairs-marker.png',
    'museos y centros de interpretación': '/images/map/museums-marker.png',
    'espacios naturales': '/images/map/naturals-marker.png',
    restaurantes: '/images/map/restaurants-marker.png',
    default: '/images/map/default-marker.png',
  };

  return categoryMarkerMap[collection] || categoryMarkerMap.default;
};

onMounted(() => {
  initializeMap();
});

onUnmounted(() => {
  if (map) {
    map.remove();
  }
});
</script>

<style scoped>
.detail-map {
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 600px; /* Consistent width with carousel and images */
  margin: 2rem auto 1rem; /* Center map horizontally with top margin for spacing */
  position: relative;
}

.map-container {
  width: 100%;
  height: 300px; /* Consistent height with carousel and images */
  border-radius: 8px;
  overflow: hidden;
}
</style>
