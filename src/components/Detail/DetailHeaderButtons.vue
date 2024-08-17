<template>
  <div class="header-buttons">
    <button @click="goBackHome" class="header-button small-button">
      ← Volver a la página principal
    </button>
    <div class="action-buttons">
      <button class="header-button" @click="handleAddToPlan">
        <font-awesome-icon :icon="['fas', 'map']" /> Añadir a un Plan
      </button>
      <button @click="toggleFavorite" class="header-button">
        <font-awesome-icon :icon="[isFavorite ? 'fas' : 'far', 'heart']" :class="{ 'favorite-icon': isFavorite }" />
        {{ isFavorite ? 'Eliminar de Favoritos' : 'Añadir a Favoritos' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

defineProps<{
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
  width: 100%;
  padding: 0;
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
  justify-content: center;
  margin: 0.25rem 0;
  box-sizing: border-box;
  flex-grow: 1;
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
  flex: 0 0 auto;
}

/* Specific style for the "Inicio" button on larger screens */
.small-button {
  flex-grow: 0;
  padding: 0.5rem 0.75rem;
}

/* Media query for smaller screens */
@media (max-width: 900px) {
  .header-buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .header-button {
    max-width: 100%;
  }

  .action-buttons {
    margin-top: 1.5rem;
    flex-direction: column;
    gap: 0;
  }

  .small-button {
    flex-grow: 1;
  }
}

/* Style for the favorite icon */
.favorite-icon {
  color: red; /* Change the icon color to red when marked as favorite */
}
</style>

