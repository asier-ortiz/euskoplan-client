<template>
  <div class="container mt-5">
    <h2>Reset Password</h2>
    <form @submit.prevent="resetPassword">
      <div class="mb-3">
        <label for="token" class="form-label">Reset Token</label>
        <input type="text" class="form-control" id="token" v-model="token" required>
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email address</label>
        <input type="email" class="form-control" id="email" v-model="email" required>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">New Password</label>
        <input type="password" class="form-control" id="password" v-model="password" required>
      </div>
      <button type="submit" class="btn btn-primary">Reset Password</button>
    </form>
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
