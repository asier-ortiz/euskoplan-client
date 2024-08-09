<template>
  <button @click="toggleFilterDrawer" class="filter-button">
    <font-awesome-icon icon="filter" /> Filtros
    <span v-if="filterCount > 0" class="filter-count">{{ filterCount }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue';
import { defineEmits } from 'vue';
import { useFilterStore } from '@/stores/filter';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const emit = defineEmits(['toggleFilterDrawer']);

const filterStore = useFilterStore();

// Calculate the number of applied filters using the getter from the store
const filterCount = computed(() => filterStore.filterCount);

// Emit the event to open/close the drawer
const toggleFilterDrawer = () => {
  emit('toggleFilterDrawer');
};
</script>

<style scoped>
.filter-button {
  position: relative;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 25px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.filter-button:hover {
  background-color: #0056b3;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.filter-count {
  position: absolute;
  top: -5px;
  right: -10px;
  background-color: red;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
}
</style>
