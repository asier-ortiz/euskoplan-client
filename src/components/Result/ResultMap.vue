<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed, onUnmounted } from 'vue';
import mapboxgl, { Map, LngLatBounds } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useCollectionsStore } from '@/stores/collections';

// Get the Mapbox access token from the environment
const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

// Initialize the map container reference
const mapContainer = ref<HTMLElement | null>(null);

// Access the collections store
const collectionsStore = useCollectionsStore();

// Define the default center of the map to be the Basque Country
const defaultCenter: [number, number] = [-2.6189, 43.25]; // Coordinates for the Basque Country

// Set up options for the map
const mapOptions = {
  style: 'mapbox://styles/mapbox/streets-v11',
  center: defaultCenter,
  zoom: 7,
};

// Map categories to their corresponding marker images
const categoryMarkerMap = {
  alojamientos: '/images/map/accommodations-marker-large.png',
  'cuevas y restos arqueológicos': '/images/map/caves-marker-large.png',
  'edificios religiosos y castillos': '/images/map/culturals-marker-large.png',
  eventos: '/images/map/events-marker-large.png',
  'parques temáticos': '/images/map/fairs-marker-large.png',
  'museos y centros de interpretación': '/images/map/museums-marker-large.png',
  'espacios naturales': '/images/map/naturals-marker-large.png',
  restaurantes: '/images/map/restaurants-marker-large.png',
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

let map: Map;

// Function to initialize the map
const initializeMap = (markersData: any[], markerImageUrl: string) => {
  // Convert markersData to GeoJSON format
  const geojson = {
    type: 'FeatureCollection',
    features: markersData.map((markerData) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [markerData.longitud, markerData.latitud],
      },
      properties: {
        title: markerData.nombre,
        municipality: markerData.municipio,
        code: markerData.codigo,
        images: markerData.imagenes ? JSON.stringify(markerData.imagenes) : '[]',
      },
    })),
  };

  // Remove existing layers and sources
  if (map.getLayer('clusters')) map.removeLayer('clusters');
  if (map.getLayer('cluster-count')) map.removeLayer('cluster-count');
  if (map.getLayer('unclustered-points')) map.removeLayer('unclustered-points');
  if (map.getSource('resources')) map.removeSource('resources');

  // Add a source for the markers
  map.addSource('resources', {
    type: 'geojson',
    data: geojson,
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50,  // Radius of each cluster when clustering points
  });

  // Add a layer for the clusters
  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'resources',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': '#51bbd6',
      'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
      'circle-opacity': 0.6,
    },
  });

  // Add a layer for the cluster count labels
  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'resources',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12,
    },
  });

  // Add a layer for individual (unclustered) points
  map.loadImage(markerImageUrl, (error, image) => {
    if (error) throw error;

    // Check if the image is already added
    if (!map.hasImage('custom-marker')) {
      map.addImage('custom-marker', image);
    }

    map.addLayer({
      id: 'unclustered-points',
      type: 'symbol',
      source: 'resources',
      filter: ['!', ['has', 'point_count']],
      layout: {
        'icon-image': 'custom-marker',
        'icon-size': 0.8, // Adjust icon size here
        'icon-allow-overlap': true,
      },
      minzoom: 14, // Set the minimum zoom level for displaying individual markers
    });
  });

  // Fit the map to the bounds of the markers only if there are valid markers
  const bounds = new LngLatBounds();
  markersData.forEach((markerData) => {
    bounds.extend([markerData.longitud, markerData.latitud]);
  });
  if (!bounds.isEmpty()) {
    map.fitBounds(bounds, {
      padding: { top: 50, bottom: 50, left: 50, right: 50 },
      maxZoom: 12,
    });
  } else {
    console.warn('No valid markers to fit bounds.');
  }
};

// Function to handle map click events
const handleMapClick = (e) => {
  const features = map.queryRenderedFeatures(e.point, { layers: ['unclustered-points'] });
  if (!features.length) {
    return;
  }

  const feature = features[0];

  // Remove existing popup if any
  const popup = new mapboxgl.Popup({ offset: 25 })
    .setLngLat(feature.geometry.coordinates)
    .setHTML(getPopupHTML(feature))
    .addTo(map);
};

// Function to handle cluster click events
const handleClusterClick = (e) => {
  const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
  if (!features.length) return;

  const clusterId = features[0].properties.cluster_id;
  const source = map.getSource('resources');

  source.getClusterExpansionZoom(clusterId, (err, zoom) => {
    if (err) return;
    map.easeTo({
      center: features[0].geometry.coordinates,
      zoom,
    });
  });
};

// Function to get the HTML content for a popup
const getPopupHTML = (feature) => {
  const collectionName = feature.properties.coleccion;
  const resourceCode = feature.properties.code;

  const imgSource = JSON.parse(feature.properties.images)[0]?.fuente || `/images/generic-${collectionName}.jpg`;
  const imgAlt = JSON.parse(feature.properties.images)[0]?.titulo || '';

  return `
    <div class="card map-card shadow-lg">
      <img class="card-img-top map-card-img-top text-light text-center" src='${imgSource}' alt='${imgAlt}'>
      <div class="card-body map-card-body">
        <h6 class="card-title map-card-title">${feature.properties.title}</h6>
        <p class="card-text text-secondary lh-sm my-1">${feature.properties.nombre_subtipo_recurso || ''}</p>
        <p class="card-text text-primary mb-0">${feature.properties.municipality || ''}</p>
        <a role="button" href="${'/resource/' + collectionName + '/' + resourceCode}" class="btn btn-sm btn-primary mt-1 w-100">View Details</a>
      </div>
    </div>
  `;
};

onMounted(() => {
  mapboxgl.accessToken = accessToken;

  // Initialize the map
  map = new mapboxgl.Map({
    container: mapContainer.value!,
    ...mapOptions,
  });

  // Add controls to the map
  map.addControl(new mapboxgl.NavigationControl());
  map.addControl(new mapboxgl.FullscreenControl());

  // Add geolocate control
  const locateControl = new mapboxgl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    showUserHeading: true,
    showAccuracyCircle: true,
  });
  map.addControl(locateControl);

  // Watch for changes in the computed map results and update clusters accordingly
  watch(
    [mapResults, () => collectionsStore.selectedCategory],
    ([newResults, selectedCategory]) => {
      // Get the corresponding marker image URL for the selected category
      const markerImageUrl = categoryMarkerMap[selectedCategory.toLowerCase()] || '/images/map/default-marker.png';

      // Ensure the map is fully loaded before adding clusters and markers
      if (map.isStyleLoaded()) {
        initializeMap(newResults, markerImageUrl);
      }
    },
    { immediate: true }
  );

  // Add event listeners
  map.on('click', handleMapClick);
  map.on('click', 'clusters', handleClusterClick);
});

onUnmounted(() => {
  // Clean up map and event listeners when component is destroyed
  if (map) {
    map.remove();
  }
});
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 500px;
  border-radius: 8px;
  overflow: hidden;
}

.custom-html-marker {
  background-size: cover;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
}
</style>
