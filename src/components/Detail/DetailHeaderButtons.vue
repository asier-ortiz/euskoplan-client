<template>
  <div class="header-buttons">
    <button @click="goBackHome" class="header-button">
      ← Inicio
    </button>
    <div class="action-buttons">
      <button class="header-button" @click="handleAddToPlan">
        <font-awesome-icon :icon="['fas', 'map']" /> Añadir al Plan
      </button>
      <button @click="toggleFavorite" class="header-button">
        <font-awesome-icon :icon="[isFavorite ? 'fas' : 'far', 'heart']" />
        {{ isFavorite ? 'Eliminar de Favoritos' : 'Añadir a Favoritos' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  goBackHome: () => void;
  handleAddToPlan: () => void;
  toggleFavorite: () => void;
  isFavorite: boolean;
}>();
</script>

<style scoped>
.header-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto 1.5rem; /* Remove left/right margin, add space below */
  width: 100%;
  padding: 0; /* Ensure no padding on container */
  flex-wrap: wrap;
}

.header-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  margin: 0; /* Ensure no margin around buttons */
}

.header-button:hover {
  background-color: #0056b3;
}

.header-button svg {
  margin-right: 0.5rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}
</style>
