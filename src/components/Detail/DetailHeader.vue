<template>
  <div class="detail-header">
    <h1>{{ resource.nombre }}</h1>
    <h2>
      {{
        resource.nombre_subtipo_recurso ||
        resource.nombre_subtipo_recurso_espacio_natural ||
        resource.nombre_subtipo_recurso_playas_pantanos_rios
      }}
    </h2>
    <p v-if="resource.nombre_municipio" class="municipio-text">
      {{ resource.nombre_municipio }}
    </p>
    <p v-if="distance !== null">
      <font-awesome-icon icon="location-dot" class="location-icon" />
      {{ distance.toFixed(2) }} km
    </p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

defineProps<{
  resource: any;
  distance: number | null;
}>();
</script>

<style scoped>
.detail-header {
  position: relative; /* Allows positioning of the pseudo-element */
  text-align: center;
  margin: 2rem auto;
  width: 100%;
  max-width: 600px;
  z-index: 1; /* Ensures text is above the background */
}

.detail-header::before {
  content: '';
  position: absolute;
  top: -20%;
  left: 50%;
  transform: translateX(-50%);
  width: 200%; /* Extend more towards the sides */
  height: 140%; /* Extend a bit more towards the bottom */
  background: radial-gradient(
    circle at center,
    rgba(240, 220, 250, 0.2) 0%,
    rgba(240, 220, 250, 0.1) 40%,
    transparent 80%
  );
  border-radius: 50%; /* Creates a more organic, cloud-like shape */
  z-index: 0;
  pointer-events: none; /* Ensures background doesn't interfere with interactions */
}

.detail-header h1,
.detail-header h2,
.detail-header p {
  position: relative; /* Keeps text above the background */
  z-index: 1;
}

.detail-header h1 {
  font-size: 2.2rem;
  color: #333;
  margin: 0.5rem 0;
}

.detail-header h2 {
  font-size: 1.3rem;
  color: #666;
  margin: 0.5rem 0;
}

.detail-header p {
  font-size: 1rem;
  color: #555555;
  margin-top: 0.5rem;
}

.location-icon {
  margin-right: 0.5rem;
  color: #007bff;
}

.municipio-text {
  font-size: 1rem;
  color: #555555;
  margin-top: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}
</style>
