<template>
  <div class="chips-container">
    <span
      v-for="category in categories"
      :key="category"
      :class="['chip', { 'chip-selected': selectedCategory === category }]"
      @click="selectCategory(category)"
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
.chips-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.chip {
  padding: 0.5rem 1rem;
  border-radius: 25px;
  cursor: pointer;
  background-color: #e0e0e0;
  transition: background-color 0.3s, color 0.3s;
}

.chip:hover {
  background-color: #d0d0d0;
}

.chip-selected {
  background-color: #007bff;
  color: white;
}
</style>
