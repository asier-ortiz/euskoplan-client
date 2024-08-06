<template>
  <div class="results-view">
    <Spinner :visible="collectionsStore.loading" />
    <div class="tabs-and-filter">
      <div class="tabs">
        <button :class="{ active: collectionsStore.activeTab === 'cards' }" @click="setActiveTab('cards')">
          <i class="bi bi-card-text"></i> Cards
        </button>
        <button :class="{ active: collectionsStore.activeTab === 'map' }" @click="setActiveTab('map')">
          <i class="bi bi-geo-alt"></i> Map
        </button>
      </div>
      <div class="filter-button-container">
        <FilterButton @toggleFilterDrawer="toggleFilterDrawer" />
      </div>
    </div>

    <div class="results-count">
      <span class="line"></span>
      <p>{{ resultsCount }} results found</p>
      <span class="line"></span>
    </div>

    <div class="tab-content">
      <ResultCardContainer v-if="collectionsStore.activeTab === 'cards'" />
      <ResultMap v-if="collectionsStore.activeTab === 'map'" />
    </div>

    <FilterDrawer :visible="isFilterDrawerVisible" @close="toggleFilterDrawer" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ResultCardContainer from './ResultCardContainer.vue';
import ResultMap from './ResultMap.vue';
import FilterDrawer from '@/components/Hero/FilterDrawer.vue';
import FilterButton from '@/components/Hero/FilterButton.vue';
import { useCollectionsStore } from '@/stores/collections';
import Spinner from '@/components/Spinner.vue';

const collectionsStore = useCollectionsStore();
const isFilterDrawerVisible = ref(false);

const toggleFilterDrawer = () => {
  isFilterDrawerVisible.value = !isFilterDrawerVisible.value;
};

// Function to set the active tab
const setActiveTab = (tab) => {
  collectionsStore.setActiveTab(tab);
};

// Compute the number of results
const resultsCount = computed(() => {
  if (collectionsStore.searchQuery.length >= 3) {
    return collectionsStore.searchResults.length;
  }
  if (collectionsStore.selectedCategory) {
    return collectionsStore.filteredResults.length;
  }
  return 0;
});
</script>

<style scoped>
.results-view {
  margin: 1rem 0;
  position: relative; /* Ensure spinner overlay works correctly */
  min-height: 300px; /* Ensure enough space for spinner */
}

.tabs-and-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.tabs {
  display: flex;
  gap: 0.5rem;
}

.tabs button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 25px;
  background-color: #e0e0e0;
  color: #333;
  cursor: pointer;
  transition: background-color 0.3s;
}

.tabs button.active {
  background-color: #007bff;
  color: #fff;
}

.filter-button-container {
  display: flex;
  justify-content: flex-end;
}

.tab-content {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
}

.results-count {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
}

.results-count p {
  margin: 0 1rem;
}

.line {
  flex: 1;
  height: 1px;
  background-color: #ddd;
}
</style>
