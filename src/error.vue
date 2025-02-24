<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { STATUS_CODE } from '@/constants/error';
import { clearError, type NuxtError } from '#app';

const props = defineProps<{
  error: NuxtError;
}>();

const { error } = toRefs(props);

const statusCode = computed(() => error.value.statusCode || 'Unknown');
const statusMessage = computed(
  () => error.value.statusMessage || 'エラーが発生しました。時間をおいて再度お試しください。',
);
const isNotFoundStatus = computed(() => statusCode.value === STATUS_CODE.NOT_FOUND);

const buttonLabel = computed(() => (isNotFoundStatus.value ? 'ホームへ移動' : '前のページに戻る'));
const buttonText = computed(() => (isNotFoundStatus.value ? 'ホームへ' : '戻る'));

const handleError = () => {
  if (isNotFoundStatus.value) {
    clearError({ redirect: '/' });
  } else {
    clearError({ redirect: 'back' });
  }
};
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center p-4">
    <main role="main" aria-labelledby="error-title">
      <h1 id="error-title" class="mb-4 text-4xl font-bold">Error: {{ statusCode }}</h1>
      <p class="mb-8 text-gray-600">
        {{ statusMessage }}
      </p>
      <Button :aria-label="buttonLabel" @click="handleError">
        {{ buttonText }}
      </Button>
    </main>
  </div>
</template>
