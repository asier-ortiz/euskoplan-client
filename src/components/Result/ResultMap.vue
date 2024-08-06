<template>
  <div ref="mapContainer" class="map-container">
    <button class="toggle-style-button" @click="toggleMapStyle">
      {{ isDarkMode ? 'Modo Claro' : 'Modo Oscuro' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed, onUnmounted } from 'vue';
import mapboxgl, { Map, LngLatBounds } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useCollectionsStore } from '@/stores/collections';
import { useLocationStore } from '@/stores/location';

// Obtener el token de acceso de Mapbox desde el entorno
const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

// Referencia al contenedor del mapa
const mapContainer = ref<HTMLElement | null>(null);

// Acceso al store de colecciones
const collectionsStore = useCollectionsStore();

// Acceso al store de ubicación
const locationStore = useLocationStore();

// Estado para el modo oscuro
const isDarkMode = ref(false);

// Definir el centro predeterminado del mapa en el País Vasco
const defaultCenter: [number, number] = [-2.6189, 43.25]; // Coordenadas para el País Vasco

// Configurar las opciones del mapa
const mapOptions = {
  style: isDarkMode.value
    ? 'mapbox://styles/mapbox/dark-v10'
    : 'mapbox://styles/mapbox/streets-v11',
  center: defaultCenter,
  zoom: 7,
};

// Mapear categorías a sus correspondientes imágenes de marcador
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

// Computar los resultados usados para las tarjetas y marcadores
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

// Función para inicializar el mapa
const initializeMap = (markersData: any[], markerImageUrl: string) => {
  // Convertir los datos de marcadores a formato GeoJSON
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
        subtype: markerData.subtype || '',
        municipality: markerData.municipio,
        code: markerData.codigo,
        images: markerData.imagenes ? JSON.stringify(markerData.imagenes) : '[]',
        collection: collectionsStore.selectedCategory,
        fechaInicio: markerData.fechaInicio || null,
      },
    })),
  };

  // Eliminar capas y fuentes existentes
  if (map.getLayer('clusters')) map.removeLayer('clusters');
  if (map.getLayer('cluster-count')) map.removeLayer('cluster-count');
  if (map.getLayer('unclustered-points')) map.removeLayer('unclustered-points');
  if (map.getSource('resources')) map.removeSource('resources');
  if (map.hasImage('custom-marker')) map.removeImage('custom-marker');

  // Añadir una fuente para los marcadores
  map.addSource('resources', {
    type: 'geojson',
    data: geojson,
    cluster: true,
    clusterMaxZoom: 14, // Zoom máximo para agrupar puntos
    clusterRadius: 50,  // Radio de cada grupo al agrupar puntos
  });

  // Añadir una capa para los clusters
  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'resources',
    filter: ['has', 'point_count'],
    paint: {
      // Cambiar color del círculo según número de elementos en el cluster
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#51bbd6', 10, // Azul para <= 10
        '#f1f075', 100, // Amarillo para <= 100
        '#f28cb1' // Rojo para > 100
      ],
      'circle-radius': ['step', ['get', 'point_count'], 15, 100, 20, 750, 25],
      'circle-opacity': 1, // Sin transparencia
    },
  });

  // Añadir una capa para las etiquetas de conteo de clusters
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

  // Asegurarse de que la imagen del marcador se cargue antes de usarla
  map.loadImage(markerImageUrl, (error, image) => {
    if (error) {
      console.error('Error loading image:', error);
      return;
    }

    // Añadir la nueva imagen para los marcadores
    map.addImage('custom-marker', image);

    map.addLayer({
      id: 'unclustered-points',
      type: 'symbol',
      source: 'resources',
      filter: ['!', ['has', 'point_count']],
      layout: {
        'icon-image': 'custom-marker',
        'icon-size': 0.2, // Ajustar el tamaño del ícono aquí para hacer los marcadores mucho más pequeños
        'icon-allow-overlap': true,
      },
    });
  });

  // Ajustar el mapa a los límites de los marcadores solo si hay marcadores válidos
  const bounds = new LngLatBounds();
  markersData.forEach((markerData) => {
    bounds.extend([markerData.longitud, markerData.latitud]);
  });
  if (!bounds.isEmpty()) {
    map.fitBounds(bounds, {
      padding: { top: 50, bottom: 50, left: 50, right: 50 },
      maxZoom: 14,
    });
  } else {
    console.warn('No valid markers to fit bounds.');
  }
};

// Función para manejar eventos de clic en el mapa
const handleMapClick = (e) => {
  const features = map.queryRenderedFeatures(e.point, { layers: ['unclustered-points'] });
  if (!features.length) {
    return;
  }

  const feature = features[0];

  // Calcular el nuevo nivel de zoom y offset
  const targetZoom = 13; // Ajustar para asegurar que el marcador y la tarjeta se vean
  const popupOffset = 200; // Ajusta esta variable para posicionar la tarjeta adecuadamente

  map.easeTo({
    center: feature.geometry.coordinates,
    zoom: targetZoom,
    offset: [0, -popupOffset], // Desplaza el centro para dejar espacio a la tarjeta
    duration: 1500, // Animación más lenta
  });

  // Crear popup con botón de cierre
  const popup = new mapboxgl.Popup({
    offset: 25,
    closeButton: true, // Botón de cierre
    closeOnClick: true,
  })
    .setLngLat(feature.geometry.coordinates)
    .setHTML(getPopupHTML(feature))
    .addTo(map);
};

