<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
    <div class="container-fluid d-flex justify-content-between align-items-center">
      <!-- Left-aligned brand with icon -->
      <RouterLink class="navbar-brand text-light euskoplan-brand d-flex align-items-center" to="/landing">
        <img src="/images/euskoplan-icon.png" alt="Euskoplan Icon" class="euskoplan-icon me-2" />
        Euskoplan
      </RouterLink>

      <!-- Toggler and Language Picker (both controls for mobile) -->
      <div class="d-flex align-items-center d-lg-none">
        <!-- Language Picker for small screens (visible with hamburger) -->
        <div class="language-selector-mobile">
          <div class="language-picker" @click="toggleDropdown">
            <font-awesome-icon :icon="['fas', 'globe']" class="globe-icon" />
            <span class="language-text">Español</span>
            <font-awesome-icon :icon="['fas', 'caret-down']" class="select-arrow" />
          </div>
          <div v-if="dropdownVisible" class="language-dropdown">
            <div class="dropdown-item" @click="selectLanguage('es')">Español</div>
            <div class="dropdown-item" @click="selectLanguage('eu')">Euskera</div>
          </div>
        </div>

        <!-- Toggler for collapsed content (hamburger menu) -->
        <button class="navbar-toggler ms-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>

      <!-- Collapsible content -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <RouterLink
              class="nav-link text-light"
              :class="{ active: isActive('/') }"
              to="/"
            >
              Explora
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink
              class="nav-link text-light"
              :class="{ active: isActive('/plans') }"
              to="/plans"
            >
              Planes
            </RouterLink>
          </li>
        </ul>

        <!-- Add the separator and space -->
        <hr class="dropdown-divider-white d-lg-none my-2" />

        <ul class="navbar-nav ms-auto align-items-center">
          <!-- Language Picker for large screens -->
          <li v-if="isDesktop" class="nav-item me-3 position-relative language-selector-desktop">
            <div class="language-picker" @click="toggleDropdown">
              <font-awesome-icon :icon="['fas', 'globe']" class="globe-icon" />
              <span class="language-text">Español</span>
              <font-awesome-icon :icon="['fas', 'caret-down']" class="select-arrow" />
            </div>
            <div v-if="dropdownVisible" class="language-dropdown">
              <div class="dropdown-item" @click="selectLanguage('es')">Español</div>
              <div class="dropdown-item" @click="selectLanguage('eu')">Euskera</div>
            </div>
          </li>

          <!-- Right-aligned login/register or account dropdown -->
          <li v-if="authStore.isLoggedIn()" class="nav-item dropdown">
            <a class="nav-link dropdown-toggle text-light" href="#" role="button" id="navbarDropdown"
               data-bs-toggle="dropdown" aria-expanded="false">
              {{ authStore.user?.email }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end mt-2" aria-labelledby="navbarDropdown">
              <li>
                <RouterLink class="dropdown-item" to="/account">Manage Account</RouterLink>
              </li>
              <li>
                <hr class="dropdown-divider">
              </li>
              <li><a class="dropdown-item" href="#" @click.prevent="logout">Logout</a></li>
            </ul>
          </li>
          <li v-else class="nav-item d-flex align-items-center">
            <RouterLink class="nav-link login-button text-light me-2" to="/auth/login">Regístrate o inicia sesión</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const dropdownVisible = ref(false);
const isDesktop = ref(window.innerWidth >= 992);

const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value;
};

const selectLanguage = (lang: string) => {
  console.log(`Language selected: ${lang}`);
  dropdownVisible.value = false;
};

const logout = async () => {
  await authStore.logout();
  router.push('/');
};

const handleResize = () => {
  isDesktop.value = window.innerWidth >= 992;
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.language-selector-desktop') && !target.closest('.language-selector-mobile')) {
    dropdownVisible.value = false;
  }
};

const isActive = (path: string) => {
  return route.path === path;
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', handleResize);
});

onMounted(async () => {
  if (authStore.token && !authStore.user) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`;
    await authStore.fetchUser();
  }
});
</script>

<style scoped>
.navbar {
  margin-bottom: 0;
  position: sticky; /* Hacer la navbar sticky */
  top: 0; /* Posicionarla en la parte superior */
  z-index: 1030; /* Asegurar que la navbar se mantenga encima de otros elementos */
  background-color: #343a40; /* Asegurarse de que la navbar tenga un fondo sólido */
}

.euskoplan-brand {
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  line-height: 1;
}

.euskoplan-icon {
  height: 28px;
  width: auto;
  margin-right: 8px;
}

.nav-link {
  display: inline-block;
  transition: color 0.3s ease, background-color 0.3s ease;
  border-radius: 5px;
  padding: 0.5rem 0.75rem;
  margin-right: 1rem;
}

.nav-link.active,
.nav-link:hover {
  color: #ffffff;
  background-color: #0056b3;
}

.login-button {
  display: inline-block;
  background-color: #007bff;
  border-radius: 5px;
  padding: 0.5rem 0.75rem;
}

.login-button:hover {
  background-color: #0056b3;
  color: #ffffff;
}

.language-selector-mobile,
.language-selector-desktop {
  position: relative;
}

.language-picker,
.nav-item .nav-link {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 0.3rem;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.language-picker:hover,
.nav-item .nav-link:hover {
  background-color: #0056b3;
}

.language-picker .globe-icon {
  font-size: 1.1rem;
}

.language-picker .language-text {
  font-weight: bold;
  font-size: 0.9rem;
}

.select-arrow {
  margin-left: 0.2rem;
  color: white;
  transition: color 0.3s ease;
}

.language-dropdown {
  position: absolute;
  top: 140%;
  left: 0;
  background-color: #343a40;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 100%;
  padding: 0.5rem 0;
}

.language-dropdown .dropdown-item {
  color: white;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.language-dropdown .dropdown-item:hover {
  background-color: #0056b3;
}

.dropdown-menu .dropdown-item:hover {
  background-color: #f0f8ff !important;
  color: #000000;
}

.dropdown-divider-white {
  border-top: 1px solid #ffffff;
}

@media (max-width: 991px) {
  .navbar-nav .nav-item {
    text-align: left;
    width: 100%;
    margin-top: 0.5rem;
  }

  .login-button {
    padding-left: 1rem;
  }

  .dropdown-divider-white {
    margin: 1rem 0;
  }
}

@media (min-width: 992px) {

  .navbar-collapse {
    justify-content: flex-end;
  }

  .language-selector-desktop {
    margin-right: 1rem;
  }

  .navbar-toggler {
    margin-left: auto;
  }
}
</style>
