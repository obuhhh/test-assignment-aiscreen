<script setup>
import { useTemplatesStore } from '@/stores/templates';
import { RouterLink } from 'vue-router';
import {ref} from "vue";

const props = defineProps({
  template: {
    type: Object,
    required: true,
  },
});

const templatesStore = useTemplatesStore();
const isDeleting = ref(false);

const handleDelete = () => {
  if (confirm(`Delete template "${props.template.name}"?`)) {
    isDeleting.value = true
    templatesStore.deleteTemplate(props.template.id).finally(() => isDeleting.value = false);
  }
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-shadow hover:shadow-xl">
    <router-link :to="{ name: 'EditTemplate', params: { id: template.id } }">
      <img
          :src="template.preview_image || 'https://placehold.co/400x300/E2E8F0/A0AEC0?text=No+image'"
          alt="template preview"
          class="w-full h-48 object-cover cursor-pointer"
          @error="(e) => { e.target.src = 'https://placehold.co/400x300/E2E8F0/A0AEC0?text=Error' }">
    </router-link>

    <div class="p-4 flex-grow flex flex-col">
      <h3 class="font-bold text-lg truncate mb-2">{{ template.name }}</h3>

      <div v-if="template.tags?.length" class="flex flex-wrap gap-1 mb-4">
        <span v-for="tag in template.tags" :key="tag" class="px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full">{{ tag }}</span>
      </div>
      <div v-else class="h-6 mb-4"></div>

      <div class="flex-grow"></div>

      <div class="mt-auto pt-4 border-t border-gray-100 flex items-center gap-3">
        <router-link
            :to="{ name: 'EditTemplate', params: { id: template.id } }"
            class="flex-1 text-center text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md shadow-sm transition-colors duration-200"
        >
          Edit
        </router-link>
        <button
            @click="handleDelete"
            class="flex-1 text-center text-sm font-medium text-red-600 bg-red-100 hover:bg-red-200 px-3 py-2 rounded-md transition-colors duration-200"
        >
          <span v-if="isDeleting" class="block animate-spin rounded-full h-4 w-4 border-b-2 border-red-500 mx-auto"></span>
          <template v-else>Delete</template>
        </button>
      </div>
    </div>
  </div>
</template>
