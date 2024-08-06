<template>
  <div class="detail-view-container">
    <Spinner v-if="loading" :visible="loading" />
    <div v-else class="detail-view">
      <div class="header-buttons">
        <!-- Back to Home Button -->
        <button @click="goBackHome" class="header-button">
          ← Inicio
        </button>
        <div class="action-buttons">
          <!-- Add to Plan Button -->
          <button class="header-button" @click="handleAddToPlan">
            <font-awesome-icon :icon="['fas', 'map']" /> Añadir al Plan
          </button>
          <!-- Favorite Button -->
          <button @click="toggleFavorite" class="header-button">
            <font-awesome-icon :icon="[isFavorite ? 'fas' : 'far', 'heart']" />
            {{ isFavorite ? 'Eliminar de Favoritos' : 'Añadir a Favoritos' }}
          </button>
        </div>
      </div>

      <hr class="section-separator" />

      <div class="detail-header">
        <h1>{{ resource.nombre }}</h1>
        <h2>
          {{
            resource.nombre_subtipo_recurso ||
            resource.nombre_subtipo_recurso_espacio_natural ||
            resource.nombre_subtipo_recurso_playas_pantanos_rios
          }}
        </h2>
        <!-- Display distance from the user -->
        <p v-if="distance !== null">
          <font-awesome-icon icon="location-dot" class="location-icon" />
          {{ distance.toFixed(2) }} km
        </p>
      </div>

      <hr class="section-separator" />

      <div class="detail-content">
        <!-- Carousel or Single Image Display -->
        <div
          v-if="resource.imagenes && resource.imagenes.length > 1"
          class="detail-carousel"
        >
          <div class="carousel-container">
            <div
              class="carousel-slide"
              :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
            >
              <div
                v-for="(imagen, index) in resource.imagenes"
                :key="index"
                class="carousel-image"
              >
                <img
                  :src="imagen.fuente"
                  :alt="imagen.titulo || 'Imagen del recurso'"
                />
              </div>
            </div>
          </div>
          <button
            v-if="currentIndex > 0"
            @click="prevSlide"
            class="carousel-button prev-button"
          >
            ‹
          </button>
          <button
            v-if="currentIndex < resource.imagenes.length - 1"
            @click="nextSlide"
            class="carousel-button next-button"
          >
            ›
          </button>
        </div>

        <!-- Single Image Display -->
        <div
          v-else-if="resource.imagenes && resource.imagenes.length === 1"
          class="single-image"
        >
          <img
            :src="resource.imagenes[0].fuente"
            :alt="resource.imagenes[0].titulo || 'Imagen del recurso'"
          />
        </div>

        <hr class="section-separator" />

        <!-- Description -->
        <p v-html="resource.descripcion" class="description"></p>

        <hr class="section-separator" />

        <!-- Dynamic Resource Information -->
        <div class="dynamic-info">
          <p v-if="resource.direccion">
            <strong>Dirección:</strong> {{ resource.direccion }}
          </p>
          <p v-if="resource.codigo_postal">
            <strong>Código Postal:</strong> {{ resource.codigo_postal }}
          </p>
          <p v-if="resource.numero_telefono">
            <strong>Teléfono:</strong> {{ resource.numero_telefono }}
          </p>
          <p v-if="resource.email"><strong>Email:</strong> {{ resource.email }}</p>
          <p v-if="resource.pagina_web">
            <strong>Sitio Web:</strong>
            <a :href="resource.pagina_web" target="_blank">{{
                resource.pagina_web
              }}</a>
          </p>

          <!-- Accommodation Specific Fields -->
          <template v-if="resource.coleccion === 'accommodation'">
            <p v-if="resource.categoria">
              <strong>Categoría:</strong> {{ resource.categoria }}
            </p>
            <p v-if="resource.capacidad">
              <strong>Capacidad:</strong> {{ resource.capacidad }}
            </p>
            <p v-if="resource.anno_apertura">
              <strong>Año de Apertura:</strong> {{ resource.anno_apertura }}
            </p>
            <p v-if="resource.num_hab_individuales">
              <strong>Habitaciones Individuales:</strong>
              {{ resource.num_hab_individuales }}
            </p>
            <p v-if="resource.num_hab_dobles">
              <strong>Habitaciones Dobles:</strong> {{ resource.num_hab_dobles }}
            </p>
          </template>

          <!-- Cultural Specific Fields -->
          <template v-if="resource.coleccion === 'cultural'">
            <p v-if="resource.tipo_monumento">
              <strong>Tipo de Monumento:</strong> {{ resource.tipo_monumento }}
            </p>
            <p v-if="resource.estilo_artistico">
              <strong>Estilo Artístico:</strong> {{ resource.estilo_artistico }}
            </p>
          </template>

          <!-- Event Specific Fields -->
          <template v-if="resource.coleccion === 'event'">
            <p v-if="resource.fecha_inicio">
              <strong>Fecha de Inicio:</strong>
              {{ formatDate(resource.fecha_inicio) }}
            </p>
            <p v-if="resource.fecha_fin">
              <strong>Fecha de Fin:</strong> {{ formatDate(resource.fecha_fin) }}
            </p>
          </template>

          <!-- Fair Specific Fields -->
          <template v-if="resource.coleccion === 'fair'">
            <p v-if="resource.atracciones">
              <strong>Atracciones:</strong> {{ resource.atracciones }}
            </p>
            <p v-if="resource.horario">
              <strong>Horario:</strong> <span v-html="resource.horario"></span>
            </p>
          </template>

          <!-- Natural Specific Fields -->
          <template v-if="resource.coleccion === 'natural'">
            <p v-if="resource.actividades">
              <strong>Actividades:</strong>
              <span v-html="resource.actividades"></span>
            </p>
          </template>

          <!-- Restaurant Specific Fields -->
          <template v-if="resource.coleccion === 'restaurant'">
            <p v-if="resource.capacidad">
              <strong>Capacidad:</strong> {{ resource.capacidad }}
            </p>
          </template>
        </div>

        <hr class="section-separator" />

        <!-- Services Section -->
        <div
          v-if="resource.servicios && resource.servicios.length > 0"
          class="detail-services"
        >
          <h3>Servicios</h3>
          <div class="service-tags">
            <span
              v-for="(service, index) in resource.servicios"
              :key="index"
              class="service-tag"
            >{{ service.nombre }}</span
            >
          </div>
        </div>

        <hr class="section-separator" />

        <!-- Map Display -->
        <div v-if="resource.latitud && resource.longitud" class="detail-map">
          <div ref="mapContainer" class="map-container"></div>
        </div>

        <hr class="section-separator" />

        <!-- Related Resources Section -->
        <div class="related-resources" v-if="relatedResources.length > 0">
          <h3>Recursos Relacionados</h3>
          <div class="related-cards">
            <div
              v-for="(related, index) in relatedResources"
              :key="index"
              class="result-card"
              @click="navigateToResource(related)"
            >
              <div
                class="card-image"
                :style="{ backgroundImage: `url(${related.imagenes[0]?.fuente || getDefaultImage(related.coleccion)})` }"
              >
                <img
                  :src="related.imagenes[0]?.fuente || getDefaultImage(related.coleccion)"
                  alt="Imagen del recurso relacionado"
                  class="hidden-image"
                  @error="handleRelatedImageError(index)"
                />
                <!-- Event Date Overlay -->
                <div v-if="related.coleccion.toLowerCase() === 'event'" class="event-date">{{ formatDate(related.fecha_inicio) }}</div>
              </div>
              <div class="card-content">
                <h3>
                  {{
                    related.nombre_subtipo_recurso ||
                    related.nombre_subtipo_recurso_espacio_natural ||
                    related.nombre_subtipo_recurso_playas_pantanos_rios ||
                    'Sin subtipo'
                  }}
                </h3> <!-- Mostrar subtipo utilizando la misma lógica -->
                <h2>{{ related.nombre }}</h2>
                <p v-if="related.nombre_municipio" class="municipio-text">{{ related.nombre_municipio }}</p>
                <p v-if="related.distancia !== null">
                  <font-awesome-icon icon="location-dot" class="location-icon" />
                  {{ related.distancia.toFixed(2) }} km
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCollectionsStore } from '@/stores/collections';
import { useLocationStore } from '@/stores/location';
import { useFavoritesStore } from '@/stores/favorites'; // Import Favorites Store
import { useAuthStore } from '@/stores/auth'; // Import Auth Store
import { calculateDistance } from '@/utils/distance';
import mapboxgl from 'mapbox-gl';
import Swal from 'sweetalert2';
import Spinner from '@/components/Spinner.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'; // Import FontAwesomeIcon

mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'; // Replace with your Mapbox access token

// Get the current route and router
const route = useRoute();
const router = useRouter();

// Access your collections store
const collectionsStore = useCollectionsStore();
const locationStore = useLocationStore(); // Access location store
const favoritesStore = useFavoritesStore(); // Access favorites store
const authStore = useAuthStore(); // Access auth store

// Define a ref to store the current resource
const resource = ref<any>(null);

// Define a ref to store the current slide index
const currentIndex = ref<number>(0);

// Define a ref to store the map container
const mapContainer = ref<HTMLDivElement | null>(null);

// Define loading state
const loading = ref<boolean>(true);

// Define a ref for related resources
const relatedResources = ref<any[]>([]);

// Compute distance
const distance = computed(() => {
  if (
    locationStore.userLocation &&
    resource.value &&
    resource.value.longitud &&
    resource.value.latitud
  ) {
    return calculateDistance(
      locationStore.userLocation.latitude,
      locationStore.userLocation.longitude,
      Number(resource.value.latitud),
      Number(resource.value.longitud)
    );
  }
  return null;
});

// Compute if the resource is a favorite (only when authenticated)
const isFavorite = computed(() => {
  if (!authStore.isLoggedIn()) {
    return false; // Do not compute favorites if not authenticated
  }
  return favoritesStore.isFavorite(resource.value?.id, resource.value?.coleccion);
});

