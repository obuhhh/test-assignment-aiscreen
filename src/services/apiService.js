import { useAuthStore } from '@/stores/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request(endpoint, options = {}) {
	const { body, method = 'GET', isFormData = false } = options;
	const authStore = useAuthStore();
	const token = authStore.token;

	const headers = new Headers();
	if (!isFormData) {
		headers.append('Content-Type', 'application/json');
		headers.append('Accept', 'application/json');
	}
	if (token) {
		headers.append('Authorization', `Bearer ${token}`);
	}

	const config = {
		method,
		headers,
		body: isFormData ? body : JSON.stringify(body),
	};

	try {
		const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
		if (!response.ok) {
			throw await response.json().catch(() => ({ message: `Request failed with status ${response.status}` }));
		}
		return response.status === 204 ? null : await response.json();
	} catch (err) {
		console.error('API Error:', err);
		throw err;
	}
}

export const apiService = {
	login(email, password) {
		return request('/login', { method: 'POST', body: { email, password, remember_me: 1 } });
	},
	getTemplates(search = '') {
		const params = new URLSearchParams({ 'filter[name]': search })
		return request(`/canvas_templates?${params.toString()}`);
	},
	getTemplateById(id) {
		return request(`/canvas_templates/${id}`);
	},
	getTags() {
		return request('/canvas_templates/tags/list');
	},
	createTemplate(formData) {
		return request('/canvas_templates', { method: 'POST', body: formData, isFormData: true });
	},
	updateTemplate(id, formData) {
		return request(`/canvas_templates/${id}?_method=PATCH`, {
			method: 'POST',
			body: formData,
			isFormData: true,
		});
	},
	deleteTemplate(id) {
		return request('/canvas_templates', { method: 'DELETE', body: { id } });
	},
};
