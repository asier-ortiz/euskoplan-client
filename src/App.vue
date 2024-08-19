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
import Navbar from '@/components/Layout/NavbarMain.vue';
import Footer from '@/components/Layout/FooterMain.vue';
import ScrollToTop from '@/components/Misc/ScrollToTop.vue';
import { useLocationStore } from '@/stores/location';
import { useAuthStore } from '@/stores/auth';

const locationStore = useLocationStore();
const authStore = useAuthStore();

onMounted(() => {
  locationStore.fetchUserLocation();
  authStore.initializeAuth(); // Initialize authentication state on app load
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
