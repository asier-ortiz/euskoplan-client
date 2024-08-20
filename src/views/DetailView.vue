<template>
  <div class="detail-view-container">
    <Spinner v-if="loading" :visible="loading" />
    <div v-else class="detail-view-wrapper">

      <!-- Social share buttons for desktop and tablet -->
      <DetailSocialShareButtons :resource="resource" class="social-share-desktop" />

      <div class="detail-view">
        <DetailHeaderButtons
          :goBackHome="goBackHome"
          :handleAddToPlan="openPlanModal"
          :toggleFavorite="toggleFavorite"
          :isFavorite="isFavorite"
        />

        <!-- Social share buttons for mobile -->
        <DetailSocialShareButtons :resource="resource" class="social-share-mobile" />

        <hr class="section-separator" />

        <DetailHeader :resource="resource" :distance="distance" />

        <hr class="section-separator" />

        <DetailContent
          :resource="resource"
          :currentIndex="currentIndex"
          :prevSlide="prevSlide"
          :nextSlide="nextSlide"
          :formatDate="formatDate"
          @galleryClosed="handleGalleryClosed"
        />

        <DetailMap :resource="resource" :isDarkMode="isDarkMode" />

        <hr class="section-separator" />

        <DetailRelatedResources
          :relatedResources="relatedResources"
          :formatDate="formatDate"
          :navigateToResource="navigateToResource"
          :handleRelatedImageError="handleRelatedImageError"
          :getDefaultImage="getDefaultImage"
        />
      </div>
    </div>
  </div>
  <DetailPlanForm :showModal="showPlanModal" @close="closePlanModal" />
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, computed } from 'vue';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import { useCollectionsStore } from '@/stores/collections';
import { useLocationStore } from '@/stores/location';
import { useFavoritesStore } from '@/stores/favorites';
import { useAuthStore } from '@/stores/auth';
import { useMapStore } from '@/stores/map';
import { calculateDistance } from '@/utils/distance';
import { getDefaultImageUrl } from '@/utils/image';
import Swal from 'sweetalert2';
import Spinner from '@/components/Misc/LoadingSpinner.vue';
import DetailContent from '@/components/Detail/DetailContent.vue';
import DetailMap from '@/components/Detail/DetailMap.vue';
import DetailRelatedResources from '@/components/Detail/DetailRelatedResources.vue';
import DetailHeader from '@/components/Detail/DetailHeader.vue';
import DetailHeaderButtons from '@/components/Detail/DetailHeaderButtons.vue';
import DetailSocialShareButtons from '@/components/Detail/DetailSocialShareButtons.vue';
import DetailPlanForm from '@/components/Detail/DetailPlanForm.vue';
import { updateMetaTags } from '@/utils/meta';

const route = useRoute();
const router = useRouter();
const collectionsStore = useCollectionsStore();
const locationStore = useLocationStore();
const favoritesStore = useFavoritesStore();
const authStore = useAuthStore();
const mapStore = useMapStore();

const resource = ref<any>(null);
const currentIndex = ref<number>(0);
const loading = ref<boolean>(true);
const relatedResources = ref<any[]>([]);
const isDarkMode = ref(mapStore.mapMode);
const showPlanModal = ref(false);

let lastFullPath = '';

onBeforeRouteLeave((to, from, next) => {
  if (from.name === 'Detail') {
    mapStore.setReturningFromDetail(true);
  }
  next();
});

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
  () => route.path,
  async (newPath, oldPath) => {
    if (newPath !== oldPath) {
      await fetchResource();

      const imageTitle = resource.value.imagenes && resource.value.imagenes[0]?.titulo
        ? ` - ${resource.value.imagenes[0].titulo}`
        : '';

      updateMetaTags({
        title: resource.value.nombre || 'Recurso en Euskoplan',
        description: `${resource.value.descripcion || 'Descubre este recurso en Euskoplan.'}${imageTitle}`,
        image: resource.value.imagenes && resource.value.imagenes[0]
          ? resource.value.imagenes[0].fuente
          : `${window.location.origin}/images/default-image.jpg`,
        url: `${window.location.origin}${newPath}`,
      });
    }
  }
);

const fetchResource = async () => {
  loading.value = true;
  const { id, category } = route.params;
  const language = 'es';

  if (collectionsStore.currentDetail && collectionsStore.currentDetail.id === Number(id) && collectionsStore.currentDetail.coleccion === category) {
    resource.value = collectionsStore.currentDetail;
  } else {
    await collectionsStore.fetchResourceById(category, Number(id), language);
    resource.value = collectionsStore.currentDetail;
  }

  await collectionsStore.fetchRelatedResources(category, language);
  relatedResources.value = collectionsStore.relatedResources;

  relatedResources.value.forEach((related) => {
    if (locationStore.userLocation && related.longitud && related.latitud) {
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

    updateMetaTags({
      title: resource.value.nombre || 'Recurso en Euskoplan',
      description: resource.value.descripcion || 'Descubre este recurso en Euskoplan.',
      image: resource.value.imagenes && resource.value.imagenes[0] ? resource.value.imagenes[0].fuente : `${window.location.origin}/images/default-image.jpg`,
      url: window.location.href,
    });
  }
};

const openPlanModal = () => {
  showPlanModal.value = true;
};

const closePlanModal = () => {
  showPlanModal.value = false;
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
  return getDefaultImageUrl(collection);
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

const handleGalleryClosed = () => {
  console.log('Gallery closed');
};

onMounted(() => {
  lastFullPath = route.fullPath.split('#')[0];
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
  align-items: flex-start;
  padding: 1rem;
}

.detail-view-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
  position: relative;
}

.detail-view {
  flex: 1;
  padding: 2rem;
  font-family: 'Arial', sans-serif;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 960px;
  box-sizing: border-box;
}

.section-separator {
  border: none;
  border-top: 2px dotted #8bbcd7;
  margin: 2rem 0;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9f9f9;
}

.social-share-desktop {
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 20px;
  left: 20px;
  gap: 10px;
  z-index: 2000;
}

.social-share-mobile {
  display: none;
}

@media (max-width: 900px) {
  .social-share-desktop {
    display: none;
  }

  .social-share-mobile {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 10px;
    margin-top: 10px;
  }
}
</style>
