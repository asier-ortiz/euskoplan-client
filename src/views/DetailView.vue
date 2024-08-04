<template>
  <div class="detail-view-container">
    <Spinner v-if="loading" :visible="loading" />
    <div v-else class="detail-view">
      <!-- Back to Home Button -->
      <button @click="goBackHome" class="back-home-button">
        ← Home
      </button>
      <div class="detail-header">
        <h1>{{ resource.nombre }}</h1>
        <h2>{{ resource.coleccion }}</h2>
      </div>
      <div class="detail-content">
        <div v-if="resource.imagenes && resource.imagenes.length > 1" class="detail-carousel">
          <div class="carousel-container">
            <div class="carousel-slide" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
              <div v-for="(imagen, index) in resource.imagenes" :key="index" class="carousel-image">
                <img :src="imagen.fuente" alt="Resource image" />
              </div>
            </div>
          </div>
          <button v-if="currentIndex > 0" @click="prevSlide" class="carousel-button prev-button">‹</button>
          <button v-if="currentIndex < resource.imagenes.length - 1" @click="nextSlide" class="carousel-button next-button">›</button>
        </div>

        <div v-else-if="resource.imagenes && resource.imagenes.length === 1" class="single-image">
          <img :src="resource.imagenes[0].fuente" alt="Resource image" />
        </div>

        <p v-html="resource.descripcion" class="description"></p>
        <div class="detail-info">
          <p><strong>Address:</strong> {{ resource.direccion }}</p>
          <p><strong>Phone:</strong> {{ resource.numero_telefono }}</p>
          <p><strong>Email:</strong> {{ resource.email }}</p>
          <p><strong>Website:</strong> <a :href="resource.pagina_web" target="_blank">{{ resource.pagina_web }}</a></p>
        </div>
        <div v-if="resource.servicios && resource.servicios.length > 0" class="detail-services">
          <h3>Services</h3>
          <ul>
            <li v-for="(service, index) in resource.servicios" :key="index">{{ service.nombre }}</li>
          </ul>
        </div>
        <div v-if="resource.latitud && resource.longitud" class="detail-map">
          <div ref="mapContainer" class="map-container"></div>
        </div>

        <!-- New Related Resources Section -->
        <div class="related-resources" v-if="relatedResources.length > 0">
          <h3>Related Resources</h3>
          <div class="related-cards">
            <div
              v-for="(related, index) in relatedResources"
              :key="index"
              class="related-card"
              @click="navigateToResource(related)"
            >
              <img :src="related.imagenes[0]?.fuente || getDefaultImage(related.coleccion)" alt="Related resource image" />
              <div class="related-content">
                <h4>{{ related.nombre }}</h4>
                <p>{{ related.nombre_municipio }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCollectionsStore } from '@/stores/collections';
import mapboxgl from 'mapbox-gl';
import Spinner from '@/components/Spinner.vue';

mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'; // Replace with your Mapbox access token

// Get the current route and router
const route = useRoute();
const router = useRouter();

// Access your collections store
const collectionsStore = useCollectionsStore();

// Define a ref to store the current resource
const resource = ref(null);

// Define a ref to store the current slide index
const currentIndex = ref(0);

// Define a ref to store the map container
const mapContainer = ref(null);

// Define loading state
const loading = ref(true);

// Define a ref for related resources
const relatedResources = ref([]);

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
});

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
const navigateToResource = (related) => {
  router.push({ name: 'Detail', params: { id: Number(related.codigo), category: related.coleccion } });
};

// Function to get a default image based on the collection type
const getDefaultImage = (collection) => {
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
</script>

<style scoped>
.detail-view-container {
  position: relative;
  min-height: 100vh; /* Ensure full height to center spinner vertically */
  display: flex;
  justify-content: center;
  align-items: center;
}

.detail-view {
  padding: 2rem;
  font-family: 'Arial', sans-serif;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 2rem auto;
  position: relative; /* Added to contain the button */
}

.detail-header {
  text-align: center;
  margin-bottom: 2rem;
}

.detail-header h1 {
  font-size: 2.5rem;
  color: #333;
}

.detail-header h2 {
  font-size: 1.5rem;
  color: #666;
}

.back-home-button {
  position: fixed; /* Use fixed positioning to make it appear at the top left of the viewport */
  top: 10px; /* Adjust the top position */
  left: 10px; /* Adjust the left position */
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
  z-index: 10; /* Ensure the button is on top */
}

.back-home-button:hover {
  background-color: #0056b3;
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

.single-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 1rem;
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
  font-size: 1.1rem;
  line-height: 1.6;
  color: #444;
  margin: 1rem 0;
}

.detail-info {
  margin-top: 1rem;
  text-align: center;
}

.detail-info p {
  margin: 0.5rem 0;
  font-size: 1rem;
  color: #333;
}

.detail-info a {
  color: #007bff;
  text-decoration: none;
}

.detail-info a:hover {
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

.detail-services ul {
  list-style-type: none;
  padding: 0;
}

.detail-services li {
  font-size: 1rem;
  color: #666;
  margin: 0.5rem 0;
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
}

.related-card {
  width: 200px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  background-color: white;
  transition: transform 0.3s;
}

.related-card:hover {
  transform: translateY(-5px);
}

.related-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.related-content {
  padding: 0.5rem;
  text-align: center;
}

.related-content h4 {
  font-size: 1.2rem;
  color: #333;
  margin: 0.5rem 0;
}

.related-content p {
  font-size: 0.9rem;
  color: #666;
}
</style>
