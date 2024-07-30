<template>
  <div>
    <Hero @chipSelected="handleChipSelected" />
    <ResultsContainer />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Hero from '@/components/Hero/Hero.vue';
import ResultsContainer from '@/components/Result/ResultsContainer.vue';
import { useCollectionsStore } from '@/stores/collections';

const collectionsStore = useCollectionsStore();

const handleChipSelected = async (category) => {
  collectionsStore.selectedCategory = category;

  // Perform a search only in the selected category if a search query exists
  if (collectionsStore.searchQuery.length >= 3) {
    await collectionsStore.searchInCategory(category, collectionsStore.searchQuery, 'es');
  } else {
    // Otherwise, filter results by category
    await collectionsStore.filterResultsByCategory(category, 'es');
  }
};

// Watch for changes in search query
watch(() => collectionsStore.searchQuery, async (newQuery) => {
  if (newQuery.length >= 3) {
    if (collectionsStore.selectedCategory) {
      // Search only in the selected category if a chip is selected
      await collectionsStore.searchInCategory(collectionsStore.selectedCategory, newQuery, 'es');
    } else {
      // Otherwise, search in all collections
      await collectionsStore.searchAllCollections(newQuery, 'es');
    }
  }
});
</script>
