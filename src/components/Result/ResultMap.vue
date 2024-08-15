<template>
  <div v-show="isMapTabActive" ref="mapContainer" class="map-container">
    <button class="toggle-style-button" @click="toggleMapStyle" title="Toggle Dark/Light Mode">
      <FontAwesomeIcon :icon="[isDarkMode === 'dark' ? 'fas' : 'fas', isDarkMode === 'dark' ? 'sun' : 'moon']" />
    </button>
    <MapZoomMessage :mapInstance="map" />

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
import { formatDateForApi } from "@/utils/date";
import { getMarkerImageUrl, handleWheelZoom } from '@/utils/map';
import MapZoomMessage from '@/components/Misc/MapZoomMessage.vue';

const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const mapContainer = ref<HTMLElement | null>(null);
const collectionsStore = useCollectionsStore();
const mapStore = useMapStore();
const filterStore = useFilterStore();
const locationStore = useLocationStore();
const isDarkMode = ref(mapStore.mapMode);
let map: Map | null = null;

// Info panel state
const showInfoPanel = ref(false);
const selectedImage = ref('');
const selectedSubtype = ref('');
const selectedTitle = ref('');
const selectedMunicipality = ref('');
const selectedDistance = ref('');
const selectedCollection = ref('');
const selectedCode = ref('');

// Ref variables for wheel zoom handling
const showZoomMessage = ref(false);
const zoomMessageTimeout = ref<number | null>(null);
let wheelZoomHandler: (event: WheelEvent) => void;

// Watch for active tab to ensure map is initialized properly
const isMapTabActive = computed(() => collectionsStore.activeTab === 'map');

// Map configuration
const mapOptions = {
  style: isDarkMode.value === 'dark'
      ? 'mapbox://styles/mapbox/dark-v10'
      : 'mapbox://styles/mapbox/streets-v11',
  center: mapStore.mapCenter || [-2.6189, 43.25],
  zoom: mapStore.mapZoom || 7,
};

