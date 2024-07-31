<template>
  <div class="results-container">
    <div class="sorting-buttons">
      <button @click="sortByName" :class="{ active: sortField === 'name' }">
        Nombre
        <i :class="sortOrder === 'asc' ? 'bi bi-sort-alpha-down' : 'bi bi-sort-alpha-up'"></i>
      </button>
      <button @click="sortByDistance" :class="{ active: sortField === 'distance' }">
        Distancia
        <i :class="sortOrder === 'asc' ? 'bi bi-sort-numeric-down' : 'bi bi-sort-numeric-up'"></i>
      </button>
    </div>
    <Spinner :visible="collectionsStore.loading" />
    <div v-if="!collectionsStore.loading" class="cards-grid">
      <ResultCard
          v-for="item in sortedResults"
          :key="item.codigo"
          :collection="item.coleccion"
          :name="item.nombre"
          :images="item.imagenes"
          :itemId="item.codigo"
          :longitud="item.longitud"
          :latitud="item.latitud"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCollectionsStore } from '@/stores/collections';
import { useLocationStore } from '@/stores/location';
import ResultCard from '@/components/Result/ResultCard.vue';
import Spinner from '@/components/Spinner.vue';
import { calculateDistance } from '@/utils/distance';

// Access your collections store
const collectionsStore = useCollectionsStore();
const locationStore = useLocationStore();

const sortField = ref('name');
const sortOrder = ref('asc');

// Compute the results to display
const results = computed(() => {
  if (collectionsStore.searchQuery.length >= 3) {
    return collectionsStore.searchResults;
  }
  if (collectionsStore.selectedCategory) {
    return collectionsStore.filteredResults;
  }
  return [
    ...collectionsStore.randomAccommodations,
    ...collectionsStore.randomCaves,
    ...collectionsStore.randomCulturals,
    ...collectionsStore.randomEvents,
    ...collectionsStore.randomFairs,
    ...collectionsStore.randomMuseums,
    ...collectionsStore.randomNaturals,
    ...collectionsStore.randomRestaurants,
  ];
});

// Add computed property for sorted results
const sortedResults = computed(() => {
  const sorted = [...results.value];
  if (sortField.value === 'name') {
    sorted.sort((a, b) => {
      const result = a.nombre.localeCompare(b.nombre);
      return sortOrder.value === 'asc' ? result : -result;
    });
  } else if (sortField.value === 'distance' && locationStore.userLocation) {
    sorted.sort((a, b) => {
      const distanceA = calculateDistance(
          locationStore.userLocation.latitude,
          locationStore.userLocation.longitude,
          a.latitud,
          a.longitud
      );
      const distanceB = calculateDistance(
          locationStore.userLocation.latitude,
          locationStore.userLocation.longitude,
          b.latitud,
          b.longitud
      );
      return sortOrder.value === 'asc' ? distanceA - distanceB : distanceB - distanceA;
    });
  }
  return sorted;
});

// Sort functions
const sortByName = () => {
  if (sortField.value === 'name') {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = 'name';
    sortOrder.value = 'asc';
  }
};

const sortByDistance = () => {
  if (sortField.value === 'distance') {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = 'distance';
    sortOrder.value = 'asc';
  }
};
</script>

<style scoped>
.results-container {
  margin-top: 1rem; /* Reduced top margin */
}

.sorting-buttons {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem; /* Increased bottom margin */
  gap: 0.5rem;
}

.sorting-buttons button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 25px;
  background-color: #e0e0e0;
  color: #333;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sorting-buttons button.active {
  background-color: #007bff;
  color: white;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Adjust card size */
  gap: 1.5rem;
}

.bi {
  font-size: 1rem;
}
</style>
