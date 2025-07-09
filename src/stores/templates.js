import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import {apiService} from '@/services/apiService';
import router from '@/router';

export const useTemplatesStore = defineStore('templates', () => {
	const templates = ref([]);
	const currentTemplate = ref(null);
	const tags = ref([]);
	const selectedTag = ref(null);
	const templatesLoadings = ref({
		create: false,
		fetchAll: false,
		getById: false,
		update: false,
	});

	const filteredTemplates = computed(() => {
		if (!selectedTag.value) {
			return templates.value;
		}
		return templates.value.filter(template =>
			Array.isArray(template.tags) && template.tags.includes(selectedTag.value)
		);
	});

	function clearData() {
		templates.value = [];
		tags.value = [];
		currentTemplate.value = null;
		selectedTag.value = null;
	}

	async function fetchTemplates(search = '') {
		templatesLoadings.value.fetchAll = true;
		try {
			templates.value = (await apiService.getTemplates(search)) || [];
		} catch (err) {
			throw err.errors.name.join('. ') || err.message || 'Cannot load templates.';
		} finally {
			templatesLoadings.value.fetchAll = false;
		}
	}

	async function fetchAll() {
		templatesLoadings.value.fetchAll = true;
		try {
			const [templatesData, tagsData] = await Promise.all([
				apiService.getTemplates(),
				apiService.getTags(),
			]);
			templates.value = templatesData || [];
			tags.value = (Array.isArray(tagsData) ? tagsData : []).filter(Boolean);
		} catch (err) {
			throw err.errors.name.join('. ') || err.message || 'Cannot load data.';
		} finally {
			templatesLoadings.value.fetchAll = false;
		}
	}

	async function fetchTemplateById(id) {
		templatesLoadings.value.getById = true;
		currentTemplate.value = null;
		try {
			currentTemplate.value = await apiService.getTemplateById(id);
		} catch (err) {
			throw `Cannot load template ID: ${id}.`;
		} finally {
			templatesLoadings.value.getById.value = false;
		}
	}

	async function createTemplate(formData) {
		templatesLoadings.value.create = true;
		try {
			const newTemplate = await apiService.createTemplate(formData);
			if (newTemplate) {
				templates.value.unshift(newTemplate);
			}
		} catch (err) {
			throw err.errors.name.join('. ') || err.message || 'Cannot create template';
		} finally {
			templatesLoadings.value.create = false;
		}
	}

	async function updateTemplate(id, templateData) {
		templatesLoadings.value.update = true;
		try {
			const formData = new FormData();
			formData.append('name', templateData.name);
			formData.append('description', templateData.description);
			formData.append('width', templateData.width);
			formData.append('height', templateData.height);

			if (Array.isArray(templateData.tags)) {
				templateData.tags.forEach(tag => formData.append('tags[]', tag));
			}

			if (templateData.preview_image instanceof File) {
				formData.append('preview_image', templateData.preview_image);
			}

			if(currentTemplate.value) {
				formData.append('objects', JSON.stringify(currentTemplate.value.objects || []));
			}

			const updatedTemplateResponse = await apiService.updateTemplate(id, formData);

			if (updatedTemplateResponse) {
				const updatedTemplate = updatedTemplateResponse;
				currentTemplate.value = updatedTemplate;

				const index = templates.value.findIndex(t => t.id === parseInt(id));
				if (index !== -1) {
					templates.value[index] = updatedTemplate;
				}

				await router.push({ name: 'Home' });
			}

		} catch (err) {
			throw err.errors.name.join('. ') || err.message || 'Cannot update template';
		} finally {
			templatesLoadings.value.update = false;
		}
	}

	async function deleteTemplate(id) {
		try {
			await apiService.deleteTemplate(id);
			templates.value = templates.value.filter((t) => t.id !== id);
		} catch (err) {
			throw err.errors.name.join('. ') || err.message || 'Cannot delete template';
		} finally {
		}
	}

	function selectTag(tag) {
		selectedTag.value = selectedTag.value === tag ? null : tag;
	}

	return {
		templates, tags, selectedTag, filteredTemplates, currentTemplate, templatesLoadings,
		fetchAll, fetchTemplateById, createTemplate, updateTemplate, deleteTemplate, selectTag, clearData, fetchTemplates,
	};
});
