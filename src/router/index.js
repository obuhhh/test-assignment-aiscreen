import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import EditTemplateView from '../views/EditTemplateView.vue';
import { useAuthStore } from '../stores/auth';

const routes = [
	{
		path: '/',
		name: 'Home',
		component: HomeView,
		meta: { requiresAuth: true },
	},
	{
		path: '/login',
		name: 'Login',
		component: LoginView,
	},
	{
		path: '/template/:id',
		name: 'EditTemplate',
		component: EditTemplateView,
		meta: { requiresAuth: true },
		props: true,
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

router.beforeEach((to, from, next) => {
	const authStore = useAuthStore();
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

	if (requiresAuth && !authStore.isAuthenticated) {
		next({ name: 'Login' });
	} else if (to.name === 'Login' && authStore.isAuthenticated) {
		next({ name: 'Home' });
	} else {
		next();
	}
});

export default router;
