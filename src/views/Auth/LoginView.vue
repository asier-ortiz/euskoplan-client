<template>
  <div class="container mt-5">
    <h2>Login</h2>
    <form @submit.prevent="onSubmit">
      <div class="mb-3">
        <label for="email" class="form-label">Email address</label>
        <input
          type="email"
          class="form-control"
          id="email"
          v-model="email"
          @blur="validateField('email')"
          :class="{ 'is-invalid': touched.email && errors.email }"
          @input="touched.email = true"
        />
        <div class="invalid-feedback" v-if="touched.email && errors.email">{{ errors.email }}</div>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
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
        <div class="invalid-feedback" v-if="touched.password && errors.password">{{ errors.password }}</div>
      </div>
      <button type="submit" class="btn btn-primary" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Login
      </button>
    </form>
    <div class="mt-3">
      <p>Don't have an account? <RouterLink to="/auth/signup">Sign up</RouterLink></p>
      <p><RouterLink to="/auth/password-recovery">Forgot your password?</RouterLink></p>
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
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
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
    console.log('Submitting:', values); // Log para depuración
    await authStore.login(values);
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Login successful!',
    }).then(() => {
      router.push('/');
    });
  } catch (error) {
    if (error.message === 'Invalid credentials') {
      Swal.fire({
        icon: 'error',
        title: 'Login failed',
        text: 'Invalid email or password. Please try again.',
      });
    } else {
      console.error('Unexpected error:', error);
    }
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
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
