<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
});

const emit = defineEmits(["update:modelValue"]);

const handleInput = (event) => {
  emit("update:modelValue", event.target.value);
};
</script>

<template>
  <input
    :type="props.type"
    class="w-full rounded-md border border-pink-700/40 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 shadow-sm outline-none ring-pink-400 focus:border-pink-400 focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-950"
    :value="props.modelValue"
    @input="handleInput"
    v-bind="$attrs"
  />
</template>