// Watch for changes in route params and refetch resources
watch(
  () => [route.params.id, route.params.category],
  () => {
    fetchResource();
  }
);

// Fetch the resource based on the ID and category from the route parameters
const fetchResource = async () => {
  loading.value = true;
  const { id, category } = route.params;
  const language = 'es'; // Replace with the desired language

  await collectionsStore.fetchResourceById(category, Number(id), language);
  resource.value = collectionsStore.currentDetail;

  // Fetch related resources
  await collectionsStore.fetchRelatedResources(category, language);
  relatedResources.value = collectionsStore.relatedResources;

  // Calculate distance for related resources
  relatedResources.value.forEach((related) => {
    if (
      locationStore.userLocation &&
      related.longitud &&
      related.latitud
    ) {
      related.distancia = calculateDistance(
        locationStore.userLocation.latitude,
        locationStore.userLocation.longitude,
        Number(related.latitud),
        Number(related.longitud)
      );
    }
  });

  // Set loading to false once the resource is loaded
  loading.value = false;

  // Ensure map initialization after the DOM is updated
  if (resource.value && resource.value.latitud && resource.value.longitud) {
    await nextTick();
    initializeMap();
  }
};

// Initialize the map
const initializeMap = () => {
  if (mapContainer.value) {
    const map = new mapboxgl.Map({
      container: mapContainer.value,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [parseFloat(resource.value.longitud), parseFloat(resource.value.latitud)],
      zoom: 14
    });

    new mapboxgl.Marker()
      .setLngLat([parseFloat(resource.value.longitud), parseFloat(resource.value.latitud)])
      .addTo(map);
  }
};

// Fetch the resource when the component is mounted
onMounted(() => {
  fetchResource();
  if (authStore.isLoggedIn()) {
    favoritesStore.fetchFavorites(); // Fetch favorites only if authenticated
  }
});