// Función para manejar eventos de clic en clusters
const handleClusterClick = (e) => {
  const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
  if (!features.length) return;

  const clusterId = features[0].properties.cluster_id;
  const source = map.getSource('resources');

  source.getClusterExpansionZoom(clusterId, (err, zoom) => {
    if (err) return;

    // Calcular el nuevo centro para que el cluster se expanda adecuadamente
    const newCenter = features[0].geometry.coordinates;
    const popupOffset = 200; // Ajusta esta variable para posicionar la tarjeta adecuadamente

    map.easeTo({
      center: newCenter,
      zoom: zoom + 1, // Aumentar el zoom para dividir el cluster
      offset: [0, -popupOffset], // Desplaza el centro para dejar espacio a la tarjeta
      duration: 1000, // Animación más rápida
    });
  });
};

// Función para obtener el contenido HTML de un popup
const getPopupHTML = (feature) => {
  const collectionName = feature.properties.collection;
  const resourceCode = feature.properties.code;

  const imgSource = JSON.parse(feature.properties.images)[0]?.fuente || `/images/default/default-image.jpg`;
  const imgAlt = JSON.parse(feature.properties.images)[0]?.titulo || '';

  // Verificar si la ubicación del usuario está disponible
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

// Función para calcular la distancia entre dos puntos
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const radlat1 = Math.PI * lat1 / 180;
  const radlat2 = Math.PI * lat2 / 180;
  const theta = lon1 - lon2;
  const radtheta = Math.PI * theta / 180;
  let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) dist = 1;
  dist = Math.acos(dist);
  dist = dist * 180 / Math.PI;
  dist = dist * 60 * 1.1515;
  dist = dist * 1.609344; // Convertir millas a kilómetros
  return dist;
};

// Función para alternar el estilo del mapa
const toggleMapStyle = () => {
  isDarkMode.value = !isDarkMode.value;
  map.setStyle(isDarkMode.value ? 'mapbox://styles/mapbox/dark-v10' : 'mapbox://styles/mapbox/streets-v11');
};

onMounted(() => {
  mapboxgl.accessToken = accessToken;

  // Inicializar el mapa
  map = new mapboxgl.Map({
    container: mapContainer.value!,
    ...mapOptions,
  });

  // Deshabilitar zoom de desplazamiento por defecto
  map.scrollZoom.disable();

  // Añadir controles al mapa
  map.addControl(new mapboxgl.NavigationControl());
  map.addControl(new mapboxgl.FullscreenControl());

  // Añadir control de geolocalización
  const locateControl = new mapboxgl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    showUserHeading: true,
    showAccuracyCircle: true,
  });
  map.addControl(locateControl);

  // Remover atribución del mapa
  map.on('load', () => {
    const attributionControl = map.getContainer().getElementsByClassName('mapboxgl-ctrl-attrib')[0];
    if (attributionControl) {
      attributionControl.parentNode.removeChild(attributionControl);
    }
  });

  // Cambiar cursor cuando se pasa el mouse sobre un marcador o cluster
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

  // Obtener la ubicación del usuario cuando el componente se monta
  locationStore.fetchUserLocation();

  // Observar cambios en los resultados del mapa y actualizar clusters
  watch(
    [mapResults, () => collectionsStore.selectedCategory],
    ([newResults, selectedCategory]) => {
      // Obtener la URL de la imagen del marcador correspondiente a la categoría seleccionada
      const markerImageUrl = categoryMarkerMap[selectedCategory.toLowerCase()] || '/images/map/default-marker.png';

      // Asegurarse de que el mapa esté completamente cargado antes de añadir clusters y marcadores
      if (map.isStyleLoaded()) {
        initializeMap(newResults, markerImageUrl);
      }
    },
    { immediate: true }
  );

  // Añadir eventos de clic
  map.on('click', handleMapClick);
  map.on('click', 'clusters', handleClusterClick);

  // Añadir manejo de eventos para zoom con tecla
  const enableZoomWithKey = (event) => {
    if (event.ctrlKey || event.metaKey) {
      map.scrollZoom.enable();
    } else {
      map.scrollZoom.disable();
      if (event.type === 'wheel') {
        // Mostrar mensaje de instrucción para el usuario
        const message = document.createElement('div');
        message.textContent = 'Mantén presionada la tecla Ctrl (Cmd en Mac) para hacer zoom';
        message.style.position = 'absolute';
        message.style.top = '50%';
        message.style.left = '50%';
        message.style.transform = 'translate(-50%, -50%)';
        message.style.padding = '10px 20px';
        message.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        message.style.color = 'white';
        message.style.borderRadius = '5px';
        message.style.zIndex = '1000';
        mapContainer.value.appendChild(message);

        // Remover el mensaje después de 2 segundos
        setTimeout(() => {
          mapContainer.value.removeChild(message);
        }, 2000);
      }
    }
  };

  // Manejar eventos del mouse y teclado
  mapContainer.value.addEventListener('wheel', enableZoomWithKey);
  mapContainer.value.addEventListener('keydown', enableZoomWithKey);
  mapContainer.value.addEventListener('keyup', enableZoomWithKey);
});

onUnmounted(() => {
  // Limpiar el mapa y los eventos cuando el componente es destruido
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
  position: relative; /* Asegura que el botón se posicione sobre el mapa */
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
  z-index: 2; /* Asegura que el botón esté encima del mapa */
}

.result-card {
  display: flex;
  flex-direction: column;
  width: 200px; /* Ancho del popup */
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.card-image {
  background-size: cover;
  background-position: center;
  height: 120px; /* Altura ajustada para la imagen */
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
  font-size: 1rem; /* Tamaño de fuente ajustado */
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
