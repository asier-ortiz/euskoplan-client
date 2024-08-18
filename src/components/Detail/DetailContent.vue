<template>
  <div class="detail-content">
    <!-- Grid layout for large screens -->
    <div v-if="!isMobile && resource.imagenes && resource.imagenes.length > 1" class="image-grid">
      <div v-for="(imagen, index) in resource.imagenes" :key="index" class="grid-image">
        <div v-if="!imageLoaded[index]" class="skeleton-loader"></div>
        <a
          :href="imagen.fuente"
          data-fancybox="gallery"
          :data-caption="imagen.titulo || 'Imagen del recurso'"
        >
          <img
            :src="imagen.fuente"
            :alt="imagen.titulo || 'Imagen del recurso'"
            @load="handleImageLoad(index)"
            @error="handleImageLoad(index)"
            :class="{ 'hidden-image': !imageLoaded[index] }"
          />
        </a>
      </div>
    </div>

    <!-- Carousel layout for small screens -->
    <div v-else-if="resource.imagenes && resource.imagenes.length > 1" class="detail-carousel">
      <div class="carousel-container">
        <div class="carousel-slide" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
          <div v-for="(imagen, index) in resource.imagenes" :key="index" class="carousel-image">
            <div v-if="!imageLoaded[index]" class="skeleton-loader"></div>
            <a
              :href="imagen.fuente"
              data-fancybox="gallery"
              :data-caption="imagen.titulo || 'Imagen del recurso'"
            >
              <img
                :src="imagen.fuente"
                :alt="imagen.titulo || 'Imagen del recurso'"
                @load="handleImageLoad(index)"
                @error="handleImageLoad(index)"
                :class="{ 'hidden-image': !imageLoaded[index] }"
              />
            </a>
          </div>
        </div>
      </div>
      <button v-if="currentIndex > 0" @click="prevSlide" class="carousel-button prev-button">‹</button>
      <button v-if="currentIndex < resource.imagenes.length - 1" @click="nextSlide" class="carousel-button next-button">›</button>
    </div>

    <!-- Single image or default image -->
    <div v-else class="single-image">
      <div v-if="!imageLoaded[0]" class="skeleton-loader"></div>
      <a
        :href="singleImageUrl"
        data-fancybox="gallery"
        :data-caption="singleImageAlt"
      >
        <img
          :src="singleImageUrl"
          :alt="singleImageAlt"
          @load="handleImageLoad(0)"
          @error="handleImageLoad(0)"
          :class="{ 'hidden-image': !imageLoaded[0] }"
        />
      </a>
    </div>

    <hr class="section-separator" />

    <!-- Filter the HTML content to remove empty paragraphs -->
    <p v-html="filteredDescription" class="description"></p>

    <hr class="section-separator" />

    <!-- Display dynamic info only if available -->
    <div v-if="hasDynamicInfo" class="dynamic-info">
      <!-- General Info -->
      <p v-if="resource.direccion"><strong>Dirección:</strong> <span v-html="resource.direccion"></span></p>
      <p v-if="resource.codigo_postal"><strong>Código Postal:</strong> <span v-html="resource.codigo_postal"></span></p>
      <p v-if="resource.numero_telefono"><strong>Teléfono:</strong> <span v-html="resource.numero_telefono"></span></p>
      <p v-if="resource.numero_telefono_2"><strong>Teléfono 2:</strong> <span v-html="resource.numero_telefono_2"></span></p>
      <p v-if="resource.email"><strong>Email:</strong> <span v-html="resource.email"></span></p>
      <p v-if="resource.pagina_web"><strong>Sitio Web:</strong><a :href="resource.pagina_web" target="_blank">{{ resource.pagina_web }}</a></p>

      <!-- Accommodation Specific -->
      <template v-if="resource.coleccion === 'accommodation'">
        <p v-if="resource.categoria"><strong>Categoría:</strong> <span v-html="resource.categoria"></span></p>
        <p v-if="resource.capacidad"><strong>Capacidad:</strong> <span v-html="resource.capacidad"></span></p>
        <p v-if="resource.anno_apertura"><strong>Año de Apertura:</strong> <span v-html="resource.anno_apertura"></span></p>
        <p v-if="resource.num_hab_individuales"><strong>Habitaciones Individuales:</strong> <span v-html="resource.num_hab_individuales"></span></p>
        <p v-if="resource.num_hab_dobles"><strong>Habitaciones Dobles:</strong> <span v-html="resource.num_hab_dobles"></span></p>
        <p v-if="resource.num_hab_salon"><strong>Salones:</strong> <span v-html="resource.num_hab_salon"></span></p>
        <p v-if="resource.num_hab_hasta_4_plazas"><strong>Habitaciones hasta 4 plazas:</strong> <span v-html="resource.num_hab_hasta_4_plazas"></span></p>
        <p v-if="resource.num_hab_mas_4_plazas"><strong>Habitaciones más de 4 plazas:</strong> <span v-html="resource.num_hab_mas_4_plazas"></span></p>
      </template>

      <!-- Cave Specific -->
      <template v-if="resource.coleccion === 'cave'">
        <p v-if="resource.tipo_monumento"><strong>Tipo de Monumento:</strong> <span v-html="resource.tipo_monumento"></span></p>
        <p v-if="resource.periodo"><strong>Período:</strong> <span v-html="resource.periodo"></span></p>
      </template>

      <!-- Cultural Specific -->
      <template v-if="resource.coleccion === 'cultural'">
        <p v-if="resource.tipo_monumento"><strong>Tipo de Monumento:</strong> <span v-html="resource.tipo_monumento"></span></p>
        <p v-if="resource.estilo_artistico"><strong>Estilo Artístico:</strong> <span v-html="resource.estilo_artistico"></span></p>
      </template>

      <!-- Event Specific -->
      <template v-if="resource.coleccion === 'event'">
        <p v-if="resource.fecha_inicio"><strong>Fecha de Inicio:</strong> <span v-html="formatDate(resource.fecha_inicio)"></span></p>
        <p v-if="resource.fecha_fin"><strong>Fecha de Fin:</strong> <span v-html="formatDate(resource.fecha_fin)"></span></p>
      </template>

      <!-- Fair Specific -->
      <template v-if="resource.coleccion === 'fair'">
        <p v-if="resource.atracciones"><strong>Atracciones:</strong> <span v-html="resource.atracciones"></span></p>
        <p v-if="resource.horario"><strong>Horario:</strong> <span v-html="resource.horario"></span></p>
        <p v-if="resource.tarifas"><strong>Tarifas:</strong> <span v-html="resource.tarifas"></span></p>
      </template>

      <!-- Natural Specific -->
      <template v-if="resource.coleccion === 'natural'">
        <p v-if="resource.subtipo_recurso_espacio_natural"><strong>Subtipo Espacio Natural:</strong> <span v-html="resource.subtipo_recurso_espacio_natural"></span></p>
        <p v-if="resource.fauna"><strong>Fauna:</strong> <span v-html="resource.fauna"></span></p>
        <p v-if="resource.flora"><strong>Flora:</strong> <span v-html="resource.flora"></span></p>
        <p v-if="resource.subtipo_recurso_playas_pantanos_rios"><strong>Subtipo Playas/Pantanos/Ríos:</strong> <span v-html="resource.subtipo_recurso_playas_pantanos_rios"></span></p>
        <p v-if="resource.actividades"><strong>Actividades:</strong><span v-html="resource.actividades"></span></p>
        <p v-if="resource.horario"><strong>Horario:</strong><span v-html="resource.horario"></span></p>
      </template>

      <!-- Restaurant Specific -->
      <template v-if="resource.coleccion === 'restaurant'">
        <p v-if="resource.capacidad"><strong>Capacidad:</strong> <span v-html="resource.capacidad"></span></p>
      </template>

      <!-- Museum Specific -->
      <template v-if="resource.coleccion === 'museum'">
        <p v-if="resource.tematica"><strong>Temática:</strong> <span v-html="resource.tematica"></span></p>
        <p v-if="resource.capacidad"><strong>Capacidad:</strong> <span v-html="resource.capacidad"></span></p>
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
const imageLoaded = ref<boolean[]>([]);

