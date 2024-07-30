<template>
  <div>
    <Hero @chipSelected="handleChipSelected" />
    <ResultsContainer />
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import Hero from '@/components/Hero/Hero.vue';
import ResultsContainer from '@/components/Result/ResultsContainer.vue';
import { useCollectionsStore } from '@/stores/collections';

const collectionsStore = useCollectionsStore();

const handleChipSelected = async (category) => {
  collectionsStore.selectedCategory = category || null; // Ensure null is properly handled

  // Check if a valid search query exists
  if (collectionsStore.searchQuery.length >= 3) {
    if (category) {
      // Search in the selected category
      await collectionsStore.searchInCategory(category, collectionsStore.searchQuery, 'es');
    } else {
      // Search across all collections if no category is selected
      await collectionsStore.searchAllCollections(collectionsStore.searchQuery, 'es');
    }
  } else {
    // Filter by category if no search query is present
    await collectionsStore.filterResultsByCategory(category, 'es');
  }
};

// Watch for changes in search query
watch(() => collectionsStore.searchQuery, async (newQuery) => {
  if (newQuery.length >= 3) {
    if (collectionsStore.selectedCategory) {
      // Search only in the selected category
      await collectionsStore.searchInCategory(collectionsStore.selectedCategory, newQuery, 'es');
    } else {
      // Search across all collections if no category is selected
      await collectionsStore.searchAllCollections(newQuery, 'es');
    }
  } else {
    // Load random collections if the query is too short
    await collectionsStore.loadRandomCollections();
  }
});
</script>
