<template>
  <div v-show="isMapTabActive" ref="mapContainer" class="map-container">
    <button class="toggle-style-button" @click="toggleMapStyle">
      {{ isDarkMode.value === 'dark' ? 'Modo Claro' : 'Modo Oscuro' }}
    </button>
    <div v-show="showZoomMessage" class="zoom-message">Mantén presionada la tecla Ctrl (Cmd en Mac) para hacer zoom</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed, onUnmounted } from 'vue';
import mapboxgl, { Map, LngLatBounds } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useCollectionsStore } from '@/stores/collections';
import { useLocationStore } from '@/stores/location';
import { useFilterStore } from '@/stores/filter'; // Import the filter store

const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const mapContainer = ref<HTMLElement | null>(null);
const collectionsStore = useCollectionsStore();
const filterStore = useFilterStore(); // Initialize the filter store
const locationStore = useLocationStore();
const isDarkMode = ref(collectionsStore.mapMode); // Get initial map mode from the store
let map: Map | null = null;

// State for displaying the zoom message
const showZoomMessage = ref(false);
let zoomMessageTimeout: number | null = null;

// Watch for active tab to ensure map is initialized properly
const isMapTabActive = computed(() => collectionsStore.activeTab === 'map');

// Map configuration
const mapOptions = {
  style: isDarkMode.value === 'dark' ? 'mapbox://styles/mapbox/dark-v10' : 'mapbox://styles/mapbox/streets-v11',
  center: collectionsStore.mapCenter || [-2.6189, 43.25],
  zoom: collectionsStore.mapZoom || 7,
};

// Map categories to their corresponding marker images
const categoryMarkerMap = {
  alojamientos: '/images/map/accommodations-marker.png',
  'cuevas y restos arqueológicos': '/images/map/caves-marker.png',
  'edificios religiosos y castillos': '/images/map/culturals-marker.png',
  eventos: '/images/map/events-marker.png',
  'parques temáticos': '/images/map/fairs-marker.png',
  'museos y centros de interpretación': '/images/map/museums-marker.png',
  'espacios naturales': '/images/map/naturals-marker.png',
  restaurantes: '/images/map/restaurants-marker.png',
};

// Determine which results to display on the map: filteredResults or searchResults
const mapResults = computed(() => {
  return collectionsStore.filteredResults.length > 0
    ? collectionsStore.filteredResults
    : collectionsStore.searchResults;
});

// Initialize the map
const initializeMap = () => {
  if (!map) {
    map = new mapboxgl.Map({
      container: mapContainer.value!,
      ...mapOptions,
    });

    map.scrollZoom.disable();
    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.FullscreenControl());

    const locateControl = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      showUserHeading: true,
      showAccuracyCircle: true,
    });
    map.addControl(locateControl);

    map.on('load', () => {
      const attributionControl = map
        .getContainer()
        .getElementsByClassName('mapboxgl-ctrl-attrib')[0];
      if (attributionControl) {
        attributionControl.parentNode.removeChild(attributionControl);
      }

      // Ensure markers and clusters are added on load
      addMarkersAndClusters();
    });

    map.on('click', handleMapClick);
    map.on('click', 'clusters', handleClusterClick);

    // Handle cursor changes over clusters and markers
    map.on('mouseenter', 'clusters', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'clusters', () => {
      map.getCanvas().style.cursor = '';
    });

    map.on('mouseenter', 'unclustered-points', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'unclustered-points', () => {
      map.getCanvas().style.cursor = '';
    });

    locationStore.fetchUserLocation();

    // Save map state when the map moves or zooms
    map.on('moveend', () => {
      const center = map.getCenter();
      collectionsStore.setMapCenter({ lat: center.lat, lng: center.lng });
      collectionsStore.setMapZoom(map.getZoom());
    });

    // Listen for wheel events to control zoom with the Ctrl key
    mapContainer.value?.addEventListener('wheel', handleWheelZoom);
  } else {
    map.resize();
    addMarkersAndClusters();
  }
};

