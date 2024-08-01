<template>
  <div class="app-container">
    <Navbar />
    <main class="content-container">
      <RouterView />
    </main>
    <Footer />
    <ScrollToTop />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import Navbar from '@/components/Layout/Navbar.vue';
import Footer from '@/components/Layout/Footer.vue';
import ScrollToTop from '@/components/ScrollToTop.vue';
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
  overflow-x: hidden; /* Hide horizontal overflow */
  padding: 0 15px; /* Add some horizontal padding if needed */
}
</style>
