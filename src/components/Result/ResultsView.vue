<template>
  <div class="results-view">
    <div class="tabs-and-filter">
      <div class="tabs">
        <button :class="{ active: activeTab === 'cards' }" @click="activeTab = 'cards'">Cards</button>
        <button :class="{ active: activeTab === 'map' }" @click="activeTab = 'map'">Map</button>
      </div>
      <div class="filter-button-container">
        <FilterButton @toggleFilterDrawer="toggleFilterDrawer" />
      </div>
    </div>

    <div class="results-count">
      <p>{{ resultsCount }} results found</p>
    </div>

    <div class="tab-content">
      <ResultCardContainer v-if="activeTab === 'cards'" />
      <ResultMap v-if="activeTab === 'map'" />
    </div>

    <FilterDrawer :visible="isFilterDrawerVisible" @close="toggleFilterDrawer" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCollectionsStore } from '@/stores/collections';
import ResultCardContainer from './ResultCardContainer.vue';
import ResultMap from './ResultMap.vue';
import FilterDrawer from '@/components/Hero/FilterDrawer.vue';
import FilterButton from '@/components/Hero/FilterButton.vue';

const activeTab = ref('cards');
const isFilterDrawerVisible = ref(false);

const toggleFilterDrawer = () => {
  isFilterDrawerVisible.value = !isFilterDrawerVisible.value;
};

const collectionsStore = useCollectionsStore();

const resultsCount = computed(() => {
  if (collectionsStore.searchQuery.length >= 3) {
    return collectionsStore.searchResults.length;
  }
  if (collectionsStore.selectedCategory) {
    return collectionsStore.filteredResults.length;
  }
  return (
    collectionsStore.randomAccommodations.length +
    collectionsStore.randomCaves.length +
    collectionsStore.randomCulturals.length +
    collectionsStore.randomEvents.length +
    collectionsStore.randomFairs.length +
    collectionsStore.randomMuseums.length +
    collectionsStore.randomNaturals.length +
    collectionsStore.randomRestaurants.length
  );
});
</script>

<style scoped>
.results-view {
  margin: 1rem 0;
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

.results-count {
  text-align: center;
  margin-bottom: 1rem;
}

.tab-content {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
}
</style>
