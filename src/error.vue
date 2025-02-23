<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { clearError, type NuxtError } from '#app';

defineProps<{
  error: NuxtError;
}>();

const handleError = () => {
  clearError({ redirect: '/' });
};
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center p-4">
    <h1 class="mb-4 text-4xl font-bold">Error: {{ error.statusCode || 'Unknown' }}</h1>
    <p class="mb-8 text-gray-600">
      {{ error.statusMessage || 'エラーが発生しました。時間をおいて再度お試しください。' }}
    </p>
    <Button @click="handleError">戻る</Button>
  </div>
</template>
