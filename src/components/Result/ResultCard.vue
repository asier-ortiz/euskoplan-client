<template>
  <div class="result-card" :style="{ backgroundImage: `url(${imageUrl})` }">
    <div class="card-content">
      <template v-if="collection">
        <h3>{{ collection }}</h3>
      </template>
      <template v-if="name">
        <h2>{{ name }}</h2>
      </template>
      <img :src="imageUrl" @error="handleImageError" class="hidden-image" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, computed } from 'vue';

const props = defineProps({
  collection: String,
  name: String,
  images: {
    type: Array,
    default: () => [],
  },
});

const defaultImageUrl = 'path/to/default/image.jpg'; // Reemplaza con la URL de tu imagen predeterminada

const imageUrl = ref(props.images.length > 0 ? props.images[0].fuente : defaultImageUrl);

const handleImageError = () => {
  imageUrl.value = defaultImageUrl;
};
</script>

<style scoped>
.result-card {
  width: 300px; /* Ajusta el ancho según tus necesidades */
  height: 150px; /* Ajusta la altura según tus necesidades */
  background-size: cover;
  background-position: center;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 1rem;
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