// Function to detect screen size
const updateScreenSize = () => {
  isMobile.value = window.innerWidth < 768; // Example breakpoint for mobile screens
};

// Initialize imageLoaded array
watch(() => props.resource.imagenes, () => {
  imageLoaded.value = Array(props.resource.imagenes ? props.resource.imagenes.length : 1).fill(false);
});

const handleImageLoad = (index: number) => {
  imageLoaded.value[index] = true;
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
  position: relative;
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
  transition: transform 0.3s ease-in-out, border-radius 0.3s ease-in-out; /* Smooth transition for image and border-radius */
}

/* Zoom effect on hover for grid images */
.grid-image:hover img {
  transform: scale(1.1); /* Zoom the image by 10% */
  border-radius: 8px; /* Keep border-radius consistent */
}

/* Single image container */
.single-image {
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 350px;
  margin-bottom: 1rem;
  overflow: hidden; /* Ensure the overflow is hidden to enforce the border-radius */
  border-radius: 8px;
}

/* Single image styling */
.single-image img {
  width: 100%;
  max-width: 100%; /* Ensure the image does not exceed the container width */
  max-height: 250px;
  border-radius: 8px;
  object-fit: cover;
  transition: transform 0.3s ease-in-out, border-radius 0.3s ease-in-out; /* Smooth transition for image and border-radius */
}

/* Zoom effect on hover for single image */
.single-image:hover img {
  transform: scale(1.1); /* Zoom the image by 10% */
  border-radius: 8px; /* Keep border-radius consistent */
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
  position: relative;
  min-width: 100%;
  transition: transform 0.5s ease-in-out;
}

.carousel-image img {
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

/* Skeleton loader */
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

/* Hidden image until loaded */
.hidden-image {
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* Show image after load */
.hidden-image.loaded {
  opacity: 1;
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
