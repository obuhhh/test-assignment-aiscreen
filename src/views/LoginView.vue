<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const loginError = ref(null);

const loginForm = ref({
  email: 'hello@aiscreen.io',
  password: 'Demo!1234',
});

const handleLogin = async () => {
  await authStore.login(loginForm.value.email, loginForm.value.password).catch(err => {
    loginError.value = err;
    console.error("Login failed in component:", err);
  });
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
      <h1 class="text-3xl font-bold text-center text-gray-900">Authentication</h1>
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="text-sm font-medium text-gray-700">Email</label>
          <input v-model="loginForm.email" type="email" id="email" required
                 class="w-full px-4 py-2 mt-2 text-base text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>
        <div>
          <label for="password" class="text-sm font-medium text-gray-700">Password</label>
          <input v-model="loginForm.password" type="password" id="password" required
                 class="w-full px-4 py-2 mt-2 text-base text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>
        <div v-if="loginError" class="text-red-500 text-sm text-center">{{ loginError }}</div>
        <div>
          <button type="submit" :disabled="authStore.loginLoading"
                  class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
            <span v-if="authStore.loginLoading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
            <span v-else>Log in</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
