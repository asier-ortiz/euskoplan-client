<template>
  <div class="results-container">
    <!-- Spinner component to show loading status -->
    <Spinner :visible="collectionsStore.loading" />
    <!-- Cards grid to display results -->
    <div v-if="!collectionsStore.loading" class="cards-grid">
      <ResultCard
          v-for="item in results"
          :key="item.id"
          :collection="item.coleccion"
          :name="item.nombre"
          :images="item.imagenes"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'; // Importing computed from Vue
import { useCollectionsStore } from '@/stores/collections'; // Importing store
import ResultCard from '@/components/Result/ResultCard.vue'; // Importing ResultCard component
import Spinner from '@/components/Spinner.vue'; // Importing Spinner component

const collectionsStore = useCollectionsStore(); // Getting the collections store

// Compute the results to be displayed
const results = computed(() => {
  // If there is a search query, return search results
  if (collectionsStore.searchQuery.length >= 3) {
    return collectionsStore.searchResults;
  }
  // If a category is selected, return filtered results
  else if (collectionsStore.selectedCategory) {
    return collectionsStore.filteredResults;
  }
  // Otherwise, return random collections
  else {
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
  }
});
</script>

<style scoped>
/* Container for the results */
.results-container {
  margin-top: 2rem;
}

/* Grid layout for cards */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* Auto-fit to screen size */
  gap: 1rem; /* Space between cards */
}
</style>
