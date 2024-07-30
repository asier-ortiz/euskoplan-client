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
import { ref, defineEmits } from 'vue';

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

const emit = defineEmits(['chipSelected']);

const selectCategory = (category) => {
  if (selectedCategory.value === category) {
    selectedCategory.value = null;  // Deselecciona el chip si ya está seleccionado
  } else {
    selectedCategory.value = category;
  }
  emit('chipSelected', selectedCategory.value);
};
</script>

<style scoped>
/* Estilos adicionales si es necesario */
</style>
