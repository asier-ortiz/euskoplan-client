<template>
  <div>
    <Hero @chipSelected="handleChipSelected" @search="handleSearch" />
    <div class="container">
      <ResultsView />
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, watch} from 'vue';
import Hero from '@/components/Hero/Hero.vue';
import ResultsView from '@/components/Result/ResultsView.vue';
import { useCollectionsStore } from '@/stores/collections';

const collectionsStore = useCollectionsStore();

// Centralize search logic in a function
const performSearch = async () => {
  const { searchQuery, selectedCategory } = collectionsStore;

  if (searchQuery.length >= 3) {
    if (selectedCategory) {
      await collectionsStore.searchInCategory(selectedCategory, searchQuery, 'es');
    } else {
      await collectionsStore.searchAllCollections(searchQuery, 'es');
    }
  } else if (selectedCategory) {
    await collectionsStore.filterResultsByCategory(selectedCategory, 'es');
  }
};

// Execute the search if there is a search term or category selected on the initial load
onMounted(() => {
  if (collectionsStore.searchQuery || collectionsStore.selectedCategory) {
    performSearch();
  }
});

const handleChipSelected = async (category) => {
  collectionsStore.selectedCategory = category;
  await performSearch();
};

const handleSearch = async (query) => {
  collectionsStore.searchQuery = query;
  await performSearch();
};

// Watch for changes in searchQuery and selectedCategory and trigger appropriate search
watch(
    () => [collectionsStore.searchQuery, collectionsStore.selectedCategory],
    async ([newQuery, newCategory], [oldQuery, oldCategory]) => {
      // Perform search when searchQuery is updated or when selectedCategory changes
      if (newQuery !== oldQuery || newCategory !== oldCategory) {
        await performSearch();
      }
    }
);
</script>
