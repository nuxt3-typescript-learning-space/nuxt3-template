<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { STATUS_CODE } from '@/constants/error';
import { clearError, type NuxtError } from '#app';

const props = defineProps<{
  error: NuxtError;
}>();

const { error } = toRefs(props);

const handleError = () => {
  if (error.value.statusCode === STATUS_CODE.NOT_FOUND) {
    clearError({ redirect: '/' });
  } else {
    clearError({ redirect: 'back' });
  }
};
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center p-4">
    <main role="main" aria-labelledby="error-title">
      <h1 id="error-title" class="mb-4 text-4xl font-bold">Error: {{ error.statusCode || 'Unknown' }}</h1>
      <p class="mb-8 text-gray-600">
        {{ error.statusMessage || 'エラーが発生しました。時間をおいて再度お試しください。' }}
      </p>
      <Button aria-label="前のページに戻る" @click="handleError">戻る</Button>
    </main>
  </div>
</template>
