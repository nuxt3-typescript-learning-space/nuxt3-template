<script setup lang="ts">
import { Primitive } from 'radix-vue';
import { cn } from '@/lib/tailwind';
import { buttonVariants } from '.';
import type { ButtonVariants } from '.';
import type { PrimitiveProps } from 'radix-vue';
import type { HTMLAttributes } from 'vue';

interface Props extends PrimitiveProps {
  variant?: ButtonVariants['variant'];
  size?: ButtonVariants['size'];
  class?: HTMLAttributes['class'];
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
});
</script>

<template>
  <Primitive :as="as" :as-child="asChild" :class="cn(buttonVariants({ variant, size }), props.class)">
    <slot />
  </Primitive>
</template>
