<template>
  <div class="result-card" :style="{ backgroundImage: `url(${imageUrl})` }">
    <div class="card-content">
      <h3>{{ collection }}</h3>
      <h2>{{ name }}</h2>
      <img :src="imageUrl" @error="handleImageError" class="hidden-image" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, watch } from 'vue';

const props = defineProps({
  collection: String,
  name: String,
  images: {
    type: Array,
    default: () => [],
  },
});

const getDefaultImageUrl = (collection) => {
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

const imageUrl = ref('');

watch(
  () => props.images,
  (newImages) => {
    if (newImages.length > 0 && newImages[0].fuente) {
      imageUrl.value = newImages[0].fuente;
    } else {
      imageUrl.value = getDefaultImageUrl(props.collection);
    }
  },
  { immediate: true }
);

const handleImageError = () => {
  imageUrl.value = getDefaultImageUrl(props.collection);
};
</script>

<style scoped>
.result-card {
  width: 100%;
  height: 150px; /* Ajusta la altura según tus necesidades */
  background-size: cover;
  background-position: center;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
}

.card-content {
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  color: white;
  padding: 0.5rem;
}

.card-content h3 {
  margin: 0;
  font-size: 1rem;
}

.card-content h2 {
  margin: 0;
  font-size: 1.5rem;
}

.hidden-image {
  display: none;
}
</style>