// Toggle favorite status
const toggleFavorite = () => {
  if (!authStore.isLoggedIn()) {
    Swal.fire({
      icon: 'info',
      title: 'Necesitas iniciar sesión',
      text: 'Regístrate o inicia sesión para poder guardar este recurso en tus favoritos.',
      confirmButtonText: 'Iniciar sesión',
    }).then(() => {
      router.push('/auth/login'); // Navigate to login page
    });
    return;
  }

  if (!isFavorite.value) {
    favoritesStore.addFavorite(resource.value.id, resource.value.coleccion);
  } else {
    const favoriteId = favoritesStore.getFavoriteId(resource.value.id, resource.value.coleccion);
    if (favoriteId) {
      favoritesStore.removeFavorite(favoriteId);
    }
  }
};

// Handle add to plan action
const handleAddToPlan = () => {
  if (!authStore.isLoggedIn()) {
    Swal.fire({
      icon: 'info',
      title: 'Necesitas iniciar sesión',
      text: 'Regístrate o inicia sesión para poder añadir este recurso a tu plan.',
      confirmButtonText: 'Iniciar sesión',
    }).then(() => {
      router.push('/auth/login'); // Navigate to login page
    });
  } else {
    // Add to plan logic here
    Swal.fire({
      icon: 'success',
      title: 'Añadido al plan',
      text: 'Este recurso ha sido añadido a tu plan.',
    });
  }
};

// Functions to navigate the carousel
const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

const nextSlide = () => {
  if (currentIndex.value < resource.value.imagenes.length - 1) {
    currentIndex.value++;
  }
};

// Navigate to a related resource detail page
const navigateToResource = (related: any) => {
  router.push({ name: 'Detail', params: { id: Number(related.codigo), category: related.coleccion } });
};

// Function to get a default image based on the collection type
const getDefaultImage = (collection: string) => {
  const defaultImages = {
    accommodation: '/images/default/default-accommodation.jpg',
    cave: '/images/default/default-cave.jpg',
    cultural: '/images/default/default-cultural.jpg',
    event: '/images/default/default-event.jpg',
    fair: '/images/default/default-fair.jpg',
    museum: '/images/default/default-museum.jpg',
    natural: '/images/default/default-natural.jpg',
    restaurant: '/images/default/default-restaurant.jpg',
    default: '/images/default/default-image.jpg',
  };

  return defaultImages[collection.toLowerCase()] || defaultImages.default;
};

// Function to navigate back to the home page
const goBackHome = () => {
  router.push({ name: 'Home' }); // Use push to navigate directly to the Home page
};

// Function to format the date from the API
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

// Handle image loading errors for related resources
const handleRelatedImageError = (index: number) => {
  relatedResources.value[index].imagenes[0].fuente = getDefaultImage(relatedResources.value[index].coleccion);
};
</script>

