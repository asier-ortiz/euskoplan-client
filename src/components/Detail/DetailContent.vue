<template>
  <div class="detail-content">
    <!-- Grid layout for large screens -->
    <div v-if="!isMobile && resource.imagenes && resource.imagenes.length > 1" class="image-grid">
      <div v-for="(imagen, index) in resource.imagenes" :key="index" class="grid-image">
        <a
          :href="imagen.fuente"
          data-fancybox="gallery"
          :data-caption="imagen.titulo || 'Imagen del recurso'"
        >
          <img :src="imagen.fuente" :alt="imagen.titulo || 'Imagen del recurso'" />
        </a>
      </div>
    </div>

    <!-- Carousel layout for small screens -->
    <div v-else-if="resource.imagenes && resource.imagenes.length > 1" class="detail-carousel">
      <div class="carousel-container">
        <div class="carousel-slide" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
          <div v-for="(imagen, index) in resource.imagenes" :key="index" class="carousel-image">
            <a
              :href="imagen.fuente"
              data-fancybox="gallery"
              :data-caption="imagen.titulo || 'Imagen del recurso'"
            >
              <img :src="imagen.fuente" :alt="imagen.titulo || 'Imagen del recurso'" />
            </a>
          </div>
        </div>
      </div>
      <button v-if="currentIndex > 0" @click="prevSlide" class="carousel-button prev-button">‹</button>
      <button v-if="currentIndex < resource.imagenes.length - 1" @click="nextSlide" class="carousel-button next-button">›</button>
    </div>

    <!-- Single image or default image -->
    <div v-else class="single-image">
      <a
        :href="singleImageUrl"
        data-fancybox="gallery"
        :data-caption="singleImageAlt"
      >
        <img :src="singleImageUrl" :alt="singleImageAlt" />
      </a>
    </div>

    <hr class="section-separator" />

    <!-- Filter the HTML content to remove empty paragraphs -->
    <p v-html="filteredDescription" class="description"></p>

    <hr class="section-separator" />

    <!-- Display dynamic info only if available -->
    <div v-if="hasDynamicInfo" class="dynamic-info">
      <!-- General Info -->
      <p v-if="resource.direccion"><strong>Dirección:</strong> {{ resource.direccion }}</p>
      <p v-if="resource.codigo_postal"><strong>Código Postal:</strong> {{ resource.codigo_postal }}</p>
      <p v-if="resource.numero_telefono"><strong>Teléfono:</strong> {{ resource.numero_telefono }}</p>
      <p v-if="resource.numero_telefono_2"><strong>Teléfono 2:</strong> {{ resource.numero_telefono_2 }}</p>
      <p v-if="resource.email"><strong>Email:</strong> {{ resource.email }}</p>
      <p v-if="resource.pagina_web"><strong>Sitio Web:</strong><a :href="resource.pagina_web" target="_blank">{{ resource.pagina_web }}</a></p>

      <!-- Accommodation Specific -->
      <template v-if="resource.coleccion === 'accommodation'">
        <p v-if="resource.categoria"><strong>Categoría:</strong> {{ resource.categoria }}</p>
        <p v-if="resource.capacidad"><strong>Capacidad:</strong> {{ resource.capacidad }}</p>
        <p v-if="resource.anno_apertura"><strong>Año de Apertura:</strong> {{ resource.anno_apertura }}</p>
        <p v-if="resource.num_hab_individuales"><strong>Habitaciones Individuales:</strong> {{ resource.num_hab_individuales }}</p>
        <p v-if="resource.num_hab_dobles"><strong>Habitaciones Dobles:</strong> {{ resource.num_hab_dobles }}</p>
        <p v-if="resource.num_hab_salon"><strong>Salones:</strong> {{ resource.num_hab_salon }}</p>
        <p v-if="resource.num_hab_hasta_4_plazas"><strong>Habitaciones hasta 4 plazas:</strong> {{ resource.num_hab_hasta_4_plazas }}</p>
        <p v-if="resource.num_hab_mas_4_plazas"><strong>Habitaciones más de 4 plazas:</strong> {{ resource.num_hab_mas_4_plazas }}</p>
      </template>

      <!-- Cave Specific -->
      <template v-if="resource.coleccion === 'cave'">
        <p v-if="resource.tipo_monumento"><strong>Tipo de Monumento:</strong> {{ resource.tipo_monumento }}</p>
        <p v-if="resource.periodo"><strong>Período:</strong> {{ resource.periodo }}</p>
      </template>

      <!-- Cultural Specific -->
      <template v-if="resource.coleccion === 'cultural'">
        <p v-if="resource.tipo_monumento"><strong>Tipo de Monumento:</strong> {{ resource.tipo_monumento }}</p>
        <p v-if="resource.estilo_artistico"><strong>Estilo Artístico:</strong> {{ resource.estilo_artistico }}</p>
      </template>

      <!-- Event Specific -->
      <template v-if="resource.coleccion === 'event'">
        <p v-if="resource.fecha_inicio"><strong>Fecha de Inicio:</strong> {{ formatDate(resource.fecha_inicio) }}</p>
        <p v-if="resource.fecha_fin"><strong>Fecha de Fin:</strong> {{ formatDate(resource.fecha_fin) }}</p>
      </template>

      <!-- Fair Specific -->
      <template v-if="resource.coleccion === 'fair'">
        <p v-if="resource.atracciones"><strong>Atracciones:</strong> <span v-html="resource.atracciones"></span></p>
        <p v-if="resource.horario"><strong>Horario:</strong> <span v-html="resource.horario"></span></p>
        <p v-if="resource.tarifas"><strong>Tarifas:</strong> <span v-html="resource.tarifas"></span></p>
      </template>

      <!-- Natural Specific -->
      <template v-if="resource.coleccion === 'natural'">
        <p v-if="resource.subtipo_recurso_espacio_natural"><strong>Subtipo Espacio Natural:</strong> {{ resource.subtipo_recurso_espacio_natural }}</p>
        <p v-if="resource.fauna"><strong>Fauna:</strong> {{ resource.fauna }}</p>
        <p v-if="resource.flora"><strong>Flora:</strong> {{ resource.flora }}</p>
        <p v-if="resource.subtipo_recurso_playas_pantanos_rios"><strong>Subtipo Playas/Pantanos/Ríos:</strong> {{ resource.subtipo_recurso_playas_pantanos_rios }}</p>
        <p v-if="resource.actividades"><strong>Actividades:</strong><span v-html="resource.actividades"></span></p>
        <p v-if="resource.horario"><strong>Horario:</strong><span v-html="resource.horario"></span></p>
      </template>

      <!-- Restaurant Specific -->
      <template v-if="resource.coleccion === 'restaurant'">
        <p v-if="resource.capacidad"><strong>Capacidad:</strong> {{ resource.capacidad }}</p>
      </template>

      <!-- Museum Specific -->
      <template v-if="resource.coleccion === 'museum'">
        <p v-if="resource.tematica"><strong>Temática:</strong> {{ resource.tematica }}</p>
        <p v-if="resource.capacidad"><strong>Capacidad:</strong> {{ resource.capacidad }}</p>
        <p v-if="resource.horario"><strong>Horario:</strong> <span v-html="resource.horario"></span></p>
      </template>
    </div>

    <hr class="section-separator" />

    <!-- Services section -->
    <div v-if="resource.servicios && resource.servicios.length > 0" class="detail-services">
      <h3>Servicios</h3>
      <div class="service-tags">
        <span v-for="(service, index) in resource.servicios" :key="index" class="service-tag">{{ service.nombre }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import { defineProps, defineEmits } from 'vue';
import { Fancybox } from '@fancyapps/ui';
import { getDefaultImageUrl } from '@/utils/image';

const props = defineProps<{
  resource: any;
  formatDate: (date: string) => string;
}>();

const emit = defineEmits(['galleryClosed']);

const currentIndex = ref(0);
const isMobile = ref(false);

// Function to detect screen size
const updateScreenSize = () => {
  isMobile.value = window.innerWidth < 768; // Example breakpoint for mobile screens
};

// Call on component mount
onMounted(() => {
  window.addEventListener('resize', updateScreenSize);
  updateScreenSize(); // Initialize screen size

  Fancybox.bind('[data-fancybox="gallery"]', {
    on: {
      close: () => {
        emit('galleryClosed');
      }
    }
  });
});

watch(() => props.resource, () => {
  currentIndex.value = 0;
});

const singleImageUrl = computed(() => {
  return props.resource.imagenes && props.resource.imagenes.length === 1
    ? props.resource.imagenes[0].fuente
    : getDefaultImageUrl(props.resource.coleccion);
});

const singleImageAlt = computed(() => {
  return props.resource.imagenes && props.resource.imagenes.length === 1
    ? props.resource.imagenes[0].titulo || 'Imagen del recurso'
    : 'Imagen por defecto';
});

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
    (props.resource.coleccion === 'cave' &&
      (props.resource.tipo_monumento || props.resource.periodo)) ||
    (props.resource.coleccion === 'cultural' &&
      (props.resource.tipo_monumento || props.resource.estilo_artistico)) ||
    (props.resource.coleccion === 'event' &&
      (props.resource.fecha_inicio || props.resource.fecha_fin)) ||
    (props.resource.coleccion === 'fair' &&
      (props.resource.atracciones || props.resource.horario || props.resource.tarifas)) ||
    (props.resource.coleccion === 'natural' &&
      (props.resource.subtipo_recurso_espacio_natural || props.resource.fauna || props.resource.flora || props.resource.subtipo_recurso_playas_pantanos_rios || props.resource.actividades || props.resource.horario)) ||
    (props.resource.coleccion === 'restaurant' &&
      props.resource.capacidad) ||
    (props.resource.coleccion === 'museum' &&
      (props.resource.tematica || props.resource.capacidad || props.resource.horario))
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

/* Grid layout for large screens */
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* Set a larger minimum size */
  gap: 1rem;
  width: 100%;
  max-width: 100%;
}

.grid-image {
  overflow: hidden;
  border-radius: 8px;
  transition: transform 0.3s ease-in-out; /* Smooth transition */
}

.grid-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
  min-width: 200px; /* Ensure a minimum width */
  min-height: 200px; /* Ensure a minimum height */
  transition: transform 0.3s ease-in-out; /* Smooth transition for image */
}

/* Zoom effect on hover */
.grid-image:hover img {
  transform: scale(1.1); /* Zoom the image by 10% */
}

/* Carousel layout for small screens */
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

/* Other styles */
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

/* Responsive grid adjustments */
@media (max-width: 1200px) {
  .image-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 992px) {
  .image-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
}

@media (max-width: 768px) {
  .image-grid {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }
}

@media (max-width: 576px) {
  .image-grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }

  .detail-carousel {
    max-width: 100%;
  }

  .carousel-image {
    min-width: 100%;
  }
}
</style>
