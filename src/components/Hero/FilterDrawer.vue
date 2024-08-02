<template>
  <transition
    enter-active-class="slide-enter-active"
    leave-active-class="slide-leave-active"
    enter-class="slide-enter"
    leave-to-class="slide-leave-to"
  >
    <div class="drawer" v-if="visible">
      <div class="drawer-header">
        <button class="close-button" @click="closeDrawer">Cerrar</button>
      </div>
      <div class="filter-content">
        <!-- Chips for selected filters -->
        <div class="chips" v-if="selectedProvince || selectedLocality || startDate || endDate || selectedSubCategory">
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

        <!-- Province Selector -->
        <select v-model="selectedProvince" @change="changeProvince">
          <option value="" disabled>Select Province</option>
          <option v-for="province in provinces" :key="province" :value="province">
            {{ province }}
          </option>
        </select>

        <!-- Locality Selector -->
        <select v-model="selectedLocality" :disabled="!selectedProvince">
          <option value="" disabled>Select Locality</option>
          <option v-for="locality in filteredLocalities" :key="locality.id" :value="locality.nombre">
            {{ locality.nombre }}
          </option>
        </select>

        <!-- Dynamic Category Selector -->
        <select v-if="currentCategories.length" v-model="selectedSubCategory">
          <option value="" disabled>Select {{ selectedCategoryName }} Category</option>
          <option v-for="category in currentCategories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>

        <!-- Date Pickers, visible only if "Eventos" is selected -->
        <div v-if="selectedCategory === 'Eventos'">
          <div class="date-picker">
            <label for="start-date">Start Date:</label>
            <DatePicker
              v-model="startDate"
              id="start-date"
              placeholder="Select start date"
              :format="'yyyy-MM-dd'"
              :value-type="'format'"
            />
          </div>
          <div class="date-picker">
            <label for="end-date">End Date:</label>
            <DatePicker
              v-model="endDate"
              id="end-date"
              placeholder="Select end date"
              :format="'yyyy-MM-dd'"
              :value-type="'format'"
            />
          </div>
        </div>

        <!-- Apply Filters Button -->
        <button @click="applyFilters" class="apply-button">Apply Filters</button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useFilterStore } from '@/stores/filter';
import { useCollectionsStore } from '@/stores/collections';
import DatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'filtersApplied']);

const filterStore = useFilterStore();
const collectionsStore = useCollectionsStore();

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

// Filtered localities according to the selected province
const filteredLocalities = computed(() => filterStore.filteredLocalities);

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
        ...filterStore.categories.natural.playas_pantanos_rios
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
const selectedSubCategory = ref(filterStore.selectedCategories[selectedCategory.value?.toLowerCase()]);

// Formatted dates for displaying in chips
const formattedStartDate = computed(() => startDate.value ? new Date(startDate.value).toLocaleDateString() : '');
const formattedEndDate = computed(() => endDate.value ? new Date(endDate.value).toLocaleDateString() : '');

// Function to close the drawer
const closeDrawer = () => {
  emit('close');
};

// Function to apply filters and update the store
const applyFilters = () => {
  filterStore.selectedProvince = selectedProvince.value;
  filterStore.selectedLocality = selectedLocality.value;
  filterStore.startDate = startDate.value;
  filterStore.endDate = endDate.value;
  filterStore.setSelectedCategory(selectedCategory.value, selectedSubCategory.value);
  emit('filtersApplied');
  closeDrawer();
};

// Function to remove the selected province
const removeProvince = () => {
  selectedProvince.value = null;
  selectedLocality.value = null;
  filterStore.filterLocalitiesByProvince(null);
};

// Function to remove the selected locality
const removeLocality = () => {
  selectedLocality.value = null;
};

// Function to change the province
const changeProvince = () => {
  filterStore.filterLocalitiesByProvince(selectedProvince.value);
  selectedLocality.value = null;
};

// Function to remove the start date
const removeStartDate = () => {
  startDate.value = null;
};

// Function to remove the end date
const removeEndDate = () => {
  endDate.value = null;
};

// Function to remove the selected category
const removeSelectedCategory = () => {
  selectedSubCategory.value = null;
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
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  color: #007bff;
  transition: color 0.3s;
}

.close-button:hover {
  color: #0056b3;
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

select {
  width: 100%;
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.date-picker {
  display: flex;
  flex-direction: column;
}

.apply-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.apply-button:hover {
  background-color: #0056b3;
}
</style>
