<template>
  <div class="chips-container">
    <span
      v-for="category in categories"
      :key="category"
      :class="['chip', { 'chip-selected': collectionsStore.selectedCategory === category }]"
      @click="toggleCategory(category)"
      role="button"
    >
      {{ category }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCollectionsStore } from '@/stores/collections';
import { useFilterStore } from '@/stores/filter';
import { debounce } from 'lodash-es'; // Ensure lodash-es is used to support tree-shaking

const collectionsStore = useCollectionsStore();
const filterStore = useFilterStore();

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

// Debounce the API call to prevent multiple calls
const debouncedFetchResults = debounce((category, searchQuery) => {
  collectionsStore.fetchResults(category, searchQuery, { idioma: 'es' });
}, 300);

const toggleCategory = (category) => {
  // Toggle category selection
  const isCurrentlySelected = collectionsStore.selectedCategory === category;
  const newCategory = isCurrentlySelected ? null : category;

  collectionsStore.setSelectedCategory(newCategory);

  if (newCategory) {
    filterStore.clearFilters(); // Clear filters when a new category is selected

    // Fetch results using the current search query for the selected category
    debouncedFetchResults(newCategory, collectionsStore.searchQuery);
  } else {
    // Clear results if no category is selected
    collectionsStore.results = [];
  }
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
  padding: 0.2rem 0.5rem;
  border-radius: 15px;
  cursor: pointer;
  background-color: #f8f9fa;
  color: #343a40;
  font-size: 0.9rem;
  transition: background-color 0.3s, color 0.3s;
  white-space: nowrap;
  border: 1px solid #007bff;
}

.chip:hover {
  background-color: #007bff;
  color: white;
}

.chip-selected {
  background-color: #007bff;
  color: white;
}

@media (max-width: 600px) {
  .chip {
    font-size: 0.8rem;
    padding: 0.2rem 0.4rem;
  }
}
</style>
