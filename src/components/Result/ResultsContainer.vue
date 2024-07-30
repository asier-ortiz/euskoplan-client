<template>
  <div class="results-container">
    <Spinner :visible="collectionsStore.loading" />
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
import { onMounted, computed } from 'vue';
import { useCollectionsStore } from '@/stores/collections';
import ResultCard from '@/components/Result/ResultCard.vue';
import Spinner from '@/components/Spinner.vue';

const collectionsStore = useCollectionsStore();

const loadRandomCollections = async () => {
  await collectionsStore.loadRandomCollections();
};

const results = computed(() => {
  if (collectionsStore.searchQuery && collectionsStore.selectedCategory) {
    return collectionsStore.searchResults.filter(item => item.coleccion === collectionsStore.selectedCategory);
  } else if (collectionsStore.searchQuery) {
    return collectionsStore.searchResults;
  } else if (collectionsStore.selectedCategory) {
    return collectionsStore.filteredResults;
  } else {
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

onMounted(() => {
  loadRandomCollections();
});
</script>

<style scoped>
.results-container {
  margin-top: 2rem;
  padding: 1rem; /* Padding for the container */
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Adjusted min width to control card size */
  gap: 1.5rem; /* Increased gap for more spacing */
  justify-items: center; /* Center items within the grid */
  align-items: stretch; /* Stretch items to fill the grid */
}
</style>
