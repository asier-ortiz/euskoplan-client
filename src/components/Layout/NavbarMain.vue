<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <!-- Left-aligned brand and links -->
      <RouterLink class="navbar-brand text-light euskoplan-brand" to="/">Euskoplan</RouterLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
              aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <RouterLink class="nav-link text-light" to="/">Explora</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link text-light" to="/">Planes</RouterLink>
          </li>
        </ul>
        <ul class="navbar-nav ms-auto align-items-center">
          <!-- Custom Language Picker -->
          <li class="nav-item me-3 position-relative language-selector">
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
import { ref, onMounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

const authStore = useAuthStore();
const router = useRouter();

const dropdownVisible = ref(false);

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

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.language-selector')) {
    dropdownVisible.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

// Cleanup event listener
import { onBeforeUnmount } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Ensure the navbar correctly displays the user's email after login/verification
onMounted(async () => {
  if (authStore.token && !authStore.user) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`;
    await authStore.fetchUser();
  }
});
</script>

<style scoped>
.navbar {
  margin-bottom: 0; /* Remove bottom margin */
}

.euskoplan-brand {
  font-size: 1.5rem; /* Larger text for Euskoplan */
  font-weight: bold; /* Make it bold */
}

.nav-link {
  transition: color 0.3s ease, background-color 0.3s ease;
  border-radius: 5px; /* Ensure corners are always rounded */
  padding: 0.5rem 1rem; /* Add padding to make the hover effect more prominent */
  margin-right: 1rem; /* Add space between the links */
}

.nav-link:hover {
  color: #ffffff; /* Change text color on hover for readability */
  background-color: #0056b3; /* Background color change on hover */
}

.login-button {
  background-color: #007bff; /* Always have a background for the login/register button */
  border-radius: 5px; /* Rounded corners */
  padding: 0.5rem 1rem; /* Padding for a button-like appearance */
}

.login-button:hover {
  background-color: #0056b3; /* Darker blue on hover */
  color: #ffffff; /* Ensure text remains white */
}

/* Custom Language Picker styling */
.language-selector {
  position: relative;
}

.language-picker {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 0.3rem; /* Adjust gap between icon and text */
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.language-picker:hover {
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
  margin-left: 0.2rem; /* Adjust space between text and arrow */
  color: white;
  transition: color 0.3s ease;
}

.language-dropdown {
  position: absolute;
  top: 140%; /* Further space the dropdown from the selector */
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

  /* Ensure navbar items are properly aligned in mobile mode */
  .navbar-collapse {
    justify-content: space-between;
  }

  .navbar-nav.me-auto {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .navbar-nav.ms-auto {
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }

  /* Make the language picker always visible */
  .language-picker {
    max-width: 100%; /* Full width in mobile view */
  }
}
</style>
