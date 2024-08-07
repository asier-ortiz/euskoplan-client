<!-- DetailHeader.vue -->
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
    <p v-if="distance !== null">
      <font-awesome-icon icon="location-dot" class="location-icon" />
      {{ distance.toFixed(2) }} km
    </p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  resource: any;
  distance: number | null;
}>();
</script>

<style scoped>
.detail-header {
  text-align: center;
  margin: 2rem auto; /* Consistent margin for alignment and spacing */
  width: 100%;
  max-width: 600px; /* Align with content and map width */
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
  color: #007bff;
  margin-top: 0.5rem;
}
</style>
