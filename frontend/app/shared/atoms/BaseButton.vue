<script setup>
import { computed } from "vue";

const props = defineProps({
  variant: {
    type: String,
    default: "primary",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const variantClasses = computed(() => {
  if (props.variant === "secondary") {
    return "bg-transparent border border-pink-500 text-pink-300 hover:bg-pink-700/20";
  }
  if (props.variant === "danger") {
    return "bg-red-600 hover:bg-red-700 text-white";
  }
  return "bg-pink-600 hover:bg-pink-700 text-white";
});
</script>

<template>
  <button
    class="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-transform transition-shadow duration-150 ease-out focus:outline-none focus-visible:ring-0 active:translate-y-[1px] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
    :class="variantClasses"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>
