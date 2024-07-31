<template>
  <div>
    <Hero @chipSelected="handleChipSelected" @search="handleSearch" />
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
    if (category) {
      await collectionsStore.searchInCategory(category, collectionsStore.searchQuery, 'es');
    } else {
      await collectionsStore.searchAllCollections(collectionsStore.searchQuery, 'es');
    }
  } else {
    await collectionsStore.filterResultsByCategory(category, 'es');
  }
};

const handleSearch = async (query) => {
  collectionsStore.searchQuery = query;

  if (query.length >= 3) {
    if (collectionsStore.selectedCategory) {
      await collectionsStore.searchInCategory(collectionsStore.selectedCategory, query, 'es');
    } else {
      await collectionsStore.searchAllCollections(query, 'es');
    }
  }
};

// Watch for changes in searchQuery and selectedCategory and trigger appropriate search
watch(
  () => [collectionsStore.searchQuery, collectionsStore.selectedCategory],
  async ([newQuery, newCategory]) => {
    if (newQuery.length >= 3) {
      if (newCategory) {
        await collectionsStore.searchInCategory(newCategory, newQuery, 'es');
      } else {
        await collectionsStore.searchAllCollections(newQuery, 'es');
      }
    } else if (newCategory) {
      await collectionsStore.filterResultsByCategory(newCategory, 'es');
    }
  }
);
</script>