// Add markers and clusters to the map
const addMarkersAndClusters = () => {
  const markerImageUrl = categoryMarkerMap[collectionsStore.selectedCategory?.toLowerCase()] || '/images/map/default-marker.png';

  const geojson = {
    type: 'FeatureCollection',
    features: mapResults.value.map((markerData) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [markerData.longitud, markerData.latitud],
      },
      properties: {
        title: markerData.nombre,
        subtype: markerData.subtype || '',
        municipality: markerData.municipio,
        code: markerData.codigo,
        images: markerData.imagenes ? JSON.stringify(markerData.imagenes) : '[]',
        collection: collectionsStore.selectedCategory,
        fechaInicio: markerData.fechaInicio || null,
      },
    })),
  };

  if (map?.getLayer('clusters')) map.removeLayer('clusters');
  if (map?.getLayer('cluster-count')) map.removeLayer('cluster-count');
  if (map?.getLayer('unclustered-points')) map.removeLayer('unclustered-points');
  if (map?.getSource('resources')) map.removeSource('resources');
  if (map?.hasImage('custom-marker')) map.removeImage('custom-marker');

  map?.addSource('resources', {
    type: 'geojson',
    data: geojson,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
  });

  map?.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'resources',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#51bbd6', 10,
        '#f1f075', 100,
        '#f28cb1',
      ],
      'circle-radius': ['step', ['get', 'point_count'], 15, 100, 20, 750, 25],
      'circle-opacity': 1,
    },
  });

  map?.addLayer({
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

  map?.loadImage(markerImageUrl, (error, image) => {
    if (error) {
      console.error('Error loading image:', error);
      return;
    }

    map?.addImage('custom-marker', image);

    map?.addLayer({
      id: 'unclustered-points',
      type: 'symbol',
      source: 'resources',
      filter: ['!', ['has', 'point_count']],
      layout: {
        'icon-image': 'custom-marker',
        'icon-size': 0.2,
        'icon-allow-overlap': true,
      },
    });
  });

  const bounds = new LngLatBounds();
  mapResults.value.forEach((markerData) => {
    bounds.extend([markerData.longitud, markerData.latitud]);
  });
  if (!bounds.isEmpty()) {
    map?.fitBounds(bounds, {
      padding: { top: 50, bottom: 50, left: 50, right: 50 },
      maxZoom: 14,
    });
  } else {
    console.warn('No valid markers to fit bounds.');
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

const handleMapClick = (e) => {
  const features = map?.queryRenderedFeatures(e.point, { layers: ['unclustered-points'] });
  if (!features.length) {
    return;
  }

  const feature = features[0];
  const targetZoom = 13;
  const popupOffset = 200;

  map?.easeTo({
    center: feature.geometry.coordinates,
    zoom: targetZoom,
    offset: [0, -popupOffset],
    duration: 1500,
  });

  const popup = new mapboxgl.Popup({
    offset: 25,
    closeButton: true,
    closeOnClick: true,
  })
    .setLngLat(feature.geometry.coordinates)
    .setHTML(getPopupHTML(feature))
    .addTo(map!);
};

const handleClusterClick = (e) => {
  const features = map?.queryRenderedFeatures(e.point, { layers: ['clusters'] });
  if (!features.length) return;

  const clusterId = features[0].properties.cluster_id;
  const source = map?.getSource('resources') as mapboxgl.GeoJSONSource;

  source.getClusterExpansionZoom(clusterId, (err, zoom) => {
    if (err) return;

    const newCenter = features[0].geometry.coordinates;
    const popupOffset = 200;

    map?.easeTo({
      center: newCenter,
      zoom: zoom + 1,
      offset: [0, -popupOffset],
      duration: 1000,
    });
  });
};

const getPopupHTML = (feature) => {
  const collectionName = feature.properties.collection;
  const resourceCode = feature.properties.code;

  const imgSource =
    JSON.parse(feature.properties.images)[0]?.fuente || `/images/default/default-image.jpg`;
  const imgAlt = JSON.parse(feature.properties.images)[0]?.titulo || '';

  const userLocation = locationStore.userLocation;
  let distanceText = '';
  if (userLocation) {
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      feature.geometry.coordinates[1],
      feature.geometry.coordinates[0]
    ).toFixed(2);
    distanceText = `<p><i class="fas fa-map-marker-alt"></i> ${distance} km</p>`;
  }

  return `
    <div class="result-card">
      <div class="card-image" style="background-image: url(${imgSource});"></div>
      <div class="card-content">
        <h3>${feature.properties.subtype}</h3>
        <h2>${feature.properties.title}</h2>
        <p class="municipio-text">${feature.properties.municipality}</p>
        ${distanceText}
        <a role="button" href="/resource/${collectionName}/${resourceCode}" class="btn btn-sm btn-primary mt-1 w-100">Ver Detalles</a>
      </div>
    </div>
  `;
};

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const radlat1 = (Math.PI * lat1) / 180;
  const radlat2 = (Math.PI * lat2) / 180;
  const theta = lon1 - lon2;
  const radtheta = (Math.PI * theta) / 180;
  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) dist = 1;
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  dist = dist * 1.609344; // Convert miles to kilometers
  return dist;
};

