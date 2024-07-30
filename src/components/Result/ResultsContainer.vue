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
import { computed, watch } from 'vue';
import { useCollectionsStore } from '@/stores/collections';
import ResultCard from '@/components/Result/ResultCard.vue';
import Spinner from '@/components/Spinner.vue';

const collectionsStore = useCollectionsStore();

const results = computed(() => {
  if (collectionsStore.searchQuery.length >= 3) {
    if (collectionsStore.selectedCategory) {
      return collectionsStore.searchResults.filter(item => item.coleccion === collectionsStore.selectedCategory);
    } else {
      return collectionsStore.searchResults;
    }
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

watch(
  () => collectionsStore.selectedCategory,
  async (newCategory) => {
    if (newCategory) {
      await collectionsStore.filterResultsByCategory(newCategory, 'es');
    }
  }
);

watch(
  () => collectionsStore.searchQuery,
  async (newQuery) => {
    if (newQuery.length >= 3) {
      await collectionsStore.searchAllCollections(newQuery, 'es');
    } else {
      collectionsStore.searchResults = [];
    }
  }
);
</script>

<style scoped>
.results-container {
  margin-top: 2rem;
}
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
</style>
