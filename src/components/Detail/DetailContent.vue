<template>
  <div class="detail-content">
    <!-- Carousel for multiple images -->
    <div v-if="resource.imagenes && resource.imagenes.length > 1" class="detail-carousel">
      <div class="carousel-container">
        <div class="carousel-slide" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
          <div v-for="(imagen, index) in resource.imagenes" :key="index" class="carousel-image">
            <img :src="imagen.fuente" :alt="imagen.titulo || 'Imagen del recurso'" />
          </div>
        </div>
      </div>
      <button v-if="currentIndex > 0" @click="prevSlide" class="carousel-button prev-button">‹</button>
      <button v-if="currentIndex < resource.imagenes.length - 1" @click="nextSlide" class="carousel-button next-button">›</button>
    </div>

    <!-- Single image or default image -->
    <div v-else class="single-image">
      <img :src="singleImageUrl" :alt="singleImageAlt" />
    </div>

    <hr class="section-separator" />

    <!-- Filter the HTML content to remove empty paragraphs -->
    <p v-html="filteredDescription" class="description"></p>

    <hr class="section-separator" />

    <!-- Display dynamic info only if available -->
    <div v-if="hasDynamicInfo" class="dynamic-info">
      <p v-if="resource.direccion"><strong>Dirección:</strong> {{ resource.direccion }}</p>
      <p v-if="resource.codigo_postal"><strong>Código Postal:</strong> {{ resource.codigo_postal }}</p>
      <p v-if="resource.numero_telefono"><strong>Teléfono:</strong> {{ resource.numero_telefono }}</p>
      <p v-if="resource.email"><strong>Email:</strong> {{ resource.email }}</p>
      <p v-if="resource.pagina_web"><strong>Sitio Web:</strong><a :href="resource.pagina_web" target="_blank">{{ resource.pagina_web }}</a></p>

      <template v-if="resource.coleccion === 'accommodation'">
        <p v-if="resource.categoria"><strong>Categoría:</strong> {{ resource.categoria }}</p>
        <p v-if="resource.capacidad"><strong>Capacidad:</strong> {{ resource.capacidad }}</p>
        <p v-if="resource.anno_apertura"><strong>Año de Apertura:</strong> {{ resource.anno_apertura }}</p>
        <p v-if="resource.num_hab_individuales"><strong>Habitaciones Individuales:</strong> {{ resource.num_hab_individuales }}</p>
        <p v-if="resource.num_hab_dobles"><strong>Habitaciones Dobles:</strong> {{ resource.num_hab_dobles }}</p>
      </template>

      <template v-if="resource.coleccion === 'cultural'">
        <p v-if="resource.tipo_monumento"><strong>Tipo de Monumento:</strong> {{ resource.tipo_monumento }}</p>
        <p v-if="resource.estilo_artistico"><strong>Estilo Artístico:</strong> {{ resource.estilo_artistico }}</p>
      </template>

      <template v-if="resource.coleccion === 'event'">
        <p v-if="resource.fecha_inicio"><strong>Fecha de Inicio:</strong> {{ formatDate(resource.fecha_inicio) }}</p>
        <p v-if="resource.fecha_fin"><strong>Fecha de Fin:</strong> {{ formatDate(resource.fecha_fin) }}</p>
      </template>

      <template v-if="resource.coleccion === 'fair'">
        <p v-if="resource.atracciones"><strong>Atracciones:</strong> <span v-html="resource.atracciones"></span></p>
        <p v-if="resource.horario"><strong>Horario:</strong> <span v-html="resource.horario"></span></p>
        <p v-if="resource.tarifas"><strong>Tarifas:</strong> <span v-html="resource.tarifas"></span></p>
      </template>

      <template v-if="resource.coleccion === 'natural'">
        <p v-if="resource.actividades"><strong>Actividades:</strong><span v-html="resource.actividades"></span></p>
      </template>

      <template v-if="resource.coleccion === 'restaurant'">
        <p v-if="resource.capacidad"><strong>Capacidad:</strong> {{ resource.capacidad }}</p>
      </template>
    </div>

    <hr class="section-separator" />

    <div v-if="resource.servicios && resource.servicios.length > 0" class="detail-services">
      <h3>Servicios</h3>
      <div class="service-tags">
        <span v-for="(service, index) in resource.servicios" :key="index" class="service-tag">{{ service.nombre }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { defineProps } from 'vue';
import { getDefaultImageUrl } from '@/utils/imageUtils'; // Import the utility function

const props = defineProps<{
  resource: any;
  formatDate: (date: string) => string;
}>();

// Ref to manage the current slide index
const currentIndex = ref(0);

// Computed property to get the single image URL or a default image if not available
const singleImageUrl = computed(() => {
  return props.resource.imagenes && props.resource.imagenes.length === 1
    ? props.resource.imagenes[0].fuente
    : getDefaultImageUrl(props.resource.coleccion);
});

// Computed property to get the alt text for the single image or a default text
const singleImageAlt = computed(() => {
  return props.resource.imagenes && props.resource.imagenes.length === 1
    ? props.resource.imagenes[0].titulo || 'Imagen del recurso'
    : 'Imagen por defecto';
});

// Watch for changes in the resource to reset the currentIndex
watch(
  () => props.resource,
  (newResource, oldResource) => {
    if (newResource !== oldResource) {
      currentIndex.value = 0; // Reset the index to 0 when the resource changes
    }
  },
  { immediate: true } // Ensure the watcher runs immediately when the component is mounted
);

// Functions to change the slide index
const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

const nextSlide = () => {
  if (currentIndex.value < props.resource.imagenes.length - 1) {
    currentIndex.value++;
  }
};

// Computed property to filter out empty paragraphs from the description
const filteredDescription = computed(() => {
  // Remove empty paragraphs or those containing only non-breaking spaces
  return props.resource.descripcion.replace(/<p>&nbsp;<\/p>/g, '');
});

// Computed property to determine if there is any dynamic info to display
const hasDynamicInfo = computed(() => {
  return (
    props.resource.direccion ||
    props.resource.codigo_postal ||
    props.resource.numero_telefono ||
    props.resource.email ||
    props.resource.pagina_web ||
    (props.resource.coleccion === 'accommodation' &&
      (props.resource.categoria || props.resource.capacidad || props.resource.anno_apertura || props.resource.num_hab_individuales || props.resource.num_hab_dobles)) ||
    (props.resource.coleccion === 'cultural' &&
      (props.resource.tipo_monumento || props.resource.estilo_artistico)) ||
    (props.resource.coleccion === 'event' &&
      (props.resource.fecha_inicio || props.resource.fecha_fin)) ||
    (props.resource.coleccion === 'fair' &&
      (props.resource.atracciones || props.resource.horario || props.resource.tarifas)) ||
    (props.resource.coleccion === 'natural' &&
      props.resource.actividades) ||
    (props.resource.coleccion === 'restaurant' &&
      props.resource.capacidad)
  );
});
</script>

<style scoped>
.detail-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

.detail-carousel {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin-bottom: 1rem;
  overflow: hidden;
  border-radius: 8px;
}

.carousel-container {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.carousel-slide {
  display: flex;
}

.carousel-image {
  min-width: 100%;
  transition: transform 0.5s ease-in-out;
}

.carousel-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.single-image {
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 600px;
  margin-bottom: 1rem;
}

.single-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.carousel-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 1rem;
  cursor: pointer;
  z-index: 1;
  font-size: 2rem;
}

.prev-button {
  left: 0;
}

.next-button {
  right: 0;
}

.description {
  text-align: justify;
  font-size: 1rem;
  line-height: 1.6;
  color: #444;
  margin: 1rem 0;
  word-wrap: break-word;
  width: 100%;
}

.description p {
  margin: 0.5rem 0;
}

.dynamic-info {
  margin-top: 1rem;
  text-align: left;
  width: 100%;
  font-size: 0.95rem;
  color: #333;
  background-color: #f0f8ff;
  padding: 1rem;
  border-radius: 8px;
}

.dynamic-info p {
  margin: 0.5rem 0;
}

.dynamic-info a {
  color: #007bff;
  text-decoration: none;
  word-wrap: break-word;
}

.dynamic-info a:hover {
  text-decoration: underline;
}

.detail-services {
  margin-bottom: 2rem;
  text-align: center;
}

.detail-services h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.service-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.service-tag {
  background-color: #e9ecef;
  color: #555;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
}
</style>
