<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <RouterLink class="navbar-brand text-light" to="/">Euskoplan</RouterLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li v-if="authStore.isLoggedIn()" class="nav-item dropdown">
            <a class="nav-link dropdown-toggle text-light" href="#" role="button" id="navbarDropdown" data-bs-toggle="dropdown" aria-expanded="false">
              {{ authStore.user?.email }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end mt-2" aria-labelledby="navbarDropdown">
              <li><RouterLink class="dropdown-item" to="/account">Manage Account</RouterLink></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="#" @click.prevent="logout">Logout</a></li>
            </ul>
          </li>
          <li v-else class="nav-item d-flex align-items-center">
            <RouterLink class="nav-link text-light me-2" to="/auth/login">Login</RouterLink>
            <RouterLink class="nav-link text-light" to="/auth/signup">Signup</RouterLink>
          </li>
        </ul>
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
.navbar {
  margin-bottom: 0; /* Eliminar margen inferior */
}

@media (max-width: 768px) {
  .dropdown-menu {
    position: static;
    float: none;
    width: auto;
    margin-top: 0;
  }
  .dropdown-menu-end {
    margin-bottom: 1rem;
  }
  .dropdown-toggle::after {
    margin-left: 0.255em;
  }
}
</style>
