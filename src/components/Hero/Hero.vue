<template>
  <div>
    <h1>¿Qué te apetece hacer?</h1>
    <SearchInput @search="onSearch" />
    <br />
    <div class="chips-and-filter">
      <CategoryChips @chipSelected="onChipSelected" />
    </div>
    <hr class="chips-divider"/>
    <div class="filter-button-container">
      <FilterButton @toggleFilterDrawer="toggleFilterDrawer" />
    </div>
    <FilterDrawer :visible="isFilterDrawerVisible" @close="toggleFilterDrawer" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { defineEmits } from 'vue';
import SearchInput from '@/components/Hero/SearchInput.vue';
import CategoryChips from '@/components/Hero/CategoryChips.vue';
import FilterDrawer from '@/components/Hero/FilterDrawer.vue';
import FilterButton from '@/components/Hero/FilterButton.vue';

const emit = defineEmits(['chipSelected', 'search']);
const isFilterDrawerVisible = ref(false);

const toggleFilterDrawer = () => {
  isFilterDrawerVisible.value = !isFilterDrawerVisible.value;
};

const onChipSelected = (category) => {
  emit('chipSelected', category);
};

const onSearch = (query) => {
  emit('search', query);
};
</script>

<style scoped>
.chips-and-filter {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.chips-divider {
  margin: 1rem 0;
}

.filter-button-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}
</style>
