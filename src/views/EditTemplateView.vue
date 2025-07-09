<script setup>
import { onMounted, ref, watchEffect } from 'vue';
import { useTemplatesStore } from '@/stores/templates';
import { useRoute } from 'vue-router';

const templatesStore = useTemplatesStore();
const route = useRoute();
const templateId = route.params.id;
const updateError = ref(false);

const editForm = ref({
  name: '',
  description: '',
  width: '',
  height: '',
  tags: [],
  preview_image: null,
});

const previewUrl = ref(null);

watchEffect(() => {
  if (templatesStore.currentTemplate) {
    editForm.value.name = templatesStore.currentTemplate.name;
    editForm.value.description = templatesStore.currentTemplate.description || '';
    editForm.value.width = templatesStore.currentTemplate.width;
    editForm.value.height = templatesStore.currentTemplate.height;
    editForm.value.tags = [...(templatesStore.currentTemplate.tags || [])];
    previewUrl.value = templatesStore.currentTemplate.preview_image;
  }
});

onMounted(() => {
  templatesStore.fetchTemplateById(templateId);
});

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    editForm.value.preview_image = file;
    previewUrl.value = URL.createObjectURL(file);
  }
};

const handleSave = async () => {
  if (!editForm.value.name) {
    alert('Name is required.');
    return;
  }
  await templatesStore.updateTemplate(templateId, editForm.value).catch(e => {
    updateError.value = e
  });
};
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="container mx-auto p-4 sm:p-6 lg:p-8">
      <div class="max-w-4xl mx-auto">
        <router-link to="/" class="text-blue-600 hover:underline mb-6 inline-block">&larr; Templates</router-link>

        <div v-if="templatesStore.templatesLoadings.getById && !templatesStore.currentTemplate" class="text-center py-16">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p class="mt-4 text-lg text-gray-600">Loading...</p>
        </div>

        <div v-else-if="updateError" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p class="font-bold">Error</p>
          <p>{{ updateError }}</p>
        </div>

        <form v-else-if="templatesStore.currentTemplate" @submit.prevent="handleSave" class="bg-white p-8 rounded-xl shadow-lg space-y-6">
          <h1 class="text-3xl font-bold text-gray-800">Edit</h1>

          <div>
            <label for="template-name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input v-model="editForm.name" type="text" id="template-name" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
          </div>

          <div>
            <label for="template-description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea v-model="editForm.description" id="template-description" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label for="template-width" class="block text-sm font-medium text-gray-700 mb-1">Width</label>
              <input v-model="editForm.width" type="text" id="template-width" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label for="template-height" class="block text-sm font-medium text-gray-700 mb-1">Height</label>
              <input v-model="editForm.height" type="text" id="template-height" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
            </div>
          </div>

          <div>
            <label for="template-tags" class="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
            <input
                :value="editForm.tags.join(', ')"
                @input="editForm.tags = $event.target.value.split(',').map(t => t.trim()).filter(Boolean)"
                type="text"
                id="template-tags"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Preview</label>
            <img v-if="previewUrl" :src="previewUrl" alt="Preview" class="w-64 h-auto rounded-lg shadow-md mb-4">
            <input @change="handleFileChange" type="file" accept="image/*" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
          </div>

          <div class="pt-4 flex items-center justify-end gap-4">
            <router-link to="/" class="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200">
              Cancel
            </router-link>
            <button type="submit" :disabled="templatesStore.templatesLoadings.update" class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center">
              <span v-if="templatesStore.templatesLoadings.update" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
