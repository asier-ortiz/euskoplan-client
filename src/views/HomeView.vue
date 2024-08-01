<template>
  <div>
    <Hero @chipSelected="handleChipSelected" @search="handleSearch" />
    <div class="container">
      <ResultsView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import Hero from '@/components/Hero/Hero.vue';
import ResultsView from '@/components/Result/ResultsView.vue';
import { useCollectionsStore } from '@/stores/collections';

const collectionsStore = useCollectionsStore();

// Centraliza la lógica de búsqueda en una función
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

// Ejecuta la búsqueda si hay un término de búsqueda o categoría seleccionada al montar el componente
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

// Observa los cambios en searchQuery y selectedCategory y desencadena la búsqueda adecuada
watch(
    () => [collectionsStore.searchQuery, collectionsStore.selectedCategory],
    async () => {
      await performSearch();
    }
);
</script>