// Determine which results to display on the map
const mapResults = computed(() => collectionsStore.results);

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
let isRestoringState = false;

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
      addMarkersAndClusters();

      // Remove the attribution control if it exists
      const attributionControl = map
          .getContainer()
          .querySelector('.mapboxgl-ctrl-attrib');
      if (attributionControl) {
        attributionControl.parentNode.removeChild(attributionControl);
      }

      if (mapStore.mapCenter && mapStore.mapZoom) {
        isRestoringState = true;
        map.setCenter([mapStore.mapCenter.lng, mapStore.mapCenter.lat]);
        map.setZoom(mapStore.mapZoom);

        if (mapStore.mapPopup) {
          const popupState = JSON.parse(mapStore.mapPopup);
          openPopup(popupState);
        }

        map.once('moveend', () => {
          isRestoringState = false;
        });
      }

      if (!mapStore.returningFromDetail && mapStore.shouldRefitBounds) {
        fitMapBounds();
        mapStore.setShouldRefitBounds(false);
      }
    });

    map.on('moveend', () => {
      if (!isRestoringState) {
        const center = map.getCenter();
        mapStore.setMapCenter({ lat: center.lat, lng: center.lng });
        mapStore.setMapZoom(map.getZoom());
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

    // Define the handler with the correct arguments
    wheelZoomHandler = handleWheelZoom(map, showZoomMessage, zoomMessageTimeout);

    // Add the event listener using the handler reference
    mapContainer.value?.addEventListener('wheel', wheelZoomHandler);
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
const addMarkerLayers = (imageName) => {
  if (map?.getLayer('unclustered-points')) {
    map.removeLayer('unclustered-points');
  }

  if (map?.getLayer('resource-names')) {
    map.removeLayer('resource-names');
  }

  map?.addLayer({
    id: 'unclustered-points',
    type: 'symbol',
    source: 'resources',
    filter: ['!', ['has', 'point_count']],
    layout: {
      'icon-image': imageName,
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
const loadAndAddImage = (markerImageUrl, collectionName) => {
  const imageName = `custom-marker-${collectionName}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

  map?.loadImage(markerImageUrl, (error, image) => {
    if (error) {
      console.error('Error loading image:', error);
      return;
    }
    map?.addImage(imageName, image);
  });

  return imageName;
};

// Helper function to fit map bounds
const fitMapBounds = () => {
  const bounds = new LngLatBounds();
  let validMarkers = 0;

  mapResults.value.forEach((markerData) => {
    if (markerData.longitud && markerData.latitud) {
      bounds.extend([markerData.longitud, markerData.latitud]);
      validMarkers++;
    }
  });

  if (validMarkers > 0) {
    map?.fitBounds(bounds, {
      padding: { top: 50, bottom: 50, left: 50, right: 50 },
      maxZoom: 14,
      duration: 1000,
    });
  } else {
    console.warn('No valid markers to fit bounds.');
  }

  mapStore.setShouldRefitBounds(false);
};

// Main function to add markers and clusters
const addMarkersAndClusters = async () => {
  const selectedCategory = collectionsStore.selectedCategory?.toLowerCase();
  const markerImageUrl = getMarkerImageUrl(selectedCategory || '');
  const imageName = loadAndAddImage(markerImageUrl, selectedCategory);

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

  removeExistingLayers([
    'clusters',
    'cluster-count',
    'unclustered-points',
    'resource-names',
  ]);
  removeExistingSource('resources');

  addSource('resources', geojson);
  addMarkerLayers(imageName);
  addClusterLayers();

  map.once('idle', () => {
    if (mapStore.didCategoryChange || mapStore.shouldRefitBounds) {
      fitMapBounds();
      mapStore.setDidCategoryChange(false);
      mapStore.setShouldRefitBounds(false);
    }
  });
};

// Save popup state if a popup is opened
const handleMapClick = (e) => {
  const features = map?.queryRenderedFeatures(e.point, {
    layers: ['unclustered-points'],
  });
  if (!features.length) {
    closePopup();
    return;
  }

  const feature = features[0];

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

  mapStore.setMapPopup(JSON.parse(JSON.stringify(feature)));

  showInfoPanel.value = true;
};

// Close the info panel
const closePopup = () => {
  showInfoPanel.value = false;
  mapStore.setMapPopup(null);
};

// Method to open popup using stored state
const openPopup = (feature) => {
  if (!feature || !feature.properties) return;

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

  source.getClusterExpansionZoom(clusterId, (err, zoom) => {
    if (err) return;

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

  const currentCenter = map.getCenter();
  const currentZoom = map.getZoom();

  isDarkMode.value = isDarkMode.value === 'dark' ? 'light' : 'dark';
  mapStore.setMapMode(isDarkMode.value);
  map.setStyle(
      isDarkMode.value === 'dark'
          ? 'mapbox://styles/mapbox/dark-v10'
          : 'mapbox://styles/mapbox/streets-v11'
  );

  map.once('style.load', () => {
    map.setCenter(currentCenter);
    map.setZoom(currentZoom);
    addMarkersAndClusters();
  });
};

const performMapSearch = async () => {
  if (!map) {
    console.warn('Map is not initialized yet.');
    return;
  }

  const { searchQuery, selectedCategory } = collectionsStore;

  let subcategoryKey = null;
  let subcategoryValue = null;

  if (selectedCategory?.toLowerCase() === 'espacios naturales') {
    if (filterStore.selectedCategories.natural.espacio_natural) {
      subcategoryKey = 'nombre_subtipo_recurso_espacio_natural';
      subcategoryValue = filterStore.selectedCategories.natural.espacio_natural;
    } else if (filterStore.selectedCategories.natural.playas_pantanos_rios) {
      subcategoryKey = 'nombre_subtipo_recurso_playas_pantanos_rios';
      subcategoryValue = filterStore.selectedCategories.natural.playas_pantanos_rios;
    }
  } else if (filterStore.selectedCategories[selectedCategory?.toLowerCase()]) {
    subcategoryKey = 'nombre_subtipo_recurso';
    subcategoryValue = filterStore.selectedCategories[selectedCategory.toLowerCase()];
  }

  const filters = {
    idioma: 'es',
    ...(filterStore.selectedProvince && {
      nombre_provincia: filterStore.selectedProvince,
    }),
    ...(filterStore.selectedLocality && {
      nombre_municipio: filterStore.selectedLocality,
    }),
    ...(subcategoryKey && subcategoryValue && { [subcategoryKey]: subcategoryValue }),
    ...(filterStore.startDate && {
      fecha_inicio: formatDateForApi(filterStore.startDate),
    }),
    ...(filterStore.endDate && {
      fecha_fin: formatDateForApi(filterStore.endDate),
    }),
  };

  await collectionsStore.fetchResults(selectedCategory, searchQuery, filters);

  if (mapStore.shouldRefitBounds) {
    fitMapBounds();
  } else {
    map.setCenter([mapStore.mapCenter.lng, mapStore.mapCenter.lat]);
    map.setZoom(mapStore.mapZoom);
  }
};

const clearMapMarkers = () => {
  if (map?.getLayer('clusters')) map.removeLayer('clusters');
  if (map?.getLayer('cluster-count')) map.removeLayer('cluster-count');
  if (map?.getLayer('unclustered-points')) map.removeLayer('unclustered-points');
  if (map?.getLayer('resource-names')) map.removeLayer('resource-names');
  if (map?.getSource('resources')) map.removeSource('resources');
};

watch(
    () => collectionsStore.searchQuery,
    async () => {
      await performMapSearch();
      if (isMapTabActive.value) {
        addMarkersAndClusters();
        mapStore.setShouldRefitBounds(true);
      }
    }
);

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
    if (!map) {
      initializeMap();
    } else {
      map.resize();
    }

    await performMapSearch();

    if (mapStore.didCategoryChange || (!mapStore.returningFromDetail && mapStore.shouldRefitBounds)) {
      fitMapBounds();
    }

    mapStore.resetReturningFromDetail();
    mapStore.resetAllFlags();
  }
});

watch(
    () => collectionsStore.selectedCategory,
    async (newCategory, oldCategory) => {
      if (newCategory !== oldCategory) {
        mapStore.setDidCategoryChange(true);
        closePopup();
        await performMapSearch();

        if (mapStore.shouldRefitBounds) {
          fitMapBounds();
          mapStore.setShouldRefitBounds(false);
        }
      }
    }
);

watch(
    () => collectionsStore.results,
    (newResults) => {
      if (newResults && newResults.length > 0) {
        addMarkersAndClusters();

        if (mapStore.didCategoryChange || (!mapStore.returningFromDetail && mapStore.shouldRefitBounds)) {
          fitMapBounds();
          mapStore.setDidCategoryChange(false);
          mapStore.setShouldRefitBounds(false);
        }
      } else {
        clearMapMarkers();
      }
    },
    { immediate: true }
);

onMounted(async () => {
  mapboxgl.accessToken = accessToken;

  if (isMapTabActive.value) {
    initializeMap();

    const checkMapInitialization = setInterval(() => {
      if (map && map.isStyleLoaded()) {
        clearInterval(checkMapInitialization);
        performMapSearch();

        if (mapStore.mapCenter && mapStore.mapZoom) {
          isRestoringState = true;
          map.setCenter([mapStore.mapCenter.lng, mapStore.mapCenter.lat]);
          map.setZoom(mapStore.mapZoom);

          if (mapStore.mapPopup) {
            const popupState = JSON.parse(mapStore.mapPopup);
            openPopup(popupState);
          }

          map.once('moveend', () => {
            isRestoringState = false;
          });
        }
      }
    }, 100);
  }
});

onUnmounted(() => {
  if (map) {
    const center = map.getCenter();
    mapStore.setMapCenter({ lat: center.lat, lng: center.lng });
    mapStore.setMapZoom(map.getZoom());

    map.remove();
    if (mapContainer.value) {
      mapContainer.value.removeEventListener('wheel', wheelZoomHandler);
    }
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
