<template>
  <div class="signup-container d-flex justify-content-center align-items-center">
    <div class="card p-4 shadow" style="width: 100%; max-width: 400px;">
      <h2 class="text-center mb-4">Registrarse</h2>
      <form @submit.prevent="onSubmit">
        <div class="mb-3">
          <label for="username" class="form-label">Nombre de usuario</label>
          <input
            type="text"
            class="form-control"
            id="username"
            v-model="username"
            @blur="handleBlur('username')"
            :class="{ 'is-invalid': touched.username && errors.username }"
          />
          <div class="invalid-feedback" v-if="touched.username && errors.username">
            {{ errors.username }}
          </div>
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Correo Electrónico</label>
          <input
            type="email"
            class="form-control"
            id="email"
            v-model="email"
            @blur="handleBlur('email')"
            :class="{ 'is-invalid': touched.email && errors.email }"
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
              @blur="handleBlur('password')"
              :class="{ 'is-invalid': touched.password && errors.password }"
            />
            <button type="button" class="btn btn-outline-secondary" @click="togglePassword">
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
          <div class="invalid-feedback" v-if="touched.password && errors.password">
            {{ errors.password }}
          </div>
        </div>
        <div class="mb-3">
          <label for="password_confirm" class="form-label">Confirmar Contraseña</label>
          <div class="input-group">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              class="form-control"
              id="password_confirm"
              v-model="password_confirm"
              @blur="handleBlur('password_confirm')"
              :class="{ 'is-invalid': touched.password_confirm && errors.password_confirm }"
            />
            <button type="button" class="btn btn-outline-secondary" @click="toggleConfirmPassword">
              <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
          <div class="invalid-feedback" v-if="touched.password_confirm && errors.password_confirm">
            {{ errors.password_confirm }}
          </div>
        </div>
        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Registrarse
        </button>
      </form>
      <div class="mt-3 text-center">
        <p>¿Ya tienes una cuenta? <RouterLink to="/auth/login">Iniciar Sesión</RouterLink></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import * as yup from 'yup';
import { useForm, useField } from 'vee-validate';
import router from '@/router';

const authStore = useAuthStore();

const schema = yup.object({
  username: yup.string().required('El nombre de usuario es obligatorio'),
  email: yup.string().email('Correo electrónico inválido').required('El correo electrónico es obligatorio'),
  password: yup.string().required('La contraseña es obligatoria'),
  password_confirm: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contraseñas deben coincidir')
    .required('La confirmación de la contraseña es obligatoria'),
});

const { handleSubmit, errors, validateField } = useForm({
  validationSchema: schema,
});

const { value: username } = useField('username');
const { value: email } = useField('email');
const { value: password } = useField('password');
const { value: password_confirm } = useField('password_confirm');
const touched = ref({
  username: false,
  email: false,
  password: false,
  password_confirm: false,
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

const handleBlur = (field: string) => {
  validateField(field);
  touched.value[field] = true;
};

const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true;
    console.log('Registrando:', values); // Log para depuración
    await authStore.register(values);
    router.push('/auth/login');
  } catch (error) {
    console.error('Error de registro:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.signup-container {
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
