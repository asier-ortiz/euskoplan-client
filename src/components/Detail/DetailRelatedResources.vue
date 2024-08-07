<template>
  <div class="related-resources" v-if="relatedResources.length > 0">
    <h3>Puede que también te interese</h3>
    <div class="related-cards">
      <div
        v-for="(related, index) in relatedResources"
        :key="index"
        class="result-card"
        @click="navigateToResource(related)"
      >
        <div
          class="card-image"
          :style="{ backgroundImage: `url(${related.imagenes[0]?.fuente || getDefaultImage(related.coleccion)})` }"
        >
          <img
            :src="related.imagenes[0]?.fuente || getDefaultImage(related.coleccion)"
            alt="Imagen del recurso relacionado"
            class="hidden-image"
            @error="handleRelatedImageError(index)"
          />
          <div v-if="related.coleccion.toLowerCase() === 'event'" class="event-date">
            {{ formatDate(related.fecha_inicio) }}
          </div>
        </div>
        <div class="card-content">
          <h3>
            {{
              related.nombre_subtipo_recurso ||
              related.nombre_subtipo_recurso_espacio_natural ||
              related.nombre_subtipo_recurso_playas_pantanos_rios ||
              'Sin subtipo'
            }}
          </h3>
          <h2>{{ related.nombre }}</h2>
          <p v-if="related.nombre_municipio" class="municipio-text">{{ related.nombre_municipio }}</p>
          <p v-if="related.distancia !== null">
            <font-awesome-icon icon="location-dot" class="location-icon" />
            {{ related.distancia.toFixed(2) }} km
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  relatedResources: any[];
  formatDate: (date: string) => string;
  navigateToResource: (resource: any) => void;
  handleRelatedImageError: (index: number) => void;
  getDefaultImage: (collection: string) => string;
}>();
</script>

<style scoped>
.related-resources {
  width: 100%;
  margin-top: 3rem;
  padding-bottom: 2rem; /* Add padding to increase space after the heading */
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
  flex-wrap: wrap;
  padding-top: 1rem; /* Add padding to increase space between heading and cards */
}


.result-card {
  display: flex;
  flex-direction: column;
  width: 240px; /* Made wider for better visual appearance */
  height: 320px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  background-color: white;
}

.result-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.card-image {
  flex: 2;
  background-size: cover;
  background-position: center;
  height: 60%;
  position: relative;
  border-bottom: 1px solid #ddd;
}

.hidden-image {
  display: none;
}

.card-content {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  text-align: center;
}

.card-content h3 {
  margin: 0 0 0.25rem;
  font-size: 0.8rem;
  color: #666666;
  text-transform: uppercase;
  font-weight: normal;
  letter-spacing: 0.5px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-content h2 {
  margin: 0 0 0.5rem;
  font-size: 1.4rem;
  color: #333333;
  font-weight: bold;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-content p {
  margin: 0.25rem 0;
  font-size: 1rem;
  color: #555555;
}

.card-content .location-icon {
  margin-right: 0.5rem;
  color: #007bff;
}

.result-card:hover .card-content h2 {
  color: #007bff;
}

.municipio-text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}

.event-date {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 5px;
  border-radius: 5px;
  font-size: 0.8rem;
}
</style>
