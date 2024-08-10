<template>
  <div v-show="isMapTabActive" ref="mapContainer" class="map-container">
    <button class="toggle-style-button" @click="toggleMapStyle" title="Toggle Dark/Light Mode">
      <FontAwesomeIcon :icon="[isDarkMode === 'dark' ? 'fas' : 'fas', isDarkMode === 'dark' ? 'sun' : 'moon']" />
    </button>
    <div v-show="showZoomMessage" class="zoom-message">
      Mantén presionada la tecla Ctrl (Cmd en Mac) para hacer zoom
    </div>

    <!-- Info Panel -->
    <div v-if="showInfoPanel" class="info-panel visible">
      <ResultPopupContent
        :imageSrc="selectedImage"
        :subtype="selectedSubtype"
        :title="selectedTitle"
        :municipality="selectedMunicipality"
        :distance="selectedDistance"
        :collection="selectedCollection"
        :code="selectedCode"
        @close="closePopup"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed, onUnmounted } from 'vue';
import mapboxgl, { Map, LngLatBounds } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FontAwesomeIcon } from '@/font-awesome';
import { useCollectionsStore } from '@/stores/collections';
import { useLocationStore } from '@/stores/location';
import { useFilterStore } from '@/stores/filter';
import { useMapStore } from '@/stores/map';
import { calculateDistance } from '@/utils/distance';
import ResultPopupContent from './ResultPopupContent.vue';

const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const mapContainer = ref<HTMLElement | null>(null);
const collectionsStore = useCollectionsStore();
const mapStore = useMapStore();
const filterStore = useFilterStore();
const locationStore = useLocationStore();
const isDarkMode = ref(mapStore.mapMode);
let map: Map | null = null;

// State for displaying the zoom message
const showZoomMessage = ref(false);
let zoomMessageTimeout: number | null = null;

// Info panel state
const showInfoPanel = ref(false);
const selectedImage = ref('');
const selectedSubtype = ref('');
const selectedTitle = ref('');
const selectedMunicipality = ref('');
const selectedDistance = ref('');
const selectedCollection = ref('');
const selectedCode = ref('');

// Watch for active tab to ensure map is initialized properly
const isMapTabActive = computed(() => collectionsStore.activeTab === 'map');

// Map configuration
const mapOptions = {
  style:
    isDarkMode.value === 'dark'
      ? 'mapbox://styles/mapbox/dark-v10'
      : 'mapbox://styles/mapbox/streets-v11',
  center: mapStore.mapCenter || [-2.6189, 43.25],
  zoom: mapStore.mapZoom || 7,
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

// Determine which results to display on the map
const mapResults = computed(() => {
  return collectionsStore.results;
});

// Determine the subtype based on collection type
const getSubtype = (item) => {
  if (item.coleccion.toLowerCase() === 'natural') {
    return (
      item.nombre_subtipo_recurso_espacio_natural ||
      item.nombre_subtipo_recurso_playas_pantanos_rios ||
      ''
    );
  }
  return item.nombre_subtipo_recurso || '';
};

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

      // Restore popup state if available
      const popupState = mapStore.mapPopup;
      if (popupState) {
        openPopup(popupState);
      }
    });

    map.on('click', handleMapClick);
    map.on('click', 'clusters', handleClusterClick);
    map.on('click', (e) => {
      if (
        !map?.queryRenderedFeatures(e.point, {
          layers: ['unclustered-points', 'clusters'],
        }).length
      ) {
        closePopup();
      }
    });

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
      mapStore.setMapCenter({ lat: center.lat, lng: center.lng });
      mapStore.setMapZoom(map.getZoom());
    });

    // Listen for wheel events to control zoom with the Ctrl key
    mapContainer.value?.addEventListener('wheel', handleWheelZoom);
  } else {
    map.resize();
    addMarkersAndClusters();
  }
};

