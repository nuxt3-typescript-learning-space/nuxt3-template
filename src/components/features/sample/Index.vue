<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { useSampleStore } from '@/store/sampleStore';
import CounterDisplay from './CounterDisplay.vue';
import Title from './Title.vue';

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
