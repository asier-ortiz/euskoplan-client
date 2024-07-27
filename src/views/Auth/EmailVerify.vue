<template>
  <div class="container mt-5">
    <h2>Verify Email</h2>
    <form @submit.prevent="verifyEmail">
      <div class="mb-3">
        <label for="token" class="form-label">Verification Token</label>
        <input type="text" class="form-control" id="token" v-model="token" required>
      </div>
      <button type="submit" class="btn btn-primary">Verify</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

export default defineComponent({
  setup() {
    const token = ref('');
    const authStore = useAuthStore();

    const verifyEmail = () => {
      authStore.verifyEmail(token.value);
    };

    return {
      token,
      verifyEmail,
    };
  },
});
</script>
