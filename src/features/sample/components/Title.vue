<script setup lang="ts">
import type { TitleApi } from '@/server/api/title';

const { data, status } = await useFetch<TitleApi>('/api/title');

const isFetching = computed(() => status.value === 'pending');
const title = computed(() => data.value?.title || 'No title available');
</script>
<template>
  <template v-if="isFetching">
    <p>Loading...</p>
  </template>
  <template v-else>
    <h1>{{ title }}</h1>
  </template>
</template>
