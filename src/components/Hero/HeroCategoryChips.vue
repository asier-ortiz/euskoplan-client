<template>
  <div class="chips-container">
    <div
        v-for="category in categories"
        :key="category"
        class="chip"
        :class="{ 'chip-selected': isSelected(category) }"
        @click="toggleCategory(category)"
    >
      {{ category }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCollectionsStore } from '@/stores/collections';
import { useFilterStore } from '@/stores/filter';
import { useMapStore } from '@/stores/map';

const collectionsStore = useCollectionsStore();
const filterStore = useFilterStore();
const mapStore = useMapStore();

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

const toggleCategory = async (category) => {
  const isCurrentlySelected = collectionsStore.selectedCategory === category;
  const newCategory = isCurrentlySelected ? null : category;

  collectionsStore.setSelectedCategory(newCategory);

  if (newCategory) {
    const filters = filterStore.getFilters();
    await collectionsStore.fetchResults(newCategory, collectionsStore.searchQuery, filters);
    mapStore.setDidCategoryChange(true);
    mapStore.setShouldRefitBounds(true);  // Ensure map refits bounds after category change
  } else {
    collectionsStore.results = [];
  }
};

const isSelected = (category) => collectionsStore.selectedCategory === category;
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
  background-color: #0056b3;
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
