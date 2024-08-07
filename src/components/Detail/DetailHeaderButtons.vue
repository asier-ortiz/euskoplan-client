<template>
  <div class="header-buttons">
    <button @click="goBackHome" class="header-button small-button">
      ← Volver a la página principal
    </button>
    <div class="action-buttons">
      <button class="header-button" @click="handleAddToPlan">
        <font-awesome-icon :icon="['fas', 'map']" /> Añadir a a un Plan
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

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
  width: 100%;
  max-width: 800px;
  margin: 0 auto 1.5rem;
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
  margin: 0.25rem;
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

/* Estilo específico para el botón "Inicio" en pantallas grandes */
.small-button {
  flex-grow: 0; /* No crece como los otros botones */
  padding: 0.5rem 0.75rem; /* Reduce el padding para hacerlo más pequeño */
}

/* Media query para pantallas pequeñas */
@media (max-width: 600px) {
  .header-buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .header-button {
    max-width: 100%;
  }

  .action-buttons {
    flex-direction: column;
    gap: 0;
  }

  .small-button {
    flex-grow: 1; /* En pantallas pequeñas, el botón "Inicio" también se expande */
  }
}
</style>
