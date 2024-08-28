<template>
  <footer class="footer-main footer bg-dark text-lg-start text-white">
    <div class="container p-4 d-flex justify-content-between align-items-center">
      <div class="text-left">
        <p class="mb-0">&copy; {{ currentYear }} Euskoplan. All rights reserved.</p>
      </div>
      <div class="text-right">
        <p class="mb-0">
          Made with
          <span class="mx-2">
            <font-awesome-icon :icon="['fab', 'laravel']"/> +
            <font-awesome-icon :icon="['fab', 'vuejs']"/> +
            <font-awesome-icon icon="heart" class="text-danger"/>
          </span>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const currentYear = ref(new Date().getFullYear());
</script>

<style scoped>
.footer {
  background-color: #343a40; /* Dark background */
  padding: 1rem 0;
  color: #ffffff; /* White text */
}

.footer .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer .text-left {
  flex: 1;
}

.footer .text-right {
  flex: 1;
  text-align: right;
}

.footer .text-right i {
  margin: 0 0.2rem;
}

.footer .text-right .mx-2 {
  margin-left: 0.5rem; /* Increase space between "Made with" and icons */
}
</style>
