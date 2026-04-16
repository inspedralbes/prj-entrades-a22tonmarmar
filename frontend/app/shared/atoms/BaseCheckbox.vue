<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const handleChange = (event) => {
  emit("update:modelValue", event.target.checked);
};
</script>

<template>
  <label class="inline-flex items-center gap-2 text-sm text-slate-100">
    <input
      type="checkbox"
      class="h-4 w-4 rounded border-pink-500/60 bg-slate-900 text-pink-500 focus:ring-pink-400"
      :checked="props.modelValue"
      @change="handleChange"
    />
    <span class="select-none">
      <slot />
    </span>
  </label>
</template>
