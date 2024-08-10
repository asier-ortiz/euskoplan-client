<template>
  <transition
    enter-active-class="slide-enter-active"
    leave-active-class="slide-leave-active"
    enter-class="slide-enter"
    leave-to-class="slide-leave-to"
  >
    <div class="drawer" v-if="visible">
      <div class="drawer-header">
        <span class="drawer-title">Filtros</span>
        <button class="close-button" @click="closeDrawer">&times;</button>
      </div>
      <div class="filter-content">
        <!-- Chips for selected filters -->
        <div class="chips" v-if="anyFilterSelected">
          <span v-if="selectedProvince" class="chip">
            {{ selectedProvince }}
            <button class="chip-close" @click="removeProvince">&times;</button>
          </span>
          <span v-if="selectedLocality" class="chip">
            {{ selectedLocality }}
            <button class="chip-close" @click="removeLocality">&times;</button>
          </span>
          <span v-if="startDate" class="chip">
            Start: {{ formattedStartDate }}
            <button class="chip-close" @click="removeStartDate">&times;</button>
          </span>
          <span v-if="endDate" class="chip">
            End: {{ formattedEndDate }}
            <button class="chip-close" @click="removeEndDate">&times;</button>
          </span>
          <span v-if="selectedSubCategory" class="chip">
            {{ selectedSubCategory }}
            <button class="chip-close" @click="removeSelectedCategory">&times;</button>
          </span>
        </div>

        <hr />

        <!-- Province Selector -->
        <label for="province">Provincia</label>
        <select id="province" v-model="selectedProvince" @change="applyFilters">
          <option value="" disabled>Selecciona una Provincia</option>
          <option v-for="province in provinces" :key="province" :value="province">
            {{ province }}
          </option>
        </select>

        <!-- Locality Selector with Filter Input Inside -->
        <label for="locality">Municipio</label>
        <div class="select-wrapper" :class="{ disabled: !selectedProvince }">
          <input
            type="text"
            v-model="localitySearch"
            placeholder="Filtrar Municipios"
            class="locality-search-input"
            :disabled="!selectedProvince"
            @input="filterLocalities"
          />
          <select
            id="locality"
            v-model="selectedLocality"
            @change="applyFilters"
            :disabled="!selectedProvince"
          >
            <option value="" disabled>Selecciona un Municipio</option>
            <option v-for="locality in filteredLocalities" :key="locality.id" :value="locality.nombre">
              {{ locality.nombre }}
            </option>
          </select>
        </div>

        <hr />

        <!-- Dynamic Category Selector -->
        <label v-if="currentCategories.length" for="category">
          {{ selectedCategoryName }} Categoría
        </label>
        <select
          v-if="currentCategories.length"
          id="category"
          v-model="selectedSubCategory"
          @change="applyFilters"
        >
          <option value="" disabled>Selecciona una categoría para {{ selectedCategoryName }}</option>
          <option v-for="category in currentCategories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>

        <hr v-if="selectedCategory === 'Eventos'" />

        <!-- Date Pickers, visible only if "Eventos" is selected -->
        <div v-if="selectedCategory === 'Eventos'">
          <div class="date-picker">
            <label for="start-date">Fecha de Inicio:</label>
            <DatePicker
              v-model="startDate"
              id="start-date"
              placeholder="Select start date"
              :format="'yyyy-MM-dd'"
              :value-type="'format'"
            />
          </div>
          <div class="date-picker">
            <label for="end-date">Fecha de Fin:</label>
            <DatePicker
              v-model="endDate"
              id="end-date"
              placeholder="Select end date"
              :format="'yyyy-MM-dd'"
              :value-type="'format'"
            />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useFilterStore } from '@/stores/filter';
import { useCollectionsStore } from '@/stores/collections';
import { useMapStore } from '@/stores/map'; // Import the new map store
import DatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { defineProps, defineEmits } from 'vue';
import { debounce } from 'lodash';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close', 'filtersApplied']);

const filterStore = useFilterStore();
const collectionsStore = useCollectionsStore();
const mapStore = useMapStore(); // Use the new map store

