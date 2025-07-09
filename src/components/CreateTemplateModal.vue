<script setup>
import {ref, watchEffect} from 'vue';
import { useTemplatesStore } from '@/stores/templates';

const emit = defineEmits(['close']);
const templatesStore = useTemplatesStore();

let creationDraft = localStorage.getItem('creationDraft')
creationDraft = creationDraft ? JSON.parse(creationDraft) : {};

const form = ref({
  name: '',
  description: '',
  width: '1920',
  height: '1080',
  tags: [],
  preview_image: null,
  ...creationDraft,
});
const formError = ref(null);

watchEffect(() => {
  const { preview_image, ...rest } = form.value;
  const withoutImage = JSON.stringify(rest);
  localStorage.setItem('creationDraft', withoutImage);
})

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.value.preview_image = file;
  }
};

const handleSubmit = async () => {
  if (!form.value.name || !form.value.width || !form.value.height) {
    formError.value = 'Name, height and width are required';
    return;
  }
  formError.value = null;

  const formData = new FormData();
  formData.append('name', form.value.name);
  formData.append('description', form.value.description);
  formData.append('width', form.value.width);
  formData.append('height', form.value.height);

  formData.append('objects', JSON.stringify([]));

  if (Array.isArray(form.value.tags)) {
    form.value.tags.forEach(tag => formData.append('tags[]', tag));
  }

  if (form.value.preview_image) {
    formData.append('preview_image', form.value.preview_image);
  }

  try {
    await templatesStore.createTemplate(formData);
    localStorage.removeItem('creationDraft');
    emit('close');
  } catch (error) {
    formError.value = error || 'Unexpected error.';
  }
};
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="$emit('close')">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 m-4">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Create template</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <form @submit.prevent="handleSubmit" class="space-y-6">

        <div>
          <label for="create-template-name" class="block text-sm font-medium text-gray-700 mb-1">Назва</label>
          <input v-model="form.name" type="text" id="create-template-name" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
        </div>

        <div>
          <label for="create-template-description" class="block text-sm font-medium text-gray-700 mb-1">Опис</label>
          <textarea v-model="form.description" id="create-template-description" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label for="create-template-width" class="block text-sm font-medium text-gray-700 mb-1">Width</label>
            <input v-model="form.width" type="text" id="create-template-width" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
          </div>
          <div>
            <label for="create-template-height" class="block text-sm font-medium text-gray-700 mb-1">Height</label>
            <input v-model="form.height" type="text" id="create-template-height" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
          </div>
        </div>

        <div>
          <label for="create-template-tags" class="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
          <input
              :value="form.tags.join(', ')"
              @blur="form.tags = $event.target.value.split(',').map(t => t.trim()).filter(Boolean)"
              type="text"
              id="create-template-tags"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
        </div>

        <div>
          <label for="create-template-image" class="block text-sm font-medium text-gray-700 mb-2">Preview</label>
          <input @change="handleFileChange" type="file" id="create-template-image" accept="image/*" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
        </div>

        <div v-if="formError" class="text-red-500 text-sm text-center">{{ formError }}</div>

        <div class="pt-4 flex items-center justify-end gap-4">
          <button type="button" @click="$emit('close')" class="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200">
            Cancel
          </button>
          <button type="submit" :disabled="templatesStore.templatesLoadings.create" class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center">
            <span v-if="templatesStore.templatesLoadings.create" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
            Create
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
