<template>
  <div class="password-recovery-container d-flex justify-content-center align-items-center">
    <div class="card p-4 shadow" style="width: 100%; max-width: 400px;">
      <h2 class="text-center mb-4">Solicitar Recuperación de Contraseña</h2>
      <form @submit.prevent="onSubmit">
        <div class="mb-3">
          <label for="email" class="form-label">Correo Electrónico</label>
          <input
            type="email"
            class="form-control"
            id="email"
            v-model="email"
            @blur="validateField('email')"
            :class="{ 'is-invalid': touched.email && errors.email }"
            @input="touched.email = true"
            required
          />
          <div class="invalid-feedback" v-if="touched.email && errors.email">
            {{ errors.email }}
          </div>
        </div>
        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Enviar Correo de Recuperación
        </button>
      </form>
      <div class="mt-3 text-center">
        <p>Volver a <RouterLink to="/auth/login">Iniciar Sesión</RouterLink></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import Swal from 'sweetalert2';
import * as yup from 'yup';
import { useForm, useField } from 'vee-validate';
import router from '@/router';

const authStore = useAuthStore();

const schema = yup.object({
  email: yup.string().email('Correo electrónico inválido').required('El correo electrónico es obligatorio'),
});

const { handleSubmit, errors, validateField } = useForm({
  validationSchema: schema,
});

const { value: email } = useField('email');
const touched = ref({
  email: false,
});
const loading = ref(false);

const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true;
    await authStore.requestPasswordReset(values.email);
    await Swal.fire({
      icon: 'success',
      title: 'Correo Enviado',
      text: 'Se ha enviado un correo electrónico para restablecer tu contraseña.',
    });
    await router.push('/');
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo enviar el correo. Por favor, inténtalo de nuevo.',
    });
  } finally {
    loading.value = false;
  }
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

.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  display: block;
}

.spinner-border {
  margin-right: 5px;
}
</style>