// Ensure categories are fetched when component mounts
onMounted(() => {
  if (!filterStore.localities.length) {
    filterStore.fetchLocalities();
  }
  if (!filterStore.categories.accommodation.length) {
    filterStore.fetchCategories();
  }
});

// Fixed provinces options
const provinces = filterStore.provinces;

// Locality search input for filtering
const localitySearch = ref('');

// Filtered localities according to the selected province and search input
const filteredLocalities = computed(() => {
  if (!selectedProvince.value) return [];
  const search = localitySearch.value.toLowerCase();
  return filterStore.filteredLocalities.filter((locality) =>
    locality.nombre.toLowerCase().includes(search)
  );
});

// Watch the selected category in the collections store
const selectedCategory = computed(() => collectionsStore.selectedCategory);

// Determine current categories based on the selected collection category
const currentCategories = computed(() => {
  switch (selectedCategory.value) {
    case 'Alojamientos':
      return filterStore.categories.accommodation;
    case 'Cuevas y Restos Arqueológicos':
      return filterStore.categories.cave;
    case 'Edificios Religiosos y Castillos':
      return filterStore.categories.cultural;
    case 'Eventos':
      return filterStore.categories.event;
    case 'Museos y Centros de Interpretación':
      return filterStore.categories.museum;
    case 'Espacios Naturales':
      return [
        ...filterStore.categories.natural.espacio_natural,
        ...filterStore.categories.natural.playas_pantanos_rios,
      ];
    case 'Restaurantes':
      return filterStore.categories.restaurant;
    default:
      return [];
  }
});

// References for the selected province and locality
const selectedProvince = ref(filterStore.selectedProvince);
const selectedLocality = ref(filterStore.selectedLocality);

// Variables for selected dates
const startDate = ref(filterStore.startDate);
const endDate = ref(filterStore.endDate);

// Variable for selected subcategory
const selectedCategoryName = computed(() => selectedCategory.value);

// Synchronize subcategory selection with the filter store
const selectedSubCategory = ref(
  filterStore.selectedCategories[selectedCategory.value?.toLowerCase()]
);

// Watch for changes in selected category and clear local filters
watch(selectedCategory, () => {
  clearLocalFilters();
  filterStore.clearFilters();
  debouncedApplyFilters(); // Trigger filters application on category change
});

// Watch for changes in subcategory and apply filters automatically
watch(selectedSubCategory, () => {
  debouncedApplyFilters();
});

// Watch for changes in date inputs and apply filters automatically
watch([startDate, endDate], () => {
  debouncedApplyFilters();
});

// Check if any filter is selected
const anyFilterSelected = computed(() => {
  return (
    selectedProvince.value ||
    selectedLocality.value ||
    startDate.value ||
    endDate.value ||
    selectedSubCategory.value
  );
});

// Formatted dates for displaying in chips
const formattedStartDate = computed(() =>
  startDate.value ? new Date(startDate.value).toLocaleDateString() : ''
);
const formattedEndDate = computed(() =>
  endDate.value ? new Date(endDate.value).toLocaleDateString() : ''
);

// Helper function to format date as YYYY/MM/DD
const formatDateForApi = (date) => {
  if (!date) return null;
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Intl.DateTimeFormat('es-ES', options)
    .format(new Date(date))
    .split('/')
    .reverse()
    .join('/');
};

// Function to clear local filters and reset UI elements
const clearLocalFilters = () => {
  selectedProvince.value = null;
  selectedLocality.value = null;
  startDate.value = null;
  endDate.value = null;
  selectedSubCategory.value = null;
  localitySearch.value = ''; // Clear locality search input
};

// Function to close the drawer
const closeDrawer = () => {
  emit('close');
};

// Debounce the applyFilters function to reduce API calls
const debouncedApplyFilters = debounce(() => {
  applyFilters();
}, 300);

