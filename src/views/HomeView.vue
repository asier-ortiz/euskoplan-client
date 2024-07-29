<template>
  <div>
    <Hero @chipSelected="handleChipSelected" />
    <ResultsContainer />
  </div>
</template>

<script setup lang="ts">
import Hero from '@/components/Hero/Hero.vue';
import ResultsContainer from '@/components/Result/ResultsContainer.vue';
import { useCollectionsStore } from '@/stores/collections';

const collectionsStore = useCollectionsStore();

const handleChipSelected = async (category) => {
  collectionsStore.selectedCategory = category;
  await collectionsStore.filterResultsByCategory(category, 'es');
};
</script>

<style scoped>
.hero-container {
  margin-bottom: 2rem;
}
</style>
