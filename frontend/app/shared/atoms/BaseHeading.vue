<script setup>
import { computed } from "vue";

const props = defineProps({
  level: {
    type: Number,
    default: 1,
  },
});

const tag = computed(() => {
  const clamped = Math.min(3, Math.max(1, props.level));
  return `h${clamped}`;
});

const classes = computed(() => {
  if (props.level === 1) {
    return "text-3xl font-extrabold tracking-tight text-pink-400";
  }
  if (props.level === 2) {
    return "text-2xl font-bold tracking-tight text-pink-300";
  }
  return "text-xl font-semibold tracking-tight text-pink-200";
});
</script>

<template>
  <component :is="tag" :class="classes">
    <slot />
  </component>
</template>
