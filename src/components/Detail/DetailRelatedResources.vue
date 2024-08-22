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
          <div v-if="!imageLoaded[index]" class="skeleton-loader"></div> <!-- Skeleton loader -->
          <img
            :src="related.imagenes[0]?.fuente || getDefaultImage(related.coleccion)"
            alt="Imagen del recurso relacionado"
            class="hidden-image"
            @load="handleImageLoad(index)"
            @error="handleRelatedImageError(index)"
            :class="{ loaded: imageLoaded[index] }"
          />
          <div v-if="related.coleccion.toLowerCase() === 'event'" class="event-date">
            {{ formatDate(related.fecha_inicio) }}
          </div>
        </div>
        <div class="card-content">
          <h3 v-if="related.nombre_subtipo_recurso ||
            related.nombre_subtipo_recurso_espacio_natural ||
            related.nombre_subtipo_recurso_playas_pantanos_rios"
          >
            {{
              related.nombre_subtipo_recurso ||
              related.nombre_subtipo_recurso_espacio_natural ||
              related.nombre_subtipo_recurso_playas_pantanos_rios
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
import { defineProps, ref, watch } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const props = defineProps<{
  relatedResources: any[];
  formatDate: (date: string) => string;
  navigateToResource: (resource: any) => void;
  handleRelatedImageError: (index: number) => void;
  getDefaultImage: (collection: string) => string;
}>();

const imageLoaded = ref<boolean[]>([]);

// Initialize imageLoaded array
watch(() => props.relatedResources, () => {
  imageLoaded.value = Array(props.relatedResources.length).fill(false);
}, { immediate: true });

const handleImageLoad = (index: number) => {
  imageLoaded.value[index] = true;
};
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
  width: 240px;
  height: auto; /* Allow height to adjust based on content */
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
  flex-grow: 1; /* Allow the image to take the remaining space */
  background-size: cover;
  background-position: center;
  position: relative;
  border-bottom: 1px solid #ddd;
  height: 150px; /* Provide a minimum height for the image */
  display: flex;
  align-items: center;
  justify-content: center;
}

.hidden-image {
  display: none;
}

.hidden-image.loaded {
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
  object-fit: cover; /* Ensure skeleton loader also respects the image's aspect ratio */
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
