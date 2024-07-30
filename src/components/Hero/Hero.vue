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
  justify-content: space-between;
  align-items: center;
}
.filter-button {
  margin-left: auto;
}
</style>


