<script setup>
import { computed } from "vue";
const props = defineProps({
  state: {
    type: String,
    default: "available", // available | onHold | selected | sold
  },
  shape: {
    type: String,
    default: "seat", // seat | block
  },
  // Per diferenciar alçada entre barricada (baixa) i pista (alta)
  tall: {
    type: Boolean,
    default: false,
  },
  interactive: {
    type: Boolean,
    default: true,
  },
  label: {
    type: String,
    default: "",
  },
});

const baseClasses =
  "flex items-center justify-center border rounded-md text-xs font-medium transition-colors duration-150 select-none";

const shapeClasses = computed(() => {
  if (props.shape === "block") {
    // Barricada (tall=false) vs Pista (tall=true)
    // Fem-les més horitzontals, com als esquemes
    return props.tall ? "h-32 w-full md:h-40" : "h-16 w-full md:h-20";
  }
  // shape seat (butaca)
  return "h-10 w-10 md:h-11 md:w-11";
});

const stateClasses = computed(() => {
  if (props.state === "selected") {
    return "bg-orange-500 text-slate-900 border-orange-400";
  }
  if (props.state === "onHold") {
    return "bg-yellow-400 text-slate-900 border-yellow-300";
  }
  if (props.state === "sold") {
    return "bg-slate-600 text-slate-200 border-slate-500";
  }
  // available
  return "bg-emerald-500 text-slate-900 border-emerald-400";
});

const interactionClasses = computed(() => {
  if (
    !props.interactive ||
    props.state === "sold" ||
    props.state === "onHold"
  ) {
    return "cursor-not-allowed opacity-70";
  }
  return "cursor-pointer hover:brightness-110";
});
</script>

<template>
  <div :class="[baseClasses, shapeClasses, stateClasses, interactionClasses]">
    <span v-if="label" class="truncate px-1">
      {{ label }}
    </span>
  </div>
</template>
