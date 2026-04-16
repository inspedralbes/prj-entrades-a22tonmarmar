<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  error: {
    type: [String, Array, null],
    default: null,
  },
});
</script>

<template>
  <div class="flex flex-col gap-1 text-sm">
    <label class="font-medium text-slate-100">
      {{ props.label }}
    </label>
    <slot />
    <p v-if="props.error" class="text-xs text-red-400">
      <span v-if="Array.isArray(props.error)">
        {{ props.error[0] }}
      </span>
      <span v-else>
        {{ props.error }}
      </span>
    </p>
  </div>
</template>
