<template>
  <div class="result-card">
    <div class="card-image" :style="{ backgroundImage: `url(${imageSrc})` }" />
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
import { defineProps } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const props = defineProps<{
  imageSrc: string;
  subtype: string;
  title: string;
  municipality: string;
  distance: string;
  collection: string;
  code: string;
}>();
</script>

<style scoped>
.result-card {
  display: flex;
  flex-direction: column;
  width: 250px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.card-image {
  background-size: cover;
  background-position: center;
  height: 80px;
  position: relative;
}

.card-content {
  padding: 10px;
  text-align: center;
}

.card-content h3 {
  margin: 0 0 5px;
  font-size: 0.6rem;
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
  font-size: 0.7rem;
  color: #333333;
  font-weight: bold;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-content p {
  margin: 5px 0;
  font-size: 0.7rem;
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
</style>