const toggleMapStyle = () => {
  if (!map) return;

  // Save current map state
  const currentCenter = map.getCenter();
  const currentZoom = map.getZoom();

  // Toggle map style
  isDarkMode.value = isDarkMode.value === 'dark' ? 'light' : 'dark';
  collectionsStore.setMapMode(isDarkMode.value); // Update map mode in the store
  map.setStyle(
    isDarkMode.value === 'dark' ? 'mapbox://styles/mapbox/dark-v10' : 'mapbox://styles/mapbox/streets-v11'
  );

  // Restore map state after style change
  map.once('style.load', () => {
    map.setCenter(currentCenter);
    map.setZoom(currentZoom);
    addMarkersAndClusters(); // Re-add markers and clusters
  });
};

// This method is triggered when the map tab becomes active or on initial load
const performMapSearch = async () => {
  const { searchQuery, selectedCategory } = collectionsStore;

  const filters = {
    idioma: 'es',
    ...(filterStore.selectedProvince && { nombre_provincia: filterStore.selectedProvince }),
    ...(filterStore.selectedLocality && { nombre_municipio: filterStore.selectedLocality }),
    ...(filterStore.selectedCategories[selectedCategory?.toLowerCase()] && {
      nombre_subtipo_recurso: filterStore.selectedCategories[selectedCategory.toLowerCase()],
    }),
    ...(filterStore.startDate && { fecha_inicio: formatDateForApi(filterStore.startDate) }),
    ...(filterStore.endDate && { fecha_fin: formatDateForApi(filterStore.endDate) }),
  };

  if (searchQuery.length >= 3) {
    if (selectedCategory) {
      await collectionsStore.searchInCategory(selectedCategory, searchQuery, 'es');
    } else {
      await collectionsStore.searchAllCollections(searchQuery, 'es');
    }
  } else if (selectedCategory) {
    await collectionsStore.filterResultsByCategory(selectedCategory, filters);
  }
};

// Format date helper function
const formatDateForApi = (date) => {
  if (!date) return null;
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Intl.DateTimeFormat('es-ES', options).format(new Date(date)).split('/').reverse().join('/');
};

// Watch for changes in the search query
watch(() => collectionsStore.searchQuery, async () => {
  if (isMapTabActive.value) {
    await performMapSearch();
    addMarkersAndClusters();
  }
});

// Watch for changes in applied filters
watch(() => [
  filterStore.selectedProvince,
  filterStore.selectedLocality,
  filterStore.selectedCategories,
  filterStore.startDate,
  filterStore.endDate
], async () => {
  if (isMapTabActive.value) {
    await performMapSearch();
    addMarkersAndClusters();
  }
}, { deep: true });

watch(isMapTabActive, async (isActive) => {
  if (isActive) {
    // If map tab is active, perform search to ensure markers are updated
    await performMapSearch();
    initializeMap();
  }
});

watch(
  () => collectionsStore.selectedCategory,
  async () => {
    if (isMapTabActive.value) {
      // Update markers when category changes and map tab is active
      await performMapSearch();
      addMarkersAndClusters();
    }
  }
);

onMounted(async () => {
  mapboxgl.accessToken = accessToken;
  if (isMapTabActive.value) {
    await performMapSearch();
    initializeMap();
  }
});

onUnmounted(() => {
  if (map) {
    map.remove();
    mapContainer.value?.removeEventListener('wheel', handleWheelZoom);
  }
});
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 500px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
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

.result-card {
  display: flex;
  flex-direction: column;
  width: 200px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.card-image {
  background-size: cover;
  background-position: center;
  height: 120px;
  position: relative;
}

.hidden-image {
  display: none;
}

.card-content {
  padding: 10px;
  text-align: center;
}

.card-content h3 {
  margin: 0 0 5px;
  font-size: 0.8rem;
  color: #666666;
  text-transform: uppercase;
  font-weight: normal;
  letter-spacing: 0.5px;
}

.card-content h2 {
  margin: 0 0 10px;
  font-size: 1rem;
  color: #333333;
  font-weight: bold;
  line-height: 1.2;
}

.card-content p {
  margin: 5px 0;
  font-size: 0.9rem;
  color: #555555;
}

.card-content .location-icon {
  margin-right: 5px;
  color: #007bff;
}

.municipio-text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}

.event-date {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 0.7rem;
}
</style>
