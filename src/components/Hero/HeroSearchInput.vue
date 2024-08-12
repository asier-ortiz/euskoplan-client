<template>
  <div class="search-container">
    <input
      type="text"
      class="search-input"
      v-model="searchQuery"
      @input="onSearchInput"
      placeholder="¿Qué te apetece hacer?"
    />
    <button class="search-button" @click="handleSearchClick">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path
          d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM10 14a4 4 0 110-8 4 4 0 010 8z"
        ></path>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { debounce } from 'lodash-es';
import { useCollectionsStore } from '@/stores/collections';
import { useFilterStore } from '@/stores/filter';

const collectionsStore = useCollectionsStore();
const filterStore = useFilterStore();
const searchQuery = ref(collectionsStore.searchQuery); // Initialize with value from store

// Helper function to determine the correct subcategory filter key and value
const getSubcategoryFilter = () => {
  const category = collectionsStore.selectedCategory?.toLowerCase();

  if (category === 'espacios naturales') {
    console.log('Espacios Naturales Category Detected');
    const espacioNatural = filterStore.selectedCategories.natural.espacio_natural;
    const playasPantanosRios = filterStore.selectedCategories.natural.playas_pantanos_rios;

    if (espacioNatural) {
      console.log('Using Espacio Natural');
      return {
        key: 'nombre_subtipo_recurso_espacio_natural',
        value: espacioNatural,
      };
    } else if (playasPantanosRios) {
      console.log('Using Playas Pantanos Rios');
      return {
        key: 'nombre_subtipo_recurso_playas_pantanos_rios',
        value: playasPantanosRios,
      };
    } else {
      console.log('No specific subcategory selected');
    }

  } else if (filterStore.selectedCategories[category]) {
    console.log('Using default subcategory');
    return {
      key: 'nombre_subtipo_recurso',
      value: filterStore.selectedCategories[category],
    };
  }

  return {}; // Return an empty object if no subcategory is found
};

// Helper function to construct the correct filters for API call
const getFilters = () => {
  const subcategoryFilter = getSubcategoryFilter();

  const filters = {
    idioma: 'es',
    ...(filterStore.selectedProvince && {
      nombre_provincia: filterStore.selectedProvince,
    }),
    ...(filterStore.selectedLocality && {
      nombre_municipio: filterStore.selectedLocality,
    }),
    ...(subcategoryFilter.key && subcategoryFilter.value && {
      [subcategoryFilter.key]: subcategoryFilter.value,
    }),
    ...(filterStore.startDate && {
      fecha_inicio: formatDateForApi(filterStore.startDate),
    }),
    ...(filterStore.endDate && {
      fecha_fin: formatDateForApi(filterStore.endDate),
    }),
  };

  console.log('Filters:', filters); // Debugging log to check filter parameters

  return filters;
};

// Ensure the fetchResults function is using the correct filters
const fetchResultsWithFilters = () => {
  console.log('Fetching results from HeroSearchInput with query:', searchQuery.value);
  collectionsStore.setSearchQuery(searchQuery.value);
  const filters = getFilters();
  collectionsStore.fetchResults(
    collectionsStore.selectedCategory,
    searchQuery.value,
    filters // Pass the correct filters
  );
};

// Format date helper function
const formatDateForApi = (date) => {
  if (!date) return null;
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Intl.DateTimeFormat('es-ES', options)
    .format(new Date(date))
    .split('/')
    .reverse()
    .join('/');
};

// Update the search query and call the store action
const onSearchInput = debounce(fetchResultsWithFilters, 500);

// Emit the search query when the button is clicked
const handleSearchClick = fetchResultsWithFilters;
</script>

<style scoped>
.search-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%; /* Ensures full width within parent container */
  max-width: 800px; /* Matches the parent container's max-width */
  margin-bottom: 1rem;
}

.search-input {
  flex: 1; /* Allows the input to fill the remaining space */
  padding: 0.5rem 1rem;
  border: 2px solid #007bff;
  border-radius: 25px 0 0 25px;
  outline: none;
  font-size: 1rem;
}

.search-button {
  padding: 0.5rem 1rem;
  border: 2px solid #007bff;
  border-left: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 0 25px 25px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-button svg {
  fill: white;
}
</style>
