<script setup lang="ts">
import CounterDisplay from '@/components/CounterDisplay.vue';
import Title from '@/components/Title.vue';
import Button from '@/components/ui/button/Button.vue';
import { useCounterStore } from '@/store/counterStore';
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
