<template>
  <div class="results-container">
    <Spinner :visible="collectionsStore.loading" />
    <div v-if="!collectionsStore.loading" class="cards-grid">
      <ResultCard
          v-for="item in results"
          :key="item.codigo"
          :collection="item.coleccion"
          :name="item.nombre"
          :images="item.imagenes"
          :itemId="item.codigo"
          :longitud="item.longitud"
          :latitud="item.latitud"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCollectionsStore } from '@/stores/collections';
import ResultCard from '@/components/Result/ResultCard.vue';
import Spinner from '@/components/Spinner.vue';

// Access your collections store
const collectionsStore = useCollectionsStore();

// Compute the results to display
const results = computed(() => {
  if (collectionsStore.searchQuery.length >= 3) {
    return collectionsStore.searchResults;
  }
  if (collectionsStore.selectedCategory) {
    return collectionsStore.filteredResults;
  }
  return [
    ...collectionsStore.randomAccommodations,
    ...collectionsStore.randomCaves,
    ...collectionsStore.randomCulturals,
    ...collectionsStore.randomEvents,
    ...collectionsStore.randomFairs,
    ...collectionsStore.randomMuseums,
    ...collectionsStore.randomNaturals,
    ...collectionsStore.randomRestaurants,
  ];
});
</script>

<style scoped>
.results-container {
  margin-top: 2rem;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Adjust card size */
  gap: 1.5rem;
}
</style>
