<template>
  <div class="login-container d-flex justify-content-center align-items-center">
    <div class="card p-4 shadow" style="width: 100%; max-width: 400px;">
      <h2 class="text-center mb-4">Iniciar Sesión</h2>
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
          />
          <div class="invalid-feedback" v-if="touched.email && errors.email">
            {{ errors.email }}
          </div>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Contraseña</label>
          <div class="input-group">
            <input
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              id="password"
              v-model="password"
              @blur="validateField('password')"
              :class="{ 'is-invalid': touched.password && errors.password }"
              @input="touched.password = true"
            />
            <button type="button" class="btn btn-outline-secondary" @click="togglePassword">
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
          <div class="invalid-feedback" v-if="touched.password && errors.password">
            {{ errors.password }}
          </div>
        </div>
        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Iniciar Sesión
        </button>
      </form>
      <div class="mt-3 text-center">
        <p>¿No tienes una cuenta? <RouterLink to="/auth/signup">Regístrate</RouterLink></p>
        <p><RouterLink to="/auth/password-recovery">¿Olvidaste tu contraseña?</RouterLink></p>
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
  password: yup.string().required('La contraseña es obligatoria'),
});

const { handleSubmit, errors, validateField } = useForm({
  validationSchema: schema,
});

const { value: email } = useField('email');
const { value: password } = useField('password');
const touched = ref({
  email: false,
  password: false,
});
const showPassword = ref(false);
const loading = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true;
    console.log('Enviando:', values); // Log para depuración
    await authStore.login(values);
    await Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: '¡Inicio de sesión exitoso!',
    });
    // No necesitamos un redireccionamiento adicional aquí
  } catch (error) {
    if (error.message === 'Invalid credentials') {
      await Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: 'Correo electrónico o contraseña inválidos. Inténtalo de nuevo.',
      });
    } else {
      console.error('Error inesperado:', error);
    }
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.login-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f0f0f0;
  min-height: calc(100vh - 160px); /* Adjusted to account for both navbar and footer height */
}

.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  display: block;
}

.input-group-text {
  cursor: pointer;
}

.spinner-border {
  margin-right: 5px;
}

.card {
  border-radius: 10px;
}
</style>
