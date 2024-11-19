<script setup lang="ts">
import Index from '@/components/features/sample/Index.vue';

useHead({
  title: 'サンプルページ',
  meta: [
    {
      name: 'description',
      content: 'Nuxtテンプレートのサンプルページです。',
    },
  ],
});
</script>
<template>
  <component :is="Index" />
</template>
