<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/Layout/Navbar.vue'
import Footer from './components/Layout/Footer.vue'
</script>

<template>
  <div>
    <Navbar />
    <main class="container mt-3">
      <RouterView />
    </main>
<!--    <Footer />-->
  </div>
</template>

<style scoped>
</style>