<style scoped>
.detail-view-container {
  position: relative;
  min-height: 100vh; /* Ensure full height to center spinner vertically */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.detail-view {
  padding: 2rem;
  font-family: 'Arial', sans-serif;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 960px; /* Reduced max-width for a narrower view */
  width: 90%;
  margin: 2rem auto;
  position: relative; /* Added to contain the button */
  box-sizing: border-box;
}

.header-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.header-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.header-button:hover {
  background-color: #0056b3;
}

.header-button svg {
  margin-right: 0.5rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.detail-header {
  text-align: center;
  margin-bottom: 2rem;
}

.detail-header h1 {
  font-size: 2.2rem; /* Slightly reduced for better fit */
  color: #333;
  margin: 0.5rem 0;
}

.detail-header h2 {
  font-size: 1.3rem; /* Slightly reduced for better fit */
  color: #666;
  margin: 0.5rem 0;
}

.detail-header p {
  font-size: 1rem;
  color: #007bff;
  margin-top: 0.5rem;
}

.section-separator {
  border: none;
  border-top: 1px solid #ddd;
  margin: 1.5rem 0;
}

.detail-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.detail-carousel {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin-bottom: 1rem;
  overflow: hidden;
  border-radius: 8px;
}

.carousel-container {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.carousel-slide {
  display: flex;
}

.carousel-image {
  min-width: 100%;
  transition: transform 0.5s ease-in-out;
}

.carousel-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.single-image {
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 600px;
  margin-bottom: 1rem;
}

.single-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.carousel-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 1rem;
  cursor: pointer;
  z-index: 1;
  font-size: 2rem;
}

.prev-button {
  left: 0;
}

.next-button {
  right: 0;
}

.description {
  text-align: justify;
  font-size: 1rem; /* Slightly reduced for better fit */
  line-height: 1.6;
  color: #444;
  margin: 1rem 0;
}

.dynamic-info {
  margin-top: 1rem;
  text-align: left;
  width: 100%;
  font-size: 0.95rem; /* Slightly reduced for better fit */
  color: #333;
}

.dynamic-info p {
  margin: 0.5rem 0;
}

.dynamic-info a {
  color: #007bff;
  text-decoration: none;
}

.dynamic-info a:hover {
  text-decoration: underline;
}

.detail-services {
  margin-top: 2rem;
  text-align: center;
}

.detail-services h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.service-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.service-tag {
  background-color: #e9ecef;
  color: #555;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
}

.detail-map {
  width: 100%;
  max-width: 600px;
  margin-top: 2rem;
}

.map-container {
  width: 100%;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9f9f9;
}

/* Related Resources Styling */
.related-resources {
  width: 100%;
  margin-top: 2rem;
}

.related-resources h3 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
}

.related-cards {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.result-card {
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 320px; /* Increased height for more visual appeal */
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s; /* Added transition effects */
  cursor: pointer;
  background-color: white; /* Background color for the card */
}

.result-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.card-image {
  flex: 2;
  background-size: cover;
  background-position: center;
  height: 60%;
  position: relative;
  border-bottom: 1px solid #ddd; /* Divider between image and content */
}

.hidden-image {
  display: none;
}

.card-content {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffff; /* White background for card content */
  text-align: center; /* Center align content */
}

.card-content h3 {
  margin: 0 0 0.25rem; /* Add margin-bottom for spacing */
  font-size: 0.8rem; /* Smaller font size for subtype text */
  color: #666666; /* Gray color for the subtype text */
  text-transform: uppercase;
  font-weight: normal;
  letter-spacing: 0.5px; /* Add letter spacing for a cleaner look */
}

.card-content h2 {
  margin: 0 0 0.5rem; /* Add margin-bottom for spacing */
  font-size: 1.4rem; /* Slightly reduced font size for better balance */
  color: #333333; /* Darker color for the name text */
  font-weight: bold;
  line-height: 1.2; /* Improved line spacing */
}

.card-content p {
  margin: 0.25rem 0; /* Ensure some margin for the municipio text */
  font-size: 1rem; /* Adjust font size for municipio and distance text */
  color: #555555; /* Slightly lighter color for text */
}

.card-content .location-icon {
  margin-right: 0.5rem; /* Space between icon and text */
  color: #007bff; /* Color for the location icon */
}

.card-content h3,
.card-content h2 {
  transition: color 0.3s; /* Smooth color transition */
}

.result-card:hover .card-content h2 {
  color: #007bff; /* Highlight title on hover */
}

/* Add a style for limiting municipio text to 3 lines */
.municipio-text {
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Limit to 3 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}

/* Style for the event date overlay */
.event-date {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 5px;
  border-radius: 5px;
  font-size: 0.8rem;
}

/* Media Queries */
@media (max-width: 768px) {
  .detail-header h1 {
    font-size: 2rem;
  }

  .detail-header h2 {
    font-size: 1.2rem;
  }

  .detail-content {
    padding: 0 1rem;
  }

  .dynamic-info {
    font-size: 0.9rem;
  }

  .service-tag {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .header-buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .header-button {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .carousel-button {
    font-size: 1.5rem;
  }

  .detail-header h1 {
    font-size: 1.8rem;
  }

  .detail-header h2 {
    font-size: 1rem;
  }
}
</style>
