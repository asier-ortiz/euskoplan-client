<template>
  <div class="app-container">
    <Navbar />
    <main class="content-container container mt-3">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import Navbar from './components/Layout/Navbar.vue';
import Footer from './components/Layout/Footer.vue';
import { useLocationStore } from '@/stores/location';

const locationStore = useLocationStore();

onMounted(() => {
  locationStore.fetchUserLocation();
});
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f0f0f0;
}

.content-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
