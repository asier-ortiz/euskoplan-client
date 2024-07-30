<template>
  <div class="mb-3">
    <label for="search" class="form-label">¿Qué te apetece hacer?</label>
    <input
        type="text"
        class="form-control"
        id="search"
        v-model="searchQuery"
        @input="debouncedSearch"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCollectionsStore } from '@/stores/collections';
import { debounce } from 'lodash-es'; // Ensure lodash-es is installed

const collectionsStore = useCollectionsStore();
const searchQuery = ref('');

const onSearch = () => {
  collectionsStore.searchQuery = searchQuery.value;
};

// Debounce search to prevent multiple rapid requests
const debouncedSearch = debounce(onSearch, 300);
</script>

<style scoped>
/* Additional styles if needed */
</style>
