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
import { useFilterStore } from '@/stores/filter';

const collectionsStore = useCollectionsStore();
const filterStore = useFilterStore();

// Centralize search logic in a function
const performSearch = async () => {
  const { searchQuery, selectedCategory } = collectionsStore;

  // Construct filters from the filter store
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

  if (searchQuery.length >= 3) {
    if (selectedCategory) {
      await collectionsStore.searchInCategory(selectedCategory, searchQuery, 'es');
    } else {
      await collectionsStore.searchAllCollections(searchQuery, 'es');
    }
  } else if (selectedCategory) {
    // Pass the filters to the filterResultsByCategory method
    await collectionsStore.filterResultsByCategory(selectedCategory, filters);
  }
};

// Format date helper function
const formatDateForApi = (date) => {
  if (!date) return null;
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Intl.DateTimeFormat('es-ES', options).format(new Date(date)).split('/').reverse().join('/');
};

// Execute the search if there is a search term or category selected on the initial load
onMounted(() => {
  if (collectionsStore.searchQuery || collectionsStore.selectedCategory) {
    performSearch();
  }
});

const handleChipSelected = async (category) => {
  // Reset filters when a new category is selected
  filterStore.clearFilters();
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
