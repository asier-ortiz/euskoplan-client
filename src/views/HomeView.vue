<template>
  <div>
    <Hero @chipSelected="handleChipSelected" />
    <ResultsView />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Hero from '@/components/Hero/Hero.vue';
import ResultsView from '@/components/Result/ResultsView.vue';
import { useCollectionsStore } from '@/stores/collections';

const collectionsStore = useCollectionsStore();

const handleChipSelected = async (category) => {
  collectionsStore.selectedCategory = category;

  if (collectionsStore.searchQuery.length >= 3) {
    await collectionsStore.searchInCategory(category, collectionsStore.searchQuery, 'es');
  } else {
    await collectionsStore.filterResultsByCategory(category, 'es');
  }
};

watch(() => collectionsStore.searchQuery, async (newQuery) => {
  if (newQuery.length >= 3) {
    if (collectionsStore.selectedCategory) {
      await collectionsStore.searchInCategory(collectionsStore.selectedCategory, newQuery, 'es');
    } else {
      await collectionsStore.searchAllCollections(newQuery, 'es');
    }
  }
});
</script>
