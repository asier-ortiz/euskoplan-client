<template>
  <div class="password-recovery-container d-flex justify-content-center align-items-center">
    <div class="card p-4 shadow" style="width: 100%; max-width: 400px;">
      <h2 class="text-center mb-4">Solicitar Recuperación de Contraseña</h2>
      <form @submit.prevent="requestPasswordReset">
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
        <button type="submit" class="btn btn-primary w-100">Enviar Correo de Recuperación</button>
      </form>
      <div class="mt-3 text-center">
        <p>Volver a  <RouterLink to="/auth/login">Iniciar Sesión</RouterLink></p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

export default defineComponent({
  setup() {
    const email = ref('');
    const authStore = useAuthStore();

    const requestPasswordReset = () => {
      authStore.requestPasswordReset(email.value);
    };

    return {
      email,
      requestPasswordReset,
    };
  },
});
</script>

<style scoped>
.password-recovery-container {
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
