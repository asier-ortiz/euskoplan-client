<template>
  <div class="chips-container">
    <span
      v-for="category in categories"
      :key="category"
      :class="['chip', { 'selected-chip': selectedCategory === category }]"
      @click="selectCategory(category)"
    >
      {{ category }}
    </span>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';

const emit = defineEmits(['chipSelected']);

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
  if (selectedCategory.value === category) {
    selectedCategory.value = null;
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
  gap: 0.5rem;
}
.chip {
  padding: 0.5rem 1rem;
  border-radius: 16px;
  background-color: #e0e0e0;
  cursor: pointer;
  user-select: none;
}
.selected-chip {
  background-color: #007bff;
  color: white;
}
</style>
