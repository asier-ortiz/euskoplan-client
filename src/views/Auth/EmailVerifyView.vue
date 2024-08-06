<template>
  <div class="email-verify-container d-flex justify-content-center align-items-center">
    <div class="card p-4 shadow text-center" style="width: 100%; max-width: 400px;">
      <h2>Verificación de Correo Electrónico</h2>
      <div v-if="loading">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p>Verificando tu correo electrónico...</p>
      </div>
      <div v-else>
        <p v-if="error">{{ error }}</p>
        <p v-else-if="success">{{ success }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const loading = ref(true);
const success = ref<string | null>(null);
const error = ref<string | null>(null);

onMounted(async () => {
  const token = route.query.token as string;
  if (!token) {
    error.value = 'Token inválido';
    loading.value = false;
    return;
  }

  try {
    await authStore.verifyEmail(token);
    success.value = 'Tu correo electrónico ha sido verificado. Serás redirigido a la página principal.';
    setTimeout(() => {
      router.push('/');
    }, 3000);
  } catch (err) {
    error.value = 'Hubo un error al verificar tu correo electrónico. Se te ha enviado un nuevo correo de verificación.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.email-verify-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f0f0f0;
  min-height: calc(100vh - 160px); /* Adjusted to account for both navbar and footer height */
}

.spinner-border {
  margin-bottom: 20px;
}

.card {
  border-radius: 10px;
}
</style>
