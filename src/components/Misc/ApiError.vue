<template>
  <div class="error-container">
    <p>Lo sentimos, hubo un problema al conectar con el servidor.</p>
    <button @click="retry">Reintentar</button>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';

const emit = defineEmits(['retry']);

const retry = () => {
  emit('retry');
};
</script>

<style scoped>
.error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  color: #721c24;
  text-align: center;
  margin: 10vh auto; /* Centered vertically with some top margin */
  max-width: 400px; /* Max width for larger screens */
  width: 90%; /* Make it responsive to the screen size */
  box-sizing: border-box; /* Include padding in the width/height */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Slight shadow for depth */
}

p {
  font-size: 1.1rem; /* Slightly larger text for readability */
  margin: 0 0 1rem 0; /* Space between text and button */
}

button {
  padding: 0.5rem 1rem;
  background-color: #d9534f;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #c9302c;
}

@media (max-width: 600px) {
  .error-container {
    padding: 1rem;
    margin: 20vh auto; /* Adjusted margin for small screens */
  }

  p {
    font-size: 1rem;
  }

  button {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
}
</style>
