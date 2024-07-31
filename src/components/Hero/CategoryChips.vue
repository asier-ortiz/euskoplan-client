<template>
  <div class="chips-container">
    <span
      v-for="category in categories"
      :key="category"
      :class="['chip', { 'chip-selected': collectionsStore.selectedCategory === category }]"
      @click="selectCategory(category)"
      role="button"
    >
      {{ category }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCollectionsStore } from '@/stores/collections';

const collectionsStore = useCollectionsStore();

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

const selectCategory = (category) => {
  if (collectionsStore.selectedCategory === category) {
    collectionsStore.setSelectedCategory(null); // Deselect if already selected
  } else {
    collectionsStore.setSelectedCategory(category);
  }
  collectionsStore.filterResultsByCategory(category, 'es');
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
