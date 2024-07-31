<template>
  <div>
    <h1>¿Qué te apetece hacer?</h1>
    <SearchInput @search="onSearch" />
    <br />
    <div class="chips-and-filter">
      <CategoryChips @chipSelected="onChipSelected" />
    </div>
    <hr class="chips-divider"/>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';
import SearchInput from '@/components/Hero/SearchInput.vue';
import CategoryChips from '@/components/Hero/CategoryChips.vue';

const emit = defineEmits(['chipSelected', 'search']);

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
</style>
