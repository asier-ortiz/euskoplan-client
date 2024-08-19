<template>
  <div class="password-reset-container d-flex justify-content-center align-items-center">
    <div class="card p-4 shadow" style="width: 100%; max-width: 400px;">
      <h2 class="text-center mb-4">Restablecer Contraseña</h2>
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
        <div class="mb-3">
          <label for="password" class="form-label">Nueva Contraseña</label>
          <div class="input-group">
            <input
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              id="password"
              v-model="password"
              @blur="validateField('password')"
              :class="{ 'is-invalid': touched.password && errors.password }"
              @input="touched.password = true"
              required
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
          <label for="password_confirm" class="form-label">Confirmar Nueva Contraseña</label>
          <div class="input-group">
            <input
              :type="showPasswordConfirm ? 'text' : 'password'"
              class="form-control"
              id="password_confirm"
              v-model="password_confirm"
              @blur="validateField('password_confirm')"
              :class="{ 'is-invalid': touched.password_confirm && errors.password_confirm }"
              @input="touched.password_confirm = true"
              required
            />
            <button type="button" class="btn btn-outline-secondary" @click="togglePasswordConfirm">
              <i :class="showPasswordConfirm ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
          <div class="invalid-feedback" v-if="touched.password_confirm && errors.password_confirm">
            {{ errors.password_confirm }}
          </div>
        </div>
        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Restablecer Contraseña
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import * as yup from 'yup';
import { useForm, useField } from 'vee-validate';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const schema = yup.object({
  email: yup.string().email('Correo electrónico inválido').required('El correo electrónico es obligatorio'),
  password: yup.string().required('La contraseña es obligatoria').min(6, 'La contraseña debe tener al menos 6 caracteres').max(20, 'La contraseña no puede exceder los 20 caracteres'),
  password_confirm: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Debe confirmar la contraseña'),
});

const { handleSubmit, errors, validateField } = useForm({
  validationSchema: schema,
});

const { value: email } = useField('email');
const { value: password } = useField('password');
const { value: password_confirm } = useField('password_confirm');
const touched = ref({
  email: false,
  password: false,
  password_confirm: false,
});
const loading = ref(false);

const showPassword = ref(false);
const showPasswordConfirm = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const togglePasswordConfirm = () => {
  showPasswordConfirm.value = !showPasswordConfirm.value;
};

const token = ref('');

onMounted(async () => {
  token.value = route.query.token as string;
  if (!token.value || token.value.length !== 40) {
    Swal.fire({
      icon: 'error',
      title: 'Token faltante o inválido',
      text: 'El token de restablecimiento es inválido o ha expirado.',
    }).then(() => {
      router.push('/auth/login');
    });
  }

  // Check token validity
  try {
    await authStore.findPasswordResetToken(token.value);
  } catch (error) {
    if (error.message === 'Token expired') {
      // Token expired, resend the reset email
      await Swal.fire({
        icon: 'error',
        title: 'Token Expirado',
        text: 'Tu token de restablecimiento ha expirado. Se ha enviado un nuevo token a tu correo electrónico.',
      });
      await authStore.requestPasswordReset(email.value);
      await router.push('/auth/login');
    } else {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El token de restablecimiento es inválido o ha expirado.',
      });
      await router.push('/auth/login');
    }
  }
});

const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true;

    // If valid, proceed to reset the password
    await authStore.resetPassword({ token: token.value, email: values.email, password: values.password, password_confirm: values.password_confirm });
    await Swal.fire({
      icon: 'success',
      title: 'Contraseña Restablecida',
      text: 'Tu contraseña ha sido restablecida con éxito.',
    });
    await router.push('/auth/login');
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response.data.message || 'Hubo un problema al restablecer la contraseña. Por favor, inténtalo de nuevo.',
      });
    } else {
      console.error('Error:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al restablecer la contraseña. Por favor, inténtalo de nuevo.',
      });
    }
  } finally {
    loading.value = false;
  }
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
</style>
