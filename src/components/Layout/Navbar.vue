<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" to="/">Euskoplan</RouterLink>
      <div class="d-flex ms-auto">
        <div v-if="authStore.isLoggedIn()" class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" id="navbarDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            {{ authStore.user?.email }}
          </a>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
            <li><RouterLink class="dropdown-item" to="/account">Manage Account</RouterLink></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#" @click.prevent="logout">Logout</a></li>
          </ul>
        </div>
        <div v-else class="d-flex align-items-center">
          <RouterLink class="nav-link me-2" to="/auth/login">Login</RouterLink>
          <RouterLink class="nav-link" to="/auth/signup">Signup</RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

const authStore = useAuthStore();
const router = useRouter();

const logout = async () => {
  await authStore.logout();
  router.push('/');
};

onMounted(async () => {
  if (authStore.token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`;
    await authStore.fetchUser();
  }
});
</script>

<style scoped>
/* Estilos adicionales para la navegación */
.navbar {
  margin-bottom: 1rem;
}
</style>