// Helper function to remove existing layers
const removeExistingLayers = (layerIds) => {
  layerIds.forEach((layerId) => {
    if (map?.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
  });
};

// Helper function to remove an existing source
const removeExistingSource = (sourceId) => {
  if (map?.getSource(sourceId)) {
    map.removeSource(sourceId);
  }
};

// Helper function to add source
const addSource = (sourceId, data) => {
  map?.addSource(sourceId, {
    type: 'geojson',
    data: data,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
  });
};

// Helper function to add cluster layers
const addClusterLayers = () => {
  map?.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'resources',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#51bbd6',
        10,
        '#f1f075',
        100,
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
};

// Helper function to add marker layers
const addMarkerLayers = () => {
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

  map?.addLayer({
    id: 'resource-names',
    type: 'symbol',
    source: 'resources',
    filter: ['!', ['has', 'point_count']],
    layout: {
      'text-field': ['get', 'title'],
      'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
      'text-size': 14,
      'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
      'text-radial-offset': 0.5,
      'text-justify': 'auto',
      'text-anchor': 'center',
      'text-allow-overlap': false,
      'text-padding': 2,
    },
    paint: {
      'text-color': isDarkMode.value === 'dark' ? '#ffffff' : '#000000',
      'text-halo-color': isDarkMode.value === 'dark' ? '#000000' : '#ffffff',
      'text-halo-width': 1,
    },
  });
};

// Helper function to load and add marker image
const loadAndAddImage = (markerImageUrl) => {
  // Remove existing image if it exists
  if (map?.hasImage('custom-marker')) {
    map.removeImage('custom-marker');
  }

  // Load and add the new image
  map?.loadImage(markerImageUrl, (error, image) => {
    if (error) {
      console.error('Error loading image:', error);
      return;
    }

    // Add the image
    map?.addImage('custom-marker', image);
  });
};

// Helper function to fit map bounds
const fitMapBounds = () => {
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

  mapStore.didCategoryChange = false;
  mapStore.shouldRefitBounds = false;
};

// Main function to add markers and clusters
const addMarkersAndClusters = () => {
  const markerImageUrl =
    categoryMarkerMap[collectionsStore.selectedCategory?.toLowerCase()] ||
    '/images/map/default-marker.png';

  const geojson = {
    type: 'FeatureCollection',
    features: mapResults.value.map((markerData, index) => ({
      type: 'Feature',
      id: index,
      geometry: {
        type: 'Point',
        coordinates: [markerData.longitud, markerData.latitud],
      },
      properties: {
        title: markerData.nombre,
        subtype: getSubtype(markerData),
        municipality: markerData.nombre_municipio,
        code: markerData.codigo,
        images: markerData.imagenes ? JSON.stringify(markerData.imagenes) : '[]',
        collection: markerData.coleccion,
        fechaInicio: markerData.fechaInicio || null,
      },
    })),
  };

  console.log('GeoJSON data for markers:', geojson); // Debugging log to check data

  // Remove existing layers and source
  removeExistingLayers([
    'clusters',
    'cluster-count',
    'unclustered-points',
    'resource-names',
  ]);
  removeExistingSource('resources');

  // Add the source
  addSource('resources', geojson);

  // Load and add marker image, then add layers
  loadAndAddImage(markerImageUrl);
  addClusterLayers();
  addMarkerLayers();

  // Fit map bounds if necessary
  if (mapStore.didCategoryChange || mapStore.shouldRefitBounds) {
    fitMapBounds();
    mapStore.shouldRefitBounds = false;
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
  const features = map?.queryRenderedFeatures(e.point, {
    layers: ['unclustered-points'],
  });
  if (!features.length) {
    closePopup();
    return;
  }

  const feature = features[0];

  // Set selected info for the panel
  selectedImage.value =
    JSON.parse(feature.properties.images)[0]?.fuente ||
    `/images/default/default-image.jpg`;
  selectedSubtype.value = feature.properties.subtype;
  selectedTitle.value = feature.properties.title;
  selectedMunicipality.value = feature.properties.municipality;
  selectedDistance.value = calculateDistance(
    locationStore.userLocation.latitude,
    locationStore.userLocation.longitude,
    feature.geometry.coordinates[1],
    feature.geometry.coordinates[0]
  ).toFixed(2);
  selectedCollection.value = feature.properties.collection;
  selectedCode.value = feature.properties.code;

  // Save popup state to store
  mapStore.setMapPopup(feature);

  // Show the info panel
  showInfoPanel.value = true;
};

// Close the info panel
const closePopup = () => {
  showInfoPanel.value = false;
  mapStore.setMapPopup(null);
};

// Method to open popup using stored state
const openPopup = (feature) => {
  selectedImage.value =
    JSON.parse(feature.properties.images)[0]?.fuente ||
    `/images/default/default-image.jpg`;
  selectedSubtype.value = feature.properties.subtype;
  selectedTitle.value = feature.properties.title;
  selectedMunicipality.value = feature.properties.municipality;
  selectedDistance.value = calculateDistance(
    locationStore.userLocation.latitude,
    locationStore.userLocation.longitude,
    feature.geometry.coordinates[1],
    feature.geometry.coordinates[0]
  ).toFixed(2);
  selectedCollection.value = feature.properties.collection;
  selectedCode.value = feature.properties.code;

  showInfoPanel.value = true;
};

const handleClusterClick = async (e) => {
  const features = map?.queryRenderedFeatures(e.point, { layers: ['clusters'] });
  if (!features.length) return;

  const clusterId = features[0].properties.cluster_id;
  const source = map?.getSource('resources') as mapboxgl.GeoJSONSource;

  // Get the cluster expansion zoom level and bounds
  source.getClusterExpansionZoom(clusterId, (err, zoom) => {
    if (err) return;

    // Get the cluster's features
    source.getClusterLeaves(clusterId, Infinity, 0, (err, leaves) => {
      if (err) return;

      const bounds = new LngLatBounds();
      leaves.forEach((leaf) => {
        bounds.extend(leaf.geometry.coordinates);
      });

      map?.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: zoom + 1,
        duration: 1000,
      });
    });
  });
};

