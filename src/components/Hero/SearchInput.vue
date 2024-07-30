<template>
  <div class="mb-3">
    <label for="search" class="form-label">¿Qué te apetece hacer?</label>
    <input type="text" class="form-control" id="search" v-model="searchQuery" @input="onSearch">
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCollectionsStore } from '@/stores/collections';
import debounce from 'lodash.debounce';

const collectionsStore = useCollectionsStore();
const searchQuery = ref(collectionsStore.searchQuery);

const onSearch = debounce(() => {
  collectionsStore.searchQuery = searchQuery.value;
  if (searchQuery.value.length >= 3) {
    collectionsStore.searchAllCollections(searchQuery.value, 'es');
  } else {
    collectionsStore.searchResults = [];
  }
}, 500);

</script>

<style scoped>
/* Estilos adicionales si es necesario */
</style>
