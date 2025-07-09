import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiService } from '@/services/apiService';
import { useTemplatesStore } from './templates';
import router from '@/router';

export const useAuthStore = defineStore('auth', () => {
	const token = ref(localStorage.getItem('authToken') || null);
	const loginLoading = ref(false);

	const isAuthenticated = computed(() => !!token.value);

	function setToken(newToken) {
		token.value = newToken;
		if (newToken) {
			localStorage.setItem('authToken', newToken);
		} else {
			localStorage.removeItem('authToken');
		}
	}

	async function login(email, password) {
		const templatesStore = useTemplatesStore();
		loginLoading.value = true;
		try {
			const data = await apiService.login(email, password);
			if (data.token) {
				setToken(data.token);
				await templatesStore.fetchAll();
				await router.push({ name: 'Home' });
			}
		} catch (err) {
			throw err;
		} finally {
			loginLoading.value = false;
		}
	}

	function logout() {
		const templatesStore = useTemplatesStore();
		setToken(null);
		templatesStore.clearData();
		router.push({ name: 'Login' });
	}

	return { token, isAuthenticated, login, logout, loginLoading };
});