const toggleMapStyle = () => {
  if (!map) return;

  // Save current map state
  const currentCenter = map.getCenter();
  const currentZoom = map.getZoom();

  // Toggle map style
  isDarkMode.value = isDarkMode.value === 'dark' ? 'light' : 'dark';
  mapStore.setMapMode(isDarkMode.value);
  map.setStyle(
    isDarkMode.value === 'dark'
      ? 'mapbox://styles/mapbox/dark-v10'
      : 'mapbox://styles/mapbox/streets-v11'
  );

  // Restore map state after style change
  map.once('style.load', () => {
    map.setCenter(currentCenter);
    map.setZoom(currentZoom);
    addMarkersAndClusters();
  });
};

// This method is triggered when the map tab becomes active or on initial load
const performMapSearch = async () => {
  const { searchQuery, selectedCategory } = collectionsStore;

  // Determine the correct subcategory filter key
  const subCategoryFilterKey =
    selectedCategory === 'Espacios Naturales'
      ? filterStore.selectedCategories[selectedCategory.toLowerCase()] ===
      filterStore.categories.natural.espacio_natural
        ? 'nombre_subtipo_recurso_espacio_natural'
        : 'nombre_subtipo_recurso_playas_pantanos_rios'
      : 'nombre_subtipo_recurso';

  const filters = {
    idioma: 'es',
    ...(filterStore.selectedProvince && {
      nombre_provincia: filterStore.selectedProvince,
    }),
    ...(filterStore.selectedLocality && {
      nombre_municipio: filterStore.selectedLocality,
    }),
    ...(filterStore.selectedCategories[selectedCategory?.toLowerCase()] && {
      [subCategoryFilterKey]:
        filterStore.selectedCategories[selectedCategory.toLowerCase()],
    }),
    ...(filterStore.startDate && {
      fecha_inicio: formatDateForApi(filterStore.startDate),
    }),
    ...(filterStore.endDate && {
      fecha_fin: formatDateForApi(filterStore.endDate),
    }),
  };

  // Use fetchResults to get data based on both search and filters
  await collectionsStore.fetchResults(selectedCategory, searchQuery, filters);
};

// Format date helper function
const formatDateForApi = (date) => {
  if (!date) return null;
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Intl.DateTimeFormat('es-ES', options)
    .format(new Date(date))
    .split('/')
    .reverse()
    .join('/');
};

// Watch for changes in the search query
watch(
  () => collectionsStore.searchQuery,
  async () => {
    await performMapSearch();
    if (isMapTabActive.value) {
      addMarkersAndClusters();
      mapStore.shouldRefitBounds = true;
    }
  }
);

// Watch for changes in applied filters
watch(
  () => [
    filterStore.selectedProvince,
    filterStore.selectedLocality,
    filterStore.selectedCategories,
    filterStore.startDate,
    filterStore.endDate,
  ],
  async () => {
    if (isMapTabActive.value) {
      await performMapSearch();
      closePopup();
      addMarkersAndClusters();
    }
  },
  { deep: true }
);

watch(isMapTabActive, async (isActive) => {
  if (isActive) {
    // If map tab is active, perform search to ensure markers are updated
    await performMapSearch();
    initializeMap();
  }
});

watch(
  () => collectionsStore.selectedCategory,
  async (newCategory, oldCategory) => {
    if (newCategory !== oldCategory) {
      mapStore.didCategoryChange = true;
      closePopup();
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

.toggle-style-button:hover {
  background-color: #f0f0f0;
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

.info-panel {
  position: absolute;
  bottom: 10px;
  left: 10px;
  width: 250px;
  z-index: 4;
}

@media screen and (max-width: 768px) {
  .info-panel {
    width: 200px;
  }
}
</style>
