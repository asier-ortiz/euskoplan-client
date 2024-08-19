<template>
  <div class="result-card">
    <button class="close-btn" @click="$emit('close')">×</button>
    <div class="card-image">
      <img
          :src="imageUrl"
          @load="handleImageLoad"
          @error="handleImageError"
          class="popup-image"
          alt="Image of {{ title }}"
      />
      <div v-if="!imageLoaded" class="skeleton-loader"></div> <!-- Skeleton loader -->
    </div>
    <div class="card-content">
      <h3 class="popup-subtype">{{ subtype }}</h3>
      <h2 class="popup-title">{{ title }}</h2>
      <p class="municipio-text">{{ municipality }}</p>
      <p class="distance-text">
        <font-awesome-icon icon="location-dot" class="location-icon" /> {{ distance }} km
      </p>
      <router-link :to="`/detail/${collection}/${code}`" class="btn btn-sm btn-primary mt-1 w-100">
        Ver Detalles
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, watch } from 'vue';
import { getDefaultImageUrl } from '@/utils/image';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const props = defineProps<{
  imageSrc: string;
  subtype: string;
  title: string;
  municipality: string;
  distance: string;
  collection: string;
  code: string;
}>();

const imageUrl = ref('');
const imageLoaded = ref(false);

const setInitialImage = () => {
  imageUrl.value = props.imageSrc || getDefaultImageUrl(props.collection);
};

const handleImageLoad = () => {
  imageLoaded.value = true;
};

const handleImageError = () => {
  imageUrl.value = getDefaultImageUrl(props.collection);
  imageLoaded.value = true; // Hide skeleton if error occurs
};

watch(
    () => props.imageSrc,
    () => setInitialImage(),
    { immediate: true }
);

</script>

<style scoped>
.result-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: white;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #007bff; /* Blue background for close button */
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 5;
}

.close-btn:hover {
  background-color: #0056b3; /* Darker blue */
}

.card-image {
  background-size: cover;
  background-position: center;
  height: 120px;
  position: relative;
}

.popup-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.skeleton-loader {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  position: absolute;
  top: 0;
  left: 0;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-content h2 {
  margin: 0 0 10px;
  font-size: 0.9rem;
  color: #333333;
  font-weight: bold;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-content p {
  margin: 5px 0;
  font-size: 0.8rem;
  color: #555555;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.location-icon {
  margin-right: 5px;
  color: #007bff;
}

.municipio-text {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}

@media screen and (max-width: 768px) {
  .card-image {
    height: 80px;
  }

  .card-content h3 {
    font-size: 0.7rem;
  }

  .card-content h2 {
    font-size: 0.8rem;
  }

  .card-content p {
    font-size: 0.7rem;
  }
}
</style>
