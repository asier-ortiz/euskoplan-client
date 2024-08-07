<!-- src/components/ScrollToTop.vue -->
<template>
  <button v-show="isVisible" class="scroll-to-top" @click="scrollToTop">
    <i class="bi bi-arrow-up-circle-fill"></i>
  </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isVisible = ref(false);

const handleScroll = () => {
  // Mostrar el botón cuando se ha hecho scroll 100px hacia abajo
  isVisible.value = window.scrollY > 100;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.scroll-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 0.5rem 1rem;
  font-size: 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.3s;
  z-index: 1000;
}

.scroll-to-top:hover {
  background-color: #0056b3;
}

.scroll-to-top i {
  font-size: 2rem;
}
</style>