// Function to apply filters and update the store
const applyFilters = async () => {
  // Update the filter store with the current selections
  filterStore.selectedProvince = selectedProvince.value;
  filterStore.setSelectedLocality(selectedLocality.value);
  filterStore.setStartDate(startDate.value);
  filterStore.setEndDate(endDate.value);
  filterStore.setSelectedCategory(
    selectedCategory.value?.toLowerCase(),
    selectedSubCategory.value
  );

  // Format dates for API
  const formattedStart = formatDateForApi(filterStore.startDate);
  const formattedEnd = formatDateForApi(filterStore.endDate);

  // Build query parameters dynamically
  const filters = {
    idioma: 'es',
    ...(filterStore.selectedProvince && {
      nombre_provincia: filterStore.selectedProvince,
    }),
    ...(filterStore.selectedLocality && {
      nombre_municipio: filterStore.selectedLocality,
    }),
    ...(getSubCategoryFilter() && getSubCategoryFilter()), // Use helper function to get the correct parameter
    ...(formattedStart && { fecha_inicio: formattedStart }),
    ...(formattedEnd && { fecha_fin: formattedEnd }),
  };

  // Use fetchResults to get data based on both search and filters
  await collectionsStore.fetchResults(selectedCategoryName.value, collectionsStore.searchQuery, filters);

  // Set flag to refit map bounds after filter changes
  mapStore.shouldRefitBounds = true; // Use map store to set refit flag

  // Close any open popups on the map
  mapStore.setMapPopup(null);

  emit('filtersApplied');
};

// Helper function to get the correct subcategory filter parameter
const getSubCategoryFilter = () => {
  if (selectedCategory.value === 'Espacios Naturales') {
    if (selectedSubCategory.value) {
      if (
        filterStore.categories.natural.espacio_natural.includes(selectedSubCategory.value)
      ) {
        return { nombre_subtipo_recurso_espacio_natural: selectedSubCategory.value };
      }
      if (
        filterStore.categories.natural.playas_pantanos_rios.includes(selectedSubCategory.value)
      ) {
        return { nombre_subtipo_recurso_playas_pantanos_rios: selectedSubCategory.value };
      }
    }
  } else {
    return selectedSubCategory.value
      ? { nombre_subtipo_recurso: selectedSubCategory.value }
      : null;
  }
  return null;
};

// Function to filter localities based on input
const filterLocalities = () => {
  // This function doesn't need to do anything as the filtering is handled in computed property
};

// Function to remove the selected province
const removeProvince = async () => {
  selectedProvince.value = null;
  selectedLocality.value = null;
  filterStore.filterLocalitiesByProvince(null);
  localitySearch.value = ''; // Clear locality search input
  await debouncedApplyFilters(); // Trigger query after removal
};

// Function to remove the selected locality
const removeLocality = async () => {
  selectedLocality.value = null;
  await debouncedApplyFilters(); // Trigger query after removal
};

// Function to remove the start date
const removeStartDate = async () => {
  startDate.value = null;
  await debouncedApplyFilters(); // Trigger query after removal
};

// Function to remove the end date
const removeEndDate = async () => {
  endDate.value = null;
  await debouncedApplyFilters(); // Trigger query after removal
};

// Function to remove the selected category
const removeSelectedCategory = async () => {
  selectedSubCategory.value = null;
  await debouncedApplyFilters(); // Trigger query after removal
};
</script>

<style scoped>
.drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
  padding: 1rem;
  z-index: 1000;
  overflow-y: auto;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.drawer-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  color: #ffffff;
  background-color: #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s, color 0.3s;
}

.close-button:hover {
  background-color: #0056b3;
}

.filter-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chip {
  background-color: #e7f3fe;
  color: #0056b3;
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.chip-close {
  background: none;
  border: none;
  color: #0056b3;
  font-size: 1rem;
  cursor: pointer;
}

.select-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
}

.locality-search-input {
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
}

select {
  width: 100%;
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
}

select:disabled,
.locality-search-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.date-picker {
  display: flex;
  flex-direction: column;
}

hr {
  border: none;
  border-top: 1px solid #ccc;
  margin: 1rem 0;
}
</style>
