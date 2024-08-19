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
            @input="onUsernameInput"
            @blur="handleBlur('username')"
            :class="{ 'is-invalid': touched.username && (errors.username || usernameTaken) }"
          />
          <div class="invalid-feedback" v-if="touched.username && errors.username">
            {{ errors.username }}
          </div>
          <div class="invalid-feedback" v-if="usernameTaken">
            Este nombre de usuario ya está en uso.
          </div>
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Correo Electrónico</label>
          <input
            type="email"
            class="form-control"
            id="email"
            v-model="email"
            @input="onEmailInput"
            @blur="handleBlur('email')"
            :class="{ 'is-invalid': touched.email && (errors.email || emailTaken) }"
          />
          <div class="invalid-feedback" v-if="touched.email && errors.email">
            {{ errors.email }}
          </div>
          <div class="invalid-feedback" v-if="emailTaken">
            Este correo electrónico ya está en uso.
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
              @input="validatePassword"
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
              @input="validatePasswordConfirm"
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
        <button type="submit" class="btn btn-primary w-100" :disabled="!formValid || loading || errors.username || errors.email || errors.password || errors.password_confirm || usernameTaken || emailTaken">
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
import { ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import * as yup from 'yup';
import { useForm, useField } from 'vee-validate';
import { debounce } from 'lodash-es';
import router from '@/router';

const authStore = useAuthStore();

const schema = yup.object({
  username: yup
    .string()
    .required('El nombre de usuario es obligatorio')
    .min(5, 'El nombre de usuario debe tener al menos 5 caracteres'),
  email: yup
    .string()
    .email('Correo electrónico inválido')
    .required('El correo electrónico es obligatorio'),
  password: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
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

const usernameTaken = ref(false);
const emailTaken = ref(false);
const formValid = ref(false);

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

// Handle username input changes
const onUsernameInput = () => {
  if (username.value === '') {
    usernameTaken.value = false;
    errors.username = '';
  } else {
    debouncedCheckUsername();
  }
  validateForm();
};

// Handle email input changes
const onEmailInput = () => {
  if (email.value === '') {
    emailTaken.value = false;
    errors.email = '';
  } else {
    debouncedCheckEmail();
  }
  validateForm();
};

// Validate password input
const validatePassword = () => {
  if (password.value.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres.';
  } else {
    errors.password = '';
  }
  validatePasswordConfirm();
  validateForm();
};

// Validate password confirmation input
const validatePasswordConfirm = () => {
  if (password.value !== password_confirm.value) {
    errors.password_confirm = 'Las contraseñas deben coincidir.';
  } else {
    errors.password_confirm = '';
  }
  validateForm();
};

// Check if username is available
const checkUsernameAvailability = async () => {
  if (username.value.length >= 5) {
    const isAvailable = await authStore.checkUsernameAvailability(username.value);
    usernameTaken.value = !isAvailable;
    if (!isAvailable) {
      errors.username = 'Este nombre de usuario ya está en uso.';
    } else {
      errors.username = '';
    }
  }
  validateForm();
};

// Check if email is available and valid
const checkEmailAvailability = async () => {
  if (errors.email === '') {
    const isAvailable = await authStore.checkEmailAvailability(email.value);
    emailTaken.value = !isAvailable;
    if (!isAvailable) {
      errors.email = 'Este correo electrónico ya está en uso.';
    } else {
      errors.email = '';
    }
  }
  validateForm();
};

// Debounce the checks to avoid excessive API calls
const debouncedCheckUsername = debounce(checkUsernameAvailability, 500);
const debouncedCheckEmail = debounce(checkEmailAvailability, 500);

// Validate the entire form to enable/disable the submit button
const validateForm = () => {
  formValid.value = !(
    errors.username ||
    errors.email ||
    errors.password ||
    errors.password_confirm ||
    usernameTaken.value ||
    emailTaken.value ||
    username.value === '' ||
    email.value === '' ||
    password.value === '' ||
    password_confirm.value === ''
  );
};

const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true;
    await authStore.register(values);
    await router.push('/auth/login');
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
