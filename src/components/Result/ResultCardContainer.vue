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
      <!-- Additional Buttons for Locality Collection -->
      <button v-if="isLocalityCollection" @click="sortByPopulation" :class="{ active: collectionsStore.sortField === 'population' }">
        Población
        <i :class="collectionsStore.sortOrder === 'asc' ? 'bi bi-sort-numeric-down' : 'bi bi-sort-numeric-up'"></i>
      </button>
      <button v-if="isLocalityCollection" @click="sortByArea" :class="{ active: collectionsStore.sortField === 'area' }">
        Superficie
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
        :longitude="Number(item.longitud)"
        :latitude="Number(item.latitud)"
        :subtype="getSubtype(item)"
        :municipality="item.coleccion === 'locality' ? item.nombre_provincia : item.nombre_municipio"
        :startDate="item.fecha_inicio"
        :area="item.coleccion === 'locality' ? item.superficie : null"
        :population="item.coleccion === 'locality' ? item.numero_habitantes : null"
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
import { getSubtype } from '@/utils/subtype';

const collectionsStore = useCollectionsStore();
const locationStore = useLocationStore();

// Sort the results based on the selected sort field
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
  } else if (collectionsStore.sortField === 'population') {
    sorted.sort((a, b) => {
      const populationA = parseInt(a.numero_habitantes, 10);
      const populationB = parseInt(b.numero_habitantes, 10);
      return collectionsStore.sortOrder === 'asc' ? populationA - populationB : populationB - populationA;
    });
  } else if (collectionsStore.sortField === 'area') {
    sorted.sort((a, b) => {
      const areaA = parseFloat(a.superficie);
      const areaB = parseFloat(b.superficie);
      return collectionsStore.sortOrder === 'asc' ? areaA - areaB : areaB - areaA;
    });
  }
  return sorted;
});

// Get the paginated results based on the current page and sorted results
const paginatedResults = computed(() => {
  const start = (collectionsStore.currentPage - 1) * collectionsStore.itemsPerPage;
  const end = start + collectionsStore.itemsPerPage;
  return sortedResults.value.slice(start, end);
});

// Determine if the current collection is an event
const isEventCollection = computed(() => collectionsStore.selectedCategory.toLowerCase() === 'eventos');

// Determine if the current collection is a locality
const isLocalityCollection = computed(() => collectionsStore.selectedCategory.toLowerCase() === 'localidades');

// Functions for sorting
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

const sortByPopulation = () => {
  if (collectionsStore.sortField === 'population') {
    collectionsStore.sortOrder = collectionsStore.sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    collectionsStore.setSortField('population');
    collectionsStore.setSortOrder('asc');
  }
};

const sortByArea = () => {
  if (collectionsStore.sortField === 'area') {
    collectionsStore.sortOrder = collectionsStore.sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    collectionsStore.setSortField('area');
    collectionsStore.setSortOrder('asc');
  }
};
</script>

<style scoped>
.results-container {
  margin-top: 1rem;
}

.sorting-buttons {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.sorting-buttons button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 25px;
  background-color: #e0e0e0;
  color: #333;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s, color 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sorting-buttons button.active {
  background-color: #007bff;
  color: white;
}

.sorting-buttons button:hover {
  background-color: #0056b3;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: white;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.bi {
  font-size: 1rem;
}
</style>
