<template>
  <div>
    <h1>¿Qué te apetece hacer?</h1>
    <SearchInput />
    <br />
    <div class="chips-and-filter">
      <CategoryChips @chipSelected="onChipSelected" />
    </div>
    <hr class="chips-divider"/>
    <FilterButton @toggleFilterDrawer="toggleFilterDrawer" />
    <FilterDrawer :visible="isFilterDrawerVisible" @close="toggleFilterDrawer" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { defineEmits } from 'vue';
import SearchInput from '@/components/Hero/SearchInput.vue';
import CategoryChips from '@/components/Hero/CategoryChips.vue';
import FilterButton from '@/components/Hero/FilterButton.vue';
import FilterDrawer from '@/components/Hero/FilterDrawer.vue';

const emit = defineEmits(['chipSelected']);
const isFilterDrawerVisible = ref(false);

const toggleFilterDrawer = () => {
  isFilterDrawerVisible.value = !isFilterDrawerVisible.value;
};

const onChipSelected = (category) => {
  emit('chipSelected', category);
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
</style>
