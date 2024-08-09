<script setup lang="ts">
defineProps({
  count: {
    type: Number,
    required: true,
  },
});
</script>
<template>
  <div>counter: {{ count }}</div>
</template>
