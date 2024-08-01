<template>
  <div class="detail-view-container">
    <Spinner v-if="loading" :visible="loading" />
    <div v-else class="detail-view">
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useCollectionsStore } from '@/stores/collections';
import mapboxgl from 'mapbox-gl';
import Spinner from '@/components/Spinner.vue';

mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'; // Reemplaza con tu token de Mapbox

// Get the current route
const route = useRoute();

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

// Fetch the resource based on the ID and category from the route parameters
const fetchResource = async () => {
  const { id, category } = route.params;
  const language = 'es'; // Replace with the desired language

  await collectionsStore.fetchResourceById(category, Number(id), language);
  resource.value = collectionsStore.currentDetail;

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
</style>
