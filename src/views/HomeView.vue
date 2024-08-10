<!-- src/components/HomeView.vue -->
<template>
  <div>
    <Hero @chipSelected="handleChipSelected" @search="handleSearch" />
    <div class="container">
      <ResultsMain />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import Hero from '@/components/Hero/HeroMain.vue';
import ResultsMain from '@/components/Result/ResultsMain.vue';
import { useCollectionsStore } from '@/stores/collections';
import { useFilterStore } from '@/stores/filter';

const collectionsStore = useCollectionsStore();
const filterStore = useFilterStore();

// Perform the search based on current state
const performSearchAndFilter = async () => {
  const { searchQuery, selectedCategory } = collectionsStore;

  const filters = {
    idioma: 'es',
    ...(filterStore.selectedProvince && { nombre_provincia: filterStore.selectedProvince }),
    ...(filterStore.selectedLocality && { nombre_municipio: filterStore.selectedLocality }),
    ...(filterStore.selectedCategories[selectedCategory?.toLowerCase()] && {
      nombre_subtipo_recurso: filterStore.selectedCategories[selectedCategory.toLowerCase()],
    }),
    ...(filterStore.startDate && { fecha_inicio: formatDateForApi(filterStore.startDate) }),
    ...(filterStore.endDate && { fecha_fin: formatDateForApi(filterStore.endDate) }),
  };

  await collectionsStore.fetchResults(selectedCategory, searchQuery, filters);
};

// Format date helper function
const formatDateForApi = (date) => {
  if (!date) return null;
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Intl.DateTimeFormat('es-ES', options).format(new Date(date)).split('/').reverse().join('/');
};

// Execute the search on initial load
onMounted(() => {
  if (collectionsStore.searchQuery || collectionsStore.selectedCategory) {
    performSearchAndFilter();
  }
});

// Handle category chip selection
const handleChipSelected = async (category) => {
  filterStore.clearFilters();
  collectionsStore.setSelectedCategory(category);
  await performSearchAndFilter();
};

// Handle search input
const handleSearch = async (query) => {
  collectionsStore.searchQuery = query;
  await performSearchAndFilter();
};

// Watch for changes in searchQuery and selectedCategory
watch(
  () => [collectionsStore.searchQuery, collectionsStore.selectedCategory],
  async ([newQuery, newCategory], [oldQuery, oldCategory]) => {
    if (newQuery !== oldQuery || newCategory !== oldCategory) {
      await performSearchAndFilter();
    }
  }
);
</script>
