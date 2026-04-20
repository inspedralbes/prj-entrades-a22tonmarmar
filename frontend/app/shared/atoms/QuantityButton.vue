<script setup>
const props = defineProps({
  icon: {
    type: String,
    default: "+",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click"]);

const handleClick = () => {
  if (props.disabled) return;
  emit("click");
};
</script>

<template>
  <button
    type="button"
    class="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-600 bg-slate-800 text-xs font-semibold text-slate-50 shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
    :disabled="disabled"
    @click="handleClick"
  >
    {{ icon }}
  </button>
</template>
