<script setup lang="ts">
import CounterDisplay from '@/components/features/sample/CounterDisplay.vue';
import Title from '@/components/features/sample/Title.vue';
import Button from '@/components/ui/button/Button.vue';
import { useSampleStore } from '@/store/sampleStore';

const sampleStore = useSampleStore();
const { count: countState } = storeToRefs(sampleStore);
const { increment, decrement } = sampleStore;
</script>
<template>
  <section>
    <Title />
    <Button @click="increment">Increment</Button>
    <Button @click="decrement">Decrement</Button>
    <CounterDisplay :count="countState" />
  </section>
</template>
