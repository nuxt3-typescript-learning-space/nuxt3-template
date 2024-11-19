<script setup lang="ts">
interface Props {
  count: number;
}

defineProps<Props>();
</script>
<template>
  <div>counter: {{ count }}</div>
</template>
