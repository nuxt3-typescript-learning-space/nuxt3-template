<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { useCounterStore } from '@/store/counterStore';
import CounterDisplay from './CounterDisplay.vue';
import Title from './Title.vue';

const counterStore = useCounterStore();
const { count: countState } = storeToRefs(counterStore);
const { increment, decrement } = counterStore;
</script>
<template>
  <section>
    <Title />
    <Button @click="increment">Increment</Button>
    <Button @click="decrement">Decrement</Button>
    <CounterDisplay :count="countState" />
  </section>
</template>
