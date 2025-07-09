<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useTemplatesStore } from '@/stores/templates';
import TemplateCard from '@/components/TemplateCard.vue';
import CreateTemplateModal from '@/components/CreateTemplateModal.vue';
import {debounce} from "@/utils/debounce.js";

const authStore = useAuthStore();
const templatesStore = useTemplatesStore();

const isModalOpen = ref(false);
const loadingError = ref(false);

templatesStore.fetchAll().catch(e => loadingError.value = e);

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const debouncedSearch = debounce((event) => {
  templatesStore.fetchTemplates(event.target.value);
});
</script>

<template>
  <div>
    <header class="bg-white shadow-md">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center h-16">
          <h1 class="text-2xl font-bold text-blue-600">Templates</h1>
          <input
              placeholder="Search..."
              type="text"
              class="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-xs ml-2"
              @input="debouncedSearch"
          >

          <div class="flex ml-auto">
            <button @click="openModal" class="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              Create
            </button>
            <button @click="authStore.logout()" class="ml-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Log out
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="container mx-auto p-4 sm:p-6 lg:p-8">
      <div class="mb-6">
        <h2 class="text-lg font-semibold mb-3">Filter by tags:</h2>
        <div class="flex flex-wrap gap-2">
          <button @click="templatesStore.selectTag(null)"
                  :class="['px-3 py-1 text-sm font-medium rounded-full transition-colors', !templatesStore.selectedTag ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']">
            All
          </button>
          <button v-for="tag in templatesStore.tags" :key="tag" @click="templatesStore.selectTag(tag)"
                  :class="['px-3 py-1 text-sm font-medium rounded-full transition-colors', templatesStore.selectedTag === tag ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']">
            {{ tag }}
          </button>
        </div>
      </div>

      <div v-if="loadingError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline ml-2">{{ loadingError }}</span>
      </div>

      <div v-if="templatesStore.templatesLoadings.fetchAll" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <div v-else-if="templatesStore.filteredTemplates.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <TemplateCard v-for="template in templatesStore.filteredTemplates" :key="template.id" :template="template" />
      </div>

      <div v-else class="text-center py-16">
        <p class="text-gray-500 text-xl">There is no any template yet</p>
      </div>
    </main>

    <CreateTemplateModal v-if="isModalOpen" @close="closeModal" />
  </div>
</template>
