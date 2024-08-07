<template>
  <div class="detail-content">
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

    <div v-else-if="resource.imagenes && resource.imagenes.length === 1" class="single-image">
      <img :src="resource.imagenes[0].fuente" :alt="resource.imagenes[0].titulo || 'Imagen del recurso'" />
    </div>

    <hr class="section-separator" />

    <!-- Filtramos el contenido HTML para eliminar párrafos vacíos -->
    <p v-html="filteredDescription" class="description"></p>

    <hr class="section-separator" />

    <div class="dynamic-info">
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
        <p v-if="resource.atracciones"><strong>Atracciones:</strong> {{ resource.atracciones }}</p>
        <p v-if="resource.horario"><strong>Horario:</strong> <span v-html="resource.horario"></span></p>
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
import { computed } from 'vue';
import { defineProps } from 'vue';

const props = defineProps<{
  resource: any;
  currentIndex: number;
  prevSlide: () => void;
  nextSlide: () => void;
  formatDate: (date: string) => string;
}>();

// Computed property to filter out empty paragraphs from the description
const filteredDescription = computed(() => {
  // Eliminar los párrafos vacíos o que solo contienen espacios no separables
  return props.resource.descripcion.replace(/<p>&nbsp;<\/p>/g, '');
});
</script>

<style scoped>
.detail-content {
  display: flex;
  flex-direction: column;
  align-items: center;
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
}

/* Ajusta el espacio entre párrafos dentro del contenido HTML */
.description p {
  margin: 0.5rem 0; /* Ajusta este valor para cambiar el espacio entre párrafos */
}

.dynamic-info {
  margin-top: 1rem;
  text-align: left;
  width: 100%;
  font-size: 0.95rem;
  color: #333;
}

.dynamic-info p {
  margin: 0.5rem 0;
}

.dynamic-info a {
  color: #007bff;
  text-decoration: none;
}

.dynamic-info a:hover {
  text-decoration: underline;
}

.detail-services {
  margin-top: 2rem;
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
