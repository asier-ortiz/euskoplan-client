<template>
  <div>
    <h1>¿Qué te apetece hacer?</h1>
    <SearchInput />
    <div class="chips-and-filter">
      <CategoryChips @chipSelected="onChipSelected" />
      <button @click="toggleFilterDrawer" class="filter-button">
        Filter <i class="bi bi-funnel"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';
import SearchInput from '@/components/Hero/SearchInput.vue';
import CategoryChips from '@/components/Hero/CategoryChips.vue';

const emit = defineEmits(['chipSelected']);

const toggleFilterDrawer = () => {
  // Lógica para mostrar el drawer
};

const onChipSelected = (category) => {
  emit('chipSelected', category);
};
</script>

<style scoped>
.chips-and-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-top: 1rem;
}
.filter-button {
  margin-left: auto;
  padding: 0.5rem 1rem;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.filter-button i {
  margin-left: 0.5rem;
}
.filter-button:hover {
  background-color: #0056b3;
}
</style>
