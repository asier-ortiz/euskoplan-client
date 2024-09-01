<!-- src/components/HeroSearchInput.vue -->
<template>
  <div class="search-container">
    <input
        type="text"
        class="search-input"
        v-model="searchQuery"
        @input="onSearchInput"
        :placeholder="placeholderText"
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
import { ref, computed, watch } from 'vue';
import { debounce } from 'lodash-es';
import { useCollectionsStore } from '@/stores/collections';
import { useFilterStore } from '@/stores/filter'; // Import filter store

const collectionsStore = useCollectionsStore();
const filterStore = useFilterStore(); // Access filter store
const searchQuery = ref(collectionsStore.searchQuery); // Initialize with value from store

// Watch for changes in the store's searchQuery and update local searchQuery
watch(
    () => collectionsStore.searchQuery,
    (newQuery) => {
      searchQuery.value = newQuery;
    }
);

// Computed property for placeholder text
const placeholderText = computed(() => {
  return collectionsStore.selectedCategory
      ? `Busca en ${collectionsStore.selectedCategory}`
      : '';
});

// Ensure the fetchResults function is using the correct filters
const fetchResultsWithFilters = () => {
  const filters = filterStore.getFilters(); // Get active filters
  console.log('Fetching results with query:', searchQuery.value);
  collectionsStore.setSearchQuery(searchQuery.value);
  collectionsStore.fetchResources(
      collectionsStore.selectedCategory,
      searchQuery.value,
      filters // Pass active filters
  );
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
  width: 100%;
  max-width: 800px;
  margin-bottom: 1rem;
}

.search-input {
  flex: 1;
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
