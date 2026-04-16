<script setup>
import { computed } from "vue";
const props = defineProps({
  state: {
    type: String,
    default: "available", // available | onHold | selected | sold
  },
});

const baseClasses = "inline-block h-3 w-3 rounded-sm";

const stateClasses = computed(() => {
  if (props.state === "selected") {
    return "bg-orange-500";
  }
  if (props.state === "onHold") {
    return "bg-yellow-300";
  }
  if (props.state === "sold") {
    return "bg-slate-500";
  }
  // available
  return "bg-emerald-500";
});
</script>

<template>
  <span :class="[baseClasses, stateClasses]" />
</template>
