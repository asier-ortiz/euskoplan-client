<template>
  <div class="pagination">
    <button
        :disabled="currentPage === 1"
        @click="goToPage(1)"
    >
      Primera
    </button>

    <button
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
    >
      Anterior
    </button>

    <span>Página {{ currentPage }} de {{ totalPages }}</span>

    <button
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
    >
      Siguiente
    </button>

    <button
        :disabled="currentPage === totalPages"
        @click="goToPage(totalPages)"
    >
      Última
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCollectionsStore } from '@/stores/collections';

const collectionsStore = useCollectionsStore();

const currentPage = computed(() => collectionsStore.currentPage);
const totalPages = computed(() => collectionsStore.totalPages);

const goToPage = (page: number) => {
  collectionsStore.setCurrentPage(page);
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem; /* Increased margin for more space above */
  gap: 1rem;
  flex-wrap: wrap; /* Allows wrapping on smaller screens */
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s, color 0.3s;
  font-size: 1rem;
}

button:disabled {
  background-color: #d3d3d3;
  cursor: not-allowed;
}

button:not(:disabled):hover {
  background-color: #0056b3;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: white; /* Ensures text remains white on hover */
}

@media (max-width: 600px) {
  .pagination {
    flex-direction: column;
    gap: 0.5rem; /* Reduced gap for smaller screens */
  }

  button {
    width: 100%; /* Full-width buttons on small screens */
    font-size: 0.9rem; /* Slightly smaller font size */
  }
}
</style>
