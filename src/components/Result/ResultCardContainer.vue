<template>
  <div class="results-container">
    <div class="sorting-buttons">
      <button @click="sortByName" :class="{ active: collectionsStore.sortField === 'name' }">
        Nombre
        <i :class="collectionsStore.sortOrder === 'asc' ? 'bi bi-sort-alpha-down' : 'bi bi-sort-alpha-up'"></i>
      </button>
      <button @click="sortByDistance" :class="{ active: collectionsStore.sortField === 'distance' }">
        Distancia
        <i :class="collectionsStore.sortOrder === 'asc' ? 'bi bi-sort-numeric-down' : 'bi bi-sort-numeric-up'"></i>
      </button>
      <!-- New Sort by Date Button for Events -->
      <button v-if="isEventCollection" @click="sortByDate" :class="{ active: collectionsStore.sortField === 'date' }">
        Fecha
        <i :class="collectionsStore.sortOrder === 'asc' ? 'bi bi-sort-numeric-down' : 'bi bi-sort-numeric-up'"></i>
      </button>
    </div>
    <div v-if="!collectionsStore.loading" class="cards-grid">
      <ResultCard
          v-for="item in paginatedResults"
          :key="`${item.coleccion}-${item.id}`"
          :collection="item.coleccion"
          :name="item.nombre"
          :images="item.imagenes"
          :itemId="Number(item.codigo)"
          :longitud="Number(item.longitud)"
          :latitud="Number(item.latitud)"
          :subtype="getSubtype(item)"
          :municipio="item.nombre_municipio"
          :fechaInicio="item.fecha_inicio"
      />
    </div>
    <ResultCardPagination />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCollectionsStore } from '@/stores/collections';
import { useLocationStore } from '@/stores/location';
import ResultCard from '@/components/Result/ResultCard.vue';
import ResultCardPagination from '@/components/Result/ResultCardPagination.vue';
import { calculateDistance } from '@/utils/distance';

// Access your collections store
const collectionsStore = useCollectionsStore();
const locationStore = useLocationStore();

// Compute the sorted results
const sortedResults = computed(() => {
  const sorted = [...collectionsStore.results];
  if (collectionsStore.sortField === 'name') {
    sorted.sort((a, b) => {
      const result = a.nombre.localeCompare(b.nombre);
      return collectionsStore.sortOrder === 'asc' ? result : -result;
    });
  } else if (collectionsStore.sortField === 'distance' && locationStore.userLocation) {
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
      return collectionsStore.sortOrder === 'asc' ? distanceA - distanceB : distanceB - distanceA;
    });
  } else if (collectionsStore.sortField === 'date') {
    sorted.sort((a, b) => {
      const dateA = new Date(a.fecha_inicio);
      const dateB = new Date(b.fecha_inicio);
      return collectionsStore.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }
  return sorted;
});

// Compute the paginated results based on the current page and sorted results
const paginatedResults = computed(() => {
  const start = (collectionsStore.currentPage - 1) * collectionsStore.itemsPerPage;
  const end = start + collectionsStore.itemsPerPage;
  return sortedResults.value.slice(start, end);
});

// Determine the subtype based on collection type
const getSubtype = (item) => {
  if (item.coleccion.toLowerCase() === 'natural') {
    return item.nombre_subtipo_recurso_espacio_natural || item.nombre_subtipo_recurso_playas_pantanos_rios || '';
  }
  return item.nombre_subtipo_recurso || '';
};

// Determine if the current collection is an event
const isEventCollection = computed(() => collectionsStore.selectedCategory.toLowerCase() === 'eventos');

// Sort functions
const sortByName = () => {
  if (collectionsStore.sortField === 'name') {
    collectionsStore.sortOrder = collectionsStore.sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    collectionsStore.setSortField('name');
    collectionsStore.setSortOrder('asc');
  }
};

const sortByDistance = () => {
  if (collectionsStore.sortField === 'distance') {
    collectionsStore.sortOrder = collectionsStore.sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    collectionsStore.setSortField('distance');
    collectionsStore.setSortOrder('asc');
  }
};

const sortByDate = () => {
  if (collectionsStore.sortField === 'date') {
    collectionsStore.sortOrder = collectionsStore.sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    collectionsStore.setSortField('date');
    collectionsStore.setSortOrder('asc');
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
  flex-wrap: wrap; /* Allows buttons to wrap to the next line on small screens */
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
