<template>
  <div class="mb-3">
    <label for="search" class="form-label">¿Qué te apetece hacer?</label>
    <input type="text" class="form-control" id="search" v-model="searchQuery" @input="onSearch">
  </div>
</template>

<script setup>
import { ref } from 'vue';

const searchQuery = ref('');
const onSearch = () => {
  // Emitir evento de búsqueda o manejar la búsqueda aquí
  console.log(searchQuery.value);
};
</script>

<style scoped>
/* Estilos adicionales si es necesario */
</style>
