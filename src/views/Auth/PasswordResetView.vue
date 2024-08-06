<template>
  <div class="password-reset-container d-flex justify-content-center align-items-center">
    <div class="card p-4 shadow" style="width: 100%; max-width: 400px;">
      <h2 class="text-center mb-4">Restablecer Contraseña</h2>
      <form @submit.prevent="resetPassword">
        <div class="mb-3">
          <label for="token" class="form-label">Token de Restablecimiento</label>
          <input
            type="text"
            class="form-control"
            id="token"
            v-model="token"
            required
          />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Correo Electrónico</label>
          <input
            type="email"
            class="form-control"
            id="email"
            v-model="email"
            required
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Nueva Contraseña</label>
          <input
            type="password"
            class="form-control"
            id="password"
            v-model="password"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary w-100">Restablecer Contraseña</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

export default defineComponent({
  setup() {
    const token = ref('');
    const email = ref('');
    const password = ref('');
    const authStore = useAuthStore();

    const resetPassword = () => {
      authStore.resetPassword({ token: token.value, email: email.value, password: password.value });
    };

    return {
      token,
      email,
      password,
      resetPassword,
    };
  },
});
</script>

<style scoped>
.password-reset-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f0f0f0;
  min-height: calc(100vh - 160px); /* Adjusted to account for both navbar and footer height */
}

.card {
  border-radius: 10px;
}
</style>
