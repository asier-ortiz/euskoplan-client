<template>
  <div class="detail-view-container">
    <Spinner v-if="loading" :visible="loading" />
    <div v-else class="detail-view">
      <!-- Include DetailHeaderButtons Component -->
      <DetailHeaderButtons
        :goBackHome="goBackHome"
        :handleAddToPlan="handleAddToPlan"
        :toggleFavorite="toggleFavorite"
        :isFavorite="isFavorite"
      />

      <hr class="section-separator" />

      <!-- Include DetailHeader Component -->
      <DetailHeader :resource="resource" :distance="distance" />

      <hr class="section-separator" />

      <!-- Include DetailContent Component -->
      <DetailContent
        :resource="resource"
        :currentIndex="currentIndex"
        :prevSlide="prevSlide"
        :nextSlide="nextSlide"
        :formatDate="formatDate"
      />

      <!-- Include DetailMap Component -->
      <DetailMap :resource="resource" :isDarkMode="isDarkMode" />

      <hr class="section-separator" />

      <!-- Include DetailRelatedResources Component -->
      <DetailRelatedResources
        :relatedResources="relatedResources"
        :formatDate="formatDate"
        :navigateToResource="navigateToResource"
        :handleRelatedImageError="handleRelatedImageError"
        :getDefaultImage="getDefaultImage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCollectionsStore } from '@/stores/collections';
import { useLocationStore } from '@/stores/location';
import { useFavoritesStore } from '@/stores/favorites';
import { useAuthStore } from '@/stores/auth';
import { useMapStore } from '@/stores/map'; // Import map store
import { calculateDistance } from '@/utils/distance';
import mapboxgl from 'mapbox-gl';
import Swal from 'sweetalert2';
import Spinner from '@/components/Misc/LoadingSpinner.vue';
import DetailContent from '@/components/Detail/DetailContent.vue';
import DetailMap from '@/components/Detail/DetailMap.vue';
import DetailRelatedResources from '@/components/Detail/DetailRelatedResources.vue';
import DetailHeader from '@/components/Detail/DetailHeader.vue';
import DetailHeaderButtons from '@/components/Detail/DetailHeaderButtons.vue';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const route = useRoute();
const router = useRouter();
const collectionsStore = useCollectionsStore();
const locationStore = useLocationStore();
const favoritesStore = useFavoritesStore();
const authStore = useAuthStore();
const mapStore = useMapStore(); // Use the map store

const resource = ref<any>(null);
const currentIndex = ref<number>(0);
const loading = ref<boolean>(true);
const relatedResources = ref<any[]>([]);
const isDarkMode = ref(mapStore.mapMode); // Use map store for dark mode

let map: mapboxgl.Map | undefined;

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

const isFavorite = computed(() => {
  if (!authStore.isLoggedIn()) {
    return false;
  }
  return favoritesStore.isFavorite(resource.value?.id, resource.value?.coleccion);
});

watch(
  () => [route.params.id, route.params.category],
  () => {
    fetchResource();
  }
);

const fetchResource = async () => {
  loading.value = true;
  const { id, category } = route.params;
  const language = 'es';

  await collectionsStore.fetchResourceById(category, Number(id), language);
  resource.value = collectionsStore.currentDetail;

  await collectionsStore.fetchRelatedResources(category, language);
  relatedResources.value = collectionsStore.relatedResources;

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

  loading.value = false;
  if (resource.value && resource.value.latitud && resource.value.longitud) {
    await nextTick();
  }
};

const toggleFavorite = () => {
  if (!authStore.isLoggedIn()) {
    Swal.fire({
      icon: 'info',
      title: 'Necesitas iniciar sesión',
      text: 'Regístrate o inicia sesión para poder guardar este recurso en tus favoritos.',
      confirmButtonText: 'Iniciar sesión',
    }).then(() => {
      router.push('/auth/login');
    });
    return;
  }

  if (!isFavorite.value) {
    favoritesStore.addFavorite(resource.value.id, resource.value.coleccion);
  } else {
    const favoriteId = favoritesStore.getFavoriteId(
      resource.value.id,
      resource.value.coleccion
    );
    if (favoriteId) {
      favoritesStore.removeFavorite(favoriteId);
    }
  }
};

const handleAddToPlan = () => {
  if (!authStore.isLoggedIn()) {
    Swal.fire({
      icon: 'info',
      title: 'Necesitas iniciar sesión',
      text: 'Regístrate o inicia sesión para poder añadir este recurso a tu plan.',
      confirmButtonText: 'Iniciar sesión',
    }).then(() => {
      router.push('/auth/login');
    });
  } else {
    Swal.fire({
      icon: 'success',
      title: 'Añadido al plan',
      text: 'Este recurso ha sido añadido a tu plan.',
    });
  }
};

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

const navigateToResource = (related: any) => {
  router.push({
    name: 'Detail',
    params: { id: Number(related.codigo), category: related.coleccion },
  });
};

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

const goBackHome = () => {
  router.push({ name: 'Home' });
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

const handleRelatedImageError = (index: number) => {
  relatedResources.value[index].imagenes[0].fuente = getDefaultImage(
    relatedResources.value[index].coleccion
  );
};

onMounted(() => {
  fetchResource();
  if (authStore.isLoggedIn()) {
    favoritesStore.fetchFavorites();
  }
});
</script>

<style scoped>
.detail-view-container {
  position: relative;
  min-height: 100vh;
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
  max-width: 960px;
  width: 90%;
  margin: 2rem auto;
  position: relative;
  box-sizing: border-box;
}

.section-separator {
  border: none;
  border-top: 1px solid #ddd;
  margin: 1.5rem 0;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9f9f9;
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

@media (max-width: 768px) {
  .detail-header h1 {
    font-size: 2rem;
  }

  .detail-header h2 {
    font-size: 1.2rem;
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
}
</style>
