<script setup lang="ts">
import { useSampleStore } from '@/store/sampleStore';

const sampleStore = useSampleStore();
const { isFetching: isFetchingState, title: titleState } = storeToRefs(sampleStore);
const { updateTitle } = sampleStore;

await updateTitle();
</script>
<template>
  <template v-if="isFetchingState">
    <p>Loading...</p>
  </template>
  <template v-else>
    <h1>{{ titleState }}</h1>
  </template>
</template>
