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
        <div class="chips" v-if="selectedProvince || selectedLocality || startDate || endDate">
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

        <!-- Date Pickers -->
        <div class="date-picker">
          <label for="start-date">Start Date:</label>
          <DatePicker
              v-model="startDate"
              id="start-date"
              placeholder="Select start date"
              format="YYYY-MM-DD"
          />
        </div>
        <div class="date-picker">
          <label for="end-date">End Date:</label>
          <DatePicker
              v-model="endDate"
              id="end-date"
              placeholder="Select end date"
              format="YYYY-MM-DD"
          />
        </div>

        <!-- Apply Filters Button -->
        <button @click="applyFilters" class="apply-button">Apply Filters</button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useFilterStore } from '@/stores/filter';
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'filtersApplied']);

const filterStore = useFilterStore();

// Fetch localities when the component is mounted
onMounted(() => {
  if (!filterStore.localities.length) {
    filterStore.fetchLocalities();
  }
});

// Fixed provinces options
const provinces = filterStore.provinces;

// Filtered localities according to the selected province
const filteredLocalities = computed(() => {
  return filterStore.filteredLocalities;
});

// References for the selected province and locality
const selectedProvince = ref(filterStore.selectedProvince);
const selectedLocality = ref(filterStore.selectedLocality);

// Variables for selected dates
const startDate = ref(filterStore.startDate);
const endDate = ref(filterStore.endDate);

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
  emit('filtersApplied'); // Emit event when filters are applied
  closeDrawer(); // Optionally close the drawer after applying filters
};

// Function to remove the selected province
const removeProvince = () => {
  selectedProvince.value = null;
  selectedLocality.value = null; // Clear locality if province is removed
  filterStore.filterLocalitiesByProvince(null); // Clear filtered localities
};

// Function to remove the selected locality
const removeLocality = () => {
  selectedLocality.value = null;
};

// Function to change the province
const changeProvince = () => {
  filterStore.filterLocalitiesByProvince(selectedProvince.value);
  selectedLocality.value = null; // Reset locality when changing province
};

// Function to remove the start date
const removeStartDate = () => {
  startDate.value = null;
};

// Function to remove the end date
const removeEndDate = () => {
  endDate.value = null;
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
  background-color: #e7f3fe; /* A softer blue to match the button */
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
