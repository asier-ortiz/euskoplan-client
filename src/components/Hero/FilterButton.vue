<template>
  <button @click="toggleFilterDrawer" class="filter-button">
    Filter <i class="bi bi-funnel"></i>
  </button>
</template>

<script setup>
const emit = defineEmits(['toggleFilterDrawer']);

const toggleFilterDrawer = () => {
  emit('toggleFilterDrawer');
};
</script>

<style scoped>
.filter-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 25px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.filter-button:hover {
  background-color: #0056b3;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.filter-button i {
  font-size: 1rem;
}
</style>
