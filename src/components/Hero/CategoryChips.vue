<template>
  <div class="d-flex flex-wrap">
    <span
      v-for="category in categories"
      :key="category"
      :class="['badge', 'rounded-pill', { 'bg-primary': selectedCategory === category, 'bg-secondary': selectedCategory !== category }]"
      @click="selectCategory(category)"
      class="me-2 mb-2"
      role="button"
    >
      {{ category }}
    </span>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const categories = [
  'Alojamientos',
  'Cuevas y Restos Arqueológicos',
  'Edificios Religiosos y Castillos',
  'Eventos',
  'Parques Temáticos',
  'Museos y Centros de Interpretación',
  'Espacios Naturales',
  'Restaurantes'
];

const selectedCategory = ref(null);
const selectCategory = (category) => {
  selectedCategory.value = category;
  console.log(`Selected category: ${selectedCategory.value}`);
};
</script>

<style scoped>
/* Estilos adicionales si es necesario */
</style>
