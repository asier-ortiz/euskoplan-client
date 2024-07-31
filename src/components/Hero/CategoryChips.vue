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
  padding: 0.2rem 0.5rem; /* Smaller padding */
  border-radius: 15px; /* Smaller border radius */
  cursor: pointer;
  background-color: #f8f9fa; /* Light background color */
  color: #343a40; /* Darker text color for better readability */
  font-size: 0.9rem; /* Smaller font size */
  transition: background-color 0.3s, color 0.3s;
  white-space: nowrap; /* Prevent text from wrapping */
  border: 1px solid #007bff; /* Border to improve visibility */
}

.chip:hover {
  background-color: #007bff;
  color: white;
}

.chip-selected {
  background-color: #007bff;
  color: white;
}

/* Media query to adjust the font size and padding for smaller screens */
@media (max-width: 600px) {
  .chip {
    font-size: 0.8rem;
    padding: 0.2rem 0.4rem; /* Adjust padding for smaller screens */
  }
}
</style>
