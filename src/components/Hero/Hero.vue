<template>
  <div class="hero container my-5">
    <SearchInput />
    <div class="d-flex justify-content-between align-items-center mt-3">
      <CategoryChips />
      <FilterButton />
    </div>
    <FilterDrawer />
  </div>
</template>

<script setup>
import SearchInput from './SearchInput.vue';
import CategoryChips from './CategoryChips.vue';
import FilterButton from './FilterButton.vue';
import FilterDrawer from './FilterDrawer.vue';
</script>

<style scoped>
/* Estilos adicionales si es necesario */
</style>
